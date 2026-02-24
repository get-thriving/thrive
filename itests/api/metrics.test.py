"""Tests for the API for metrics."""

from collections.abc import Iterator

import pytest
import requests
from jupiter_webapi_client.api.metrics.metric_create import (
    sync_detailed as metric_create_sync,
)
from jupiter_webapi_client.api.metrics.metric_entry_create import (
    sync_detailed as metric_entry_create_sync,
)
from jupiter_webapi_client.api.test_helper.workspace_set_feature import (
    sync_detailed as workspace_set_feature_sync,
)
from jupiter_webapi_client.client import AuthenticatedClient
from jupiter_webapi_client.models.metric import Metric
from jupiter_webapi_client.models.metric_create_args import MetricCreateArgs
from jupiter_webapi_client.models.metric_create_result import MetricCreateResult
from jupiter_webapi_client.models.metric_entry import MetricEntry
from jupiter_webapi_client.models.metric_entry_create_args import MetricEntryCreateArgs
from jupiter_webapi_client.models.metric_entry_create_result import (
    MetricEntryCreateResult,
)
from jupiter_webapi_client.models.workspace_feature import WorkspaceFeature
from jupiter_webapi_client.models.workspace_set_feature_args import (
    WorkspaceSetFeatureArgs,
)

from itests.helpers import get_parsed_from_response


@pytest.fixture(autouse=True, scope="module")
def _enable_metrics_feature(logged_in_client: AuthenticatedClient) -> Iterator[None]:
    try:
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(feature=WorkspaceFeature.METRICS, value=True),
        )
        yield
    finally:
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(feature=WorkspaceFeature.METRICS, value=False),
        )


@pytest.fixture()
def create_metric(logged_in_client: AuthenticatedClient):
    def _create(name: str) -> Metric:
        result = metric_create_sync(
            client=logged_in_client,
            body=MetricCreateArgs(name=name, is_key=False),
        )
        return get_parsed_from_response(MetricCreateResult, result).new_metric

    return _create


@pytest.fixture()
def create_metric_entry(logged_in_client: AuthenticatedClient):
    def _create(metric_ref_id: str, value: float) -> MetricEntry:
        result = metric_entry_create_sync(
            client=logged_in_client,
            body=MetricEntryCreateArgs(metric_ref_id=metric_ref_id, value=value),
        )
        return get_parsed_from_response(
            MetricEntryCreateResult, result
        ).new_metric_entry

    return _create


def _headers(api_key: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {api_key}"}


def test_api_metric_create(api_url: str, api_key: str) -> None:
    response = requests.post(
        f"{api_url}/v1/metrics",
        headers=_headers(api_key),
        json={
            "name": "Weight",
            "is_key": True,
            "icon": "⚖️",
            "metric_unit": "weight",
        },
    )
    assert response.status_code == 200

    metric = response.json()["new_metric"]
    assert metric["name"] == "Weight"
    assert metric["is_key"] is True
    assert metric["archived"] is False
    assert "ref_id" in metric


def test_api_metric_load(api_url: str, api_key: str, create_metric) -> None:
    created = create_metric("Load Metric")

    response = requests.get(
        f"{api_url}/v1/metrics/{created.ref_id}?allow_archived=false",
        headers=_headers(api_key),
    )
    assert response.status_code == 200

    metric = response.json()["metric"]
    assert metric["ref_id"] == created.ref_id
    assert metric["name"] == "Load Metric"


def test_api_metric_find(api_url: str, api_key: str, create_metric) -> None:
    create_metric("Metric Alpha")
    create_metric("Metric Beta")

    response = requests.get(
        f"{api_url}/v1/metrics?allow_archived=false&include_notes=false&include_time_event_blocks=false&include_tags=false",
        headers=_headers(api_key),
    )
    assert response.status_code == 200

    names = [e["metric"]["name"] for e in response.json()["entries"]]
    assert "Metric Alpha" in names
    assert "Metric Beta" in names


def test_api_metric_load_settings(api_url: str, api_key: str) -> None:
    response = requests.get(
        f"{api_url}/v1/metrics/settings",
        headers=_headers(api_key),
    )
    assert response.status_code == 200
    assert "collection_project" in response.json()


def test_api_metric_update(api_url: str, api_key: str, create_metric) -> None:
    created = create_metric("Old Metric")

    response = requests.put(
        f"{api_url}/v1/metrics/{created.ref_id}",
        headers=_headers(api_key),
        json={
            "ref_id": created.ref_id,
            "name": {"should_change": True, "value": "New Metric"},
            "is_key": {"should_change": False},
            "icon": {"should_change": False},
            "collection_period": {"should_change": False},
            "collection_eisen": {"should_change": False},
            "collection_difficulty": {"should_change": False},
            "collection_actionable_from_day": {"should_change": False},
            "collection_actionable_from_month": {"should_change": False},
            "collection_due_at_day": {"should_change": False},
            "collection_due_at_month": {"should_change": False},
            "metric_unit": {"should_change": False},
        },
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/metrics/{created.ref_id}?allow_archived=false",
        headers=_headers(api_key),
    )
    assert response2.status_code == 200
    assert response2.json()["metric"]["name"] == "New Metric"


def test_api_metric_archive(api_url: str, api_key: str, create_metric) -> None:
    created = create_metric("Archive Metric")

    response = requests.delete(
        f"{api_url}/v1/metrics/{created.ref_id}",
        headers=_headers(api_key),
    )
    assert response.status_code == 200

    response3 = requests.get(
        f"{api_url}/v1/metrics/{created.ref_id}?allow_archived=true",
        headers=_headers(api_key),
    )
    assert response3.status_code == 200
    assert response3.json()["metric"]["archived"] is True

    response4 = requests.get(
        f"{api_url}/v1/metrics/{created.ref_id}?allow_archived=false",
        headers=_headers(api_key),
    )
    assert response4.status_code == 502
    assert response4.json()["status"] == 404


def test_api_metric_remove(api_url: str, api_key: str, create_metric) -> None:
    created = create_metric("Remove Metric")

    response = requests.delete(
        f"{api_url}/v1/metrics/{created.ref_id}/remove",
        headers=_headers(api_key),
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/metrics/{created.ref_id}?allow_archived=true",
        headers=_headers(api_key),
    )
    assert response2.status_code == 502
    assert response2.json()["status"] == 404


def test_api_metric_entry_create(api_url: str, api_key: str, create_metric) -> None:
    metric = create_metric("Entry Metric")

    response = requests.post(
        f"{api_url}/v1/metrics/{metric.ref_id}/entries",
        headers=_headers(api_key),
        json={
            "metric_ref_id": metric.ref_id,
            "value": 75.5,
            "collection_time": "2024-06-15",
        },
    )
    assert response.status_code == 200

    entry = response.json()["new_metric_entry"]
    assert entry["value"] == 75.5
    assert "ref_id" in entry


def test_api_metric_entry_load(
    api_url: str, api_key: str, create_metric, create_metric_entry
) -> None:
    metric = create_metric("Entry Load Metric")
    entry = create_metric_entry(metric.ref_id, 42.0)

    response = requests.get(
        f"{api_url}/v1/metrics/{metric.ref_id}/entries/{entry.ref_id}?allow_archived=false",
        headers=_headers(api_key),
    )
    assert response.status_code == 200
    assert response.json()["metric_entry"]["value"] == 42.0


def test_api_metric_entry_update(
    api_url: str, api_key: str, create_metric, create_metric_entry
) -> None:
    metric = create_metric("Entry Update Metric")
    entry = create_metric_entry(metric.ref_id, 10.0)

    response = requests.put(
        f"{api_url}/v1/metrics/{metric.ref_id}/entries/{entry.ref_id}",
        headers=_headers(api_key),
        json={
            "ref_id": entry.ref_id,
            "value": {"should_change": True, "value": 20.0},
            "collection_time": {"should_change": False},
        },
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/metrics/{metric.ref_id}/entries/{entry.ref_id}?allow_archived=false",
        headers=_headers(api_key),
    )
    assert response2.status_code == 200
    assert response2.json()["metric_entry"]["value"] == 20.0


def test_api_metric_entry_archive(
    api_url: str, api_key: str, create_metric, create_metric_entry
) -> None:
    metric = create_metric("Entry Archive Metric")
    entry = create_metric_entry(metric.ref_id, 5.0)

    response = requests.delete(
        f"{api_url}/v1/metrics/{metric.ref_id}/entries/{entry.ref_id}",
        headers=_headers(api_key),
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/metrics/{metric.ref_id}/entries/{entry.ref_id}?allow_archived=true",
        headers=_headers(api_key),
    )
    assert response2.status_code == 200
    assert response2.json()["metric_entry"]["archived"] is True

    response3 = requests.get(
        f"{api_url}/v1/metrics/{metric.ref_id}/entries/{entry.ref_id}?allow_archived=false",
        headers=_headers(api_key),
    )
    assert response3.status_code == 502
    assert response3.json()["status"] == 404


def test_api_metric_entry_remove(
    api_url: str, api_key: str, create_metric, create_metric_entry
) -> None:
    metric = create_metric("Entry Remove Metric")
    entry = create_metric_entry(metric.ref_id, 99.0)

    response = requests.delete(
        f"{api_url}/v1/metrics/{metric.ref_id}/entries/{entry.ref_id}/remove",
        headers=_headers(api_key),
    )
    assert response.status_code == 200

    response2 = requests.get(
        f"{api_url}/v1/metrics/{metric.ref_id}/entries/{entry.ref_id}?allow_archived=true",
        headers=_headers(api_key),
    )
    assert response2.status_code == 502
    assert response2.json()["status"] == 404


def test_api_metric_requires_auth(api_url: str) -> None:
    response = requests.get(
        f"{api_url}/v1/metrics?allow_archived=false&include_notes=false&include_time_event_blocks=false&include_tags=false",
    )
    assert response.status_code == 401
