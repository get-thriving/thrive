"""Tests for the API for working memory."""

from collections.abc import Iterator

import pytest
import requests
from jupiter_webapi_client.api.test_helper.workspace_set_feature import (
    sync_detailed as workspace_set_feature_sync,
)
from jupiter_webapi_client.client import AuthenticatedClient
from jupiter_webapi_client.models.workspace_feature import WorkspaceFeature
from jupiter_webapi_client.models.workspace_set_feature_args import (
    WorkspaceSetFeatureArgs,
)


@pytest.fixture(autouse=True, scope="module")
def _enable_working_mem_feature(
    logged_in_client: AuthenticatedClient,
) -> Iterator[None]:
    try:
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.WORKING_MEM, value=True
            ),
        )
        yield
    finally:
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.WORKING_MEM, value=False
            ),
        )


@pytest.fixture()
def enable_life_plan_feature(logged_in_client: AuthenticatedClient):
    def do_it() -> None:
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.LIFE_PLAN, value=True
            ),
        )

    return do_it


def _headers(api_key: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {api_key}"}


def test_api_working_mem_load(api_url: str, api_key: str) -> None:
    response = requests.get(
        f"{api_url}/v1/working-mem",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200
    entry = response.json()["entry"]
    assert "working_mem" in entry
    assert "note" in entry
    assert entry["working_mem"]["ref_id"] is not None
    assert entry["note"]["namespace"] == "working-mem"


def test_api_working_mem_load_settings(api_url: str, api_key: str) -> None:
    response = requests.get(
        f"{api_url}/v1/working-mem/settings",
        headers=_headers(api_key),
        timeout=10,
    )
    assert response.status_code == 200
    assert "generation_period" in response.json()
    assert "cleanup_aspect" in response.json()
    assert "clean_up_inbox_tasks" in response.json()


def test_api_working_mem_update_settings(
    api_url: str, api_key: str, enable_life_plan_feature
) -> None:
    enable_life_plan_feature()
    response = requests.put(
        f"{api_url}/v1/working-mem/settings",
        headers=_headers(api_key),
        json={
            "generation_period": {"should_change": True, "value": "daily"},
            "cleanup_aspect_ref_id": {"should_change": False},
        },
        timeout=10,
    )
    assert response.status_code == 200


def test_api_working_mem_requires_auth(api_url: str) -> None:
    response = requests.get(f"{api_url}/v1/working-mem", timeout=10)
    assert response.status_code == 401

    response = requests.get(f"{api_url}/v1/working-mem/settings", timeout=10)
    assert response.status_code == 401
