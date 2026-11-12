"""Tests about going through the items of a list with the keyboard.

`e` on a section goes into its list, `j` and `k` move between the items, `↵`
opens one and `Escape` goes back up to the section. A list that is a column's
own, such as a trunk's, is gone through the same way, from the column (ADR 0021).
"""

import re

import pytest
from jupiter_webapi_client.api.gen.gen_do import (
    sync_detailed as gen_do_sync,
)
from jupiter_webapi_client.api.habits.habit_create import (
    sync_detailed as habit_create_sync,
)
from jupiter_webapi_client.api.habits.habit_load import (
    sync_detailed as habit_load_sync,
)
from jupiter_webapi_client.api.test_helper.workspace_set_feature import (
    sync_detailed as workspace_set_feature_sync,
)
from jupiter_webapi_client.client import AuthenticatedClient
from jupiter_webapi_client.models.difficulty import Difficulty
from jupiter_webapi_client.models.eisen import Eisen
from jupiter_webapi_client.models.gen_do_args import GenDoArgs
from jupiter_webapi_client.models.habit import Habit
from jupiter_webapi_client.models.habit_create_args import HabitCreateArgs
from jupiter_webapi_client.models.habit_create_result import HabitCreateResult
from jupiter_webapi_client.models.habit_load_args import HabitLoadArgs
from jupiter_webapi_client.models.habit_load_result import HabitLoadResult
from jupiter_webapi_client.models.recurring_task_period import RecurringTaskPeriod
from jupiter_webapi_client.models.sync_target import SyncTarget
from jupiter_webapi_client.models.workspace_feature import WorkspaceFeature
from jupiter_webapi_client.models.workspace_set_feature_args import (
    WorkspaceSetFeatureArgs,
)
from playwright.sync_api import Page, ViewportSize, expect

from itests.helpers import get_parsed_from_response, wait_for_hydration

_WIDE: ViewportSize = {"width": 1400, "height": 900}
_SECTION = "#habit-inbox-tasks"
_TRUNK = "#trunk-panel"
_HABITS = "/app/workspace/apps/habits/habits"


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
def habit_with_inbox_tasks(
    logged_in_client: AuthenticatedClient, _enable_habits_feature
) -> tuple[Habit, list[str]]:
    """A habit with two inbox tasks, as the section of the habit shows them."""
    habit = get_parsed_from_response(
        HabitCreateResult,
        habit_create_sync(
            client=logged_in_client,
            body=HabitCreateArgs(
                name="Habit with items",
                period=RecurringTaskPeriod.DAILY,
                is_key=False,
                eisen=Eisen.REGULAR,
                difficulty=Difficulty.MEDIUM,
            ),
        ),
    ).new_habit

    for today in ("2026-09-06", "2026-09-07"):
        gen_result = gen_do_sync(
            client=logged_in_client,
            body=GenDoArgs(
                gen_even_if_not_modified=True,
                today=today,
                gen_targets=[SyncTarget.HABITS],
                period=[RecurringTaskPeriod.DAILY],
                filter_habit_ref_ids=[habit.ref_id],
            ),
        )
        assert gen_result.status_code == 200

    loaded = get_parsed_from_response(
        HabitLoadResult,
        habit_load_sync(
            client=logged_in_client,
            body=HabitLoadArgs(ref_id=habit.ref_id, allow_archived=False),
        ),
    )
    assert len(loaded.inbox_tasks) >= 2
    return habit, [str(task.ref_id) for task in loaded.inbox_tasks]


@pytest.fixture(autouse=True, scope="module")
def another_habit(logged_in_client: AuthenticatedClient, _enable_habits_feature):
    """A second habit, so the list of habits has more than one item."""
    return get_parsed_from_response(
        HabitCreateResult,
        habit_create_sync(
            client=logged_in_client,
            body=HabitCreateArgs(
                name="Another habit with items",
                period=RecurringTaskPeriod.DAILY,
                is_key=False,
                eisen=Eisen.REGULAR,
                difficulty=Difficulty.MEDIUM,
            ),
        ),
    ).new_habit


def _open(page: Page, habit: Habit) -> None:
    page.set_viewport_size(_WIDE)
    page.goto(f"/app/workspace/apps/habits/habits/{habit.ref_id}")
    wait_for_hydration(page)
    page.wait_for_selector(_SECTION)
    # The keys act on the column that has the focus, from the section itself.
    page.locator(_SECTION).focus()


def _focused_id(page: Page) -> str:
    return str(page.evaluate("document.activeElement?.id ?? ''"))


def _items(page: Page, scope: str = _SECTION) -> list[str]:
    """The ids of the items of the section, in the order they are shown."""
    ids = page.evaluate(
        """(selector) => Array.from(
            document.querySelector(selector).querySelectorAll('[data-strata-item]')
        ).map((el) => el.id)""",
        scope,
    )
    return [str(item_id) for item_id in ids]


def test_e_goes_into_the_list_at_its_first_item(
    page: Page, habit_with_inbox_tasks
) -> None:
    habit, _ = habit_with_inbox_tasks
    _open(page, habit)
    items = _items(page)
    assert len(items) >= 2

    page.keyboard.press("e")

    expect(page.locator(f"#{items[0]}")).to_be_focused()
    # The item with the focus is marked by a line on its left.
    expect(page.locator(f"#{items[0]}")).to_have_css("box-shadow", re.compile(r"inset"))


def test_j_and_k_move_between_the_items_and_stop_at_the_ends(
    page: Page, habit_with_inbox_tasks
) -> None:
    habit, _ = habit_with_inbox_tasks
    _open(page, habit)
    items = _items(page)
    last = len(items) - 1

    page.keyboard.press("e")
    expect(page.locator(f"#{items[0]}")).to_be_focused()

    # `k` at the first item stays on it, and does not leave the list.
    page.keyboard.press("k")
    expect(page.locator(f"#{items[0]}")).to_be_focused()

    for index in range(1, last + 1):
        page.keyboard.press("j")
        expect(page.locator(f"#{items[index]}")).to_be_focused()

    # `j` at the last item stays on it, and does not go on to another section.
    page.keyboard.press("j")
    expect(page.locator(f"#{items[last]}")).to_be_focused()

    page.keyboard.press("k")
    expect(page.locator(f"#{items[last - 1]}")).to_be_focused()


def test_enter_opens_the_item_with_the_focus(
    page: Page, habit_with_inbox_tasks
) -> None:
    habit, _ = habit_with_inbox_tasks
    _open(page, habit)
    items = _items(page)

    page.keyboard.press("e")
    page.keyboard.press("j")
    expect(page.locator(f"#{items[1]}")).to_be_focused()
    page.keyboard.press("Enter")

    ref_id = items[1].removeprefix("inbox-task-")
    page.wait_for_url(re.compile(rf"/app/workspace/core/inbox-tasks/{ref_id}"))


def test_enter_on_the_section_opens_its_first_item(
    page: Page, habit_with_inbox_tasks
) -> None:
    habit, _ = habit_with_inbox_tasks
    _open(page, habit)
    items = _items(page)

    page.keyboard.press("Enter")

    ref_id = items[0].removeprefix("inbox-task-")
    page.wait_for_url(re.compile(rf"/app/workspace/core/inbox-tasks/{ref_id}"))


def test_escape_goes_back_up_to_the_section_and_keeps_the_column(
    page: Page, habit_with_inbox_tasks
) -> None:
    habit, _ = habit_with_inbox_tasks
    _open(page, habit)
    items = _items(page)

    page.keyboard.press("e")
    page.keyboard.press("j")
    expect(page.locator(f"#{items[1]}")).to_be_focused()
    page.keyboard.press("Escape")

    expect(page.locator(_SECTION)).to_be_focused()
    # The column is still open, and the page has not moved.
    expect(page.locator("#leaf-panel")).to_be_visible()
    assert page.url.endswith(f"/habits/{habit.ref_id}")

    # The keys of a stack work again from the section: `e` goes in once more.
    page.keyboard.press("e")
    expect(page.locator(f"#{items[0]}")).to_be_focused()


def test_a_split_column_goes_through_its_items_too(
    page: Page, habit_with_inbox_tasks
) -> None:
    habit, _ = habit_with_inbox_tasks
    _open(page, habit)
    items = _items(page)

    page.keyboard.press("c")
    column = page.locator("[data-strata-split='habit-inbox-tasks']")
    expect(column).to_be_visible()
    expect(column).to_have_attribute("data-focused", "true")

    # The column holds the section, which has no focus of its own: `j` goes in
    # from the first item, and then moves on.
    page.keyboard.press("j")
    expect(page.locator(f"#{items[0]}")).to_be_focused()
    page.keyboard.press("j")
    expect(page.locator(f"#{items[1]}")).to_be_focused()

    # `Escape` goes back up to the column, which stays where it is.
    page.keyboard.press("Escape")
    expect(column).to_be_visible()
    expect(column).to_have_attribute("data-focused", "true")
    assert _focused_id(page) != items[1]


def _open_list(page: Page) -> None:
    """The list of habits, the only column on screen, with nothing focused."""
    page.set_viewport_size(_WIDE)
    page.goto(_HABITS)
    wait_for_hydration(page)
    page.wait_for_selector(_TRUNK)
    page.evaluate("document.activeElement?.blur()")


def test_a_list_with_no_sections_is_gone_into_with_e(
    page: Page, another_habit, habit_with_inbox_tasks
) -> None:
    _open_list(page)
    items = _items(page, _TRUNK)
    assert len(items) >= 2

    page.keyboard.press("e")

    expect(page.locator(f"#{items[0]}")).to_be_focused()


def test_j_and_k_go_in_from_the_ends_of_a_list_with_no_sections(
    page: Page, another_habit, habit_with_inbox_tasks
) -> None:
    _open_list(page)
    items = _items(page, _TRUNK)
    assert len(items) >= 2

    # `k` goes in from the end of the list, and `j` moves on from there; both
    # stop at the ends.
    page.keyboard.press("k")
    expect(page.locator(f"#{items[-1]}")).to_be_focused()
    page.keyboard.press("j")
    expect(page.locator(f"#{items[-1]}")).to_be_focused()
    page.keyboard.press("k")
    expect(page.locator(f"#{items[-2]}")).to_be_focused()

    page.keyboard.press("Escape")
    expect(page.locator(_TRUNK)).to_be_focused()
    page.keyboard.press("j")
    expect(page.locator(f"#{items[0]}")).to_be_focused()


def test_enter_opens_an_item_of_a_list_and_escape_closes_what_opened(
    page: Page, another_habit, habit_with_inbox_tasks
) -> None:
    _open_list(page)
    items = _items(page, _TRUNK)

    page.keyboard.press("e")
    expect(page.locator(f"#{items[0]}")).to_be_focused()
    page.keyboard.press("Enter")

    ref_id = items[0].removeprefix("habit-")
    page.wait_for_url(re.compile(rf"{_HABITS}/{ref_id}"))
    expect(page.locator("#leaf-panel")).to_be_visible()

    # The item still has the browser's focus, but the layout's is on the leaf
    # that opened: `Escape` closes it, rather than going up in the list.
    page.keyboard.press("Escape")
    page.wait_for_url(re.compile(rf"{_HABITS}(\?.*)?$"))
    expect(page.locator("#leaf-panel")).to_have_count(0)


def test_the_list_of_a_column_that_is_not_alone_is_gone_into_once_focused(
    page: Page, another_habit, habit_with_inbox_tasks
) -> None:
    habit, _ = habit_with_inbox_tasks
    _open_list(page)
    items = _items(page, _TRUNK)
    page.goto(f"{_HABITS}/{habit.ref_id}")
    wait_for_hydration(page)
    page.wait_for_selector("#leaf-panel")
    page.evaluate("document.activeElement?.blur()")

    # With the habit's column focused the keys are its own, not the list's.
    page.keyboard.press("e")
    expect(page.locator(_TRUNK).locator("[data-strata-item]:focus")).to_have_count(0)

    # `h` moves the focus to the list, whose keys then work.
    page.keyboard.press("h")
    expect(page.locator(_TRUNK)).to_have_attribute("data-focused", "true")
    page.keyboard.press("j")
    expect(page.locator(f"#{items[0]}")).to_be_focused()
