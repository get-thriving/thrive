"""Tests for the API for vacations."""

from collections.abc import Iterator

import pytest
import requests
from jupiter_webapi_client.api.test_helper.workspace_set_feature import (
    sync_detailed as workspace_set_feature_sync,
)
from jupiter_webapi_client.api.vacations.vacation_create import (
    sync_detailed as vacation_create_sync,
)
from jupiter_webapi_client.client import AuthenticatedClient
from jupiter_webapi_client.models.vacation import Vacation
from jupiter_webapi_client.models.vacation_create_args import VacationCreateArgs
from jupiter_webapi_client.models.vacation_create_result import VacationCreateResult
from jupiter_webapi_client.models.workspace_feature import WorkspaceFeature
from jupiter_webapi_client.models.workspace_set_feature_args import (
    WorkspaceSetFeatureArgs,
)

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


def test_api_vacation_create(api_url: str, api_key: str) -> None:
    response = requests.post(
        f"{api_url}/v1/vacations",
        headers=_headers(api_key),
        json={
            "name": "Summer Break",
            "start_date": "2024-07-01",
            "end_date": "2024-07-14",
        },
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
    )
    assert response.status_code == 200

    data = response.json()
    vacation = data["vacation"]
    assert vacation["ref_id"] == created.ref_id
    assert vacation["name"] == "Beach Trip"
    assert vacation["start_date"] == "2024-08-01"
    assert vacation["end_date"] == "2024-08-10"

    assert data["time_event_block"] is not None


def test_api_vacation_find(api_url: str, api_key: str, create_vacation) -> None:
    create_vacation("First Vacation", 12, 10, 12, 15)
    create_vacation("Second Vacation", 12, 20, 12, 25)

    response = requests.get(
        f"{api_url}/v1/vacations?allow_archived=false&include_notes=false&include_time_event_blocks=false&include_tags=false",
        headers=_headers(api_key),
    )
    assert response.status_code == 200

    data = response.json()
    entries = data["entries"]
    assert len(entries) >= 2

    vacations = sorted(
        [e["vacation"] for e in entries], key=lambda v: v["start_date"]
    )
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
    )

    response = requests.get(
        f"{api_url}/v1/vacations?allow_archived=false&include_notes=false&include_time_event_blocks=false&include_tags=false",
        headers=_headers(api_key),
    )
    assert response.status_code == 200
    names = [e["vacation"]["name"] for e in response.json()["entries"]]
    assert "To Archive" not in names

    response_with_archived = requests.get(
        f"{api_url}/v1/vacations?allow_archived=true&include_notes=false&include_time_event_blocks=false&include_tags=false",
        headers=_headers(api_key),
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
    )
    assert response.status_code == 200

    load_response = requests.get(
        f"{api_url}/v1/vacations/{created.ref_id}?allow_archived=false",
        headers=_headers(api_key),
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
    )
    assert response.status_code == 200

    load_response = requests.get(
        f"{api_url}/v1/vacations/{created.ref_id}?allow_archived=false",
        headers=_headers(api_key),
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
    )
    assert response.status_code == 200

    load_response = requests.get(
        f"{api_url}/v1/vacations/{created.ref_id}?allow_archived=true",
        headers=_headers(api_key),
    )
    assert load_response.status_code == 200
    vacation = load_response.json()["vacation"]
    assert vacation["archived"] is True


def test_api_vacation_remove(api_url: str, api_key: str, create_vacation) -> None:
    created = create_vacation("Remove Me", 5, 1, 5, 10)

    response = requests.delete(
        f"{api_url}/v1/vacations/{created.ref_id}/remove",
        headers=_headers(api_key),
    )
    assert response.status_code == 200

    load_response = requests.get(
        f"{api_url}/v1/vacations/{created.ref_id}?allow_archived=true",
        headers=_headers(api_key),
    )
    assert load_response.status_code == 502
    assert load_response.json()["status"] == 404


def test_api_vacation_requires_auth(api_url: str) -> None:
    response = requests.get(
        f"{api_url}/v1/vacations?allow_archived=false&include_notes=false&include_time_event_blocks=false&include_tags=false",
    )
    assert response.status_code == 401

    response_bad_token = requests.get(
        f"{api_url}/v1/vacations?allow_archived=false&include_notes=false&include_time_event_blocks=false&include_tags=false",
        headers={"Authorization": "Bearer invalid-token"},
    )
    assert response_bad_token.status_code == 401
