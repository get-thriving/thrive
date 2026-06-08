"""Tests about habits."""

import re

import pytest
from jupiter_webapi_client.api.habits.habit_create import (
    sync_detailed as habit_create_sync,
)
from jupiter_webapi_client.api.test_helper.workspace_set_feature import (
    sync_detailed as workspace_set_feature_sync,
)
from jupiter_webapi_client.client import AuthenticatedClient
from jupiter_webapi_client.models.difficulty import Difficulty
from jupiter_webapi_client.models.eisen import Eisen
from jupiter_webapi_client.models.habit import Habit
from jupiter_webapi_client.models.habit_create_args import HabitCreateArgs
from jupiter_webapi_client.models.habit_create_result import HabitCreateResult
from jupiter_webapi_client.models.habit_repeats_strategy import HabitRepeatsStrategy
from jupiter_webapi_client.models.recurring_task_period import RecurringTaskPeriod
from jupiter_webapi_client.models.workspace_feature import WorkspaceFeature
from jupiter_webapi_client.models.workspace_set_feature_args import (
    WorkspaceSetFeatureArgs,
)
from playwright.sync_api import Page, expect

from itests.helpers import get_parsed_from_response, open_leaf_publish_panel


@pytest.fixture(autouse=True, scope="module")
def _enable_habits_feature(logged_in_client: AuthenticatedClient):
    try:
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(feature=WorkspaceFeature.HABITS, value=True),
        )
        yield
    finally:
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(feature=WorkspaceFeature.HABITS, value=False),
        )


@pytest.fixture(autouse=True, scope="module")
def create_habit(logged_in_client: AuthenticatedClient):
    def _create_habit(
        name: str,
        period: RecurringTaskPeriod = RecurringTaskPeriod.DAILY,
        is_key: bool = False,
        eisen: Eisen = Eisen.REGULAR,
        difficulty: Difficulty = Difficulty.MEDIUM,
        repeats_strategy: HabitRepeatsStrategy | None = None,
        repeats_in_period_count: int | None = None,
    ) -> Habit:
        result = habit_create_sync(
            client=logged_in_client,
            body=HabitCreateArgs(
                name=name,
                period=period,
                is_key=is_key,
                eisen=eisen,
                difficulty=difficulty,
                repeats_strategy=repeats_strategy,
                repeats_in_period_count=repeats_in_period_count,
            ),
        )
        return get_parsed_from_response(HabitCreateResult, result).new_habit

    return _create_habit


def test_webui_habit_view_nothing(page: Page) -> None:
    page.goto("/app/workspace/habits")

    expect(page.locator("#trunk-panel")).to_contain_text("There are no habits to show")


def test_webui_habit_view_all(page: Page, create_habit) -> None:
    habit1 = create_habit(
        "Habit 1", RecurringTaskPeriod.DAILY, False, Eisen.REGULAR, Difficulty.MEDIUM
    )
    habit2 = create_habit(
        "Habit 2",
        RecurringTaskPeriod.WEEKLY,
        True,
        Eisen.IMPORTANT,
        Difficulty.HARD,
        HabitRepeatsStrategy.ALL_SAME,
        3,
    )
    habit3 = create_habit(
        "Habit 3",
        RecurringTaskPeriod.MONTHLY,
        False,
        Eisen.URGENT,
        Difficulty.EASY,
        HabitRepeatsStrategy.SPREAD_OUT_NO_OVERLAP,
        2,
    )

    page.goto("/app/workspace/habits")

    expect(page.locator(f"#habit-{habit1.ref_id}")).to_contain_text("Habit 1")
    expect(page.locator(f"#habit-{habit2.ref_id}")).to_contain_text("Habit 2")
    expect(page.locator(f"#habit-{habit3.ref_id}")).to_contain_text("Habit 3")


def test_webui_habit_publish_and_view_public(page: Page, create_habit) -> None:
    habit = create_habit("Published Habit")
    page.goto(f"/app/workspace/habits/{habit.ref_id}")
    page.wait_for_selector("#leaf-panel")

    open_leaf_publish_panel(page, "Habit-publish")
    page.locator("button[id='Habit-publish-create']").click()
    page.wait_for_url(re.compile(rf"/app/workspace/habits/{habit.ref_id}"))
    page.wait_for_selector("#leaf-panel")

    open_leaf_publish_panel(page, "Habit-publish")
    expect(page.locator("#Habit-publish")).to_contain_text("draft")

    page.locator("button[id='Habit-publish-toggle-status']").click()
    page.wait_for_url(re.compile(rf"/app/workspace/habits/{habit.ref_id}"))
    page.wait_for_selector("#leaf-panel")

    open_leaf_publish_panel(page, "Habit-publish")
    expect(page.locator("#Habit-publish")).to_contain_text("active")

    public_url = page.locator('input[name="publicUrl"]').input_value()
    assert "/app/public/published/" in public_url

    page.goto(public_url)
    page.wait_for_url(re.compile(r"/app/public/published/habit/"))
    page.wait_for_selector("#leaf-panel")

    expect(page.locator('input[name="name"]')).to_have_value("Published Habit")
