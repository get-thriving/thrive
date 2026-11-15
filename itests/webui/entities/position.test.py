"""Tests about the place of an open item in its list: `12/63` in its header, the
buttons and the keys `o` and `p` that go to the item before and after it, and the
list's `j` and `k`, which take the open item along (ADR 0021).
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
_PHONE: ViewportSize = {"width": 390, "height": 800}
_HABITS = "/app/workspace/apps/habits/habits"
_POSITION = "#leaf-panel-controls [data-strata-position]"
_PREVIOUS = "#leaf-panel-controls [data-strata-position-previous]"
_NEXT = "#leaf-panel-controls [data-strata-position-next]"


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
def habits_for_position(
    logged_in_client: AuthenticatedClient, _enable_habits_feature
) -> list[Habit]:
    habits = []
    for name in ("Habit one", "Habit two", "Habit three"):
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
        habits.append(get_parsed_from_response(HabitCreateResult, result).new_habit)
    return habits


def _open(page: Page, habit: Habit, query: str = "") -> None:
    page.set_viewport_size(_WIDE)
    page.goto(f"{_HABITS}/{habit.ref_id}{query}")
    wait_for_hydration(page)
    expect(page.locator("#leaf-panel")).to_have_attribute("data-focused", "true")


def _list(page: Page) -> list[str]:
    """The habits of the list, as paths, in the order it shows them."""
    paths: list[str] = page.locator("#trunk-panel").evaluate(
        """(trunk) => Array.from(trunk.querySelectorAll('[data-strata-item]'))
            .filter((item) => item.closest('[data-strata-column]') === trunk)
            .map((item) => item.querySelector('a[href]'))
            .filter((link) => link !== null)
            .map((link) => new URL(link.href).pathname)
            .filter((path) => /\\/habits\\/habits\\/\\d+$/.test(path))"""
    )
    return paths


def _at(page: Page, habit_or_path: Habit | str) -> int:
    path = (
        habit_or_path
        if isinstance(habit_or_path, str)
        else f"{_HABITS}/{habit_or_path.ref_id}"
    )
    return _list(page).index(path)


def test_an_item_says_its_place_in_its_list(
    page: Page, habits_for_position: list[Habit]
) -> None:
    habit = habits_for_position[1]
    _open(page, habit)

    paths = _list(page)
    expect(page.locator(_POSITION)).to_have_text(f"{_at(page, habit) + 1}/{len(paths)}")


def test_the_place_is_of_the_focused_column_only(
    page: Page, habits_for_position: list[Habit]
) -> None:
    _open(page, habits_for_position[0])
    expect(page.locator(_POSITION)).to_be_visible()

    page.locator("#strata-column-map button").nth(0).click()
    expect(page.locator("#trunk-panel")).to_have_attribute("data-focused", "true")

    expect(page.locator(_POSITION)).to_have_count(0)


def test_the_buttons_go_to_the_item_before_and_after(
    page: Page, habits_for_position: list[Habit]
) -> None:
    habit = habits_for_position[1]
    _open(page, habit)
    paths = _list(page)
    here = _at(page, habit)
    assert 0 < here < len(paths) - 1 or len(paths) < 3

    if here < len(paths) - 1:
        page.locator(_NEXT).click()
        expect(page).to_have_url(re.compile(re.escape(paths[here + 1]) + r"(\?.*)?$"))
        expect(page.locator(_POSITION)).to_have_text(f"{here + 2}/{len(paths)}")

        page.locator(_PREVIOUS).click()
        expect(page).to_have_url(re.compile(re.escape(paths[here]) + r"(\?.*)?$"))
        expect(page.locator(_POSITION)).to_have_text(f"{here + 1}/{len(paths)}")


def test_the_keys_do_the_same(page: Page, habits_for_position: list[Habit]) -> None:
    habit = habits_for_position[1]
    _open(page, habit)
    paths = _list(page)
    here = _at(page, habit)
    if here >= len(paths) - 1:
        pytest.skip("nothing after it to go to")

    page.keyboard.press("p")
    expect(page).to_have_url(re.compile(re.escape(paths[here + 1]) + r"(\?.*)?$"))

    page.keyboard.press("o")
    expect(page).to_have_url(re.compile(re.escape(paths[here]) + r"(\?.*)?$"))


def test_the_first_has_no_previous_and_the_last_has_no_next(
    page: Page, habits_for_position: list[Habit]
) -> None:
    _open(page, habits_for_position[0])
    paths = _list(page)

    page.goto(paths[0])
    wait_for_hydration(page)
    expect(page.locator(_PREVIOUS)).to_be_disabled()
    expect(page.locator(_NEXT)).to_be_enabled()

    page.goto(paths[-1])
    wait_for_hydration(page)
    expect(page.locator(_NEXT)).to_be_disabled()
    expect(page.locator(_PREVIOUS)).to_be_enabled()
    # The key does nothing there, rather than wrap round.
    page.keyboard.press("p")
    expect(page).to_have_url(re.compile(re.escape(paths[-1]) + r"(\?.*)?$"))


def test_what_is_collapsed_and_split_stays_when_going_along(
    page: Page, habits_for_position: list[Habit]
) -> None:
    habit = habits_for_position[0]
    _open(page, habit, "?habit%5Bcollapsed%5D=habit-streak")
    paths = _list(page)
    here = _at(page, habit)
    if here >= len(paths) - 1:
        pytest.skip("nothing after it to go to")

    page.locator(_NEXT).click()

    expect(page).to_have_url(re.compile(re.escape(paths[here + 1])))
    expect(page).to_have_url(re.compile(r"collapsed%5D=habit-streak"))


def test_going_along_replaces_the_item_in_the_history(
    page: Page, habits_for_position: list[Habit]
) -> None:
    habit = habits_for_position[0]
    _open(page, habit)
    paths = _list(page)
    here = _at(page, habit)
    if here >= len(paths) - 1:
        pytest.skip("nothing after it to go to")

    page.locator(_NEXT).click()
    expect(page).to_have_url(re.compile(re.escape(paths[here + 1]) + r"(\?.*)?$"))

    # It took the place of the one it came from, so back does not return to it.
    page.go_back()
    expect(page).not_to_have_url(re.compile(re.escape(paths[here]) + r"(\?.*)?$"))


def test_the_footer_lists_the_brackets_on_such_an_item(
    page: Page, habits_for_position: list[Habit]
) -> None:
    _open(page, habits_for_position[0])
    page.evaluate("window.dispatchEvent(new Event('resize'))")

    entry = page.locator("#strata-footer [data-strata-footer-key='prev next']")
    expect(entry).to_be_visible()
    expect(entry.locator("kbd")).to_have_text(["[", "]"])


def test_a_page_with_no_list_has_no_place(page: Page) -> None:
    page.set_viewport_size(_WIDE)
    page.goto("/app/workspace")
    wait_for_hydration(page)

    expect(page.locator("[data-strata-position]")).to_have_count(0)


def _selected_path(page: Page) -> str | None:
    """The path of the list item that has the keyboard focus, if one has."""
    path: str | None = page.evaluate(
        """() => {
            const item = document.activeElement?.closest('[data-strata-item]');
            const link = item?.querySelector('a[href]');
            return link ? new URL(link.href).pathname : null;
        }"""
    )
    return path


def test_the_list_takes_the_open_item_along_with_j(
    page: Page, habits_for_position: list[Habit]
) -> None:
    # Open the last habit of the list, then go down the list from the top to the
    # first: the open item is the one the selection is on, wherever it stops.
    _open(page, habits_for_position[0])
    paths = _list(page)
    page.goto(paths[-1])
    wait_for_hydration(page)
    expect(page.locator("#leaf-panel")).to_have_attribute("data-focused", "true")

    page.locator("#strata-column-map button").nth(0).click()
    expect(page.locator("#trunk-panel")).to_have_attribute("data-focused", "true")

    for _ in range(300):
        page.keyboard.press("j")
        if _selected_path(page) == paths[0]:
            break
    assert _selected_path(page) == paths[0]

    # The open item followed, and the list kept the focus.
    expect(page).to_have_url(re.compile(re.escape(paths[0]) + r"(\?.*)?$"))
    expect(page.locator("#trunk-panel")).to_have_attribute("data-focused", "true")


def test_the_list_opens_nothing_with_j_when_no_item_is_open(page: Page) -> None:
    page.set_viewport_size(_WIDE)
    page.goto(_HABITS)
    wait_for_hydration(page)
    url = page.url

    page.keyboard.press("j")
    page.keyboard.press("j")

    # `j` goes through the items, and `↵` is what opens one.
    assert page.url == url
    expect(page.locator("#leaf-panel")).to_have_count(0)


def test_a_phone_has_no_place(page: Page, habits_for_position: list[Habit]) -> None:
    page.set_viewport_size(_PHONE)
    page.goto(f"{_HABITS}/{habits_for_position[0].ref_id}")
    wait_for_hydration(page)

    expect(page.locator("[data-strata-position]")).to_have_count(0)
