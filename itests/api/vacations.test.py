"""Tests for the API for vacations."""

import re
import time
from collections.abc import Iterator
import requests


import pytest
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
from playwright.sync_api import Browser, Page, expect

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
                start_date=f"2024-{start_month}-{start_day}",
                end_date=f"2024-{end_month}-{end_day}",
            ),
        )
        return get_parsed_from_response(VacationCreateResult, result).new_vacation

    return _create_vacation

def test_api_vacation_find(api_url: str, api_key: str, create_vacation) -> None:
    create_vacation("First Vacation", 12, 10, 12, 15)
    create_vacation("Second Vacation", 12, 20, 12, 25)

    headers = {"Authorization": f"Bearer {api_key}"}
    response = requests.get(
        f"{api_url}/v1/vacations?allow_archived=false&include_notes=false&include_time_event_blocks=false&include_tags=true",
        headers=headers,
    )
    assert response.status_code == 200

    data = response.json()
    entries = data["entries"]
    assert len(entries) == 2

    vacations = sorted(
        [e["vacation"] for e in entries], key=lambda v: v["start_date"]
    )

    assert vacations[0]["name"] == "First Vacation"
    assert vacations[0]["start_date"] == "2024-12-10"
    assert vacations[0]["end_date"] == "2024-12-15"

    assert vacations[1]["name"] == "Second Vacation"
    assert vacations[1]["start_date"] == "2024-12-20"
    assert vacations[1]["end_date"] == "2024-12-25"