"""Tests about the controls in the headers of columns and of sections."""

from jupiter_webapi_client.api.habits.habit_create import (
    sync_detailed as habit_create_sync,
)
from jupiter_webapi_client.client import AuthenticatedClient
from jupiter_webapi_client.models.difficulty import Difficulty
from jupiter_webapi_client.models.eisen import Eisen
from jupiter_webapi_client.models.habit import Habit
from jupiter_webapi_client.models.habit_create_args import HabitCreateArgs
from jupiter_webapi_client.models.habit_create_result import HabitCreateResult
from jupiter_webapi_client.models.recurring_task_period import RecurringTaskPeriod
from playwright.sync_api import Page, ViewportSize, expect

from itests.helpers import get_parsed_from_response, wait_for_hydration

_WIDE: ViewportSize = {"width": 1920, "height": 1000}
_PHONE: ViewportSize = {"width": 390, "height": 844}
_HABITS = "/app/workspace/apps/habits/habits"
# The height of a small button, in px (`strataSize.controlSmall`).
_SMALL = 24
# The row of the header of a column, and of a section (`strataSize.columnHeader`).
_COLUMN_HEADER = 36


def _create_habit(client: AuthenticatedClient, name: str) -> Habit:
    result = habit_create_sync(
        client=client,
        body=HabitCreateArgs(
            name=name,
            period=RecurringTaskPeriod.DAILY,
            is_key=False,
            eisen=Eisen.REGULAR,
            difficulty=Difficulty.MEDIUM,
        ),
    )
    return get_parsed_from_response(HabitCreateResult, result).new_habit


def test_the_buttons_of_a_section_are_small(
    page: Page, logged_in_client: AuthenticatedClient
) -> None:
    habit = _create_habit(logged_in_client, "Small Buttons")
    page.set_viewport_size(_WIDE)
    page.goto(f"{_HABITS}/{habit.ref_id}")
    wait_for_hydration(page)

    save = page.locator("#leaf-panel #habit-update")
    expect(save).to_be_visible()
    box = save.bounding_box()
    assert box is not None
    assert box["height"] <= _SMALL

    # The first section's controls are in the header of the column, which is
    # the height of its row, not of a button that does not fit it.
    expect(page.locator("#leaf-panel-controls #habit-update")).to_be_visible()
    column_header_box = page.locator("#leaf-panel-controls").bounding_box()
    assert column_header_box is not None
    assert column_header_box["height"] <= _COLUMN_HEADER

    # The header of the other sections is the same row.
    header = page.locator("#leaf-panel [data-strata-section-header]").first
    header_box = header.bounding_box()
    assert header_box is not None
    assert header_box["height"] <= _COLUMN_HEADER


def test_the_filters_of_a_list_are_in_its_header(page: Page) -> None:
    page.set_viewport_size(_WIDE)
    page.goto(_HABITS)
    wait_for_hydration(page)

    # In the header, with the title, and not in a row of their own under it.
    header = page.locator("#trunk-panel [data-strata-header]")
    expect(header.locator("[data-strata-bar-controls]")).to_have_count(1)
    expect(page.locator("#trunk-panel [data-strata-toolbar]")).to_have_count(0)


def test_filters_that_do_not_fit_fold_into_the_menu(page: Page) -> None:
    page.set_viewport_size(_PHONE)
    page.goto(_HABITS)
    wait_for_hydration(page)

    header = page.locator("#trunk-panel [data-strata-header]")
    # No second button for them: the one of the header is the menu of the column.
    expect(header.get_by_role("button", name="More actions")).to_have_count(0)
    # The first control stays.
    expect(header.get_by_role("link", name="New")).to_be_visible()
    header.get_by_role("button", name="Menu").click()
    # They are entries like the others of the menu, before the commands of the
    # column, and a filter opens its choices under it.
    menu = page.get_by_role("menu")
    expect(menu.get_by_role("menuitem", name="Groups")).to_be_visible()
    menu.get_by_role("menuitem", name="Groups").click()
    expect(menu.get_by_role("menuitem", name="Show all")).to_be_visible()


def test_controls_that_partly_fit_are_spread_out_and_the_rest_fold(
    page: Page,
) -> None:
    page.set_viewport_size(_WIDE)
    page.goto(_HABITS)
    wait_for_hydration(page)

    header = page.locator("#trunk-panel [data-strata-header]")
    # The first ones are in the bar, and only the last ones are in the menu.
    expect(header.get_by_role("link", name="New")).to_be_visible()
    expect(header.get_by_role("combobox", name="Grouping")).to_be_visible()
    expect(header.get_by_role("button", name="More actions")).to_have_count(0)
    expect(header.get_by_role("button", name="Menu")).to_be_visible()
