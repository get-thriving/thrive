"""Tests for the publish API."""

from collections.abc import Iterator

import pytest
import requests
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
from jupiter_webapi_client.client import AuthenticatedClient
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
from jupiter_webapi_client.models.workspace_feature import WorkspaceFeature
from jupiter_webapi_client.models.workspace_set_feature_args import (
    WorkspaceSetFeatureArgs,
)

from itests.helpers import get_parsed_from_response


def _person_owner(ref_id: str) -> str:
    return f"Person:std:{ref_id}"


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


def _headers(api_key: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {api_key}"}


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
