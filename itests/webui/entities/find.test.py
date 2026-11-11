"""Tests about find: `/` searches the text of the open columns."""

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

from itests.helpers import (
    get_parsed_from_response,
    type_entity_note_editor_and_wait_for_save,
    wait_for_hydration,
)

_WIDE: ViewportSize = {"width": 1400, "height": 900}
_FIND = "[data-strata-find]"
_NAME = '#habit-properties-section input[name="name"]'
_NOTE_SECTION = "#habit-note-section"
_NOTE_TEXT = "Alpha beta gamma delta epsilon zeta"


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


def _open(page: Page, habit: Habit) -> None:
    page.set_viewport_size(_WIDE)
    page.goto(f"/app/workspace/apps/habits/habits/{habit.ref_id}")
    wait_for_hydration(page)


def _marked(page: Page) -> int:
    """How many places the page has marked as matches."""
    marked = page.evaluate("() => CSS.highlights.get('strata-find')?.size ?? 0")
    assert isinstance(marked, int)
    return marked


def test_slash_opens_find_and_typing_marks_the_matches(
    page: Page, create_habit
) -> None:
    habit = create_habit("Zebra Crossing Practice")
    _open(page, habit)

    page.keyboard.press("/")
    bar = page.locator(_FIND)
    expect(bar).to_be_visible()
    expect(bar.get_by_role("textbox")).to_be_focused()
    # The slash opened it, it was not typed into it.
    expect(bar.get_by_role("textbox")).to_have_value("")

    page.keyboard.type("zebra")
    expect(bar).to_contain_text(re.compile(r"1/\d+"))
    assert _marked(page) > 0


def test_a_query_with_no_match_says_so(page: Page, create_habit) -> None:
    habit = create_habit("Zebra Crossing Practice")
    _open(page, habit)

    page.keyboard.press("/")
    page.keyboard.type("qzxjvw")

    expect(page.locator(_FIND)).to_contain_text("no matches")
    assert _marked(page) == 0


def test_escape_closes_find_and_clears_the_marks(page: Page, create_habit) -> None:
    habit = create_habit("Zebra Crossing Practice")
    _open(page, habit)

    page.keyboard.press("/")
    page.keyboard.type("zebra")
    page.keyboard.press("Escape")

    expect(page.locator(_FIND)).to_have_count(0)
    assert _marked(page) == 0
    # It was find that took the key, not the column, which stays open.
    expect(page).to_have_url(re.compile(rf"/habits/{habit.ref_id}$"))
    expect(page.locator("#leaf-panel")).to_be_visible()


def test_arrows_step_and_enter_goes_to_the_match_and_ends_the_search(
    page: Page, create_habit
) -> None:
    create_habit("Zebra One")
    habit = create_habit("Zebra Two")
    _open(page, habit)

    page.keyboard.press("/")
    page.keyboard.type("zebra")
    bar = page.locator(_FIND)
    expect(bar).to_contain_text(re.compile(r"1/\d+"))

    # The arrows step through the matches while the field is open.
    page.keyboard.press("ArrowDown")
    expect(bar).to_contain_text(re.compile(r"2/\d+"))
    page.keyboard.press("ArrowUp")
    expect(bar).to_contain_text(re.compile(r"1/\d+"))

    # Enter goes to the match, and the search is over: the field and the marks
    # are gone, and the keyboard is on the match, not in a field.
    page.keyboard.press("Enter")
    expect(bar).to_have_count(0)
    assert _marked(page) == 0
    expect(page.locator("a:focus")).to_have_count(1)

    # `/` starts a new search, with the last query there to be replaced.
    page.keyboard.press("/")
    expect(bar.get_by_role("textbox")).to_be_focused()
    expect(bar.get_by_role("textbox")).to_have_value("zebra")
    page.keyboard.type("two")
    expect(bar.get_by_role("textbox")).to_have_value("two")


def test_enter_on_a_match_follows_the_link_it_is_in(page: Page, create_habit) -> None:
    other = create_habit("Quokka Stretching")
    habit = create_habit("Walrus Lifting")
    _open(page, habit)

    page.keyboard.press("/")
    page.keyboard.type("quokka")
    page.keyboard.press("Enter")
    # The keyboard focus is on the link the match is in, so Enter follows it.
    page.keyboard.press("Enter")

    page.wait_for_url(re.compile(rf"/habits/{other.ref_id}$"))


def test_slash_is_just_a_character_in_a_field(page: Page, create_habit) -> None:
    habit = create_habit("Zebra Crossing Practice")
    _open(page, habit)

    page.locator(_NAME).click()
    page.keyboard.press("End")
    page.keyboard.press("/")

    expect(page.locator(_NAME)).to_have_value("Zebra Crossing Practice/")
    expect(page.locator(_FIND)).to_have_count(0)


def _write_a_note(page: Page, habit: Habit) -> Locator:
    """Gives the habit a note with some text in it; returns its editor."""
    _open(page, habit)
    page.get_by_role("button", name="Create Note").click()
    page.wait_for_url(re.compile(rf"/habits/{habit.ref_id}"))
    page.reload()
    wait_for_hydration(page)
    page.wait_for_selector("#entity-block-editor")
    type_entity_note_editor_and_wait_for_save(page, _NOTE_TEXT)
    editor = page.locator('#entity-block-editor [contenteditable="true"]').first
    expect(editor).to_have_text(_NOTE_TEXT)
    # Escape leaves the note, for the section it is in.
    page.keyboard.press("Escape")
    expect(page.locator(_NOTE_SECTION)).to_be_focused()
    return editor


def test_enter_on_a_note_section_starts_editing_at_the_end(
    page: Page, create_habit
) -> None:
    editor = _write_a_note(page, create_habit("Note Keys Habit"))

    page.keyboard.press("Enter")
    expect(editor).to_be_focused()
    # The Enter that went in was not typed into the note as a new line.
    expect(page.locator("#entity-block-editor .ce-block")).to_have_count(1)

    page.keyboard.type("!")
    expect(editor).to_have_text(_NOTE_TEXT + "!")


def test_enter_in_find_goes_into_the_note_at_the_match(
    page: Page, create_habit
) -> None:
    editor = _write_a_note(page, create_habit("Note Find Habit"))

    page.keyboard.press("/")
    page.keyboard.type("epsilon")
    page.keyboard.press("Enter")

    # The search is over, and the keyboard is in the note, at the match.
    expect(page.locator(_FIND)).to_have_count(0)
    expect(editor).to_be_focused()
    page.keyboard.type("X")
    expect(editor).to_have_text("Alpha beta gamma delta Xepsilon zeta")
