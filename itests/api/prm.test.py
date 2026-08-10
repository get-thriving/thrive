"""Tests for the API for PRM (personal relationship management)."""

from collections.abc import Iterator

import pytest
import requests
from jupiter_webapi_client.api.application.invite_users_to_entity import (
    sync_detailed as invite_users_to_entity_sync,
)
from jupiter_webapi_client.api.prm.circle_create import (
    sync_detailed as circle_create_sync,
)
from jupiter_webapi_client.api.prm.occasion_create import (
    sync_detailed as occasion_create_sync,
)
from jupiter_webapi_client.api.prm.person_create import (
    sync_detailed as person_create_sync,
)
from jupiter_webapi_client.api.test_helper.workspace_set_feature import (
    sync_detailed as workspace_set_feature_sync,
)
from jupiter_webapi_client.client import AuthenticatedClient
from jupiter_webapi_client.models.access_level import AccessLevel
from jupiter_webapi_client.models.circle import Circle
from jupiter_webapi_client.models.circle_create_args import CircleCreateArgs
from jupiter_webapi_client.models.circle_create_result import CircleCreateResult
from jupiter_webapi_client.models.invite_users_to_entity_args import (
    InviteUsersToEntityArgs,
)
from jupiter_webapi_client.models.named_entity_tag import NamedEntityTag
from jupiter_webapi_client.models.occasion import Occasion
from jupiter_webapi_client.models.occasion_create_args import OccasionCreateArgs
from jupiter_webapi_client.models.occasion_create_result import OccasionCreateResult
from jupiter_webapi_client.models.occasion_kind import OccasionKind
from jupiter_webapi_client.models.person import Person
from jupiter_webapi_client.models.person_create_args import PersonCreateArgs
from jupiter_webapi_client.models.person_create_result import PersonCreateResult
from jupiter_webapi_client.models.workspace_feature import WorkspaceFeature
from jupiter_webapi_client.models.workspace_set_feature_args import (
    WorkspaceSetFeatureArgs,
)

from itests.api.conftest import AnotherUserAndWorkspace
from itests.helpers import get_parsed_from_response


@pytest.fixture(autouse=True, scope="module")
def _enable_prm_feature(logged_in_client: AuthenticatedClient) -> Iterator[None]:
    try:
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(feature=WorkspaceFeature.PRM, value=True),
        )
        yield
    finally:
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(feature=WorkspaceFeature.PRM, value=False),
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
def create_circle(logged_in_client: AuthenticatedClient):
    def _create(name: str) -> Circle:
        result = circle_create_sync(
            client=logged_in_client,
            body=CircleCreateArgs(name=name),
        )
        return get_parsed_from_response(CircleCreateResult, result).new_circle

    return _create


@pytest.fixture()
def create_occasion(logged_in_client: AuthenticatedClient):
    def _create(
        person_ref_id: str, kind: OccasionKind, name: str, date: str
    ) -> Occasion:
        result = occasion_create_sync(
            client=logged_in_client,
            body=OccasionCreateArgs(
                person_ref_id=person_ref_id,
                kind=kind,
                name=name,
                date=date,
            ),
        )
        return get_parsed_from_response(OccasionCreateResult, result).new_occasion

    return _create


def _headers(api_key: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {api_key}"}


# --- Person tests ---


def test_api_prm_person_create(api_url: str, api_key: str) -> None:
    response = requests.post(
        f"{api_url}/v1/prm/persons",
        headers=_headers(api_key),
        json={
            "name": "Alice",
            "catch_up_period": "monthly",
            "catch_up_eisen": "regular",
            "catch_up_difficulty": "easy",
        },
        timeout=10,
    )
    assert response.status_code == 200

    person = response.json()["new_person"]
    assert person["archived"] is False
    assert "ref_id" in person
    contact = response.json()["new_contact"]
    assert contact["name"] == "Alice"
    assert contact["archived"] is False


def test_api_prm_person_load(api_url: str, api_key: str, create_person) -> None:
    created = create_person("Bob")

    response = requests.get(
        f"{api_url}/v1/prm/persons/{created.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    person = response.json()["person"]
    assert person["ref_id"] == created.ref_id
    contact = response.json()["contact"]
    assert contact["name"] == "Bob"


def test_api_prm_person_find(api_url: str, api_key: str, create_person) -> None:
    create_person("Charlie")
    create_person("Diana")

    response = requests.get(
        f"{api_url}/v1/prm/persons?allow_archived=false&include_notes=false&include_time_event_blocks=false&include_tags=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    names = [e["contact"]["name"] for e in response.json()["entries"]]
    assert "Charlie" in names
    assert "Diana" in names


def test_api_prm_person_update(api_url: str, api_key: str, create_person) -> None:
    created = create_person("Old Name")

    response = requests.put(
        f"{api_url}/v1/prm/persons/{created.ref_id}",
        headers=_headers(api_key),
        json={
            "ref_id": created.ref_id,
            "name": {"should_change": True, "value": "New Name"},
            "catch_up_period": {"should_change": False},
            "catch_up_eisen": {"should_change": False},
            "catch_up_difficulty": {"should_change": False},
            "catch_up_actionable_from_day": {"should_change": False},
            "catch_up_actionable_from_month": {"should_change": False},
            "catch_up_due_at_day": {"should_change": False},
            "catch_up_due_at_month": {"should_change": False},
            "circle_ref_ids": {"should_change": False},
        },
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/prm/persons/{created.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 200
    assert response2.json()["contact"]["name"] == "New Name"


def test_api_prm_person_archive(api_url: str, api_key: str, create_person) -> None:
    created = create_person("Archive Person")

    response = requests.delete(
        f"{api_url}/v1/prm/persons/{created.ref_id}",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/prm/persons/{created.ref_id}",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 502
    assert response2.json()["status"] == 404

    response3 = requests.get(
        f"{api_url}/v1/prm/persons/{created.ref_id}?allow_archived=true",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response3.status_code == 200
    assert response3.json()["contact"]["name"] == "Archive Person"


def test_api_prm_person_remove(api_url: str, api_key: str, create_person) -> None:
    created = create_person("Remove Person")

    response = requests.delete(
        f"{api_url}/v1/prm/persons/{created.ref_id}/remove",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/prm/persons/{created.ref_id}?allow_archived=true",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 502
    assert response2.json()["status"] == 404


@pytest.fixture()
def another_user_with_prm_enabled(
    webapi_url: str,
    another_user_and_workspace: AnotherUserAndWorkspace,
) -> Iterator[AnotherUserAndWorkspace]:
    def make_client() -> AuthenticatedClient:
        return AuthenticatedClient(
            base_url=webapi_url,
            token=another_user_and_workspace.init_result.auth_token_ext,
        )

    try:
        workspace_set_feature_sync(
            client=make_client(),
            body=WorkspaceSetFeatureArgs(feature=WorkspaceFeature.PRM, value=True),
        )
        yield another_user_and_workspace
    finally:
        workspace_set_feature_sync(
            client=make_client(),
            body=WorkspaceSetFeatureArgs(feature=WorkspaceFeature.PRM, value=False),
        )


_ACL_DENIED_REASON = "You are not allowed to access this entity"


def _assert_acl_denied(response: requests.Response) -> None:
    assert response.status_code == 502
    body = response.json()
    assert body["status"] == 401
    assert body["response"]["reason"] == _ACL_DENIED_REASON


def _person_update_body(ref_id: str, *, name: str) -> dict[str, object]:
    return {
        "ref_id": ref_id,
        "name": {"should_change": True, "value": name},
        "catch_up_period": {"should_change": False},
        "catch_up_eisen": {"should_change": False},
        "catch_up_difficulty": {"should_change": False},
        "catch_up_actionable_from_day": {"should_change": False},
        "catch_up_actionable_from_month": {"should_change": False},
        "catch_up_due_at_day": {"should_change": False},
        "catch_up_due_at_month": {"should_change": False},
        "circle_ref_ids": {"should_change": False},
    }


@pytest.fixture()
def grant_person_access(
    logged_in_client: AuthenticatedClient,
    another_user_with_prm_enabled: AnotherUserAndWorkspace,
):
    def _grant(person: Person, access_level: AccessLevel) -> str:
        response = invite_users_to_entity_sync(
            client=logged_in_client,
            body=InviteUsersToEntityArgs(
                entity_type=NamedEntityTag.PERSON,
                entity_ref_id=person.ref_id,
                user_ref_ids=[
                    another_user_with_prm_enabled.init_result.new_user.ref_id
                ],
                access_level=access_level,
            ),
        )
        assert response.status_code == 200
        return another_user_with_prm_enabled.api_key

    return _grant


def _assert_other_user_cannot_access_person(
    api_url: str,
    *,
    person_ref_id: str,
    owner_api_key: str,
    other_api_key: str,
) -> None:
    assert other_api_key != owner_api_key

    owner_load_response = requests.get(
        f"{api_url}/v1/prm/persons/{person_ref_id}?allow_archived=false",
        headers=_headers(owner_api_key),
        timeout=10,
    )
    assert owner_load_response.status_code == 200

    load_response = requests.get(
        f"{api_url}/v1/prm/persons/{person_ref_id}?allow_archived=false",
        headers=_headers(other_api_key),
        timeout=10,
    )
    _assert_acl_denied(load_response)

    update_response = requests.put(
        f"{api_url}/v1/prm/persons/{person_ref_id}",
        headers=_headers(other_api_key),
        json=_person_update_body(person_ref_id, name="Hacked Person"),
        timeout=10,
    )
    _assert_acl_denied(update_response)

    archive_response = requests.delete(
        f"{api_url}/v1/prm/persons/{person_ref_id}",
        headers=_headers(other_api_key),
        timeout=10,
    )
    _assert_acl_denied(archive_response)

    remove_response = requests.delete(
        f"{api_url}/v1/prm/persons/{person_ref_id}/remove",
        headers=_headers(other_api_key),
        timeout=10,
    )
    _assert_acl_denied(remove_response)


def test_api_prm_person_acl_reader_can_read_but_not_update_or_archive(
    api_url: str,
    api_key: str,
    create_person,
    grant_person_access,
    another_user_with_prm_enabled: AnotherUserAndWorkspace,
) -> None:
    created = create_person("Reader ACL Person")
    other_api_key = another_user_with_prm_enabled.api_key

    _assert_other_user_cannot_access_person(
        api_url,
        person_ref_id=created.ref_id,
        owner_api_key=api_key,
        other_api_key=other_api_key,
    )

    other_api_key = grant_person_access(created, AccessLevel.READER)

    load_response = requests.get(
        f"{api_url}/v1/prm/persons/{created.ref_id}?allow_archived=false",
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert load_response.status_code == 200
    person = load_response.json()["person"]
    assert person["ref_id"] == created.ref_id
    assert load_response.json()["owner"]["ref_id"] is not None
    assert load_response.json()["access_status"]["access_level"] == "reader"

    update_response = requests.put(
        f"{api_url}/v1/prm/persons/{created.ref_id}",
        headers=_headers(other_api_key),
        json=_person_update_body(created.ref_id, name="Hacked Person"),
        timeout=10,
    )
    _assert_acl_denied(update_response)

    archive_response = requests.delete(
        f"{api_url}/v1/prm/persons/{created.ref_id}",
        headers=_headers(other_api_key),
        timeout=10,
    )
    _assert_acl_denied(archive_response)


def test_api_prm_person_acl_writer_can_read_and_update(
    api_url: str,
    create_person,
    grant_person_access,
) -> None:
    created = create_person("Writer Update Person")
    other_api_key = grant_person_access(created, AccessLevel.WRITER)

    load_response = requests.get(
        f"{api_url}/v1/prm/persons/{created.ref_id}?allow_archived=false",
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert load_response.status_code == 200
    assert load_response.json()["access_status"]["access_level"] == "writer"

    update_response = requests.put(
        f"{api_url}/v1/prm/persons/{created.ref_id}",
        headers=_headers(other_api_key),
        json=_person_update_body(created.ref_id, name="Updated By Writer"),
        timeout=10,
    )
    assert update_response.status_code == 200

    verify_response = requests.get(
        f"{api_url}/v1/prm/persons/{created.ref_id}?allow_archived=false",
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert verify_response.status_code == 200
    assert verify_response.json()["contact"]["name"] == "Updated By Writer"


def test_api_prm_person_acl_writer_can_read_and_archive(
    api_url: str,
    create_person,
    grant_person_access,
) -> None:
    created = create_person("Writer Archive Person")
    other_api_key = grant_person_access(created, AccessLevel.WRITER)

    archive_response = requests.delete(
        f"{api_url}/v1/prm/persons/{created.ref_id}",
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert archive_response.status_code == 200

    archived_response = requests.get(
        f"{api_url}/v1/prm/persons/{created.ref_id}?allow_archived=true",
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert archived_response.status_code == 200
    assert archived_response.json()["person"]["archived"] is True


def test_api_prm_person_acl_z_denied_without_grant(
    api_url: str,
    api_key: str,
    create_person,
    another_user_with_prm_enabled: AnotherUserAndWorkspace,
) -> None:
    created = create_person("Denied Person")
    _assert_other_user_cannot_access_person(
        api_url,
        person_ref_id=created.ref_id,
        owner_api_key=api_key,
        other_api_key=another_user_with_prm_enabled.api_key,
    )


# --- Circle tests ---


def test_api_prm_circle_create(api_url: str, api_key: str) -> None:
    response = requests.post(
        f"{api_url}/v1/prm/circles",
        headers=_headers(api_key),
        json={"name": "Family"},
        timeout=10,
    )
    assert response.status_code == 200

    circle = response.json()["new_circle"]
    assert circle["name"] == "Family"
    assert circle["archived"] is False
    assert "ref_id" in circle


def test_api_prm_circle_load(api_url: str, api_key: str, create_circle) -> None:
    created = create_circle("Friends")

    response = requests.get(
        f"{api_url}/v1/prm/circles/{created.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    circle = response.json()["circle"]
    assert circle["ref_id"] == created.ref_id
    assert circle["name"] == "Friends"


def test_api_prm_circle_find(api_url: str, api_key: str, create_circle) -> None:
    create_circle("Colleagues")
    create_circle("Neighbours")

    response = requests.get(
        f"{api_url}/v1/prm/circles",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200
    data = response.json()
    assert "circles" in data
    assert "Colleagues" in [c["name"] for c in data["circles"]]
    assert "Neighbours" in [c["name"] for c in data["circles"]]


def test_api_prm_circle_update(api_url: str, api_key: str, create_circle) -> None:
    created = create_circle("Old Circle")

    response = requests.put(
        f"{api_url}/v1/prm/circles/{created.ref_id}",
        headers=_headers(api_key),
        json={
            "ref_id": created.ref_id,
            "name": {"should_change": True, "value": "New Circle"},
        },
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/prm/circles/{created.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 200
    assert response2.json()["circle"]["name"] == "New Circle"


def test_api_prm_circle_archive(api_url: str, api_key: str, create_circle) -> None:
    created = create_circle("Archive Circle")

    response = requests.delete(
        f"{api_url}/v1/prm/circles/{created.ref_id}",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/prm/circles/{created.ref_id}?allow_archived=true",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 200
    assert response2.json()["circle"]["name"] == "Archive Circle"

    response3 = requests.get(
        f"{api_url}/v1/prm/circles/{created.ref_id}",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response3.status_code == 502
    assert response3.json()["status"] == 404


def test_api_prm_circle_remove(api_url: str, api_key: str, create_circle) -> None:
    created = create_circle("Remove Circle")

    response = requests.delete(
        f"{api_url}/v1/prm/circles/{created.ref_id}/remove",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/prm/circles/{created.ref_id}?allow_archived=true",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 502
    assert response2.json()["status"] == 404


def test_api_prm_circle_acl(
    api_url: str,
    create_circle,
    another_user_with_prm_enabled: AnotherUserAndWorkspace,
) -> None:
    created = create_circle("ACL Circle")
    other_api_key = another_user_with_prm_enabled.api_key

    load_response = requests.get(
        f"{api_url}/v1/prm/circles/{created.ref_id}?allow_archived=false",
        headers=_headers(other_api_key),
        timeout=10,
    )
    _assert_acl_denied(load_response)

    update_response = requests.put(
        f"{api_url}/v1/prm/circles/{created.ref_id}",
        headers=_headers(other_api_key),
        json={
            "ref_id": created.ref_id,
            "name": {"should_change": True, "value": "Hacked Circle"},
        },
        timeout=10,
    )
    _assert_acl_denied(update_response)

    archive_response = requests.delete(
        f"{api_url}/v1/prm/circles/{created.ref_id}",
        headers=_headers(other_api_key),
        timeout=10,
    )
    _assert_acl_denied(archive_response)

    remove_response = requests.delete(
        f"{api_url}/v1/prm/circles/{created.ref_id}/remove",
        headers=_headers(other_api_key),
        timeout=10,
    )
    _assert_acl_denied(remove_response)


def test_api_prm_occasion_acl(
    api_url: str,
    create_person,
    create_occasion,
    another_user_with_prm_enabled: AnotherUserAndWorkspace,
) -> None:
    person = create_person("ACL Occasion Person")
    occasion = create_occasion(
        person.ref_id, OccasionKind.BIRTHDAY, "ACL Occasion", "15 Feb"
    )
    other_api_key = another_user_with_prm_enabled.api_key

    load_response = requests.get(
        f"{api_url}/v1/prm/persons/{person.ref_id}/occasions/{occasion.ref_id}?allow_archived=false",
        headers=_headers(other_api_key),
        timeout=10,
    )
    _assert_acl_denied(load_response)

    update_response = requests.put(
        f"{api_url}/v1/prm/persons/{person.ref_id}/occasions/{occasion.ref_id}",
        headers=_headers(other_api_key),
        json={
            "ref_id": occasion.ref_id,
            "name": {"should_change": True, "value": "Hacked Occasion"},
            "kind": {"should_change": False},
            "date": {"should_change": False},
        },
        timeout=10,
    )
    _assert_acl_denied(update_response)

    archive_response = requests.delete(
        f"{api_url}/v1/prm/persons/{person.ref_id}/occasions/{occasion.ref_id}",
        headers=_headers(other_api_key),
        timeout=10,
    )
    _assert_acl_denied(archive_response)

    remove_response = requests.delete(
        f"{api_url}/v1/prm/persons/{person.ref_id}/occasions/{occasion.ref_id}/remove",
        headers=_headers(other_api_key),
        timeout=10,
    )
    _assert_acl_denied(remove_response)


# --- Occasion tests ---


def test_api_prm_occasion_create(api_url: str, api_key: str, create_person) -> None:
    person = create_person("Eve")

    response = requests.post(
        f"{api_url}/v1/prm/persons/{person.ref_id}/occasions",
        headers=_headers(api_key),
        json={
            "person_ref_id": person.ref_id,
            "kind": "birthday",
            "name": "Eve's Birthday",
            "date": "15 Feb",
        },
        timeout=10,
    )
    assert response.status_code == 200

    occasion = response.json()["new_occasion"]
    assert occasion["name"] == "Eve's Birthday"
    assert occasion["kind"] == "birthday"
    assert "ref_id" in occasion


def test_api_prm_occasion_load(
    api_url: str, api_key: str, create_person, create_occasion
) -> None:
    person = create_person("Frank")
    occ = create_occasion(
        person.ref_id, OccasionKind.ANNIVERSARY, "Work Anniversary", "15 Feb"
    )

    response = requests.get(
        f"{api_url}/v1/prm/persons/{person.ref_id}/occasions/{occ.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200
    assert response.json()["occasion"]["name"] == "Work Anniversary"


def test_api_prm_occasion_update(
    api_url: str, api_key: str, create_person, create_occasion
) -> None:
    person = create_person("Grace")
    occ = create_occasion(person.ref_id, OccasionKind.OTHER, "Old Occasion", "15 Feb")

    response = requests.put(
        f"{api_url}/v1/prm/persons/{person.ref_id}/occasions/{occ.ref_id}",
        headers=_headers(api_key),
        json={
            "ref_id": occ.ref_id,
            "name": {"should_change": True, "value": "New Occasion"},
            "kind": {"should_change": False},
            "date": {"should_change": True, "value": "15 Mar"},
        },
        timeout=10,
    )
    assert response.status_code == 200


def test_api_prm_occasion_archive(
    api_url: str, api_key: str, create_person, create_occasion
) -> None:
    person = create_person("Hank")
    occ = create_occasion(
        person.ref_id, OccasionKind.HOLIDAY, "Archive Occasion", "15 Feb"
    )

    response = requests.delete(
        f"{api_url}/v1/prm/persons/{person.ref_id}/occasions/{occ.ref_id}",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/prm/persons/{person.ref_id}/occasions/{occ.ref_id}?allow_archived=true",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 200
    assert response2.json()["occasion"]["name"] == "Archive Occasion"

    response3 = requests.get(
        f"{api_url}/v1/prm/persons/{person.ref_id}/occasions/{occ.ref_id}",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response3.status_code == 502
    assert response3.json()["status"] == 404


def test_api_prm_occasion_remove(
    api_url: str, api_key: str, create_person, create_occasion
) -> None:
    person = create_person("Ivan")
    occ = create_occasion(
        person.ref_id, OccasionKind.BIRTHDAY, "Remove Occasion", "15 Feb"
    )

    response = requests.delete(
        f"{api_url}/v1/prm/persons/{person.ref_id}/occasions/{occ.ref_id}/remove",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/prm/persons/{person.ref_id}/occasions/{occ.ref_id}?allow_archived=true",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 502
    assert response2.json()["status"] == 404


# --- Settings test ---


def test_api_prm_prm_load_settings(api_url: str, api_key: str) -> None:
    response = requests.get(
        f"{api_url}/v1/prm/settings",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200
    assert "max_circles_per_person" in response.json()


# --- Auth test ---


def test_api_prm_prm_requires_auth(api_url: str) -> None:
    response = requests.get(
        f"{api_url}/v1/prm/persons?allow_archived=false&include_notes=false&include_time_event_blocks=false&include_tags=false",
        timeout=10,
    )
    assert response.status_code == 401
