"""Tests for the tags API using todo tasks."""

from collections.abc import Iterator

import pytest
import requests
from jupiter_webapi_client.api.application.invite_users_to_entity import (
    sync_detailed as invite_users_to_entity_sync,
)
from jupiter_webapi_client.api.tags.tag_create import (
    sync_detailed as tag_create_sync,
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
from jupiter_webapi_client.models.tag import Tag
from jupiter_webapi_client.models.tag_create_args import TagCreateArgs
from jupiter_webapi_client.models.tag_create_result import TagCreateResult
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
def create_tag(logged_in_client: AuthenticatedClient):
    def _create(name: str) -> Tag:
        result = tag_create_sync(
            client=logged_in_client,
            body=TagCreateArgs(
                name=name,
            ),
        )
        return get_parsed_from_response(TagCreateResult, result).new_tag

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


def _todo_owner(ref_id: str) -> str:
    return f"TodoTask:std:{ref_id}"


def test_api_common_tag_create(api_url: str, api_key: str) -> None:
    response = requests.post(
        f"{api_url}/v1/common/tags",
        headers=_headers(api_key),
        json={
            "name": "urgent",
        },
        timeout=10,
    )
    assert response.status_code == 200

    tag = response.json()["new_tag"]
    assert tag["name"] == "urgent"
    assert tag["archived"] is False
    assert "ref_id" in tag


def test_api_common_tag_load(api_url: str, api_key: str, create_tag) -> None:
    tag = create_tag("load-tag")

    response = requests.get(
        f"{api_url}/v1/common/tags/{tag.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    loaded = response.json()["tag"]
    assert loaded["ref_id"] == tag.ref_id
    assert loaded["name"] == "load-tag"


def test_api_common_tag_find(api_url: str, api_key: str, create_tag) -> None:
    create_tag("find-tag-1")
    create_tag("find-tag-2")

    response = requests.get(
        f"{api_url}/v1/common/tags?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    names = [t["name"] for t in response.json()["tags"]]
    assert "find-tag-1" in names
    assert "find-tag-2" in names


def test_api_common_tag_update(api_url: str, api_key: str, create_tag) -> None:
    tag = create_tag("old-tag")

    response = requests.put(
        f"{api_url}/v1/common/tags/{tag.ref_id}",
        headers=_headers(api_key),
        json={
            "ref_id": tag.ref_id,
            "name": {"should_change": True, "value": "new-tag"},
        },
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/common/tags/{tag.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 200
    assert response2.json()["tag"]["name"] == "new-tag"


def test_api_common_tag_link_upsert(
    api_url: str, api_key: str, create_todo, create_tag
) -> None:
    todo = create_todo("Tagged Task")
    create_tag("link-tag")

    owner = _todo_owner(todo.ref_id)
    response = requests.post(
        f"{api_url}/v1/common/tags/link",
        headers=_headers(api_key),
        json={
            "owner": owner,
            "tag_names": ["link-tag"],
        },
        timeout=10,
    )
    assert response.status_code == 200

    tag_link = response.json()["tag_link"]
    assert tag_link["owner"] == owner
    assert len(tag_link["ref_ids"]) >= 1


def test_api_common_tag_archive(api_url: str, api_key: str, create_tag) -> None:
    tag = create_tag("archive-tag")

    response = requests.delete(
        f"{api_url}/v1/common/tags/{tag.ref_id}",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/common/tags/{tag.ref_id}?allow_archived=true",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 200
    assert response2.json()["tag"]["archived"] is True

    response3 = requests.get(
        f"{api_url}/v1/common/tags/{tag.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response3.status_code == 502
    assert response3.json()["status"] == 404


def test_api_common_tag_remove(api_url: str, api_key: str, create_tag) -> None:
    tag = create_tag("remove-tag")

    response = requests.delete(
        f"{api_url}/v1/common/tags/{tag.ref_id}/remove",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/common/tags/{tag.ref_id}?allow_archived=true",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 502
    assert response2.json()["status"] == 404


def test_api_common_tags_requires_auth(api_url: str) -> None:
    response = requests.get(
        f"{api_url}/v1/common/tags?allow_archived=false",
        timeout=10,
    )
    assert response.status_code == 401


def _upsert_tag_link(
    api_url: str, api_key: str, todo_ref_id: str, tag_names: list[str]
) -> requests.Response:
    return requests.post(
        f"{api_url}/v1/common/tags/link",
        headers=_headers(api_key),
        json={
            "owner": _todo_owner(todo_ref_id),
            "tag_names": tag_names,
        },
        timeout=10,
    )


def _assert_non_owner_can_only_read_tags(
    api_url: str,
    api_key: str,
    *,
    create_todo,
    create_tag,
    grant_todo_access,
    access_level: AccessLevel,
) -> None:
    todo = create_todo(f"Tag ACL {access_level.value}")
    tag = create_tag(f"tag-{access_level.value}")
    link_response = _upsert_tag_link(api_url, api_key, todo.ref_id, [tag.name])
    assert link_response.status_code == 200
    other_api_key = grant_todo_access(todo, access_level)

    load_todo = requests.get(
        f"{api_url}/v1/todos/{todo.ref_id}?allow_archived=false",
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert load_todo.status_code == 200
    assert any(loaded["ref_id"] == tag.ref_id for loaded in load_todo.json()["tags"])

    upsert_response = _upsert_tag_link(
        api_url, other_api_key, todo.ref_id, ["hacked-tag"]
    )
    _assert_acl_denied(upsert_response)

    update_response = requests.put(
        f"{api_url}/v1/common/tags/{tag.ref_id}",
        headers=_headers(other_api_key),
        json={
            "ref_id": tag.ref_id,
            "name": {"should_change": True, "value": "hacked-tag"},
        },
        timeout=10,
    )
    _assert_acl_denied(update_response)

    archive_response = requests.delete(
        f"{api_url}/v1/common/tags/{tag.ref_id}",
        headers=_headers(other_api_key),
        timeout=10,
    )
    _assert_acl_denied(archive_response)

    remove_response = requests.delete(
        f"{api_url}/v1/common/tags/{tag.ref_id}/remove",
        headers=_headers(other_api_key),
        timeout=10,
    )
    _assert_acl_denied(remove_response)


def test_api_common_tag_acl_owner_can_upsert_update_archive_and_remove(
    api_url: str, api_key: str, create_todo, create_tag
) -> None:
    todo = create_todo("Owner Tag ACL")
    tag = create_tag("owner-tag")
    upsert_response = _upsert_tag_link(api_url, api_key, todo.ref_id, [tag.name])
    assert upsert_response.status_code == 200

    update_response = requests.put(
        f"{api_url}/v1/common/tags/{tag.ref_id}",
        headers=_headers(api_key),
        json={
            "ref_id": tag.ref_id,
            "name": {"should_change": True, "value": "owner-tag-updated"},
        },
        timeout=10,
    )
    assert update_response.status_code == 200

    load_todo = requests.get(
        f"{api_url}/v1/todos/{todo.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert load_todo.status_code == 200
    assert any(loaded["ref_id"] == tag.ref_id for loaded in load_todo.json()["tags"])

    archive_response = requests.delete(
        f"{api_url}/v1/common/tags/{tag.ref_id}",
        headers=_headers(api_key),
        timeout=10,
    )
    assert archive_response.status_code == 200

    remove_todo = create_todo("Owner Tag Remove ACL")
    remove_tag = create_tag("remove-tag-acl")
    remove_link = _upsert_tag_link(
        api_url, api_key, remove_todo.ref_id, [remove_tag.name]
    )
    assert remove_link.status_code == 200
    remove_response = requests.delete(
        f"{api_url}/v1/common/tags/{remove_tag.ref_id}/remove",
        headers=_headers(api_key),
        timeout=10,
    )
    assert remove_response.status_code == 200


def test_api_common_tag_acl_writer_can_only_read(
    api_url: str, api_key: str, create_todo, create_tag, grant_todo_access
) -> None:
    _assert_non_owner_can_only_read_tags(
        api_url,
        api_key,
        create_todo=create_todo,
        create_tag=create_tag,
        grant_todo_access=grant_todo_access,
        access_level=AccessLevel.WRITER,
    )


def test_api_common_tag_acl_commenter_can_only_read(
    api_url: str, api_key: str, create_todo, create_tag, grant_todo_access
) -> None:
    _assert_non_owner_can_only_read_tags(
        api_url,
        api_key,
        create_todo=create_todo,
        create_tag=create_tag,
        grant_todo_access=grant_todo_access,
        access_level=AccessLevel.COMMENTER,
    )


def test_api_common_tag_acl_reader_can_only_read(
    api_url: str, api_key: str, create_todo, create_tag, grant_todo_access
) -> None:
    _assert_non_owner_can_only_read_tags(
        api_url,
        api_key,
        create_todo=create_todo,
        create_tag=create_tag,
        grant_todo_access=grant_todo_access,
        access_level=AccessLevel.READER,
    )
