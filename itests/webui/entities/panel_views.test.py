"""Tests about the views of a panel: its history, publishing and access.

Each is a command of the panel's ``⋯`` menu and opens as a column beside the
panel when there is room, and in place of the panel's content on a phone.
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

from itests.helpers import (
    click_column_menu_entry,
    get_parsed_from_response,
    open_column_menu,
    wait_for_hydration,
)

_WIDE: ViewportSize = {"width": 1400, "height": 900}
_WIDEST: ViewportSize = {"width": 1920, "height": 900}
_PHONE: ViewportSize = {"width": 390, "height": 800}
_PROPERTIES = "#habit-properties-section"
_LEAF_HEADER = "leaf-panel-controls"


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


def _column(page: Page, view: str) -> Locator:
    """The column a view of the habit's panel is in."""
    return page.locator(f"[data-strata-split='leaf-{view}']")


def _focus_leaf(page: Page) -> None:
    """Give the habit's panel the focus, which its menu needs to be there."""
    page.locator("#leaf-panel").click(position={"x": 5, "y": 5})
    expect(page.locator("#leaf-panel")).to_have_attribute("data-focused", "true")


def _choose(page: Page, view: str) -> None:
    """Choose a view in the menu of the habit's panel."""
    _focus_leaf(page)
    click_column_menu_entry(page, _LEAF_HEADER, f"leaf-entity-{view}-entry")


def _entry_label(page: Page, view: str) -> str:
    """What the menu of the habit's panel says for a view, then close it."""
    _focus_leaf(page)
    open_column_menu(page, _LEAF_HEADER)
    label = page.locator(f"li[id='leaf-entity-{view}-entry']").inner_text()
    page.keyboard.press("Escape")
    expect(page.locator(f"#{_LEAF_HEADER}-menu-list")).to_be_hidden()
    return label


def test_the_header_has_no_buttons_for_the_views(page: Page, create_habit) -> None:
    habit = create_habit("Habit without buttons")
    _open(page, habit)

    for view in ("history", "publish", "access"):
        expect(
            page.locator(f"#{_LEAF_HEADER} button#leaf-entity-{view}")
        ).to_have_count(0)


def test_the_habit_has_no_sections_for_them(page: Page, create_habit) -> None:
    habit = create_habit("Habit without sections")
    _open(page, habit)

    ids = page.locator("#leaf-panel [data-strata-section]").evaluate_all(
        "els => els.map((el) => el.id)"
    )
    assert "leaf-entity-history" not in ids
    assert "leaf-entity-publish" not in ids


def test_the_menu_lists_the_views(page: Page, create_habit) -> None:
    habit = create_habit("Habit with a menu")
    _open(page, habit)
    _focus_leaf(page)

    open_column_menu(page, _LEAF_HEADER)

    entries = page.locator(f"#{_LEAF_HEADER}-menu-list li[role='menuitem']")
    expect(entries.nth(0)).to_have_text("History")
    expect(entries.nth(1)).to_have_text("Publish")
    expect(entries.nth(2)).to_have_text("Access")


def test_history_opens_in_a_column_beside_the_habit(page: Page, create_habit) -> None:
    habit = create_habit("Habit with a history")
    _open(page, habit)

    _choose(page, "history")

    column = _column(page, "history")
    expect(column).to_be_visible()
    expect(column).to_contain_text("history", ignore_case=True)
    # The habit is still there, next to it, and the menu says it is open.
    expect(page.locator(_PROPERTIES)).to_be_visible()
    expect(page).to_have_url(re.compile(r"leaf-views%5Bsplit%5D=leaf-history"))
    assert _entry_label(page, "history") == "Close History"


def test_choosing_a_view_again_closes_it(page: Page, create_habit) -> None:
    habit = create_habit("Habit with a view to close")
    _open(page, habit)
    _choose(page, "publish")
    expect(_column(page, "publish")).to_be_visible()

    _choose(page, "publish")

    expect(_column(page, "publish")).to_have_count(0)
    expect(page).not_to_have_url(re.compile(r"leaf-views"))


def test_escape_closes_the_view_and_goes_back_to_the_habit(
    page: Page, create_habit
) -> None:
    habit = create_habit("Habit with a history")
    _open(page, habit)
    _choose(page, "history")
    expect(_column(page, "history")).to_be_visible()

    page.keyboard.press("Escape")

    expect(_column(page, "history")).to_have_count(0)
    expect(page).not_to_have_url(re.compile(r"leaf-views"))
    expect(page.locator("#leaf-panel")).to_have_attribute("data-focused", "true")


def test_the_cross_in_the_view_is_at_the_right_end_like_the_leafs(
    page: Page, create_habit
) -> None:
    habit = create_habit("Habit with a cross")
    _open(page, habit)
    _choose(page, "publish")
    column = _column(page, "publish")
    expect(column).to_be_visible()

    # The same button as in the leaf's header: the last one, against the right
    # edge, with the same room after it.
    cross = column.locator("[data-strata-close]")
    expect(cross.locator("[data-testid='CloseIcon']")).to_have_count(1)
    expect(column.locator("[data-strata-header] button").last).to_have_attribute(
        "data-strata-close", ""
    )

    def room_after(header: str, button: str) -> float:
        header_box = page.locator(header).bounding_box()
        button_box = page.locator(button).bounding_box()
        assert header_box is not None
        assert button_box is not None
        return (
            header_box["x"]
            + header_box["width"]
            - button_box["x"]
            - button_box["width"]
        )

    view_room = room_after(
        "[data-strata-split='leaf-publish'] [data-strata-header]",
        "[data-strata-split='leaf-publish'] [data-strata-close]",
    )
    leaf_room = room_after(
        f"#{_LEAF_HEADER}",
        f"#{_LEAF_HEADER} [data-strata-close]",
    )
    assert abs(view_room - leaf_room) < 1.5


def test_the_cross_in_the_view_closes_it(page: Page, create_habit) -> None:
    habit = create_habit("Habit with a cross to close")
    _open(page, habit)
    _choose(page, "publish")
    column = _column(page, "publish")
    expect(column).to_be_visible()

    column.get_by_role("button", name="Close Publish", exact=True).click()

    expect(column).to_have_count(0)


def test_an_open_view_survives_a_reload(page: Page, create_habit) -> None:
    habit = create_habit("Habit with a view")
    _open(page, habit)
    _choose(page, "publish")
    expect(_column(page, "publish")).to_be_visible()

    page.reload()
    wait_for_hydration(page)

    expect(_column(page, "publish")).to_be_visible()


def test_views_can_be_open_together(page: Page, create_habit) -> None:
    habit = create_habit("Habit with two views")
    _open(page, habit, _WIDEST)

    _choose(page, "publish")
    _choose(page, "access")

    expect(_column(page, "publish")).to_be_visible()
    expect(_column(page, "access")).to_be_visible()
    expect(page.locator(_PROPERTIES)).to_be_visible()


def test_publishing_leaves_the_view_open_and_shows_the_chip(
    page: Page, create_habit
) -> None:
    habit = create_habit("Habit to publish")
    _open(page, habit)
    _choose(page, "publish")
    column = _column(page, "publish")

    column.get_by_role("button", name="Publish", exact=True).click()

    # The action redirects to the same page. The column is still there, with
    # what publishing made: the button that moves it between draft and active.
    expect(column.locator("#Habit-publish-toggle-status")).to_be_visible()
    expect(column).to_be_visible()
    # The header says so, in every column, and no longer needs the menu.
    chip = page.locator(f"#{_LEAF_HEADER} [data-strata-chip='published']")
    expect(chip).to_have_text(re.compile("published"))


def test_the_chip_opens_the_view_that_says_more(page: Page, create_habit) -> None:
    habit = create_habit("Habit with a chip")
    _open(page, habit)
    _choose(page, "publish")
    _column(page, "publish").get_by_role("button", name="Publish", exact=True).click()
    chip = page.locator(f"#{_LEAF_HEADER} [data-strata-chip='published']")
    expect(chip).to_be_visible()
    _column(page, "publish").get_by_role(
        "button", name="Close Publish", exact=True
    ).click()
    expect(_column(page, "publish")).to_have_count(0)

    chip.click()

    expect(_column(page, "publish")).to_be_visible()


def test_on_a_phone_a_view_takes_the_place_of_the_content(
    page: Page, create_habit
) -> None:
    habit = create_habit("Habit on a phone")
    _open(page, habit, _PHONE)

    # The views are entries of the menu on a phone too, not buttons of the header.
    for view in ("history", "publish", "access"):
        expect(
            page.locator(f"#{_LEAF_HEADER} button#leaf-entity-{view}")
        ).to_have_count(0)

    _choose(page, "history")

    # No columns on a phone: the view is in the panel and the content is gone.
    expect(page.locator("[data-strata-split]")).to_have_count(0)
    expect(page.locator(_PROPERTIES)).to_be_hidden()

    # And only one at a time, as it always was.
    _choose(page, "publish")
    assert _entry_label(page, "history") == "History"
    assert _entry_label(page, "publish") == "Close Publish"

    _choose(page, "publish")
    expect(page.locator(_PROPERTIES)).to_be_visible()
