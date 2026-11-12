"""Tests about the map of the columns: `a` draws them with their sections, and a
label jumps to one (ADR 0021).
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
from playwright.sync_api import Locator, Page, ViewportSize, expect

from itests.helpers import get_parsed_from_response, wait_for_hydration

_WIDE: ViewportSize = {"width": 1400, "height": 900}
_NARROW: ViewportSize = {"width": 1000, "height": 700}
_HABITS = "/app/workspace/apps/habits/habits"
_MAP = "[data-strata-map]"
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
def habit_for_map(
    logged_in_client: AuthenticatedClient, _enable_habits_feature
) -> Habit:
    """A habit, whose page has a stack of sections beside the list of habits."""
    return get_parsed_from_response(
        HabitCreateResult,
        habit_create_sync(
            client=logged_in_client,
            body=HabitCreateArgs(
                name="Habit for the map",
                period=RecurringTaskPeriod.DAILY,
                is_key=False,
                eisen=Eisen.REGULAR,
                difficulty=Difficulty.MEDIUM,
            ),
        ),
    ).new_habit


def _open(page: Page, habit: Habit, query: str = "") -> None:
    page.set_viewport_size(_WIDE)
    page.goto(f"{_HABITS}/{habit.ref_id}{query}")
    wait_for_hydration(page)
    page.wait_for_selector("#habit-streak")
    # The keys act on the column that has the focus; the page opens with the
    # deepest one focused.
    expect(page.locator(_DETAIL)).to_have_attribute("data-focused", "true")


def _entry(page: Page, name: str) -> Locator:
    return page.locator(_MAP).get_by_role("button", name=name)


def _label_of(entry: Locator) -> str:
    """The letters the map shows on an entry, read from the chip."""
    label = entry.locator("[data-strata-map-label]").get_attribute(
        "data-strata-map-label"
    )
    assert isinstance(label, str), "the entry has no label"
    return label


def _type_label(page: Page, entry: Locator) -> None:
    for letter in _label_of(entry):
        page.keyboard.press(letter)


def _focused_section(page: Page) -> str:
    """The id of the section that has the keyboard focus, or empty for none."""
    return str(page.evaluate("document.activeElement?.dataset?.strataSection ?? ''"))


def test_a_draws_the_columns_with_their_sections(
    page: Page, habit_for_map: Habit
) -> None:
    _open(page, habit_for_map)

    page.keyboard.press("a")

    expect(page.locator(_MAP)).to_be_visible()
    expect(
        page.get_by_role("dialog", name="Jump to a column or section")
    ).to_be_visible()
    expect(_entry(page, "Go to the list column")).to_be_visible()
    expect(_entry(page, "Go to the detail column")).to_be_visible()
    for title in ("Properties", "Streak", "Inbox Tasks"):
        expect(_entry(page, f"Go to the {title} section")).to_be_visible()

    # Every entry has a label of its own.
    labels = page.locator("[data-strata-map-label]").evaluate_all(
        "(chips) => chips.map((chip) => chip.dataset.strataMapLabel)"
    )
    assert len(labels) == len(set(labels)) >= 5


def test_escape_leaves_the_map_and_keeps_the_column(
    page: Page, habit_for_map: Habit
) -> None:
    _open(page, habit_for_map)

    page.keyboard.press("a")
    expect(page.locator(_MAP)).to_be_visible()
    page.keyboard.press("Escape")

    expect(page.locator(_MAP)).to_have_count(0)
    # It is the map's `Escape`, not the one that closes the column.
    expect(page).to_have_url(re.compile(rf"{_HABITS}/\d+"))
    expect(page.locator(_DETAIL)).to_be_visible()


def test_a_label_goes_to_a_section_and_j_goes_on_from_it(
    page: Page, habit_for_map: Habit
) -> None:
    _open(page, habit_for_map)

    page.keyboard.press("a")
    _type_label(page, _entry(page, "Go to the Streak section"))

    expect(page.locator(_MAP)).to_have_count(0)
    expect(page.locator("#habit-streak")).to_be_focused()

    # The jump left the keyboard where `j` and `k` take it on from.
    page.keyboard.press("j")
    expect(page.locator("#habit-streak")).not_to_be_focused()
    assert _focused_section(page) not in ("", "habit-streak")


def test_a_label_goes_to_a_column_from_another(
    page: Page, habit_for_map: Habit
) -> None:
    _open(page, habit_for_map)

    page.keyboard.press("a")
    _type_label(page, _entry(page, "Go to the list column"))

    expect(page.locator(_MAP)).to_have_count(0)
    expect(page.locator(_TRUNK)).to_have_attribute("data-focused", "true")
    expect(page.locator(_TRUNK)).to_be_focused()


def test_a_click_goes_there_too(page: Page, habit_for_map: Habit) -> None:
    _open(page, habit_for_map)

    page.keyboard.press("a")
    _entry(page, "Go to the Inbox Tasks section").click()

    expect(page.locator(_MAP)).to_have_count(0)
    expect(page.locator("#habit-inbox-tasks")).to_be_focused()


def test_a_click_outside_leaves_the_map(page: Page, habit_for_map: Habit) -> None:
    _open(page, habit_for_map)

    page.keyboard.press("a")
    expect(page.locator(_MAP)).to_be_visible()
    # The dimmed window around the map, in a corner.
    page.mouse.click(5, 5)

    expect(page.locator(_MAP)).to_have_count(0)


def test_the_map_and_hint_mode_leave_each_other_alone(
    page: Page, habit_for_map: Habit
) -> None:
    _open(page, habit_for_map)

    # In the map `s` is a label, not hint mode: the first one, which is the
    # first column's.
    page.keyboard.press("a")
    page.keyboard.press("s")
    expect(page.locator("[data-strata-hints]")).to_have_count(0)
    expect(page.locator(_MAP)).to_have_count(0)
    expect(page.locator(_TRUNK)).to_have_attribute("data-focused", "true")

    # In hint mode `a` is a letter, not the map.
    _open(page, habit_for_map)
    page.keyboard.press("s")
    expect(page.locator("[data-strata-hints]")).to_be_visible()
    page.keyboard.press("a")
    expect(page.locator(_MAP)).to_have_count(0)
    page.keyboard.press("Escape")
    expect(page.locator("[data-strata-hints]")).to_have_count(0)


def test_a_field_keeps_a_for_typing(page: Page) -> None:
    page.set_viewport_size(_WIDE)
    page.goto(f"{_HABITS}/new")
    wait_for_hydration(page)
    name = page.get_by_label("Name")
    name.focus()

    page.keyboard.type("a")

    expect(page.locator(_MAP)).to_have_count(0)
    expect(name).to_have_value("a")


def test_a_split_is_a_column_of_its_own_in_the_map(
    page: Page, habit_for_map: Habit
) -> None:
    _open(page, habit_for_map)
    page.locator("#habit-inbox-tasks").focus()
    page.keyboard.press("c")
    column = page.locator("[data-strata-split='habit-inbox-tasks']")
    expect(column).to_be_visible()
    expect(column).to_have_attribute("data-focused", "true")

    page.keyboard.press("a")

    # The section is the column, so the habit's column does not list it too.
    expect(_entry(page, "Go to the Inbox Tasks column")).to_be_visible()
    expect(_entry(page, "Go to the Inbox Tasks section")).to_have_count(0)
    expect(_entry(page, "Go to the Streak section")).to_be_visible()

    # And its label focuses the column.
    _type_label(page, _entry(page, "Go to the Inbox Tasks column"))
    expect(column).to_have_attribute("data-focused", "true")


def test_a_label_brings_in_a_section_of_a_column_that_was_a_peek(
    page: Page, habit_for_map: Habit
) -> None:
    page.set_viewport_size(_NARROW)
    page.goto(f"{_HABITS}/{habit_for_map.ref_id}?habit%5Bsplit%5D=habit-inbox-tasks")
    wait_for_hydration(page)
    expect(page.locator("[data-strata-split='habit-inbox-tasks']")).to_be_visible()

    # With the list focused there is no room for the habit's column whole: it is
    # a peek, which a section can't take the keyboard focus in.
    page.keyboard.press("a")
    _type_label(page, _entry(page, "Go to the list column"))
    expect(page.locator(_TRUNK)).to_have_attribute("data-focused", "true")
    expect(page.locator(_DETAIL)).to_have_attribute("data-peek", "true")

    page.keyboard.press("a")
    _type_label(page, _entry(page, "Go to the Streak section"))

    # The column came in whole first, and then the section took the focus.
    expect(page.locator(_DETAIL)).to_have_attribute("data-focused", "true")
    expect(page.locator(_DETAIL)).not_to_have_attribute("data-peek", "true")
    expect(page.locator("#habit-streak")).to_be_focused()
