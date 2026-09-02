"""Tests for the API for vacations."""

from collections.abc import Iterator

import pytest
import requests
from jupiter_webapi_client.api.application.invite_users_to_entity import (
    sync_detailed as invite_users_to_entity_sync,
)
from jupiter_webapi_client.api.test_helper.workspace_set_feature import (
    sync_detailed as workspace_set_feature_sync,
)
from jupiter_webapi_client.api.vacations.vacation_create import (
    sync_detailed as vacation_create_sync,
)
from jupiter_webapi_client.client import AuthenticatedClient
from jupiter_webapi_client.models.access_level import AccessLevel
from jupiter_webapi_client.models.invite_users_to_entity_args import (
    InviteUsersToEntityArgs,
)
from jupiter_webapi_client.models.named_entity_tag import NamedEntityTag
from jupiter_webapi_client.models.vacation import Vacation
from jupiter_webapi_client.models.vacation_create_args import VacationCreateArgs
from jupiter_webapi_client.models.vacation_create_result import VacationCreateResult
from jupiter_webapi_client.models.workspace_feature import WorkspaceFeature
from jupiter_webapi_client.models.workspace_set_feature_args import (
    WorkspaceSetFeatureArgs,
)

from itests.api.conftest import AnotherUserAndWorkspace
from itests.helpers import get_parsed_from_response


@pytest.fixture(autouse=True, scope="module")
def _enable_vacations_feature(logged_in_client: AuthenticatedClient) -> Iterator[None]:
    try:
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.VACATIONS, value=True
            ),
        )
        yield
    finally:
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.VACATIONS, value=False
            ),
        )


@pytest.fixture()
def create_vacation(logged_in_client: AuthenticatedClient):
    def _create_vacation(
        name: str, start_month: int, start_day: int, end_month: int, end_day: int
    ) -> Vacation:
        result = vacation_create_sync(
            client=logged_in_client,
            body=VacationCreateArgs(
                name=name,
                start_date=f"2024-{start_month:02d}-{start_day:02d}",
                end_date=f"2024-{end_month:02d}-{end_day:02d}",
            ),
        )
        return get_parsed_from_response(VacationCreateResult, result).new_vacation

    return _create_vacation


def _headers(api_key: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {api_key}"}


_ACL_DENIED_REASON = "You are not allowed to access this entity"


def _assert_acl_denied(response: requests.Response) -> None:
    assert response.status_code == 502
    body = response.json()
    assert body["status"] == 401
    assert body["response"]["reason"] == _ACL_DENIED_REASON


def test_api_vacation_create(api_url: str, api_key: str) -> None:
    response = requests.post(
        f"{api_url}/v1/vacations",
        headers=_headers(api_key),
        json={
            "name": "Summer Break",
            "start_date": "2024-07-01",
            "end_date": "2024-07-14",
        },
        timeout=10,
    )
    assert response.status_code == 200

    data = response.json()
    vacation = data["new_vacation"]
    assert vacation["name"] == "Summer Break"
    assert vacation["start_date"] == "2024-07-01"
    assert vacation["end_date"] == "2024-07-14"
    assert vacation["archived"] is False
    assert "ref_id" in vacation


def test_api_vacation_load(api_url: str, api_key: str, create_vacation) -> None:
    created = create_vacation("Beach Trip", 8, 1, 8, 10)

    response = requests.get(
        f"{api_url}/v1/vacations/{created.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    data = response.json()
    vacation = data["vacation"]
    assert vacation["ref_id"] == created.ref_id
    assert vacation["name"] == "Beach Trip"
    assert vacation["start_date"] == "2024-08-01"
    assert vacation["end_date"] == "2024-08-10"

    assert data["time_event_block"] is not None


def test_api_vacation_link_multiple_locations(
    api_url: str, api_key: str, create_vacation
) -> None:
    vacation = create_vacation("Grand Tour", 6, 1, 6, 20)

    def create_location(name: str) -> dict[str, str]:
        response = requests.post(
            f"{api_url}/v1/common/locations",
            headers=_headers(api_key),
            json={"name": name, "is_key": False},
            timeout=10,
        )
        assert response.status_code == 200, response.text
        new_location: dict[str, str] = response.json()["new_location"]
        return new_location

    paris = create_location("Paris")
    rome = create_location("Rome")

    response = requests.post(
        f"{api_url}/v1/common/locations/link",
        headers=_headers(api_key),
        json={
            "owner": f"Vacation:std:{vacation.ref_id}",
            "locations_ref_ids": [paris["ref_id"], rome["ref_id"]],
        },
        timeout=10,
    )
    assert response.status_code == 200
    assert response.json()["location_link"]["locations_ref_ids"] == [
        paris["ref_id"],
        rome["ref_id"],
    ]

    load_response = requests.get(
        f"{api_url}/v1/vacations/{vacation.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert load_response.status_code == 200
    assert [location["ref_id"] for location in load_response.json()["locations"]] == [
        paris["ref_id"],
        rome["ref_id"],
    ]


def test_api_vacation_find(api_url: str, api_key: str, create_vacation) -> None:
    create_vacation("First Vacation", 12, 10, 12, 15)
    create_vacation("Second Vacation", 12, 20, 12, 25)

    response = requests.get(
        f"{api_url}/v1/vacations?allow_archived=false&include_notes=false&include_time_event_blocks=false&include_tags=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    data = response.json()
    entries = data["entries"]
    assert len(entries) >= 2

    vacations = sorted([e["vacation"] for e in entries], key=lambda v: v["start_date"])
    names = [v["name"] for v in vacations]
    assert "First Vacation" in names
    assert "Second Vacation" in names

    first = next(v for v in vacations if v["name"] == "First Vacation")
    second = next(v for v in vacations if v["name"] == "Second Vacation")

    assert first["start_date"] == "2024-12-10"
    assert first["end_date"] == "2024-12-15"
    assert second["start_date"] == "2024-12-20"
    assert second["end_date"] == "2024-12-25"


def test_api_vacation_find_excludes_archived(
    api_url: str, api_key: str, create_vacation
) -> None:
    created = create_vacation("To Archive", 3, 1, 3, 5)

    requests.delete(
        f"{api_url}/v1/vacations/{created.ref_id}",
        headers=_headers(api_key),
        timeout=10,
    )

    response = requests.get(
        f"{api_url}/v1/vacations?allow_archived=false&include_notes=false&include_time_event_blocks=false&include_tags=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200
    names = [e["vacation"]["name"] for e in response.json()["entries"]]
    assert "To Archive" not in names

    response_with_archived = requests.get(
        f"{api_url}/v1/vacations?allow_archived=true&include_notes=false&include_time_event_blocks=false&include_tags=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response_with_archived.status_code == 200
    names_with_archived = [
        e["vacation"]["name"] for e in response_with_archived.json()["entries"]
    ]
    assert "To Archive" in names_with_archived


def test_api_vacation_update(api_url: str, api_key: str, create_vacation) -> None:
    created = create_vacation("Old Name", 6, 1, 6, 10)

    response = requests.put(
        f"{api_url}/v1/vacations/{created.ref_id}",
        headers=_headers(api_key),
        json={
            "ref_id": created.ref_id,
            "name": {"should_change": True, "value": "New Name"},
            "start_date": {"should_change": True, "value": "2024-06-05"},
            "end_date": {"should_change": False},
        },
        timeout=10,
    )
    assert response.status_code == 200

    load_response = requests.get(
        f"{api_url}/v1/vacations/{created.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert load_response.status_code == 200

    vacation = load_response.json()["vacation"]
    assert vacation["name"] == "New Name"
    assert vacation["start_date"] == "2024-06-05"
    assert vacation["end_date"] == "2024-06-10"


def test_api_vacation_update_partial(
    api_url: str, api_key: str, create_vacation
) -> None:
    created = create_vacation("Keep This Name", 9, 1, 9, 15)

    response = requests.put(
        f"{api_url}/v1/vacations/{created.ref_id}",
        headers=_headers(api_key),
        json={
            "ref_id": created.ref_id,
            "name": {"should_change": False},
            "start_date": {"should_change": False},
            "end_date": {"should_change": True, "value": "2024-09-20"},
        },
        timeout=10,
    )
    assert response.status_code == 200

    load_response = requests.get(
        f"{api_url}/v1/vacations/{created.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    vacation = load_response.json()["vacation"]
    assert vacation["name"] == "Keep This Name"
    assert vacation["start_date"] == "2024-09-01"
    assert vacation["end_date"] == "2024-09-20"


def test_api_vacation_archive(api_url: str, api_key: str, create_vacation) -> None:
    created = create_vacation("Archive Me", 4, 1, 4, 10)

    response = requests.delete(
        f"{api_url}/v1/vacations/{created.ref_id}",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    load_response = requests.get(
        f"{api_url}/v1/vacations/{created.ref_id}?allow_archived=true",
        headers=_headers(api_key),
        timeout=10,
    )
    assert load_response.status_code == 200
    vacation = load_response.json()["vacation"]
    assert vacation["archived"] is True


def test_api_vacation_remove(api_url: str, api_key: str, create_vacation) -> None:
    created = create_vacation("Remove Me", 5, 1, 5, 10)

    response = requests.delete(
        f"{api_url}/v1/vacations/{created.ref_id}/remove",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    load_response = requests.get(
        f"{api_url}/v1/vacations/{created.ref_id}?allow_archived=true",
        headers=_headers(api_key),
        timeout=10,
    )
    assert load_response.status_code == 502
    assert load_response.json()["status"] == 404


@pytest.fixture()
def another_user_with_vacations_enabled(
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
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.VACATIONS, value=True
            ),
        )
        yield another_user_and_workspace
    finally:
        workspace_set_feature_sync(
            client=make_client(),
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.VACATIONS, value=False
            ),
        )


@pytest.fixture()
def grant_vacation_access(
    logged_in_client: AuthenticatedClient,
    another_user_with_vacations_enabled: AnotherUserAndWorkspace,
):
    def _grant(vacation: Vacation, access_level: AccessLevel) -> str:
        response = invite_users_to_entity_sync(
            client=logged_in_client,
            body=InviteUsersToEntityArgs(
                entity_type=NamedEntityTag.VACATION,
                entity_ref_id=vacation.ref_id,
                user_ref_ids=[
                    another_user_with_vacations_enabled.init_result.new_user.ref_id
                ],
                access_level=access_level,
            ),
        )
        assert response.status_code == 200
        return another_user_with_vacations_enabled.api_key

    return _grant


def _vacation_update_body(ref_id: str, *, name: str) -> dict[str, object]:
    return {
        "ref_id": ref_id,
        "name": {"should_change": True, "value": name},
        "start_date": {"should_change": False},
        "end_date": {"should_change": False},
    }


def _assert_other_user_cannot_access_vacation(
    api_url: str,
    *,
    vacation_ref_id: str,
    owner_api_key: str,
    other_api_key: str,
) -> None:
    assert other_api_key != owner_api_key

    owner_load_response = requests.get(
        f"{api_url}/v1/vacations/{vacation_ref_id}?allow_archived=false",
        headers=_headers(owner_api_key),
        timeout=10,
    )
    assert owner_load_response.status_code == 200

    load_response = requests.get(
        f"{api_url}/v1/vacations/{vacation_ref_id}?allow_archived=false",
        headers=_headers(other_api_key),
        timeout=10,
    )
    _assert_acl_denied(load_response)

    update_response = requests.put(
        f"{api_url}/v1/vacations/{vacation_ref_id}",
        headers=_headers(other_api_key),
        json=_vacation_update_body(vacation_ref_id, name="Hacked Vacation"),
        timeout=10,
    )
    _assert_acl_denied(update_response)

    archive_response = requests.delete(
        f"{api_url}/v1/vacations/{vacation_ref_id}",
        headers=_headers(other_api_key),
        timeout=10,
    )
    _assert_acl_denied(archive_response)


def test_api_vacation_acl_reader_can_read_but_not_update_or_archive(
    api_url: str,
    api_key: str,
    create_vacation,
    grant_vacation_access,
    another_user_with_vacations_enabled: AnotherUserAndWorkspace,
) -> None:
    created = create_vacation("Reader ACL Vacation", 7, 1, 7, 14)
    other_api_key = another_user_with_vacations_enabled.api_key

    _assert_other_user_cannot_access_vacation(
        api_url,
        vacation_ref_id=created.ref_id,
        owner_api_key=api_key,
        other_api_key=other_api_key,
    )

    other_api_key = grant_vacation_access(created, AccessLevel.READER)

    load_response = requests.get(
        f"{api_url}/v1/vacations/{created.ref_id}?allow_archived=false",
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert load_response.status_code == 200
    vacation = load_response.json()["vacation"]
    assert vacation["ref_id"] == created.ref_id
    assert vacation["name"] == "Reader ACL Vacation"
    assert load_response.json()["owner"]["ref_id"] is not None
    assert load_response.json()["access_status"]["access_level"] == "reader"

    update_response = requests.put(
        f"{api_url}/v1/vacations/{created.ref_id}",
        headers=_headers(other_api_key),
        json=_vacation_update_body(created.ref_id, name="Hacked Vacation"),
        timeout=10,
    )
    _assert_acl_denied(update_response)

    archive_response = requests.delete(
        f"{api_url}/v1/vacations/{created.ref_id}",
        headers=_headers(other_api_key),
        timeout=10,
    )
    _assert_acl_denied(archive_response)


def test_api_vacation_acl_writer_can_read_and_update(
    api_url: str,
    create_vacation,
    grant_vacation_access,
) -> None:
    created = create_vacation("Writer Update Vacation", 7, 1, 7, 14)
    other_api_key = grant_vacation_access(created, AccessLevel.WRITER)

    load_response = requests.get(
        f"{api_url}/v1/vacations/{created.ref_id}?allow_archived=false",
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert load_response.status_code == 200
    assert load_response.json()["vacation"]["name"] == "Writer Update Vacation"
    assert load_response.json()["access_status"]["access_level"] == "writer"

    update_response = requests.put(
        f"{api_url}/v1/vacations/{created.ref_id}",
        headers=_headers(other_api_key),
        json=_vacation_update_body(created.ref_id, name="Updated By Writer"),
        timeout=10,
    )
    assert update_response.status_code == 200

    verify_response = requests.get(
        f"{api_url}/v1/vacations/{created.ref_id}?allow_archived=false",
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert verify_response.status_code == 200
    assert verify_response.json()["vacation"]["name"] == "Updated By Writer"


def test_api_vacation_acl_writer_can_read_and_archive(
    api_url: str,
    create_vacation,
    grant_vacation_access,
) -> None:
    created = create_vacation("Writer Archive Vacation", 7, 1, 7, 14)
    other_api_key = grant_vacation_access(created, AccessLevel.WRITER)

    load_response = requests.get(
        f"{api_url}/v1/vacations/{created.ref_id}?allow_archived=false",
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert load_response.status_code == 200
    assert load_response.json()["vacation"]["name"] == "Writer Archive Vacation"

    archive_response = requests.delete(
        f"{api_url}/v1/vacations/{created.ref_id}",
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert archive_response.status_code == 200

    archived_response = requests.get(
        f"{api_url}/v1/vacations/{created.ref_id}?allow_archived=true",
        headers=_headers(other_api_key),
        timeout=10,
    )
    assert archived_response.status_code == 200
    assert archived_response.json()["vacation"]["archived"] is True


def test_api_vacation_acl_z_denied_without_grant(
    api_url: str,
    api_key: str,
    create_vacation,
    another_user_with_vacations_enabled: AnotherUserAndWorkspace,
) -> None:
    created = create_vacation("ACL Vacation", 7, 1, 7, 14)
    _assert_other_user_cannot_access_vacation(
        api_url,
        vacation_ref_id=created.ref_id,
        owner_api_key=api_key,
        other_api_key=another_user_with_vacations_enabled.api_key,
    )


def test_api_vacation_requires_auth(api_url: str) -> None:
    response = requests.get(
        f"{api_url}/v1/vacations?allow_archived=false&include_notes=false&include_time_event_blocks=false&include_tags=false",
        timeout=10,
    )
    assert response.status_code == 401

    response_bad_token = requests.get(
        f"{api_url}/v1/vacations?allow_archived=false&include_notes=false&include_time_event_blocks=false&include_tags=false",
        headers={"Authorization": "Bearer invalid-token"},
        timeout=10,
    )
    assert response_bad_token.status_code == 401
