"""Tests about the views of a panel: its history, publishing and access.

Each opens as a column beside the panel when there is room, and in place of the
panel's content on a phone.
"""

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
from jupiter_webapi_client.models.recurring_task_period import RecurringTaskPeriod
from jupiter_webapi_client.models.workspace_feature import WorkspaceFeature
from jupiter_webapi_client.models.workspace_set_feature_args import (
    WorkspaceSetFeatureArgs,
)
from playwright.sync_api import Page, ViewportSize, expect

from itests.helpers import get_parsed_from_response, wait_for_hydration

_WIDE: ViewportSize = {"width": 1400, "height": 900}
_WIDEST: ViewportSize = {"width": 1920, "height": 900}
_PHONE: ViewportSize = {"width": 390, "height": 800}
_PROPERTIES = "#habit-properties-section"


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
    def _create_habit(name: str) -> Habit:
        result = habit_create_sync(
            client=logged_in_client,
            body=HabitCreateArgs(
                name=name,
                period=RecurringTaskPeriod.DAILY,
                is_key=False,
                eisen=Eisen.REGULAR,
                difficulty=Difficulty.MEDIUM,
            ),
        )
        return get_parsed_from_response(HabitCreateResult, result).new_habit

    return _create_habit


def _open(page: Page, habit: Habit, viewport: ViewportSize = _WIDE) -> None:
    page.set_viewport_size(viewport)
    page.goto(f"/app/workspace/apps/habits/habits/{habit.ref_id}")
    wait_for_hydration(page)


def _column(page: Page, view: str):
    """The column a view of the habit's panel is in."""
    return page.locator(f"[data-strata-split='leaf-{view}']")


def test_history_opens_in_a_column_beside_the_habit(page: Page, create_habit) -> None:
    habit = create_habit("Habit with a history")
    _open(page, habit)

    page.locator("#leaf-entity-history").click()

    column = _column(page, "history")
    expect(column).to_be_visible()
    expect(column).to_contain_text("history", ignore_case=True)
    # The habit is still there, next to it, and the button says it is open.
    expect(page.locator(_PROPERTIES)).to_be_visible()
    expect(page.locator("#leaf-entity-history")).to_have_attribute(
        "aria-pressed", "true"
    )
    expect(page).to_have_url(re.compile(r"leaf-views%5Bsplit%5D=leaf-history"))


def test_escape_closes_the_view_and_goes_back_to_the_habit(
    page: Page, create_habit
) -> None:
    habit = create_habit("Habit with a history")
    _open(page, habit)
    page.locator("#leaf-entity-history").click()
    expect(_column(page, "history")).to_be_visible()

    page.keyboard.press("Escape")

    expect(_column(page, "history")).to_have_count(0)
    expect(page).not_to_have_url(re.compile(r"leaf-views"))
    expect(page.locator("#leaf-panel")).to_have_attribute("data-focused", "true")


def test_the_cross_in_the_view_closes_it(page: Page, create_habit) -> None:
    habit = create_habit("Habit with a history")
    _open(page, habit)
    page.locator("#leaf-entity-publish").click()
    column = _column(page, "publish")
    expect(column).to_be_visible()

    column.get_by_role("button", name="Close Publish", exact=True).click()

    expect(column).to_have_count(0)
    expect(page.locator("#leaf-entity-publish")).to_have_attribute(
        "aria-pressed", "false"
    )


def test_an_open_view_survives_a_reload(page: Page, create_habit) -> None:
    habit = create_habit("Habit with a view")
    _open(page, habit)
    page.locator("#leaf-entity-publish").click()
    expect(_column(page, "publish")).to_be_visible()

    page.reload()
    wait_for_hydration(page)

    expect(_column(page, "publish")).to_be_visible()
    expect(page.locator("#leaf-entity-publish")).to_have_attribute(
        "aria-pressed", "true"
    )


def test_views_can_be_open_together(page: Page, create_habit) -> None:
    habit = create_habit("Habit with two views")
    _open(page, habit, _WIDEST)

    page.locator("#leaf-entity-publish").click()
    page.locator("#leaf-entity-access").click()

    expect(_column(page, "publish")).to_be_visible()
    expect(_column(page, "access")).to_be_visible()
    expect(page.locator(_PROPERTIES)).to_be_visible()


def test_publishing_leaves_the_view_open(page: Page, create_habit) -> None:
    habit = create_habit("Habit to publish")
    _open(page, habit)
    page.locator("#leaf-entity-publish").click()
    column = _column(page, "publish")

    column.get_by_role("button", name="Publish", exact=True).click()

    # The action redirects to the same page. The column is still there, with
    # what publishing made: the button that moves it between draft and active.
    expect(column.locator("#Habit-publish-toggle-status")).to_be_visible()
    expect(column).to_be_visible()


def test_on_a_phone_a_view_takes_the_place_of_the_content(
    page: Page, create_habit
) -> None:
    habit = create_habit("Habit on a phone")
    _open(page, habit, _PHONE)

    page.locator("#leaf-entity-history").click()

    # No columns on a phone: the view is in the panel and the content is gone.
    expect(page.locator("[data-strata-split]")).to_have_count(0)
    expect(page.locator(_PROPERTIES)).to_be_hidden()

    # And only one at a time, as it always was.
    page.locator("#leaf-entity-publish").click()
    expect(page.locator("#leaf-entity-history")).to_have_attribute(
        "aria-pressed", "false"
    )
    expect(page.locator("#leaf-entity-publish")).to_have_attribute(
        "aria-pressed", "true"
    )

    page.locator("#leaf-entity-publish").click()
    expect(page.locator(_PROPERTIES)).to_be_visible()
