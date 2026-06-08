"""Tests about chores."""

import re

import pytest
from jupiter_webapi_client.api.chores.chore_create import (
    sync_detailed as chore_create_sync,
)
from jupiter_webapi_client.api.test_helper.workspace_set_feature import (
    sync_detailed as workspace_set_feature_sync,
)
from jupiter_webapi_client.client import AuthenticatedClient
from jupiter_webapi_client.models.chore import Chore
from jupiter_webapi_client.models.chore_create_args import ChoreCreateArgs
from jupiter_webapi_client.models.chore_create_result import ChoreCreateResult
from jupiter_webapi_client.models.difficulty import Difficulty
from jupiter_webapi_client.models.eisen import Eisen
from jupiter_webapi_client.models.recurring_task_period import RecurringTaskPeriod
from jupiter_webapi_client.models.workspace_feature import WorkspaceFeature
from jupiter_webapi_client.models.workspace_set_feature_args import (
    WorkspaceSetFeatureArgs,
)
from playwright.sync_api import Page, expect

from itests.helpers import get_parsed_from_response, open_leaf_publish_panel


@pytest.fixture(autouse=True, scope="module")
def _enable_chores_feature(logged_in_client: AuthenticatedClient):
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


@pytest.fixture(autouse=True, scope="module")
def create_chore(logged_in_client: AuthenticatedClient):
    def _create_chore(
        name: str,
        period: RecurringTaskPeriod = RecurringTaskPeriod.WEEKLY,
        is_key: bool = False,
        eisen: Eisen = Eisen.REGULAR,
        difficulty: Difficulty = Difficulty.MEDIUM,
        must_do: bool = False,
    ) -> Chore:
        result = chore_create_sync(
            client=logged_in_client,
            body=ChoreCreateArgs(
                name=name,
                period=period,
                is_key=is_key,
                eisen=eisen,
                difficulty=difficulty,
                must_do=must_do,
            ),
        )
        return get_parsed_from_response(ChoreCreateResult, result).new_chore

    return _create_chore


def test_webui_chore_view_nothing(page: Page) -> None:
    page.goto("/app/workspace/chores")

    expect(page.locator("#trunk-panel")).to_contain_text("There are no chores to show")


def test_webui_chore_view_all(page: Page, create_chore) -> None:
    chore1 = create_chore(
        "Chore 1",
        RecurringTaskPeriod.WEEKLY,
        False,
        Eisen.REGULAR,
        Difficulty.MEDIUM,
        False,
    )
    chore2 = create_chore(
        "Chore 2",
        RecurringTaskPeriod.DAILY,
        True,
        Eisen.IMPORTANT,
        Difficulty.HARD,
        True,
    )
    chore3 = create_chore(
        "Chore 3",
        RecurringTaskPeriod.MONTHLY,
        False,
        Eisen.URGENT,
        Difficulty.EASY,
        False,
    )

    page.goto("/app/workspace/chores")

    expect(page.locator(f"#chore-{chore1.ref_id}")).to_contain_text("Chore 1")
    expect(page.locator(f"#chore-{chore2.ref_id}")).to_contain_text("Chore 2")
    expect(page.locator(f"#chore-{chore3.ref_id}")).to_contain_text("Chore 3")


def test_webui_chore_publish_and_view_public(page: Page, create_chore) -> None:
    chore = create_chore("Published Chore")
    page.goto(f"/app/workspace/chores/{chore.ref_id}")
    page.wait_for_selector("#leaf-panel")

    open_leaf_publish_panel(page, "Chore-publish")
    page.locator("button[id='Chore-publish-create']").click()
    page.wait_for_url(re.compile(rf"/app/workspace/chores/{chore.ref_id}"))
    page.wait_for_selector("#leaf-panel")

    open_leaf_publish_panel(page, "Chore-publish")
    expect(page.locator("#Chore-publish")).to_contain_text("draft")

    page.locator("button[id='Chore-publish-toggle-status']").click()
    page.wait_for_url(re.compile(rf"/app/workspace/chores/{chore.ref_id}"))
    page.wait_for_selector("#leaf-panel")

    open_leaf_publish_panel(page, "Chore-publish")
    expect(page.locator("#Chore-publish")).to_contain_text("active")

    public_url = page.locator('input[name="publicUrl"]').input_value()
    assert "/app/public/published/" in public_url

    page.goto(public_url)
    page.wait_for_url(re.compile(r"/app/public/published/chore/"))
    page.wait_for_selector("#leaf-panel")

    expect(page.locator('input[name="name"]')).to_have_value("Published Chore")
