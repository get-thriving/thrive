"""Tests for the time event in-day blocks API using inbox tasks."""

from collections.abc import Iterator

import pytest
import requests
from jupiter_webapi_client.api.test_helper.workspace_set_feature import (
    sync_detailed as workspace_set_feature_sync,
)
from jupiter_webapi_client.api.time_events.time_event_in_day_block_create_for_inbox_task import (
    sync_detailed as time_event_in_day_block_create_for_inbox_task_sync,
)
from jupiter_webapi_client.api.todo.todo_task_create import (
    sync_detailed as todo_task_create_sync,
)
from jupiter_webapi_client.client import AuthenticatedClient
from jupiter_webapi_client.models.difficulty import Difficulty
from jupiter_webapi_client.models.eisen import Eisen
from jupiter_webapi_client.models.inbox_task import InboxTask
from jupiter_webapi_client.models.time_event_in_day_block import TimeEventInDayBlock
from jupiter_webapi_client.models.time_event_in_day_block_create_for_inbox_task_args import (
    TimeEventInDayBlockCreateForInboxTaskArgs,
)
from jupiter_webapi_client.models.time_event_in_day_block_create_for_inbox_task_result import (
    TimeEventInDayBlockCreateForInboxTaskResult,
)
from jupiter_webapi_client.models.todo_task_create_args import TodoTaskCreateArgs
from jupiter_webapi_client.models.todo_task_create_result import TodoTaskCreateResult
from jupiter_webapi_client.models.workspace_feature import WorkspaceFeature
from jupiter_webapi_client.models.workspace_set_feature_args import (
    WorkspaceSetFeatureArgs,
)

from itests.helpers import get_parsed_from_response


@pytest.fixture(autouse=True, scope="module")
def _enable_todo_feature(logged_in_client: AuthenticatedClient) -> Iterator[None]:
    try:
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.TODO_TASK, value=True
            ),
        )
        yield
    finally:
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.TODO_TASK, value=False
            ),
        )


@pytest.fixture()
def create_inbox_task(logged_in_client: AuthenticatedClient):
    def _create(name: str) -> InboxTask:
        result = todo_task_create_sync(
            client=logged_in_client,
            body=TodoTaskCreateArgs(
                name=name,
                is_key=False,
                eisen=Eisen.REGULAR,
                difficulty=Difficulty.EASY,
            ),
        )
        return get_parsed_from_response(TodoTaskCreateResult, result).new_inbox_task

    return _create


@pytest.fixture()
def create_time_event_in_day_block(logged_in_client: AuthenticatedClient):
    def _create(inbox_task_ref_id: str) -> TimeEventInDayBlock:
        result = time_event_in_day_block_create_for_inbox_task_sync(
            client=logged_in_client,
            body=TimeEventInDayBlockCreateForInboxTaskArgs(
                inbox_task_ref_id=inbox_task_ref_id,
                start_date="2024-06-10",
                start_time_in_day="09:00",
                duration_mins=60,
            ),
        )
        return get_parsed_from_response(
            TimeEventInDayBlockCreateForInboxTaskResult, result
        ).new_time_event

    return _create


def _headers(api_key: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {api_key}"}


def test_api_common_time_event_in_day_block_create(
    api_url: str, api_key: str, create_inbox_task
) -> None:
    task = create_inbox_task("Time Event Task")

    response = requests.post(
        f"{api_url}/v1/common/time-events/in-day-blocks/for-inbox-task",
        headers=_headers(api_key),
        json={
            "inbox_task_ref_id": task.ref_id,
            "start_date": "2024-07-15",
            "start_time_in_day": "10:00",
            "duration_mins": 45,
        },
        timeout=10,
    )
    assert response.status_code == 200

    block = response.json()["new_time_event"]
    assert block["start_date"] == "2024-07-15"
    assert block["start_time_in_day"] == "10:00"
    assert block["duration_mins"] == 45
    assert block["archived"] is False
    assert "ref_id" in block


def test_api_common_time_event_in_day_block_load(
    api_url: str, api_key: str, create_inbox_task, create_time_event_in_day_block
) -> None:
    task = create_inbox_task("TE Load Task")
    block = create_time_event_in_day_block(task.ref_id)

    response = requests.get(
        f"{api_url}/v1/common/time-events/in-day-blocks/{block.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    loaded = response.json()["in_day_block"]
    assert loaded["ref_id"] == block.ref_id
    assert loaded["start_date"] == "2024-06-10"
    assert loaded["duration_mins"] == 60

    loaded_inbox_task = response.json().get("inbox_task")
    assert loaded_inbox_task is not None
    assert loaded_inbox_task["ref_id"] == task.ref_id


def test_api_common_time_event_in_day_block_update(
    api_url: str, api_key: str, create_inbox_task, create_time_event_in_day_block
) -> None:
    task = create_inbox_task("TE Update Task")
    block = create_time_event_in_day_block(task.ref_id)

    response = requests.put(
        f"{api_url}/v1/common/time-events/in-day-blocks/{block.ref_id}",
        headers=_headers(api_key),
        json={
            "ref_id": block.ref_id,
            "start_date": {"should_change": True, "value": "2024-07-01"},
            "start_time_in_day": {"should_change": True, "value": "14:30"},
            "duration_mins": {"should_change": True, "value": 90},
        },
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/common/time-events/in-day-blocks/{block.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 200
    loaded = response2.json()["in_day_block"]
    assert loaded["start_date"] == "2024-07-01"
    assert loaded["start_time_in_day"] == "14:30"
    assert loaded["duration_mins"] == 90


def test_api_common_time_event_in_day_block_archive(
    api_url: str, api_key: str, create_inbox_task, create_time_event_in_day_block
) -> None:
    task = create_inbox_task("TE Archive Task")
    block = create_time_event_in_day_block(task.ref_id)

    response = requests.delete(
        f"{api_url}/v1/common/time-events/in-day-blocks/{block.ref_id}",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/common/time-events/in-day-blocks/{block.ref_id}?allow_archived=true",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 200
    assert response2.json()["in_day_block"]["archived"] is True

    response3 = requests.get(
        f"{api_url}/v1/common/time-events/in-day-blocks/{block.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response3.status_code == 502
    assert response3.json()["status"] == 404


def test_api_common_time_event_in_day_block_remove(
    api_url: str, api_key: str, create_inbox_task, create_time_event_in_day_block
) -> None:
    task = create_inbox_task("TE Remove Task")
    block = create_time_event_in_day_block(task.ref_id)

    response = requests.delete(
        f"{api_url}/v1/common/time-events/in-day-blocks/{block.ref_id}/remove",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/common/time-events/in-day-blocks/{block.ref_id}?allow_archived=true",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 502
    assert response2.json()["status"] == 404
