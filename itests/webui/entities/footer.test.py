"""Tests about the footer: the strip along the bottom with the keys that work
right now (ADR 0021).
"""

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
from playwright.sync_api import Locator, Page, ViewportSize, expect

from itests.helpers import get_parsed_from_response, wait_for_hydration

_WIDE: ViewportSize = {"width": 1400, "height": 900}
_PHONE: ViewportSize = {"width": 390, "height": 800}
_HABITS = "/app/workspace/apps/habits/habits"
_FOOTER = "#strata-footer"
_TRUNK = "#trunk-panel"
_DETAIL = "#leaf-panel"


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
def habit_for_footer(
    logged_in_client: AuthenticatedClient, _enable_habits_feature
) -> Habit:
    """A habit, whose page has a stack of sections beside the list of habits."""
    return get_parsed_from_response(
        HabitCreateResult,
        habit_create_sync(
            client=logged_in_client,
            body=HabitCreateArgs(
                name="Habit for the footer",
                period=RecurringTaskPeriod.DAILY,
                is_key=False,
                eisen=Eisen.REGULAR,
                difficulty=Difficulty.MEDIUM,
            ),
        ),
    ).new_habit


def _open(page: Page, habit: Habit) -> None:
    page.set_viewport_size(_WIDE)
    page.goto(f"{_HABITS}/{habit.ref_id}")
    wait_for_hydration(page)
    page.wait_for_selector("#habit-streak")
    # The keys act on the column that has the focus; the page opens with the
    # deepest one focused.
    expect(page.locator(_DETAIL)).to_have_attribute("data-focused", "true")


def _key(page: Page, label: str) -> Locator:
    """The footer's entry for what a key does, such as `go in` or `fold back`."""
    return page.locator(f"{_FOOTER} [data-strata-footer-key='{label}']")


def test_the_footer_lists_the_keys_of_the_focused_column(
    page: Page, habit_for_footer: Habit
) -> None:
    _open(page, habit_for_footer)

    footer = page.locator(_FOOTER)
    expect(footer).to_be_visible()
    for label in (
        "columns",
        "sections",
        "collapse",
        "split",
        "hints",
        "map",
        "find",
        "close",
    ):
        expect(_key(page, label)).to_be_visible()
    # Nothing has the focus inside a section yet, so there is nothing to go in.
    expect(_key(page, "go in")).to_have_count(0)
    # The `h` and `l` chips, one for each key.
    expect(_key(page, "columns").locator("kbd")).to_have_text(["h", "l"])


def test_the_columns_end_above_the_footer(page: Page, habit_for_footer: Habit) -> None:
    _open(page, habit_for_footer)

    footer_top = page.locator(_FOOTER).bounding_box()
    assert footer_top is not None
    for column in (_TRUNK, _DETAIL):
        box = page.locator(column).bounding_box()
        assert box is not None
        assert box["y"] + box["height"] <= footer_top["y"] + 0.5


def test_the_footer_follows_the_focus_into_a_section(
    page: Page, habit_for_footer: Habit
) -> None:
    _open(page, habit_for_footer)

    page.keyboard.press("j")

    expect(page.locator("[data-strata-section]:focus")).to_have_count(1)
    expect(_key(page, "go in")).to_be_visible()
    expect(_key(page, "sections")).to_be_visible()


def test_the_footer_follows_the_focus_onto_an_item_and_back(
    page: Page, habit_for_footer: Habit
) -> None:
    _open(page, habit_for_footer)

    # The list column has no sections: its keys go into its list.
    page.keyboard.press("h")
    expect(page.locator(_TRUNK)).to_have_attribute("data-focused", "true")
    expect(_key(page, "items")).to_be_visible()
    expect(_key(page, "sections")).to_have_count(0)
    expect(_key(page, "open")).to_have_count(0)

    page.keyboard.press("j")
    expect(page.locator(f"{_TRUNK} [data-strata-item]:focus")).to_have_count(1)
    expect(_key(page, "open")).to_be_visible()
    expect(_key(page, "back")).to_be_visible()
    expect(_key(page, "close")).to_have_count(0)

    page.keyboard.press("Escape")
    expect(_key(page, "back")).to_have_count(0)
    expect(_key(page, "close")).to_be_visible()


def test_the_footer_says_how_to_use_and_leave_the_modes_that_hold_the_keys(
    page: Page, habit_for_footer: Habit
) -> None:
    _open(page, habit_for_footer)

    page.keyboard.press("s")
    expect(page.locator("[data-strata-hints]")).to_be_visible()
    expect(_key(page, "type a label to click it")).to_be_visible()
    expect(_key(page, "cancel")).to_be_visible()
    expect(_key(page, "sections")).to_have_count(0)
    page.keyboard.press("Escape")
    expect(_key(page, "sections")).to_be_visible()

    page.keyboard.press("a")
    expect(page.locator("[data-strata-map]")).to_be_visible()
    expect(_key(page, "type a label to jump there")).to_be_visible()
    expect(_key(page, "cancel")).to_be_visible()
    page.keyboard.press("Escape")
    expect(_key(page, "sections")).to_be_visible()

    page.keyboard.press("f")
    expect(page.locator("[data-strata-find]")).to_be_visible()
    expect(_key(page, "type to search")).to_be_visible()
    expect(_key(page, "go to it")).to_be_visible()
    page.keyboard.press("Escape")
    expect(_key(page, "sections")).to_be_visible()


def test_a_field_leaves_only_the_key_that_leaves_it(page: Page) -> None:
    page.set_viewport_size(_WIDE)
    page.goto(f"{_HABITS}/new")
    wait_for_hydration(page)

    page.get_by_label("Name").focus()

    expect(_key(page, "leave the field")).to_be_visible()
    expect(page.locator(f"{_FOOTER} [data-strata-footer-key]")).to_have_count(1)

    page.keyboard.press("Escape")
    expect(_key(page, "leave the field")).to_have_count(0)
    expect(_key(page, "hints")).to_be_visible()


def test_a_split_column_offers_folding_it_back(
    page: Page, habit_for_footer: Habit
) -> None:
    _open(page, habit_for_footer)
    page.locator("#habit-inbox-tasks").focus()
    page.keyboard.press("c")
    column = page.locator("[data-strata-split='habit-inbox-tasks']")
    expect(column).to_have_attribute("data-focused", "true")

    expect(_key(page, "fold back")).to_be_visible()
    # A split is one section: there is no stack in it to collapse or split.
    expect(_key(page, "collapse")).to_have_count(0)
    expect(_key(page, "split")).to_have_count(0)

    page.keyboard.press("Shift+C")
    expect(column).to_have_count(0)
    expect(_key(page, "fold back")).to_have_count(0)
    expect(_key(page, "collapse")).to_be_visible()


def test_a_phone_has_no_footer(page: Page, habit_for_footer: Habit) -> None:
    page.set_viewport_size(_PHONE)
    page.goto(f"{_HABITS}/{habit_for_footer.ref_id}")
    wait_for_hydration(page)

    expect(page.locator(_FOOTER)).to_have_count(0)
