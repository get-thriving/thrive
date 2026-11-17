"""Tests about the header of a column: the parts it is made of, which of them
only the focused column shows, and the `⋯` menu (ADR 0021).
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
_TRUNK = "#trunk-panel-controls"
_LEAF = "#leaf-panel-controls"


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
def habit_for_headers(
    logged_in_client: AuthenticatedClient, _enable_habits_feature
) -> Habit:
    result = habit_create_sync(
        client=logged_in_client,
        body=HabitCreateArgs(
            name="Habit for headers",
            period=RecurringTaskPeriod.DAILY,
            is_key=False,
            eisen=Eisen.REGULAR,
            difficulty=Difficulty.MEDIUM,
        ),
    )
    return get_parsed_from_response(HabitCreateResult, result).new_habit


def _open(page: Page, habit: Habit) -> None:
    page.set_viewport_size(_WIDE)
    page.goto(f"/app/workspace/apps/habits/habits/{habit.ref_id}")
    wait_for_hydration(page)
    expect(page.locator("#leaf-panel")).to_have_attribute("data-focused", "true")


def test_a_column_is_titled_with_its_subject(
    page: Page, habit_for_headers: Habit
) -> None:
    _open(page, habit_for_headers)

    expect(page.locator(f"{_TRUNK} [data-strata-title]")).to_have_text("Habits")
    expect(page.locator(f"{_LEAF} [data-strata-title]")).to_have_text(
        f"Habit #{habit_for_headers.ref_id}"
    )


def test_only_the_focused_column_has_the_count_and_every_one_the_menu(
    page: Page, habit_for_headers: Habit
) -> None:
    _open(page, habit_for_headers)

    # The leaf has the focus: the list has no count, but both have a menu.
    expect(page.locator(f"{_LEAF} [data-strata-menu]")).to_have_count(1)
    expect(page.locator(f"{_TRUNK} [data-strata-count]")).to_have_count(0)

    page.locator("#strata-column-map button").nth(0).click()
    expect(page.locator("#trunk-panel")).to_have_attribute("data-focused", "true")

    expect(page.locator(f"{_TRUNK} [data-strata-count]")).to_have_count(1)
    # The leaf keeps its menu, though it no longer has the focus.
    expect(page.locator(f"{_LEAF} [data-strata-menu]")).to_have_count(1)
    # The close control stays, so a mouse user can always close a column.
    expect(page.locator(f"{_LEAF} [data-strata-close]")).to_have_count(1)


def test_clicking_a_title_selects_its_column(
    page: Page, habit_for_headers: Habit
) -> None:
    _open(page, habit_for_headers)
    expect(page.locator(f"{_TRUNK} [data-strata-count]")).to_have_count(0)

    page.locator(f"{_TRUNK} [data-strata-title]").click()

    # As moving there with the keyboard does: it has the focus, and its count
    # shows.
    expect(page.locator("#trunk-panel")).to_have_attribute("data-focused", "true")
    expect(page.locator(f"{_TRUNK} [data-strata-count]")).to_have_count(1)


def test_clicking_the_empty_part_of_a_header_selects_its_column(
    page: Page, habit_for_headers: Habit
) -> None:
    _open(page, habit_for_headers)
    expect(page.locator("#trunk-panel")).not_to_have_attribute("data-focused", "true")

    header = page.locator(_TRUNK)
    box = header.bounding_box()
    assert box is not None
    # Past the title and the count, before the buttons: nothing is there.
    header.click(position={"x": box["width"] * 0.6, "y": box["height"] / 2})

    expect(page.locator("#trunk-panel")).to_have_attribute("data-focused", "true")
    expect(page.locator(f"{_TRUNK} [data-strata-count]")).to_have_count(1)


def test_clicking_the_header_of_the_leaf_gives_it_back_its_menu(
    page: Page, habit_for_headers: Habit
) -> None:
    _open(page, habit_for_headers)
    page.locator("#strata-column-map button").nth(0).click()
    expect(page.locator(f"{_LEAF} [data-strata-menu]")).to_have_count(0)

    page.locator(f"{_LEAF} [data-strata-title]").click()

    expect(page.locator("#leaf-panel")).to_have_attribute("data-focused", "true")
    expect(page.locator(f"{_LEAF} [data-strata-menu]")).to_have_count(1)


def test_the_trunk_cannot_be_closed(page: Page, habit_for_headers: Habit) -> None:
    _open(page, habit_for_headers)

    page.locator("#strata-column-map button").nth(0).click()

    expect(page.locator(f"{_TRUNK} [data-strata-close]")).to_have_count(0)


def test_archive_is_in_the_menu_and_not_in_the_header(
    page: Page, habit_for_headers: Habit
) -> None:
    _open(page, habit_for_headers)

    expect(page.locator(f"{_LEAF} button#leaf-entity-archive")).to_have_count(0)
    page.locator(f"{_LEAF} [data-strata-menu]").click()
    entry = page.locator("li[id='leaf-entity-archive']")
    expect(entry).to_have_text("Archive…")

    entry.click()

    # The same dialog as before. It is left without archiving anything.
    confirm = page.locator("button[id='leaf-entity-archive-confirm']")
    expect(confirm).to_be_visible()
    expect(confirm).to_have_attribute("value", "archive")
    page.keyboard.press("Escape")
    expect(confirm).to_have_count(0)
    expect(page.locator("#leaf-panel")).to_be_visible()


def test_the_menu_lists_the_views_then_archive_and_delete(
    page: Page, habit_for_headers: Habit
) -> None:
    _open(page, habit_for_headers)

    page.locator(f"{_LEAF} [data-strata-menu]").click()

    entries = page.locator("#leaf-panel-controls-menu-list li[role='menuitem']")
    expect(entries).to_have_text(
        ["History", "Publish", "Access", "Archive…", "Delete permanently…"]
    )
    # A live habit can be archived, and deleted only once it has been.
    expect(page.locator("li[id='leaf-entity-archive']")).not_to_have_attribute(
        "aria-disabled", "true"
    )
    expect(page.locator("li[id='leaf-entity-remove']")).to_have_attribute(
        "aria-disabled", "true"
    )


def test_dot_opens_the_menu_of_the_focused_column(
    page: Page, habit_for_headers: Habit
) -> None:
    _open(page, habit_for_headers)
    url = page.url

    page.keyboard.press(".")

    menu = page.locator("#leaf-panel-controls-menu-list")
    expect(menu).to_be_visible()
    expect(menu.locator("li[id='leaf-entity-archive']")).to_be_visible()

    # `Escape` closes the menu first, and leaves the column open.
    page.keyboard.press("Escape")
    expect(menu).to_have_count(0)
    expect(page.locator("#leaf-panel")).to_be_visible()
    assert page.url == url


def test_dot_does_nothing_in_a_field(page: Page, habit_for_headers: Habit) -> None:
    _open(page, habit_for_headers)
    name = page.locator('#habit-properties-section input[name="name"]')

    name.click()
    page.keyboard.type(".")

    expect(name).to_have_value("Habit for headers.")
    expect(page.locator("#leaf-panel-controls-menu-list")).to_have_count(0)


def test_the_footer_lists_the_menu_and_the_close(
    page: Page, habit_for_headers: Habit
) -> None:
    _open(page, habit_for_headers)
    # The footer looks again when the window changes size.
    page.evaluate("window.dispatchEvent(new Event('resize'))")

    menu = page.locator("#strata-footer [data-strata-footer-key='menu']")
    expect(menu).to_be_visible()
    expect(menu.locator("kbd")).to_have_text(["."])
    expect(
        page.locator("#strata-footer [data-strata-footer-key='close']")
    ).to_be_visible()

    # The list is the focused column now, which cannot be closed.
    page.locator("#strata-column-map button").nth(0).click()
    expect(page.locator("#trunk-panel")).to_have_attribute("data-focused", "true")
    expect(
        page.locator("#strata-footer [data-strata-footer-key='close']")
    ).to_have_count(0)
    expect(page).to_have_url(re.compile(r"/habits/habits"))


def test_a_column_alone_on_the_screen_is_shown_as_selected(page: Page) -> None:
    page.set_viewport_size(_WIDE)
    page.goto("/app/workspace/apps/habits/habits")
    wait_for_hydration(page)

    # It is not "focused", as there is nothing to choose from, but it looks
    # selected: the amber line and the amber title, as a focused column's.
    trunk = page.locator("#trunk-panel")
    expect(trunk).to_have_attribute("data-alone", "true")
    expect(trunk).not_to_have_attribute("data-focused", "true")
    expect(page.locator(f"{_TRUNK} [data-strata-title]")).to_have_css(
        "color", "rgb(240, 180, 60)"
    )


def test_a_full_column_alone_is_not_shown_as_selected(page: Page) -> None:
    page.set_viewport_size(_WIDE)
    page.goto("/app/workspace")
    wait_for_hydration(page)

    # It fills the screen anyway, so there is nothing to single out.
    expect(page.locator("[data-strata-column][data-alone='true']")).to_have_count(0)


def test_a_column_that_is_no_entity_is_named_for_its_route(page: Page) -> None:
    page.set_viewport_size(_WIDE)
    page.goto("/app/workspace/apps/habits/habits/new")
    wait_for_hydration(page)

    # A page that makes an item is no entity, so it has no kind and number; it
    # is named what its route calls it, and not just "Detail".
    expect(page.locator(f"{_LEAF} [data-strata-title]")).to_contain_text(
        re.compile("new habit", re.IGNORECASE)
    )
    expect(page.locator(f"{_LEAF} [data-strata-title]")).not_to_contain_text(
        re.compile("detail", re.IGNORECASE)
    )
