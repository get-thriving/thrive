"""Tests for the notes API using inbox tasks."""

from collections.abc import Iterator

import httpx
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


def _note_owner_todo_task(inbox_task_ref_id: str) -> str:
    return f"TodoTask:{inbox_task_ref_id}:std"


@pytest.fixture()
def create_note(webapi_url: str, new_user_and_workspace):
    token = new_user_and_workspace.auth_token_ext

    def _create(inbox_task_ref_id: str, text: str = "Hello world") -> dict:
        response = httpx.post(
            f"{webapi_url}/note-create",
            headers={
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json",
            },
            json={
                "owner": _note_owner_todo_task(inbox_task_ref_id),
                "content": [
                    {
                        "correlation_id": "1",
                        "kind": "paragraph",
                        "text": text,
                    }
                ],
            },
            timeout=30.0,
        )
        assert response.status_code == 200, response.text
        return response.json()["new_note"]

    return _create


def _headers(api_key: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {api_key}"}


def test_api_common_note_create(api_url: str, api_key: str, create_inbox_task) -> None:
    task = create_inbox_task("Note Task")

    response = requests.post(
        f"{api_url}/v1/common/notes",
        headers=_headers(api_key),
        json={
            "owner": _note_owner_todo_task(task.ref_id),
            "content": [
                {
                    "correlation_id": "1",
                    "kind": "paragraph",
                    "text": "My note content",
                }
            ],
        },
        timeout=10,
    )
    assert response.status_code == 200

    note = response.json()["new_note"]
    assert note["owner"] == _note_owner_todo_task(task.ref_id)
    assert note["archived"] is False
    assert "ref_id" in note
    assert len(note["content"]) == 1
    assert note["content"][0]["text"] == "My note content"


def test_api_common_note_load(
    api_url: str, api_key: str, create_inbox_task, create_note
) -> None:
    task = create_inbox_task("Note Load Task")
    note = create_note(task.ref_id, "Load me")

    response = requests.get(
        f"{api_url}/v1/common/notes/{note['ref_id']}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    loaded = response.json()["note"]
    assert loaded["ref_id"] == note["ref_id"]
    assert loaded["owner"] == _note_owner_todo_task(task.ref_id)


def test_api_common_note_find(
    api_url: str, api_key: str, create_inbox_task, create_note
) -> None:
    task = create_inbox_task("Note Find Task")
    note = create_note(task.ref_id, "Find me")

    response = requests.get(
        f"{api_url}/v1/common/notes?allow_archived=false&filter_owner_types=TodoTask",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    ref_ids = [n["ref_id"] for n in response.json()["notes"]]
    assert note["ref_id"] in ref_ids


def test_api_common_note_update(
    api_url: str, api_key: str, create_inbox_task, create_note
) -> None:
    task = create_inbox_task("Note Update Task")
    note = create_note(task.ref_id, "Old content")

    response = requests.put(
        f"{api_url}/v1/common/notes/{note['ref_id']}",
        headers=_headers(api_key),
        json={
            "ref_id": note["ref_id"],
            "content": {
                "should_change": True,
                "value": [
                    {
                        "correlation_id": "1",
                        "kind": "paragraph",
                        "text": "New content",
                    }
                ],
            },
        },
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/common/notes/{note['ref_id']}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 200
    assert response2.json()["note"]["content"][0]["text"] == "New content"


def test_api_common_note_archive(
    api_url: str, api_key: str, create_inbox_task, create_note
) -> None:
    task = create_inbox_task("Note Archive Task")
    note = create_note(task.ref_id, "Archive me")

    response = requests.delete(
        f"{api_url}/v1/common/notes/{note['ref_id']}",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/common/notes/{note['ref_id']}?allow_archived=true",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 200
    assert response2.json()["note"]["archived"] is True

    response3 = requests.get(
        f"{api_url}/v1/common/notes/{note['ref_id']}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response3.status_code == 502
    assert response3.json()["status"] == 404


def test_api_common_note_remove(
    api_url: str, api_key: str, create_inbox_task, create_note
) -> None:
    task = create_inbox_task("Note Remove Task")
    note = create_note(task.ref_id, "Remove me")

    response = requests.delete(
        f"{api_url}/v1/common/notes/{note['ref_id']}/remove",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/common/notes/{note['ref_id']}?allow_archived=true",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 502
    assert response2.json()["status"] == 404


def test_api_common_notes_requires_auth(api_url: str) -> None:
    response = requests.get(
        f"{api_url}/v1/common/notes?allow_archived=false",
        timeout=10,
    )
    assert response.status_code == 401
