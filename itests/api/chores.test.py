"""Tests for the API for chores."""

from collections.abc import Iterator

import pytest
import requests
from jupiter_webapi_client.api.chores.chore_archive import (
    sync_detailed as chore_archive_sync,
)
from jupiter_webapi_client.api.chores.chore_create import (
    sync_detailed as chore_create_sync,
)
from jupiter_webapi_client.api.chores.chore_suspend import (
    sync_detailed as chore_suspend_sync,
)
from jupiter_webapi_client.api.test_helper.workspace_set_feature import (
    sync_detailed as workspace_set_feature_sync,
)
from jupiter_webapi_client.client import AuthenticatedClient
from jupiter_webapi_client.models.chore import Chore
from jupiter_webapi_client.models.chore_archive_args import ChoreArchiveArgs
from jupiter_webapi_client.models.chore_create_args import ChoreCreateArgs
from jupiter_webapi_client.models.chore_create_result import ChoreCreateResult
from jupiter_webapi_client.models.chore_suspend_args import ChoreSuspendArgs
from jupiter_webapi_client.models.difficulty import Difficulty
from jupiter_webapi_client.models.eisen import Eisen
from jupiter_webapi_client.models.recurring_task_period import RecurringTaskPeriod
from jupiter_webapi_client.models.workspace_feature import WorkspaceFeature
from jupiter_webapi_client.models.workspace_set_feature_args import (
    WorkspaceSetFeatureArgs,
)

from itests.helpers import get_parsed_from_response


@pytest.fixture(autouse=True, scope="module")
def _enable_chores_feature(logged_in_client: AuthenticatedClient) -> Iterator[None]:
    try:
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(feature=WorkspaceFeature.CHORES, value=True),
        )
        yield
    finally:
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(feature=WorkspaceFeature.CHORES, value=False),
        )


@pytest.fixture()
def create_chore(logged_in_client: AuthenticatedClient):
    def _create(name: str) -> Chore:
        result = chore_create_sync(
            client=logged_in_client,
            body=ChoreCreateArgs(
                name=name,
                period=RecurringTaskPeriod.WEEKLY,
                is_key=False,
                eisen=Eisen.REGULAR,
                difficulty=Difficulty.EASY,
                must_do=False,
            ),
        )
        return get_parsed_from_response(ChoreCreateResult, result).new_chore

    return _create


@pytest.fixture()
def archive_chore(logged_in_client: AuthenticatedClient):
    def _archive(ref_id: str) -> None:
        chore_archive_sync(
            client=logged_in_client,
            body=ChoreArchiveArgs(ref_id=ref_id),
        )

    return _archive


@pytest.fixture()
def suspend_chore(logged_in_client: AuthenticatedClient):
    def _suspend(ref_id: str) -> None:
        chore_suspend_sync(
            client=logged_in_client,
            body=ChoreSuspendArgs(ref_id=ref_id),
        )

    return _suspend


def _headers(api_key: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {api_key}"}


def test_api_chore_create(api_url: str, api_key: str) -> None:
    response = requests.post(
        f"{api_url}/v1/chores",
        headers=_headers(api_key),
        json={
            "name": "Clean Kitchen",
            "period": "daily",
            "is_key": True,
            "eisen": "important",
            "difficulty": "medium",
            "must_do": True,
        },
        timeout=10,
    )
    assert response.status_code == 200

    chore = response.json()["new_chore"]
    assert chore["name"] == "Clean Kitchen"
    assert chore["gen_params"]["period"] == "daily"
    assert chore["gen_params"]["eisen"] == "important"
    assert chore["gen_params"]["difficulty"] == "medium"
    assert chore["is_key"] is True
    assert chore["must_do"] is True
    assert chore["archived"] is False
    assert "ref_id" in chore


def test_api_chore_load(api_url: str, api_key: str, create_chore) -> None:
    created = create_chore("Load Chore")

    response = requests.get(
        f"{api_url}/v1/chores/{created.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    chore = response.json()["chore"]
    assert chore["ref_id"] == created.ref_id
    assert chore["name"] == "Load Chore"


def test_api_chore_find(api_url: str, api_key: str, create_chore) -> None:
    create_chore("Chore Alpha")
    create_chore("Chore Beta")

    response = requests.get(
        f"{api_url}/v1/chores?allow_archived=false&include_notes=false&include_time_event_blocks=false&include_tags=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    names = [e["chore"]["name"] for e in response.json()["entries"]]
    assert "Chore Alpha" in names
    assert "Chore Beta" in names


def test_api_chore_update(api_url: str, api_key: str, create_chore) -> None:
    created = create_chore("Old Chore")

    response = requests.put(
        f"{api_url}/v1/chores/{created.ref_id}",
        headers=_headers(api_key),
        json={
            "ref_id": created.ref_id,
            "name": {"should_change": True, "value": "New Chore"},
            "period": {"should_change": True, "value": "daily"},
            "is_key": {"should_change": False},
            "eisen": {"should_change": False},
            "difficulty": {"should_change": False},
            "must_do": {"should_change": True, "value": True},
            "actionable_from_day": {"should_change": False},
            "actionable_from_month": {"should_change": False},
            "due_at_day": {"should_change": False},
            "due_at_month": {"should_change": False},
            "skip_rule": {"should_change": False},
            "start_at_date": {"should_change": False},
            "end_at_date": {"should_change": False},
            "aspect_ref_id": {"should_change": False},
            "chapter_ref_id": {"should_change": False},
            "goal_ref_id": {"should_change": False},
        },
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/chores/{created.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 200
    assert response2.json()["chore"]["name"] == "New Chore"


def test_api_chore_archive(api_url: str, api_key: str, create_chore) -> None:
    created = create_chore("Archive Chore")

    response = requests.delete(
        f"{api_url}/v1/chores/{created.ref_id}",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    response1 = requests.get(
        f"{api_url}/v1/chores/{created.ref_id}",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response1.status_code == 502
    assert response1.json()["status"] == 404

    response2 = requests.get(
        f"{api_url}/v1/chores/{created.ref_id}?allow_archived=true",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 200
    assert response2.json()["chore"]["archived"] is True


def test_api_chore_remove(api_url: str, api_key: str, create_chore) -> None:
    created = create_chore("Remove Chore")

    response = requests.delete(
        f"{api_url}/v1/chores/{created.ref_id}/remove",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/chores/{created.ref_id}?allow_archived=true",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 502
    assert response2.json()["status"] == 404


def test_api_chore_suspend(api_url: str, api_key: str, create_chore) -> None:
    created = create_chore("Suspend Chore")

    response = requests.post(
        f"{api_url}/v1/chores/{created.ref_id}/suspend",
        headers=_headers(api_key),
        json={"ref_id": created.ref_id},
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/chores/{created.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 200
    assert response2.json()["chore"]["suspended"] is True


def test_api_chore_unsuspend(
    api_url: str, api_key: str, create_chore, suspend_chore
) -> None:
    created = create_chore("Unsuspend Chore")
    suspend_chore(created.ref_id)

    response = requests.post(
        f"{api_url}/v1/chores/{created.ref_id}/unsuspend",
        headers=_headers(api_key),
        json={"ref_id": created.ref_id},
        timeout=10,
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/chores/{created.ref_id}?allow_archived=false",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response2.status_code == 200
    assert response2.json()["chore"]["suspended"] is False


def test_api_chore_requires_auth(api_url: str) -> None:
    response = requests.get(
        f"{api_url}/v1/chores?allow_archived=false&include_notes=false&include_time_event_blocks=false&include_tags=false",
        timeout=10,
    )
    assert response.status_code == 401
