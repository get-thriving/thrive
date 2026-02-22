"""Tests for the API for PRM (personal relationship management)."""

from collections.abc import Iterator

import pytest
import requests
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
from jupiter_webapi_client.models.circle import Circle
from jupiter_webapi_client.models.circle_create_args import CircleCreateArgs
from jupiter_webapi_client.models.circle_create_result import CircleCreateResult
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

from itests.helpers import get_parsed_from_response


@pytest.fixture(autouse=True, scope="module")
def _enable_prm_feature(logged_in_client: AuthenticatedClient) -> Iterator[None]:
    try:
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.PRM, value=True
            ),
        )
        yield
    finally:
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.PRM, value=False
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
    )
    assert response.status_code == 200

    person = response.json()["new_person"]
    assert person["name"] == "Alice"
    assert person["archived"] is False
    assert "ref_id" in person


def test_api_prm_person_load(api_url: str, api_key: str, create_person) -> None:
    created = create_person("Bob")

    response = requests.get(
        f"{api_url}/v1/prm/persons/{created.ref_id}?allow_archived=false",
        headers=_headers(api_key),
    )
    assert response.status_code == 200

    person = response.json()["person"]
    assert person["ref_id"] == created.ref_id
    assert person["name"] == "Bob"


def test_api_prm_person_find(api_url: str, api_key: str, create_person) -> None:
    create_person("Charlie")
    create_person("Diana")

    response = requests.get(
        f"{api_url}/v1/prm/persons?allow_archived=false&include_notes=false&include_time_event_blocks=false&include_tags=false",
        headers=_headers(api_key),
    )
    assert response.status_code == 200

    names = [e["person"]["name"] for e in response.json()["entries"]]
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
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/prm/persons/{created.ref_id}?allow_archived=false",
        headers=_headers(api_key),
    )
    assert response2.status_code == 200
    assert response2.json()["person"]["name"] == "New Name"


def test_api_prm_person_archive(api_url: str, api_key: str, create_person) -> None:
    created = create_person("Archive Person")

    response = requests.delete(
        f"{api_url}/v1/prm/persons/{created.ref_id}",
        headers=_headers(api_key),
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/prm/persons/{created.ref_id}",
        headers=_headers(api_key),
    )
    assert response2.status_code == 502
    assert response2.json()["status"] == 404

    response3 = requests.get(
        f"{api_url}/v1/prm/persons/{created.ref_id}?allow_archived=true",
        headers=_headers(api_key),
    )
    assert response3.status_code == 200
    assert response3.json()["person"]["name"] == "Archive Person"


def test_api_prm_person_remove(api_url: str, api_key: str, create_person) -> None:
    created = create_person("Remove Person")

    response = requests.delete(
        f"{api_url}/v1/prm/persons/{created.ref_id}/remove",
        headers=_headers(api_key),
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/prm/persons/{created.ref_id}?allow_archived=true",
        headers=_headers(api_key),
    )
    assert response2.status_code == 502
    assert response2.json()["status"] == 404


# --- Circle tests ---


def test_api_prm_circle_create(api_url: str, api_key: str) -> None:
    response = requests.post(
        f"{api_url}/v1/prm/circles",
        headers=_headers(api_key),
        json={"name": "Family"},
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
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/prm/circles/{created.ref_id}?allow_archived=false",
        headers=_headers(api_key),
    )
    assert response2.status_code == 200
    assert response2.json()["circle"]["name"] == "New Circle"


def test_api_prm_circle_archive(api_url: str, api_key: str, create_circle) -> None:
    created = create_circle("Archive Circle")

    response = requests.delete(
        f"{api_url}/v1/prm/circles/{created.ref_id}",
        headers=_headers(api_key),
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/prm/circles/{created.ref_id}?allow_archived=true",
        headers=_headers(api_key),
    )
    assert response2.status_code == 200
    assert response2.json()["circle"]["name"] == "Archive Circle"

    response3 = requests.get(
        f"{api_url}/v1/prm/circles/{created.ref_id}",
        headers=_headers(api_key),
    )
    assert response3.status_code == 502
    assert response3.json()["status"] == 404


def test_api_prm_circle_remove(api_url: str, api_key: str, create_circle) -> None:
    created = create_circle("Remove Circle")

    response = requests.delete(
        f"{api_url}/v1/prm/circles/{created.ref_id}/remove",
        headers=_headers(api_key),
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/prm/circles/{created.ref_id}?allow_archived=true",
        headers=_headers(api_key),
    )
    assert response2.status_code == 502
    assert response2.json()["status"] == 404


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
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/prm/persons/{person.ref_id}/occasions/{occ.ref_id}?allow_archived=true",
        headers=_headers(api_key),
    )
    assert response2.status_code == 200
    assert response2.json()["occasion"]["name"] == "Archive Occasion"

    response3 = requests.get(
        f"{api_url}/v1/prm/persons/{person.ref_id}/occasions/{occ.ref_id}",
        headers=_headers(api_key),
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
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/prm/persons/{person.ref_id}/occasions/{occ.ref_id}?allow_archived=true",
        headers=_headers(api_key),
    )
    assert response2.status_code == 502
    assert response2.json()["status"] == 404


# --- Settings test ---


def test_api_prm_prm_load_settings(api_url: str, api_key: str) -> None:
    response = requests.get(
        f"{api_url}/v1/prm/settings",
        headers=_headers(api_key),
    )
    assert response.status_code == 200
    assert "catch_up_project" in response.json()
    assert "max_circles_per_person" in response.json()


# --- Auth test ---


def test_api_prm_prm_requires_auth(api_url: str) -> None:
    response = requests.get(
        f"{api_url}/v1/prm/persons?allow_archived=false&include_notes=false&include_time_event_blocks=false&include_tags=false",
    )
    assert response.status_code == 401
