"""Tests for the API for inbox tasks."""

from collections.abc import Iterator

import pytest
import requests
from jupiter_webapi_client.api.big_plans.big_plan_create import (
    sync_detailed as big_plan_create_sync,
)
from jupiter_webapi_client.api.big_plans.big_plan_create_inbox_task import (
    sync_detailed as big_plan_create_inbox_task_sync,
)
from jupiter_webapi_client.api.inbox_tasks.inbox_task_archive import (
    sync_detailed as inbox_task_archive_sync,
)
from jupiter_webapi_client.api.inbox_tasks.inbox_task_remove import (
    sync_detailed as inbox_task_remove_sync,
)
from jupiter_webapi_client.api.test_helper.workspace_set_feature import (
    sync_detailed as workspace_set_feature_sync,
)
from jupiter_webapi_client.api.todo.todo_task_create import (
    sync_detailed as todo_task_create_sync,
)
from jupiter_webapi_client.client import AuthenticatedClient
from jupiter_webapi_client.models.big_plan_create_args import BigPlanCreateArgs
from jupiter_webapi_client.models.big_plan_create_inbox_task_args import (
    BigPlanCreateInboxTaskArgs,
)
from jupiter_webapi_client.models.big_plan_create_inbox_task_result import (
    BigPlanCreateInboxTaskResult,
)
from jupiter_webapi_client.models.big_plan_create_result import BigPlanCreateResult
from jupiter_webapi_client.models.difficulty import Difficulty
from jupiter_webapi_client.models.eisen import Eisen
from jupiter_webapi_client.models.inbox_task import InboxTask
from jupiter_webapi_client.models.inbox_task_archive_args import InboxTaskArchiveArgs
from jupiter_webapi_client.models.inbox_task_remove_args import InboxTaskRemoveArgs
from jupiter_webapi_client.models.todo_task_create_args import TodoTaskCreateArgs
from jupiter_webapi_client.models.todo_task_create_result import TodoTaskCreateResult
from jupiter_webapi_client.models.workspace_feature import WorkspaceFeature
from jupiter_webapi_client.models.workspace_set_feature_args import (
    WorkspaceSetFeatureArgs,
)

from itests.helpers import get_parsed_from_response


@pytest.fixture(autouse=True, scope="module")
def _enable_features(logged_in_client: AuthenticatedClient) -> Iterator[None]:
    try:
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.TODO_TASK, value=True
            ),
        )
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.BIG_PLANS, value=True
            ),
        )
        yield
    finally:
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.BIG_PLANS, value=False
            ),
        )
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
def create_archivable_inbox_task(logged_in_client: AuthenticatedClient):
    """Create an inbox task via a big plan so it can be archived/removed independently."""

    def _create(name: str) -> InboxTask:
        bp_result = big_plan_create_sync(
            client=logged_in_client,
            body=BigPlanCreateArgs(
                name=f"BP for {name}",
                is_key=False,
                eisen=Eisen.REGULAR,
                difficulty=Difficulty.EASY,
            ),
        )
        big_plan = get_parsed_from_response(BigPlanCreateResult, bp_result).new_big_plan
        result = big_plan_create_inbox_task_sync(
            client=logged_in_client,
            body=BigPlanCreateInboxTaskArgs(
                big_plan_ref_id=big_plan.ref_id,
                name=name,
                is_key=False,
                eisen=Eisen.REGULAR,
                difficulty=Difficulty.EASY,
            ),
        )
        return get_parsed_from_response(
            BigPlanCreateInboxTaskResult, result
        ).new_inbox_task

    return _create


@pytest.fixture()
def archive_inbox_task(logged_in_client: AuthenticatedClient):
    def _archive(ref_id: str) -> None:
        inbox_task_archive_sync(
            client=logged_in_client,
            body=InboxTaskArchiveArgs(ref_id=ref_id),
        )

    return _archive


@pytest.fixture()
def remove_inbox_task(logged_in_client: AuthenticatedClient):
    def _remove(ref_id: str) -> None:
        inbox_task_remove_sync(
            client=logged_in_client,
            body=InboxTaskRemoveArgs(ref_id=ref_id),
        )

    return _remove


def _headers(api_key: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {api_key}"}


def test_api_common_inbox_task_created_via_todo(api_url: str, api_key: str) -> None:
    response = requests.post(
        f"{api_url}/v1/todos",
        headers=_headers(api_key),
        json={
            "name": "Buy groceries",
            "is_key": True,
            "eisen": "important",
            "difficulty": "easy",
            "actionable_date": "2024-06-01",
            "due_date": "2024-06-10",
        },
        timeout=10,
    )
    assert response.status_code == 200

    task = response.json()["new_inbox_task"]
    assert task["name"] == "Buy groceries"
    assert task["is_key"] is True
    assert task["eisen"] == "important"
    assert task["difficulty"] == "easy"
    assert task["archived"] is False
    assert "ref_id" in task


def test_api_common_inbox_task_load(
    api_url: str, api_key: str, create_inbox_task
) -> None:
    created = create_inbox_task("Load me")

    response = requests.get(
        f"{api_url}/v1/common/inbox-tasks/{created.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    task = response.json()["inbox_task"]
    assert task["ref_id"] == created.ref_id
    assert task["name"] == "Load me"
    assert task["eisen"] == "regular"
    assert task["difficulty"] == "easy"


def test_api_common_inbox_task_find(
    api_url: str, api_key: str, create_inbox_task
) -> None:
    create_inbox_task("Find Task A")
    create_inbox_task("Find Task B")

    response = requests.get(
        f"{api_url}/v1/common/inbox-tasks?allow_archived=false&include_notes=false&include_time_event_blocks=false&include_tags=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    names = [e["inbox_task"]["name"] for e in response.json()["entries"]]
    assert "Find Task A" in names
    assert "Find Task B" in names


def test_api_common_inbox_task_update(
    api_url: str, api_key: str, create_inbox_task
) -> None:
    created = create_inbox_task("Old Task Name")

    response = requests.put(
        f"{api_url}/v1/common/inbox-tasks/{created.ref_id}",
        headers=_headers(api_key),
        json={
            "ref_id": created.ref_id,
            "name": {"should_change": True, "value": "New Task Name"},
            "status": {"should_change": False},
            "is_key": {"should_change": True, "value": True},
            "eisen": {"should_change": False},
            "difficulty": {"should_change": False},
            "actionable_date": {"should_change": False},
            "due_date": {"should_change": False},
        },
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/common/inbox-tasks/{created.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 200
    assert response2.json()["inbox_task"]["name"] == "New Task Name"


def test_api_common_inbox_task_update_partial(
    api_url: str, api_key: str, create_inbox_task
) -> None:
    created = create_inbox_task("Keep This")

    response = requests.put(
        f"{api_url}/v1/common/inbox-tasks/{created.ref_id}",
        headers=_headers(api_key),
        json={
            "ref_id": created.ref_id,
            "name": {"should_change": False},
            "status": {"should_change": False},
            "is_key": {"should_change": False},
            "eisen": {"should_change": True, "value": "urgent"},
            "difficulty": {"should_change": False},
            "actionable_date": {"should_change": False},
            "due_date": {"should_change": False},
        },
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/common/inbox-tasks/{created.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 200
    assert response2.json()["inbox_task"]["eisen"] == "urgent"


def test_api_common_inbox_task_find_excludes_archived(
    api_url: str, api_key: str, create_archivable_inbox_task, archive_inbox_task
) -> None:
    created = create_archivable_inbox_task("Archive Filter Task")
    archive_inbox_task(created.ref_id)

    response = requests.get(
        f"{api_url}/v1/common/inbox-tasks",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200
    names = [e["inbox_task"]["name"] for e in response.json()["entries"]]
    assert "Archive Filter Task" not in names


def test_api_common_inbox_task_archive(
    api_url: str, api_key: str, create_archivable_inbox_task
) -> None:
    created = create_archivable_inbox_task("Archive Me Task")

    response = requests.delete(
        f"{api_url}/v1/common/inbox-tasks/{created.ref_id}",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    response1 = requests.get(
        f"{api_url}/v1/common/inbox-tasks/{created.ref_id}",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response1.status_code == 502
    assert response1.json()["status"] == 404

    response2 = requests.get(
        f"{api_url}/v1/common/inbox-tasks/{created.ref_id}?allow_archived=true",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 200
    assert response2.json()["inbox_task"]["archived"] is True


def test_api_common_inbox_task_remove(
    api_url: str, api_key: str, create_archivable_inbox_task
) -> None:
    created = create_archivable_inbox_task("Remove Me Task")

    response = requests.delete(
        f"{api_url}/v1/common/inbox-tasks/{created.ref_id}/remove",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/common/inbox-tasks/{created.ref_id}?allow_archived=true",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 502
    assert response2.json()["status"] == 404


def test_api_common_inbox_task_requires_auth(api_url: str) -> None:
    response = requests.get(
        f"{api_url}/v1/common/inbox-tasks?allow_archived=false&include_notes=false&include_time_event_blocks=false&include_tags=false",
        timeout=10,
    )
    assert response.status_code == 401

    response_bad = requests.get(
        f"{api_url}/v1/common/inbox-tasks?allow_archived=false&include_notes=false&include_time_event_blocks=false&include_tags=false",
        headers={"Authorization": "Bearer invalid-token"},
        timeout=10,
    )
    assert response_bad.status_code == 401
