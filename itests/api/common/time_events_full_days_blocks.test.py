"""Tests for the time event full days blocks API using inbox tasks."""

from collections.abc import Iterator

import pytest
import requests
from jupiter_webapi_client.api.test_helper.workspace_set_feature import (
    sync_detailed as workspace_set_feature_sync,
)
from jupiter_webapi_client.api.todo.todo_task_create import (
    sync_detailed as todo_task_create_sync,
)
from jupiter_webapi_client.client import AuthenticatedClient
from jupiter_webapi_client.models.difficulty import Difficulty
from jupiter_webapi_client.models.eisen import Eisen
from jupiter_webapi_client.models.inbox_task import InboxTask
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


def _headers(api_key: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {api_key}"}


def test_api_common_time_event_full_days_block_load(
    api_url: str, api_key: str, create_inbox_task
) -> None:
    task = create_inbox_task("FD Load Task")

    load_response = requests.get(
        f"{api_url}/v1/common/inbox-tasks/{task.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert load_response.status_code == 200

    time_event_blocks = load_response.json().get("time_event_blocks", [])
    if time_event_blocks:
        block_ref_id = time_event_blocks[0]["ref_id"]
        response = requests.get(
            f"{api_url}/v1/common/time-events/full-days-blocks/{block_ref_id}?allow_archived=false",
            headers=_headers(api_key),
            timeout=10,
        )
        assert response.status_code == 200
        assert response.json()["full_days_block"]["ref_id"] == block_ref_id
