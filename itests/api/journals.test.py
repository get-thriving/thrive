"""Tests for the API for journals."""

from collections.abc import Iterator

import pytest
import requests
from jupiter_webapi_client.api.journals.journal_create import (
    sync_detailed as journal_create_sync,
)
from jupiter_webapi_client.api.test_helper.workspace_set_feature import (
    sync_detailed as workspace_set_feature_sync,
)
from jupiter_webapi_client.client import AuthenticatedClient
from jupiter_webapi_client.models.journal import Journal
from jupiter_webapi_client.models.journal_create_args import JournalCreateArgs
from jupiter_webapi_client.models.journal_create_result import JournalCreateResult
from jupiter_webapi_client.models.recurring_task_period import RecurringTaskPeriod
from jupiter_webapi_client.models.workspace_feature import WorkspaceFeature
from jupiter_webapi_client.models.workspace_set_feature_args import (
    WorkspaceSetFeatureArgs,
)

from itests.helpers import get_parsed_from_response


@pytest.fixture(autouse=True, scope="module")
def _enable_journals_feature(logged_in_client: AuthenticatedClient) -> Iterator[None]:
    try:
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(feature=WorkspaceFeature.JOURNALS, value=True),
        )
        yield
    finally:
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.JOURNALS, value=False
            ),
        )


@pytest.fixture()
def create_journal(logged_in_client: AuthenticatedClient):
    def _create(
        right_now: str, period: RecurringTaskPeriod = RecurringTaskPeriod.WEEKLY
    ) -> Journal:
        result = journal_create_sync(
            client=logged_in_client,
            body=JournalCreateArgs(
                right_now=right_now,
                period=period,
            ),
        )
        return get_parsed_from_response(JournalCreateResult, result).new_journal

    return _create


def _headers(api_key: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {api_key}"}


# --- Journal tests ---


def test_api_journal_create(api_url: str, api_key: str) -> None:
    response = requests.post(
        f"{api_url}/v1/journals",
        headers=_headers(api_key),
        json={
            "right_now": "2024-06-10",
            "period": "weekly",
        },
    )
    assert response.status_code == 200

    journal = response.json()["new_journal"]
    assert journal["period"] == "weekly"
    assert journal["right_now"] == "2024-06-10"
    assert journal["archived"] is False
    assert "ref_id" in journal


def test_api_journal_load(api_url: str, api_key: str, create_journal) -> None:
    created = create_journal("2024-07-01")

    response = requests.get(
        f"{api_url}/v1/journals/{created.ref_id}?allow_archived=false",
        headers=_headers(api_key),
    )
    assert response.status_code == 200

    journal = response.json()["journal"]
    assert journal["ref_id"] == created.ref_id
    assert journal["period"] == "weekly"


def test_api_journal_find(api_url: str, api_key: str, create_journal) -> None:
    j1 = create_journal("2024-08-05")
    j2 = create_journal("2024-08-12")

    response = requests.get(
        f"{api_url}/v1/journals?allow_archived=false&include_notes=false&include_journal_stats=false&include_writing_tasks=false&include_tags=false",
        headers=_headers(api_key),
    )
    assert response.status_code == 200

    ref_ids = [e["journal"]["ref_id"] for e in response.json()["entries"]]
    assert j1.ref_id in ref_ids
    assert j2.ref_id in ref_ids


def test_api_journal_load_for_date_and_period(
    api_url: str, api_key: str, create_journal
) -> None:
    created = create_journal("2024-08-19")

    response = requests.get(
        f"{api_url}/v1/journals/for-date-and-period?right_now=2024-08-19&period=weekly",
        headers=_headers(api_key),
    )
    assert response.status_code == 200

    data = response.json()
    assert data["journal"] is not None
    assert data["journal"]["ref_id"] == created.ref_id
    assert data["journal"]["period"] == "weekly"


def test_api_journal_load_for_date_and_period_not_found(
    api_url: str, api_key: str
) -> None:
    response = requests.get(
        f"{api_url}/v1/journals/for-date-and-period?right_now=2099-01-01&period=weekly",
        headers=_headers(api_key),
    )
    assert response.status_code == 200

    data = response.json()
    assert data["journal"] is None


def test_api_journal_change_time_config(
    api_url: str, api_key: str, create_journal
) -> None:
    created = create_journal("2024-08-26")

    response = requests.post(
        f"{api_url}/v1/journals/{created.ref_id}/change-time-config",
        headers=_headers(api_key),
        json={
            "ref_id": created.ref_id,
            "right_now": {"should_change": True, "value": "2024-09-02"},
            "period": {"should_change": True, "value": "monthly"},
        },
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/journals/{created.ref_id}?allow_archived=false",
        headers=_headers(api_key),
    )
    assert response2.status_code == 200
    journal = response2.json()["journal"]
    assert journal["right_now"] == "2024-09-02"
    assert journal["period"] == "monthly"


def test_api_journal_load_settings(api_url: str, api_key: str) -> None:
    response = requests.get(
        f"{api_url}/v1/journals/settings",
        headers=_headers(api_key),
    )
    assert response.status_code == 200
    assert "periods" in response.json()
    assert "generation_approach" in response.json()


def test_api_journal_update_settings(api_url: str, api_key: str) -> None:
    response = requests.put(
        f"{api_url}/v1/journals/settings",
        headers=_headers(api_key),
        json={
            "periods": {"should_change": False},
            "generation_approach": {"should_change": False},
            "generation_in_advance_days": {"should_change": False},
            "writing_task_project_ref_id": {"should_change": False},
            "writing_task_eisen": {"should_change": False},
            "writing_task_difficulty": {"should_change": False},
        },
    )
    assert response.status_code == 200


def test_api_journal_regen(api_url: str, api_key: str, create_journal) -> None:
    create_journal("2024-10-07")

    response = requests.post(
        f"{api_url}/v1/journals/regen",
        headers=_headers(api_key),
        json={},
    )
    assert response.status_code == 200


def test_api_journal_refresh_stats(api_url: str, api_key: str, create_journal) -> None:
    created = create_journal("2024-09-09")

    response = requests.post(
        f"{api_url}/v1/journals/{created.ref_id}/refresh-stats",
        headers=_headers(api_key),
        json={"ref_id": created.ref_id},
    )
    assert response.status_code == 200


def test_api_journal_archive(api_url: str, api_key: str, create_journal) -> None:
    created = create_journal("2024-09-16")

    response = requests.delete(
        f"{api_url}/v1/journals/{created.ref_id}",
        headers=_headers(api_key),
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/journals/{created.ref_id}?allow_archived=true",
        headers=_headers(api_key),
    )
    assert response2.status_code == 200
    assert response2.json()["journal"]["archived"] is True

    response3 = requests.get(
        f"{api_url}/v1/journals/{created.ref_id}?allow_archived=false",
        headers=_headers(api_key),
    )
    assert response3.status_code == 502
    assert response3.json()["status"] == 404


def test_api_journal_remove(api_url: str, api_key: str, create_journal) -> None:
    created = create_journal("2024-09-23")

    response = requests.delete(
        f"{api_url}/v1/journals/{created.ref_id}/remove",
        headers=_headers(api_key),
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/journals/{created.ref_id}?allow_archived=true",
        headers=_headers(api_key),
    )
    assert response2.status_code == 502
    assert response2.json()["status"] == 404


# --- Auth test ---


def test_api_journal_requires_auth(api_url: str) -> None:
    response = requests.get(
        f"{api_url}/v1/journals?allow_archived=false&include_notes=false&include_journal_stats=false&include_writing_tasks=false&include_tags=false",
    )
    assert response.status_code == 401
