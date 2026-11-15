"""Tests for the API for todo tasks."""

import time
from collections.abc import Iterator
from datetime import UTC, datetime, timedelta

import pytest
import requests
from jupiter_webapi_client.api.application.invite_users_to_entity import (
    sync_detailed as invite_users_to_entity_sync,
)
from jupiter_webapi_client.api.inbox_tasks.inbox_task_update import (
    sync_detailed as inbox_task_update_sync,
)
from jupiter_webapi_client.api.test_helper.workspace_set_feature import (
    sync_detailed as workspace_set_feature_sync,
)
from jupiter_webapi_client.api.todo.todo_task_archive import (
    sync_detailed as todo_task_archive_sync,
)
from jupiter_webapi_client.api.todo.todo_task_create import (
    sync_detailed as todo_task_create_sync,
)
from jupiter_webapi_client.api.todo.todo_task_find import (
    sync_detailed as todo_task_find_sync,
)
from jupiter_webapi_client.client import AuthenticatedClient
from jupiter_webapi_client.models.access_level import AccessLevel
from jupiter_webapi_client.models.difficulty import Difficulty
from jupiter_webapi_client.models.eisen import Eisen
from jupiter_webapi_client.models.inbox_task_status import InboxTaskStatus
from jupiter_webapi_client.models.inbox_task_update_args import InboxTaskUpdateArgs
from jupiter_webapi_client.models.inbox_task_update_args_actionable_date import (
    InboxTaskUpdateArgsActionableDate,
)
from jupiter_webapi_client.models.inbox_task_update_args_difficulty import (
    InboxTaskUpdateArgsDifficulty,
)
from jupiter_webapi_client.models.inbox_task_update_args_due_date import (
    InboxTaskUpdateArgsDueDate,
)
from jupiter_webapi_client.models.inbox_task_update_args_eisen import (
    InboxTaskUpdateArgsEisen,
)
from jupiter_webapi_client.models.inbox_task_update_args_is_key import (
    InboxTaskUpdateArgsIsKey,
)
from jupiter_webapi_client.models.inbox_task_update_args_name import (
    InboxTaskUpdateArgsName,
)
from jupiter_webapi_client.models.inbox_task_update_args_status import (
    InboxTaskUpdateArgsStatus,
)
from jupiter_webapi_client.models.invite_users_to_entity_args import (
    InviteUsersToEntityArgs,
)
from jupiter_webapi_client.models.named_entity_tag import NamedEntityTag
from jupiter_webapi_client.models.todo_task import TodoTask
from jupiter_webapi_client.models.todo_task_archive_args import TodoTaskArchiveArgs
from jupiter_webapi_client.models.todo_task_create_args import TodoTaskCreateArgs
from jupiter_webapi_client.models.todo_task_create_result import TodoTaskCreateResult
from jupiter_webapi_client.models.todo_task_find_args import TodoTaskFindArgs
from jupiter_webapi_client.models.todo_task_find_result import TodoTaskFindResult
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


_ACL_DENIED_REASON = "You are not allowed to access this entity"


def _assert_acl_denied(response: requests.Response) -> None:
    assert response.status_code == 502
    body = response.json()
    assert body["status"] in (401, 404)
    if body["status"] == 401:
        assert body["response"]["reason"] == _ACL_DENIED_REASON


def _todo_update_body(ref_id: str, *, name: str) -> dict[str, object]:
    return {
        "ref_id": ref_id,
        "name": {"should_change": True, "value": name},
        "status": {"should_change": False},
        "is_key": {"should_change": False},
        "eisen": {"should_change": False},
        "difficulty": {"should_change": False},
        "actionable_date": {"should_change": False},
        "due_date": {"should_change": False},
        "aspect_ref_id": {"should_change": False},
        "chapter_ref_id": {"should_change": False},
        "goal_ref_id": {"should_change": False},
        "schedulability": {"should_change": False},
        "scheduling_event_duration_mins": {"should_change": False},
        "scheduling_event_count": {"should_change": False},
    }


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


@pytest.fixture()
def create_finished_todo(logged_in_client: AuthenticatedClient, create_todo):
    """Create a todo and finish it, which stamps the completion time of its inbox task."""

    def _create(name: str) -> TodoTask:
        todo = create_todo(name)
        todo_entry = _find_todos(logged_in_client, include_inbox_tasks=True)
        inbox_task = next(
            e.inbox_task for e in todo_entry if e.todo_task.ref_id == todo.ref_id
        )
        inbox_task_update_sync(
            client=logged_in_client,
            body=InboxTaskUpdateArgs(
                ref_id=inbox_task.ref_id,
                name=InboxTaskUpdateArgsName(should_change=False),
                status=InboxTaskUpdateArgsStatus(
                    should_change=True, value=InboxTaskStatus.DONE
                ),
                eisen=InboxTaskUpdateArgsEisen(should_change=False),
                difficulty=InboxTaskUpdateArgsDifficulty(should_change=False),
                actionable_date=InboxTaskUpdateArgsActionableDate(should_change=False),
                due_date=InboxTaskUpdateArgsDueDate(should_change=False),
                is_key=InboxTaskUpdateArgsIsKey(should_change=False),
            ),
        )
        return todo

    return _create


def _find_todos(client: AuthenticatedClient, **kwargs):
    result = todo_task_find_sync(client=client, body=TodoTaskFindArgs(**kwargs))
    return get_parsed_from_response(TodoTaskFindResult, result).entries


def _names(entries) -> set[str]:
    return {e.todo_task.name for e in entries}


def _timestamp(value: datetime) -> str:
    return value.astimezone(UTC).strftime("%Y-%m-%dT%H:%M:%S.%f+00:00")


def test_api_todo_find_only_archived(
    logged_in_client: AuthenticatedClient, create_todo, archive_todo
) -> None:
    open_todo = create_todo("Only Archived: still open")
    archived_todo = create_todo("Only Archived: archived")
    archive_todo(archived_todo.ref_id)

    # Archived ones stay out unless asked for, and then they come with the rest...
    assert _names(_find_todos(logged_in_client)) >= {open_todo.name}
    assert archived_todo.name not in _names(_find_todos(logged_in_client))
    with_archived = _names(_find_todos(logged_in_client, allow_archived=True))
    assert {open_todo.name, archived_todo.name} <= with_archived

    # ...unless only the archived ones are wanted.
    only_archived = _find_todos(logged_in_client, only_archived=True)
    assert archived_todo.name in _names(only_archived)
    assert open_todo.name not in _names(only_archived)
    assert all(e.todo_task.archived for e in only_archived)


def test_api_todo_find_filter_finished_after(
    logged_in_client: AuthenticatedClient,
    create_todo,
    create_finished_todo,
    archive_todo,
) -> None:
    still_open = create_todo("Finished After: still open")
    finished = create_finished_todo("Finished After: finished")
    finished_then_archived = create_finished_todo("Finished After: finished, archived")
    archive_todo(finished_then_archived.ref_id)

    an_hour_ago = _timestamp(datetime.now(UTC) - timedelta(hours=1))

    # What was finished, and only that, whether or not it is archived now.
    both = _find_todos(
        logged_in_client,
        allow_archived=True,
        filter_finished_after=an_hour_ago,
        include_inbox_tasks=True,
    )
    assert _names(both) == {finished.name, finished_then_archived.name}
    assert all(e.inbox_task.status == InboxTaskStatus.DONE for e in both)
    assert still_open.name not in _names(both)

    # Without asking for archived ones, the archived ones are not there.
    live = _find_todos(logged_in_client, filter_finished_after=an_hour_ago)
    assert _names(live) == {finished.name}

    # Just the archived ones, which is what a recent-history view wants.
    archived = _find_todos(
        logged_in_client, only_archived=True, filter_finished_after=an_hour_ago
    )
    assert _names(archived) == {finished_then_archived.name}


def test_api_todo_find_filter_finished_after_is_a_real_cut(
    logged_in_client: AuthenticatedClient, create_finished_todo, archive_todo
) -> None:
    earlier = create_finished_todo("Finished Cut: earlier")
    archive_todo(earlier.ref_id)
    time.sleep(1.5)
    cut = _timestamp(datetime.now(UTC))
    time.sleep(1.5)
    later = create_finished_todo("Finished Cut: later")
    archive_todo(later.ref_id)

    found = _find_todos(logged_in_client, only_archived=True, filter_finished_after=cut)
    assert _names(found) == {later.name}

    in_the_future = _timestamp(datetime.now(UTC) + timedelta(days=1))
    assert (
        _find_todos(
            logged_in_client, allow_archived=True, filter_finished_after=in_the_future
        )
        == []
    )


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
            "schedulability": {"should_change": False},
            "scheduling_event_duration_mins": {"should_change": False},
            "scheduling_event_count": {"should_change": False},
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


def test_api_todo_find_filter_finished_after_covers_shared_todos_and_only_them(
    webapi_url: str,
    create_finished_todo,
    archive_todo,
    grant_todo_access,
    another_user_with_todos_enabled: AnotherUserAndWorkspace,
) -> None:
    # Todos of another workspace live in that workspace's inbox tasks, so finding
    # them by finish date goes by a different road than finding one's own.
    shared_live = create_finished_todo("Shared Finished: shared, live")
    shared_archived = create_finished_todo("Shared Finished: shared, archived")
    not_shared = create_finished_todo("Shared Finished: not shared")
    grant_todo_access(shared_live, AccessLevel.READER)
    grant_todo_access(shared_archived, AccessLevel.READER)
    archive_todo(shared_archived.ref_id)
    archive_todo(not_shared.ref_id)

    sharee_client = AuthenticatedClient(
        base_url=webapi_url,
        token=another_user_with_todos_enabled.init_result.auth_token_ext,
    )
    an_hour_ago = _timestamp(datetime.now(UTC) - timedelta(hours=1))

    found = _find_todos(
        sharee_client, allow_archived=True, filter_finished_after=an_hour_ago
    )
    assert _names(found) == {shared_live.name, shared_archived.name}

    found_archived = _find_todos(
        sharee_client, only_archived=True, filter_finished_after=an_hour_ago
    )
    assert _names(found_archived) == {shared_archived.name}


def _assert_other_user_cannot_access_todo(
    api_url: str,
    *,
    todo_ref_id: str,
    owner_api_key: str,
    other_api_key: str,
) -> None:
    assert other_api_key != owner_api_key

    owner_load_response = requests.get(
        f"{api_url}/v1/todos/{todo_ref_id}?allow_archived=false",
        headers=_headers(owner_api_key),
        timeout=10,
    )
    assert owner_load_response.status_code == 200

    load_response = requests.get(
        f"{api_url}/v1/todos/{todo_ref_id}?allow_archived=false",
        headers=_headers(other_api_key),
        timeout=10,
    )
    _assert_acl_denied(load_response)

    update_response = requests.put(
        f"{api_url}/v1/todos/{todo_ref_id}",
        headers=_headers(other_api_key),
        json=_todo_update_body(todo_ref_id, name="Hacked Todo"),
        timeout=10,
    )
    _assert_acl_denied(update_response)

    archive_response = requests.delete(
        f"{api_url}/v1/todos/{todo_ref_id}",
        headers=_headers(other_api_key),
        timeout=10,
    )
    _assert_acl_denied(archive_response)


def test_api_todo_acl_reader_can_read_but_not_update_or_archive(
    api_url: str,
    api_key: str,
    create_todo,
    grant_todo_access,
    another_user_with_todos_enabled: AnotherUserAndWorkspace,
) -> None:
    created = create_todo("Reader ACL Todo")
    other_api_key = another_user_with_todos_enabled.api_key

    _assert_other_user_cannot_access_todo(
        api_url,
        todo_ref_id=created.ref_id,
        owner_api_key=api_key,
        other_api_key=other_api_key,
    )

    other_api_key = grant_todo_access(created, AccessLevel.READER)

    load_response = requests.get(
        f"{api_url}/v1/todos/{created.ref_id}?allow_archived=false",
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert load_response.status_code == 200
    todo = load_response.json()["todo_task"]
    assert todo["ref_id"] == created.ref_id
    assert todo["name"] == "Reader ACL Todo"

    update_response = requests.put(
        f"{api_url}/v1/todos/{created.ref_id}",
        headers=_headers(other_api_key),
        json=_todo_update_body(created.ref_id, name="Hacked Todo"),
        timeout=10,
    )
    _assert_acl_denied(update_response)

    archive_response = requests.delete(
        f"{api_url}/v1/todos/{created.ref_id}",
        headers=_headers(other_api_key),
        timeout=10,
    )
    _assert_acl_denied(archive_response)


def test_api_todo_acl_writer_can_read_and_update(
    api_url: str,
    create_todo,
    grant_todo_access,
) -> None:
    created = create_todo("Writer Update Todo")
    other_api_key = grant_todo_access(created, AccessLevel.WRITER)

    load_response = requests.get(
        f"{api_url}/v1/todos/{created.ref_id}?allow_archived=false",
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert load_response.status_code == 200
    assert load_response.json()["todo_task"]["name"] == "Writer Update Todo"

    update_response = requests.put(
        f"{api_url}/v1/todos/{created.ref_id}",
        headers=_headers(other_api_key),
        json=_todo_update_body(created.ref_id, name="Updated By Writer"),
        timeout=10,
    )
    assert update_response.status_code == 200

    verify_response = requests.get(
        f"{api_url}/v1/todos/{created.ref_id}?allow_archived=false",
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert verify_response.status_code == 200
    assert verify_response.json()["todo_task"]["name"] == "Updated By Writer"


def test_api_todo_acl_writer_can_read_and_archive(
    api_url: str,
    create_todo,
    grant_todo_access,
) -> None:
    created = create_todo("Writer Archive Todo")
    other_api_key = grant_todo_access(created, AccessLevel.WRITER)

    load_response = requests.get(
        f"{api_url}/v1/todos/{created.ref_id}?allow_archived=false",
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert load_response.status_code == 200
    assert load_response.json()["todo_task"]["name"] == "Writer Archive Todo"

    archive_response = requests.delete(
        f"{api_url}/v1/todos/{created.ref_id}",
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert archive_response.status_code == 200

    archived_response = requests.get(
        f"{api_url}/v1/todos/{created.ref_id}?allow_archived=true",
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert archived_response.status_code == 200
    assert archived_response.json()["todo_task"]["archived"] is True


def test_api_todo_acl_z_denied_without_grant(
    api_url: str,
    api_key: str,
    create_todo,
    another_user_with_todos_enabled: AnotherUserAndWorkspace,
) -> None:
    created = create_todo("ACL Todo")
    _assert_other_user_cannot_access_todo(
        api_url,
        todo_ref_id=created.ref_id,
        owner_api_key=api_key,
        other_api_key=another_user_with_todos_enabled.api_key,
    )


def test_api_todo_requires_auth(api_url: str) -> None:
    response = requests.get(
        f"{api_url}/v1/todos?allow_archived=false&include_notes=false&include_life_plan=false&include_tags=false&include_contacts=false&include_inbox_tasks=true",
        timeout=10,
    )
    assert response.status_code == 401
