"""Tests for the API for todo tasks."""

from collections.abc import Iterator

import pytest
import requests
from jupiter_webapi_client.api.test_helper.workspace_set_feature import (
    sync_detailed as workspace_set_feature_sync,
)
from jupiter_webapi_client.api.todo.todo_task_archive import (
    sync_detailed as todo_task_archive_sync,
)
from jupiter_webapi_client.api.todo.todo_task_create import (
    sync_detailed as todo_task_create_sync,
)
from jupiter_webapi_client.client import AuthenticatedClient
from jupiter_webapi_client.models.difficulty import Difficulty
from jupiter_webapi_client.models.eisen import Eisen
from jupiter_webapi_client.models.todo_task import TodoTask
from jupiter_webapi_client.models.todo_task_archive_args import TodoTaskArchiveArgs
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
                feature=WorkspaceFeature.TODO_TASK,
                value=True,
            ),
        )
        yield
    finally:
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.TODO_TASK,
                value=False,
            ),
        )


@pytest.fixture()
def create_todo(logged_in_client: AuthenticatedClient):
    def _create(name: str) -> TodoTask:
        result = todo_task_create_sync(
            client=logged_in_client,
            body=TodoTaskCreateArgs(
                name=name,
                is_key=False,
                eisen=Eisen.REGULAR,
                difficulty=Difficulty.EASY,
            ),
        )
        return get_parsed_from_response(TodoTaskCreateResult, result).new_todo_task

    return _create


@pytest.fixture()
def archive_todo(logged_in_client: AuthenticatedClient):
    def _archive(ref_id: str) -> None:
        todo_task_archive_sync(
            client=logged_in_client,
            body=TodoTaskArchiveArgs(ref_id=ref_id),
        )

    return _archive


def _headers(api_key: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {api_key}"}


def test_api_todo_create(api_url: str, api_key: str) -> None:
    response = requests.post(
        f"{api_url}/v1/todos",
        headers=_headers(api_key),
        json={
            "name": "Plan Q4 initiatives",
            "is_key": True,
            "eisen": "important",
            "difficulty": "medium",
            "actionable_date": "2024-07-01",
            "due_date": "2024-07-10",
        },
        timeout=10,
    )
    assert response.status_code == 200

    todo = response.json()["new_todo_task"]
    assert todo["name"] == "Plan Q4 initiatives"
    assert todo["archived"] is False
    assert "ref_id" in todo

    inbox_task = response.json()["new_inbox_task"]
    assert inbox_task["name"] == "Plan Q4 initiatives"
    assert inbox_task["is_key"] is True
    assert inbox_task["eisen"] == "important"
    assert inbox_task["difficulty"] == "medium"


def test_api_todo_load(api_url: str, api_key: str, create_todo) -> None:
    created = create_todo("Load Todo")

    response = requests.get(
        f"{api_url}/v1/todos/{created.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    todo = response.json()["todo_task"]
    assert todo["ref_id"] == created.ref_id
    assert todo["name"] == "Load Todo"
    assert response.json()["inbox_task"]["name"] == "Load Todo"


def test_api_todo_find(api_url: str, api_key: str, create_todo) -> None:
    create_todo("Todo Alpha")
    create_todo("Todo Beta")

    response = requests.get(
        f"{api_url}/v1/todos?allow_archived=false&include_notes=false&include_life_plan=false&include_tags=false&include_contacts=false&include_inbox_tasks=true",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    names = [e["todo_task"]["name"] for e in response.json()["entries"]]
    assert "Todo Alpha" in names
    assert "Todo Beta" in names


def test_api_todo_update(api_url: str, api_key: str, create_todo) -> None:
    created = create_todo("Old Todo")

    response = requests.put(
        f"{api_url}/v1/todos/{created.ref_id}",
        headers=_headers(api_key),
        json={
            "ref_id": created.ref_id,
            "name": {"should_change": True, "value": "New Todo"},
            "status": {"should_change": False},
            "is_key": {"should_change": True, "value": True},
            "eisen": {"should_change": False},
            "difficulty": {"should_change": False},
            "actionable_date": {"should_change": False},
            "due_date": {"should_change": False},
            "aspect_ref_id": {"should_change": False},
            "chapter_ref_id": {"should_change": False},
            "goal_ref_id": {"should_change": False},
        },
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/todos/{created.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 200
    assert response2.json()["todo_task"]["name"] == "New Todo"
    assert response2.json()["inbox_task"]["is_key"] is True


def test_api_todo_archive(api_url: str, api_key: str, create_todo) -> None:
    created = create_todo("Archive Todo")

    response = requests.delete(
        f"{api_url}/v1/todos/{created.ref_id}",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    response1 = requests.get(
        f"{api_url}/v1/todos/{created.ref_id}",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response1.status_code == 502
    assert response1.json()["status"] == 404

    response2 = requests.get(
        f"{api_url}/v1/todos/{created.ref_id}?allow_archived=true",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 200
    assert response2.json()["todo_task"]["archived"] is True


def test_api_todo_remove(api_url: str, api_key: str, create_todo) -> None:
    created = create_todo("Remove Todo")

    response = requests.delete(
        f"{api_url}/v1/todos/{created.ref_id}/remove",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/todos/{created.ref_id}?allow_archived=true",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 502
    assert response2.json()["status"] == 404


def test_api_todo_requires_auth(api_url: str) -> None:
    response = requests.get(
        f"{api_url}/v1/todos?allow_archived=false&include_notes=false&include_life_plan=false&include_tags=false&include_contacts=false&include_inbox_tasks=true",
        timeout=10,
    )
    assert response.status_code == 401
