"""Tests about the path in the top bar: the labels the routes supply."""

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
_LONG_NAME = "A habit with a name that is much too long to fit in the path of the bar"


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


def _crumbs(page: Page) -> list[str]:
    path = page.get_by_role("navigation", name="Path")
    return [
        (crumb.get_attribute("title") or "")
        for crumb in path.locator("[title]:not([data-split])").all()
    ]


def test_the_path_of_a_habit_has_its_name_and_the_app_once(
    page: Page, logged_in_client: AuthenticatedClient
) -> None:
    habit = _create_habit(logged_in_client, "Buy milk")
    page.set_viewport_size(_WIDE)
    page.goto(f"{_HABITS}/{habit.ref_id}")
    wait_for_hydration(page)

    # The app and its list do not repeat, and the id is the name.
    assert _crumbs(page) == ["Habits", "Buy milk"]


def test_the_last_part_is_the_current_page(
    page: Page, logged_in_client: AuthenticatedClient
) -> None:
    habit = _create_habit(logged_in_client, "Current Habit")
    page.set_viewport_size(_WIDE)
    page.goto(f"{_HABITS}/{habit.ref_id}")
    wait_for_hydration(page)

    path = page.get_by_role("navigation", name="Path")
    expect(path.locator('[aria-current="page"]')).to_have_count(1)
    expect(path.locator('[aria-current="page"]')).to_have_text("Current Habit")


def test_a_new_page_says_what_it_makes(page: Page) -> None:
    page.set_viewport_size(_WIDE)
    page.goto(f"{_HABITS}/new")
    wait_for_hydration(page)

    assert _crumbs(page) == ["Habits", "New habit"]


def test_a_long_name_is_cut_short_but_whole_in_its_title(
    page: Page, logged_in_client: AuthenticatedClient
) -> None:
    habit = _create_habit(logged_in_client, _LONG_NAME)
    page.set_viewport_size(_WIDE)
    page.goto(f"{_HABITS}/{habit.ref_id}")
    wait_for_hydration(page)

    last = page.get_by_role("navigation", name="Path").locator('[aria-current="page"]')
    expect(last).to_have_attribute("title", _LONG_NAME)
    # What shows is narrower than the name would be: the text is cut with an
    # ellipsis, not wrapped and not pushing the bar's other items off it.
    is_cut = last.evaluate("(node) => node.scrollWidth > node.clientWidth")
    assert is_cut


def test_a_part_of_the_path_focuses_the_column_it_belongs_to(
    page: Page, logged_in_client: AuthenticatedClient
) -> None:
    habit = _create_habit(logged_in_client, "Focus Habit")
    page.set_viewport_size(_WIDE)
    page.goto(f"{_HABITS}/{habit.ref_id}")
    wait_for_hydration(page)

    path = page.get_by_role("navigation", name="Path")
    path.get_by_role("button", name="Habits", exact=True).click()
    expect(page.locator("#trunk-panel")).to_have_attribute("data-focused", "true")

    path.get_by_role("button", name="Focus Habit", exact=True).click()
    expect(page.locator("#leaf-panel")).to_have_attribute("data-focused", "true")


def test_the_phone_names_the_page_after_the_last_label(
    page: Page, logged_in_client: AuthenticatedClient
) -> None:
    habit = _create_habit(logged_in_client, "Phone Habit")
    page.set_viewport_size(_PHONE)
    page.goto(f"{_HABITS}/{habit.ref_id}")
    wait_for_hydration(page)

    expect(page.locator("#strata-phone-title")).to_have_text("Phone Habit")
