"""Tests for the notes API using todo tasks as note owners."""

from collections.abc import Iterator

import httpx
import pytest
import requests
from jupiter_webapi_client.api.application.invite_users_to_entity import (
    sync_detailed as invite_users_to_entity_sync,
)
from jupiter_webapi_client.api.test_helper.workspace_set_feature import (
    sync_detailed as workspace_set_feature_sync,
)
from jupiter_webapi_client.api.todo.todo_task_create import (
    sync_detailed as todo_task_create_sync,
)
from jupiter_webapi_client.client import AuthenticatedClient
from jupiter_webapi_client.models.access_level import AccessLevel
from jupiter_webapi_client.models.difficulty import Difficulty
from jupiter_webapi_client.models.eisen import Eisen
from jupiter_webapi_client.models.invite_users_to_entity_args import (
    InviteUsersToEntityArgs,
)
from jupiter_webapi_client.models.named_entity_tag import NamedEntityTag
from jupiter_webapi_client.models.todo_task import TodoTask
from jupiter_webapi_client.models.todo_task_create_args import TodoTaskCreateArgs
from jupiter_webapi_client.models.todo_task_create_result import TodoTaskCreateResult
from jupiter_webapi_client.models.workspace_feature import WorkspaceFeature
from jupiter_webapi_client.models.workspace_set_feature_args import (
    WorkspaceSetFeatureArgs,
)

from itests.api.conftest import AnotherUserAndWorkspace, create_other_user_and_workspace
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
def create_todo_task(logged_in_client: AuthenticatedClient):
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


def _note_owner_todo_task(todo_task_ref_id: str) -> str:
    return f"TodoTask:std:{todo_task_ref_id}"


@pytest.fixture()
def create_note(webapi_url: str, new_user_and_workspace):
    token = new_user_and_workspace.auth_token_ext

    def _create(todo_task_ref_id: str, text: str = "Hello world") -> dict:  # type: ignore[type-arg,no-any-return]
        response = httpx.post(
            f"{webapi_url}/note-create",
            headers={
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json",
            },
            json={
                "owner": _note_owner_todo_task(todo_task_ref_id),
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
        return response.json()["new_note"]  # type: ignore[no-any-return]

    return _create


@pytest.fixture(scope="module")
def another_user_with_todos_enabled(
    webapi_url: str,
) -> Iterator[AnotherUserAndWorkspace]:
    with create_other_user_and_workspace(webapi_url) as other_user_and_workspace:

        def make_client() -> AuthenticatedClient:
            return AuthenticatedClient(
                base_url=webapi_url,
                token=other_user_and_workspace.init_result.auth_token_ext,
            )

        try:
            workspace_set_feature_sync(
                client=make_client(),
                body=WorkspaceSetFeatureArgs(
                    feature=WorkspaceFeature.TODO_TASK,
                    value=True,
                ),
            )
            yield other_user_and_workspace
        finally:
            workspace_set_feature_sync(
                client=make_client(),
                body=WorkspaceSetFeatureArgs(
                    feature=WorkspaceFeature.TODO_TASK,
                    value=False,
                ),
            )


@pytest.fixture()
def grant_todo_access(
    logged_in_client: AuthenticatedClient,
    another_user_with_todos_enabled: AnotherUserAndWorkspace,
):
    def _grant(todo: TodoTask, access_level: AccessLevel) -> str:
        response = invite_users_to_entity_sync(
            client=logged_in_client,
            body=InviteUsersToEntityArgs(
                entity_type=NamedEntityTag.TODOTASK,
                entity_ref_id=todo.ref_id,
                user_ref_ids=[
                    another_user_with_todos_enabled.init_result.new_user.ref_id
                ],
                access_level=access_level,
            ),
        )
        assert response.status_code == 200
        return another_user_with_todos_enabled.api_key

    return _grant


def _headers(api_key: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {api_key}"}


_ACL_DENIED_REASON = "You are not allowed to access this entity"


def _assert_acl_denied(response: requests.Response) -> None:
    assert response.status_code == 502
    body = response.json()
    assert body["status"] in (401, 404)
    if body["status"] == 401:
        assert body["response"]["reason"] == _ACL_DENIED_REASON


def test_api_common_note_create(api_url: str, api_key: str, create_todo_task) -> None:
    task = create_todo_task("Note Task")

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
    api_url: str, api_key: str, create_todo_task, create_note
) -> None:
    task = create_todo_task("Note Load Task")
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
    api_url: str, api_key: str, create_todo_task, create_note
) -> None:
    task = create_todo_task("Note Find Task")
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
    api_url: str, api_key: str, create_todo_task, create_note
) -> None:
    task = create_todo_task("Note Update Task")
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
    api_url: str, api_key: str, create_todo_task, create_note
) -> None:
    task = create_todo_task("Note Archive Task")
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
    api_url: str, api_key: str, create_todo_task, create_note
) -> None:
    task = create_todo_task("Note Remove Task")
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


def _create_note_via_api(
    api_url: str, api_key: str, todo_ref_id: str, text: str
) -> requests.Response:
    return requests.post(
        f"{api_url}/v1/common/notes",
        headers=_headers(api_key),
        json={
            "owner": _note_owner_todo_task(todo_ref_id),
            "content": [
                {
                    "correlation_id": "1",
                    "kind": "paragraph",
                    "text": text,
                }
            ],
        },
        timeout=10,
    )


def _update_note_via_api(
    api_url: str, api_key: str, note_ref_id: str, text: str
) -> requests.Response:
    return requests.put(
        f"{api_url}/v1/common/notes/{note_ref_id}",
        headers=_headers(api_key),
        json={
            "ref_id": note_ref_id,
            "content": {
                "should_change": True,
                "value": [
                    {
                        "correlation_id": "1",
                        "kind": "paragraph",
                        "text": text,
                    }
                ],
            },
        },
        timeout=10,
    )


def _assert_can_mutate_note(
    api_url: str,
    api_key: str,
    *,
    create_todo_task,
    grant_todo_access,
    access_level: AccessLevel | None,
) -> None:
    role = access_level.value if access_level is not None else "owner"

    create_todo = create_todo_task(f"Note Create {role}")
    actor_api_key = (
        grant_todo_access(create_todo, access_level)
        if access_level is not None
        else api_key
    )
    create_response = _create_note_via_api(
        api_url, actor_api_key, create_todo.ref_id, "Created note"
    )
    assert create_response.status_code == 200
    note_ref_id = create_response.json()["new_note"]["ref_id"]

    load_response = requests.get(
        f"{api_url}/v1/common/notes/{note_ref_id}?allow_archived=false",
        headers=_headers(actor_api_key),
        timeout=10,
    )
    assert load_response.status_code == 200

    update_response = _update_note_via_api(
        api_url, actor_api_key, note_ref_id, "Updated note"
    )
    assert update_response.status_code == 200

    archive_todo = create_todo_task(f"Note Archive {role}")
    archive_note = _create_note_via_api(
        api_url, api_key, archive_todo.ref_id, "Archive note"
    )
    assert archive_note.status_code == 200
    archive_actor = (
        grant_todo_access(archive_todo, access_level)
        if access_level is not None
        else api_key
    )
    archive_response = requests.delete(
        f"{api_url}/v1/common/notes/{archive_note.json()['new_note']['ref_id']}",
        headers=_headers(archive_actor),
        timeout=10,
    )
    assert archive_response.status_code == 200

    remove_todo = create_todo_task(f"Note Remove {role}")
    remove_note = _create_note_via_api(
        api_url, api_key, remove_todo.ref_id, "Remove note"
    )
    assert remove_note.status_code == 200
    remove_actor = (
        grant_todo_access(remove_todo, access_level)
        if access_level is not None
        else api_key
    )
    remove_response = requests.delete(
        f"{api_url}/v1/common/notes/{remove_note.json()['new_note']['ref_id']}/remove",
        headers=_headers(remove_actor),
        timeout=10,
    )
    assert remove_response.status_code == 200


def test_api_common_note_acl_owner_can_create_read_update_archive_and_remove(
    api_url: str, api_key: str, create_todo_task, grant_todo_access
) -> None:
    _assert_can_mutate_note(
        api_url,
        api_key,
        create_todo_task=create_todo_task,
        grant_todo_access=grant_todo_access,
        access_level=None,
    )


def test_api_common_note_acl_writer_can_create_read_update_archive_and_remove(
    api_url: str, api_key: str, create_todo_task, grant_todo_access
) -> None:
    _assert_can_mutate_note(
        api_url,
        api_key,
        create_todo_task=create_todo_task,
        grant_todo_access=grant_todo_access,
        access_level=AccessLevel.WRITER,
    )


def test_api_common_note_acl_commenter_can_create_read_update_archive_and_remove(
    api_url: str, api_key: str, create_todo_task, grant_todo_access
) -> None:
    _assert_can_mutate_note(
        api_url,
        api_key,
        create_todo_task=create_todo_task,
        grant_todo_access=grant_todo_access,
        access_level=AccessLevel.COMMENTER,
    )


def test_api_common_note_acl_reader_can_only_read(
    api_url: str, api_key: str, create_todo_task, grant_todo_access
) -> None:
    todo = create_todo_task("Reader Note ACL")
    note_response = _create_note_via_api(api_url, api_key, todo.ref_id, "Owner note")
    assert note_response.status_code == 200
    note_ref_id = note_response.json()["new_note"]["ref_id"]
    other_api_key = grant_todo_access(todo, AccessLevel.READER)

    load_response = requests.get(
        f"{api_url}/v1/common/notes/{note_ref_id}?allow_archived=false",
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert load_response.status_code == 200

    create_response = _create_note_via_api(
        api_url, other_api_key, todo.ref_id, "Reader note"
    )
    _assert_acl_denied(create_response)

    update_response = _update_note_via_api(
        api_url, other_api_key, note_ref_id, "Hacked note"
    )
    _assert_acl_denied(update_response)

    archive_response = requests.delete(
        f"{api_url}/v1/common/notes/{note_ref_id}",
        headers=_headers(other_api_key),
        timeout=10,
    )
    _assert_acl_denied(archive_response)

    remove_response = requests.delete(
        f"{api_url}/v1/common/notes/{note_ref_id}/remove",
        headers=_headers(other_api_key),
        timeout=10,
    )
    _assert_acl_denied(remove_response)
