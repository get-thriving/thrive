"""Tests for the publish API."""

from collections.abc import Iterator

import pytest
import requests
from jupiter_webapi_client.api.application.invite_users_to_entity import (
    sync_detailed as invite_users_to_entity_sync,
)
from jupiter_webapi_client.api.prm.person_create import (
    sync_detailed as person_create_sync,
)
from jupiter_webapi_client.api.publish.publish_entity_activate import (
    sync_detailed as publish_entity_activate_sync,
)
from jupiter_webapi_client.api.publish.publish_entity_create import (
    sync_detailed as publish_entity_create_sync,
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
from jupiter_webapi_client.models.person import Person
from jupiter_webapi_client.models.person_create_args import PersonCreateArgs
from jupiter_webapi_client.models.person_create_result import PersonCreateResult
from jupiter_webapi_client.models.publish_entity import PublishEntity
from jupiter_webapi_client.models.publish_entity_activate_args import (
    PublishEntityActivateArgs,
)
from jupiter_webapi_client.models.publish_entity_create_args import (
    PublishEntityCreateArgs,
)
from jupiter_webapi_client.models.publish_entity_create_result import (
    PublishEntityCreateResult,
)
from jupiter_webapi_client.models.todo_task import TodoTask
from jupiter_webapi_client.models.todo_task_create_args import TodoTaskCreateArgs
from jupiter_webapi_client.models.todo_task_create_result import TodoTaskCreateResult
from jupiter_webapi_client.models.workspace_feature import WorkspaceFeature
from jupiter_webapi_client.models.workspace_set_feature_args import (
    WorkspaceSetFeatureArgs,
)

from itests.api.conftest import AnotherUserAndWorkspace, create_other_user_and_workspace
from itests.helpers import get_parsed_from_response


def _person_owner(ref_id: str) -> str:
    return f"Person:std:{ref_id}"


@pytest.fixture(autouse=True, scope="module")
def _enable_prm_and_todo_features(
    logged_in_client: AuthenticatedClient,
) -> Iterator[None]:
    try:
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(feature=WorkspaceFeature.PRM, value=True),
        )
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
            body=WorkspaceSetFeatureArgs(feature=WorkspaceFeature.PRM, value=False),
        )
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.TODO_TASK, value=False
            ),
        )


@pytest.fixture()
def create_person(logged_in_client: AuthenticatedClient):
    def _create(name: str) -> Person:
        result = person_create_sync(
            client=logged_in_client,
            body=PersonCreateArgs(name=name),
        )
        return get_parsed_from_response(PersonCreateResult, result).new_person

    return _create


@pytest.fixture()
def create_publish_entity(logged_in_client: AuthenticatedClient, create_person):
    def _create(name: str, owner: str | None = None) -> PublishEntity:
        person = create_person(f"person-for-{name}")
        result = publish_entity_create_sync(
            client=logged_in_client,
            body=PublishEntityCreateArgs(
                owner=owner or _person_owner(person.ref_id),
            ),
        )
        return get_parsed_from_response(
            PublishEntityCreateResult, result
        ).new_publish_entity

    return _create


@pytest.fixture()
def activate_publish_entity(logged_in_client: AuthenticatedClient):
    def _activate(ref_id: str) -> None:
        result = publish_entity_activate_sync(
            client=logged_in_client,
            body=PublishEntityActivateArgs(ref_id=ref_id),
        )
        assert result.status_code == 200

    return _activate


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


def _publish_entities_url(api_url: str) -> str:
    return f"{api_url}/v1/common/publish/entities"


def test_api_common_publish_entity_create(
    api_url: str, api_key: str, create_person
) -> None:
    person = create_person("person-for-draft-publish")

    response = requests.post(
        _publish_entities_url(api_url),
        headers=_headers(api_key),
        json={
            "owner": _person_owner(person.ref_id),
        },
        timeout=10,
    )
    assert response.status_code == 200

    publish_entity = response.json()["new_publish_entity"]
    assert publish_entity["status"] == "draft"
    assert publish_entity["name"] == "PublishEntity"
    assert publish_entity["external_id"]
    assert publish_entity["owner"] == _person_owner(person.ref_id)


def test_api_common_publish_entity_create_rejects_non_shareable_entity_type(
    api_url: str, api_key: str, create_person
) -> None:
    person = create_person("person-for-invalid-publish")

    response = requests.post(
        _publish_entities_url(api_url),
        headers=_headers(api_key),
        json={
            "owner": f"HomeTab:std:{person.ref_id}",
        },
        timeout=10,
    )
    assert response.status_code == 502
    assert response.json()["status"] == 422


def test_api_common_publish_entity_load_by_external_id_active(
    api_url: str,
    api_key: str,
    create_publish_entity,
    activate_publish_entity,
) -> None:
    publish_entity = create_publish_entity("active-publish")
    activate_publish_entity(publish_entity.ref_id)

    response = requests.post(
        f"{_publish_entities_url(api_url)}/load-by-external-id",
        headers=_headers(api_key),
        json={"external_id": publish_entity.external_id},
        timeout=10,
    )
    assert response.status_code == 200

    loaded = response.json()["publish_entity"]
    assert loaded["ref_id"] == publish_entity.ref_id
    assert loaded["status"] == "active"


def test_api_common_publish_entity_load_by_external_id_not_found(
    api_url: str, api_key: str
) -> None:
    response = requests.post(
        f"{_publish_entities_url(api_url)}/load-by-external-id",
        headers=_headers(api_key),
        json={"external_id": "00000000-0000-4000-8000-000000000000"},
        timeout=10,
    )
    assert response.status_code == 502
    assert response.json()["status"] == 404


def test_api_common_publish_entity_create_duplicate_entity_raises_already_exists(
    api_url: str, api_key: str, create_publish_entity
) -> None:
    publish_entity = create_publish_entity("unique-publish")

    response = requests.post(
        _publish_entities_url(api_url),
        headers=_headers(api_key),
        json={
            "owner": publish_entity.owner,
        },
        timeout=10,
    )
    assert response.status_code == 502
    assert response.json()["status"] == 400


def test_api_common_publish_entity_activate_when_already_active_returns_conflict(
    api_url: str,
    api_key: str,
    create_publish_entity,
    activate_publish_entity,
) -> None:
    publish_entity = create_publish_entity("activate-twice")
    activate_publish_entity(publish_entity.ref_id)

    response = requests.post(
        f"{_publish_entities_url(api_url)}/{publish_entity.ref_id}/activate",
        headers=_headers(api_key),
        json={},
        timeout=10,
    )
    assert response.status_code == 502
    assert response.json()["status"] == 409


def test_api_common_publish_entity_to_draft_when_already_draft_returns_conflict(
    api_url: str, api_key: str, create_publish_entity
) -> None:
    publish_entity = create_publish_entity("to-draft-twice")

    response = requests.post(
        f"{_publish_entities_url(api_url)}/{publish_entity.ref_id}/to-draft",
        headers=_headers(api_key),
        json={},
        timeout=10,
    )
    assert response.status_code == 502
    assert response.json()["status"] == 409


def test_api_common_publish_entity_load_by_external_id_draft_not_loadable(
    api_url: str, api_key: str, create_publish_entity
) -> None:
    publish_entity = create_publish_entity("draft-only-publish")

    response = requests.post(
        f"{_publish_entities_url(api_url)}/load-by-external-id",
        headers=_headers(api_key),
        json={"external_id": publish_entity.external_id},
        timeout=10,
    )
    assert response.status_code == 502
    assert response.json()["status"] == 422


def _assert_non_owner_can_only_read_publish(
    api_url: str,
    api_key: str,
    *,
    create_todo,
    grant_todo_access,
    access_level: AccessLevel,
) -> None:
    todo = create_todo(f"Publish ACL {access_level.value}")
    create_response = requests.post(
        _publish_entities_url(api_url),
        headers=_headers(api_key),
        json={"owner": _todo_owner(todo.ref_id)},
        timeout=10,
    )
    assert create_response.status_code == 200
    publish_ref_id = create_response.json()["new_publish_entity"]["ref_id"]
    other_api_key = grant_todo_access(todo, access_level)

    load_response = requests.get(
        f"{_publish_entities_url(api_url)}/{publish_ref_id}?allow_archived=false",
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert load_response.status_code == 200
    assert load_response.json()["publish_entity"]["ref_id"] == publish_ref_id

    create_denied = requests.post(
        _publish_entities_url(api_url),
        headers=_headers(other_api_key),
        json={"owner": _todo_owner(todo.ref_id)},
        timeout=10,
    )
    _assert_acl_denied(create_denied)

    activate_denied = requests.post(
        f"{_publish_entities_url(api_url)}/{publish_ref_id}/activate",
        headers=_headers(other_api_key),
        json={},
        timeout=10,
    )
    _assert_acl_denied(activate_denied)

    to_draft_denied = requests.post(
        f"{_publish_entities_url(api_url)}/{publish_ref_id}/to-draft",
        headers=_headers(other_api_key),
        json={},
        timeout=10,
    )
    _assert_acl_denied(to_draft_denied)


def test_api_common_publish_entity_acl_owner_can_create_load_and_activate(
    api_url: str, api_key: str, create_todo
) -> None:
    todo = create_todo("Owner Publish ACL")
    create_response = requests.post(
        _publish_entities_url(api_url),
        headers=_headers(api_key),
        json={"owner": _todo_owner(todo.ref_id)},
        timeout=10,
    )
    assert create_response.status_code == 200
    publish_ref_id = create_response.json()["new_publish_entity"]["ref_id"]

    load_response = requests.get(
        f"{_publish_entities_url(api_url)}/{publish_ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert load_response.status_code == 200

    activate_response = requests.post(
        f"{_publish_entities_url(api_url)}/{publish_ref_id}/activate",
        headers=_headers(api_key),
        json={},
        timeout=10,
    )
    assert activate_response.status_code == 200

    to_draft_response = requests.post(
        f"{_publish_entities_url(api_url)}/{publish_ref_id}/to-draft",
        headers=_headers(api_key),
        json={},
        timeout=10,
    )
    assert to_draft_response.status_code == 200


def test_api_common_publish_entity_acl_writer_can_only_read(
    api_url: str, api_key: str, create_todo, grant_todo_access
) -> None:
    _assert_non_owner_can_only_read_publish(
        api_url,
        api_key,
        create_todo=create_todo,
        grant_todo_access=grant_todo_access,
        access_level=AccessLevel.WRITER,
    )


def test_api_common_publish_entity_acl_commenter_can_only_read(
    api_url: str, api_key: str, create_todo, grant_todo_access
) -> None:
    _assert_non_owner_can_only_read_publish(
        api_url,
        api_key,
        create_todo=create_todo,
        grant_todo_access=grant_todo_access,
        access_level=AccessLevel.COMMENTER,
    )


def test_api_common_publish_entity_acl_reader_can_only_read(
    api_url: str, api_key: str, create_todo, grant_todo_access
) -> None:
    _assert_non_owner_can_only_read_publish(
        api_url,
        api_key,
        create_todo=create_todo,
        grant_todo_access=grant_todo_access,
        access_level=AccessLevel.READER,
    )
