"""Tests for the locations API using todo tasks."""

from collections.abc import Iterator

import pytest
import requests
from jupiter_webapi_client.api.application.invite_users_to_entity import (
    sync_detailed as invite_users_to_entity_sync,
)
from jupiter_webapi_client.api.locations.location_create import (
    sync_detailed as location_create_sync,
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
from jupiter_webapi_client.models.location import Location
from jupiter_webapi_client.models.location_create_args import LocationCreateArgs
from jupiter_webapi_client.models.location_create_result import LocationCreateResult
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
def create_location(logged_in_client: AuthenticatedClient):
    def _create(name: str) -> Location:
        result = location_create_sync(
            client=logged_in_client,
            body=LocationCreateArgs(name=name),
        )
        return get_parsed_from_response(LocationCreateResult, result).new_location

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


def test_api_common_location_create(api_url: str, api_key: str) -> None:
    response = requests.post(
        f"{api_url}/v1/common/locations",
        headers=_headers(api_key),
        json={"name": "Home"},
        timeout=10,
    )
    assert response.status_code == 200

    location = response.json()["new_location"]
    assert location["name"] == "Home"
    assert location["archived"] is False
    assert "ref_id" in location


def test_api_common_location_create_from_address_only(
    api_url: str, api_key: str
) -> None:
    response = requests.post(
        f"{api_url}/v1/common/locations",
        headers=_headers(api_key),
        json={"address_line": "123 Main St", "country": "US"},
        timeout=10,
    )
    assert response.status_code == 200
    location = response.json()["new_location"]
    assert location["name"] == "123 Main St"
    assert location["address_line"] == "123 Main St"
    assert location["country"] == "US"


def test_api_common_location_create_requires_one_field(
    api_url: str, api_key: str
) -> None:
    response = requests.post(
        f"{api_url}/v1/common/locations",
        headers=_headers(api_key),
        json={},
        timeout=10,
    )
    assert response.status_code == 502
    assert response.json()["status"] == 422


def test_api_common_location_load(api_url: str, api_key: str, create_location) -> None:
    location = create_location("Load Location")

    response = requests.get(
        f"{api_url}/v1/common/locations/{location.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    loaded = response.json()["location"]
    assert loaded["ref_id"] == location.ref_id
    assert loaded["name"] == "Load Location"


def test_api_common_location_find(api_url: str, api_key: str, create_location) -> None:
    create_location("Find Location 1")
    create_location("Find Location 2")

    response = requests.get(
        f"{api_url}/v1/common/locations?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    names = [t["name"] for t in response.json()["locations"]]
    assert "Find Location 1" in names
    assert "Find Location 2" in names


def test_api_common_location_search(
    api_url: str, api_key: str, create_location
) -> None:
    create_location("Paris Office")
    create_location("Berlin Office")

    response = requests.post(
        f"{api_url}/v1/common/locations/search",
        headers=_headers(api_key),
        json={"query": "paris", "limit": 10, "include_archived": False},
        timeout=10,
    )
    assert response.status_code == 200

    payload = response.json()
    names = [t["name"] for t in payload["locations"]]
    assert "Paris Office" in names
    assert "Berlin Office" not in names
    assert payload["candidates"] == []


def test_api_common_location_update(
    api_url: str, api_key: str, create_location
) -> None:
    location = create_location("Old Location")

    response = requests.put(
        f"{api_url}/v1/common/locations/{location.ref_id}",
        headers=_headers(api_key),
        json={
            "ref_id": location.ref_id,
            "name": {"should_change": True, "value": "New Location"},
            "address_line": {"should_change": False},
            "country": {"should_change": False},
            "gps": {"should_change": False},
        },
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/common/locations/{location.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 200
    assert response2.json()["location"]["name"] == "New Location"


def test_api_common_location_link_upsert(
    api_url: str, api_key: str, create_todo, create_location
) -> None:
    todo = create_todo("Task With Location")
    location = create_location("Office")
    owner = _todo_owner(todo.ref_id)

    response = requests.post(
        f"{api_url}/v1/common/locations/link",
        headers=_headers(api_key),
        json={
            "owner": owner,
            "location_ref_id": location.ref_id,
        },
        timeout=10,
    )
    assert response.status_code == 200

    location_link = response.json()["location_link"]
    assert location_link["owner"] == owner
    assert location_link["location_ref_id"] == location.ref_id


def test_api_common_location_link_upsert_from_candidate(
    api_url: str, api_key: str, create_todo
) -> None:
    todo = create_todo("Task With Candidate Location")
    owner = _todo_owner(todo.ref_id)

    response = requests.post(
        f"{api_url}/v1/common/locations/link-from-candidate",
        headers=_headers(api_key),
        json={
            "owner": owner,
            "name": "Paris Office",
            "address_line": "1 Rue de Rivoli",
            "country": "FR",
            "gps": {"latitude": 48.8566, "longitude": 2.3522},
        },
        timeout=10,
    )
    assert response.status_code == 200

    payload = response.json()
    new_location = payload["new_location"]
    location_link = payload["location_link"]
    assert new_location["name"] == "Paris Office"
    assert new_location["address_line"] == "1 Rue de Rivoli"
    assert new_location["country"] == "FR"
    assert location_link["owner"] == owner
    assert location_link["location_ref_id"] == new_location["ref_id"]

    load_todo = requests.get(
        f"{api_url}/v1/todos/{todo.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert load_todo.status_code == 200
    assert load_todo.json()["location"]["ref_id"] == new_location["ref_id"]


def test_api_common_location_archive(
    api_url: str, api_key: str, create_location
) -> None:
    location = create_location("Archive Location")

    response = requests.delete(
        f"{api_url}/v1/common/locations/{location.ref_id}",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/common/locations/{location.ref_id}?allow_archived=true",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 200
    assert response2.json()["location"]["archived"] is True

    response3 = requests.get(
        f"{api_url}/v1/common/locations/{location.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response3.status_code == 502
    assert response3.json()["status"] == 404


def test_api_common_location_remove(
    api_url: str, api_key: str, create_location
) -> None:
    location = create_location("Remove Location")

    response = requests.delete(
        f"{api_url}/v1/common/locations/{location.ref_id}/remove",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/common/locations/{location.ref_id}?allow_archived=true",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 502
    assert response2.json()["status"] == 404


def test_api_common_locations_requires_auth(api_url: str) -> None:
    response = requests.get(
        f"{api_url}/v1/common/locations?allow_archived=false",
        timeout=10,
    )
    assert response.status_code == 401


def _upsert_location_link(
    api_url: str, api_key: str, todo_ref_id: str, location_ref_id: str | None
) -> requests.Response:
    return requests.post(
        f"{api_url}/v1/common/locations/link",
        headers=_headers(api_key),
        json={
            "owner": _todo_owner(todo_ref_id),
            "location_ref_id": location_ref_id,
        },
        timeout=10,
    )


def _assert_non_owner_can_only_read_locations(
    api_url: str,
    api_key: str,
    *,
    create_todo,
    create_location,
    grant_todo_access,
    access_level: AccessLevel,
) -> None:
    todo = create_todo(f"Location ACL {access_level.value}")
    location = create_location(f"Location {access_level.value}")
    link_response = _upsert_location_link(
        api_url, api_key, todo.ref_id, location.ref_id
    )
    assert link_response.status_code == 200
    other_api_key = grant_todo_access(todo, access_level)

    load_todo = requests.get(
        f"{api_url}/v1/todos/{todo.ref_id}?allow_archived=false",
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert load_todo.status_code == 200
    assert load_todo.json()["location"]["ref_id"] == location.ref_id

    upsert_response = _upsert_location_link(api_url, other_api_key, todo.ref_id, None)
    _assert_acl_denied(upsert_response)

    from_candidate_response = requests.post(
        f"{api_url}/v1/common/locations/link-from-candidate",
        headers=_headers(other_api_key),
        json={
            "owner": _todo_owner(todo.ref_id),
            "name": "Hacked Candidate Location",
        },
        timeout=10,
    )
    _assert_acl_denied(from_candidate_response)

    update_response = requests.put(
        f"{api_url}/v1/common/locations/{location.ref_id}",
        headers=_headers(other_api_key),
        json={
            "ref_id": location.ref_id,
            "name": {"should_change": True, "value": "Hacked Location"},
            "address_line": {"should_change": False},
            "country": {"should_change": False},
            "gps": {"should_change": False},
        },
        timeout=10,
    )
    _assert_acl_denied(update_response)

    archive_response = requests.delete(
        f"{api_url}/v1/common/locations/{location.ref_id}",
        headers=_headers(other_api_key),
        timeout=10,
    )
    _assert_acl_denied(archive_response)

    remove_response = requests.delete(
        f"{api_url}/v1/common/locations/{location.ref_id}/remove",
        headers=_headers(other_api_key),
        timeout=10,
    )
    _assert_acl_denied(remove_response)


def test_api_common_location_acl_owner_can_upsert_update_archive_and_remove(
    api_url: str, api_key: str, create_todo, create_location
) -> None:
    todo = create_todo("Owner Location ACL")
    location = create_location("Owner Location")
    upsert_response = _upsert_location_link(
        api_url, api_key, todo.ref_id, location.ref_id
    )
    assert upsert_response.status_code == 200

    update_response = requests.put(
        f"{api_url}/v1/common/locations/{location.ref_id}",
        headers=_headers(api_key),
        json={
            "ref_id": location.ref_id,
            "name": {"should_change": True, "value": "Owner Location Updated"},
            "address_line": {"should_change": False},
            "country": {"should_change": False},
            "gps": {"should_change": False},
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
    assert load_todo.json()["location"]["ref_id"] == location.ref_id

    archive_response = requests.delete(
        f"{api_url}/v1/common/locations/{location.ref_id}",
        headers=_headers(api_key),
        timeout=10,
    )
    assert archive_response.status_code == 200

    remove_todo = create_todo("Owner Location Remove ACL")
    remove_location = create_location("Remove Location ACL")
    remove_link = _upsert_location_link(
        api_url, api_key, remove_todo.ref_id, remove_location.ref_id
    )
    assert remove_link.status_code == 200
    remove_response = requests.delete(
        f"{api_url}/v1/common/locations/{remove_location.ref_id}/remove",
        headers=_headers(api_key),
        timeout=10,
    )
    assert remove_response.status_code == 200


def test_api_common_location_acl_writer_can_only_read(
    api_url: str, api_key: str, create_todo, create_location, grant_todo_access
) -> None:
    _assert_non_owner_can_only_read_locations(
        api_url,
        api_key,
        create_todo=create_todo,
        create_location=create_location,
        grant_todo_access=grant_todo_access,
        access_level=AccessLevel.WRITER,
    )


def test_api_common_location_acl_commenter_can_only_read(
    api_url: str, api_key: str, create_todo, create_location, grant_todo_access
) -> None:
    _assert_non_owner_can_only_read_locations(
        api_url,
        api_key,
        create_todo=create_todo,
        create_location=create_location,
        grant_todo_access=grant_todo_access,
        access_level=AccessLevel.COMMENTER,
    )


def test_api_common_location_acl_reader_can_only_read(
    api_url: str, api_key: str, create_todo, create_location, grant_todo_access
) -> None:
    _assert_non_owner_can_only_read_locations(
        api_url,
        api_key,
        create_todo=create_todo,
        create_location=create_location,
        grant_todo_access=grant_todo_access,
        access_level=AccessLevel.READER,
    )
