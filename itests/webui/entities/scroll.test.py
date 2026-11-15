"""Tests about going to the top and the bottom of a column: `⇧k` and `⇧j`, `Home`
and `End`, and a click on the title in the header of every kind of column (ADR
0021).
"""

import pytest
from jupiter_webapi_client.api.gen.gen_do import (
    sync_detailed as gen_do_sync,
)
from jupiter_webapi_client.api.habits.habit_create import (
    sync_detailed as habit_create_sync,
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
from jupiter_webapi_client.models.recurring_task_period import RecurringTaskPeriod
from jupiter_webapi_client.models.sync_target import SyncTarget
from jupiter_webapi_client.models.workspace_feature import WorkspaceFeature
from jupiter_webapi_client.models.workspace_set_feature_args import (
    WorkspaceSetFeatureArgs,
)
from playwright.sync_api import Page, ViewportSize, expect

from itests.helpers import get_parsed_from_response, wait_for_hydration

_WIDE: ViewportSize = {"width": 1400, "height": 900}
_HABITS = "/app/workspace/apps/habits/habits"
_SPLIT = "habit-inbox-tasks"
_DETAIL = "#leaf-panel"
_DETAIL_BODY = "#leaf-panel-content"
_SPLIT_BODY = f"#split-panel-{_SPLIT} [data-strata-split-host]"
# Room to scroll in every column, however little is in it.
_FILLER = "[data-strata-scroll]::after { content: ''; display: block; height: 3000px; }"


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
def habit_for_scroll(
    logged_in_client: AuthenticatedClient, _enable_habits_feature
) -> Habit:
    """A habit with an inbox task, so its Inbox Tasks section holds items and can be
    split out, in a page with a stack of sections beside the list of habits.
    """
    habit = get_parsed_from_response(
        HabitCreateResult,
        habit_create_sync(
            client=logged_in_client,
            body=HabitCreateArgs(
                name="Habit for scrolling",
                period=RecurringTaskPeriod.DAILY,
                is_key=False,
                eisen=Eisen.REGULAR,
                difficulty=Difficulty.MEDIUM,
            ),
        ),
    ).new_habit
    gen_result = gen_do_sync(
        client=logged_in_client,
        body=GenDoArgs(
            gen_even_if_not_modified=True,
            today="2026-09-06",
            gen_targets=[SyncTarget.HABITS],
            period=[RecurringTaskPeriod.DAILY],
            filter_habit_ref_ids=[habit.ref_id],
        ),
    )
    assert gen_result.status_code == 200
    return habit


def _open(page: Page, habit: Habit) -> None:
    """The habit with its inbox tasks split out, and room to scroll in each column."""
    page.set_viewport_size(_WIDE)
    page.goto(f"{_HABITS}/{habit.ref_id}?habit%5Bsplit%5D={_SPLIT}")
    wait_for_hydration(page)
    expect(page.locator(f"#split-panel-{_SPLIT}")).to_be_visible()
    expect(page.locator(_DETAIL)).to_have_attribute("data-focused", "true")
    page.add_style_tag(content=_FILLER)


def _at_top(page: Page, selector: str) -> None:
    page.wait_for_function(
        "(sel) => document.querySelector(sel).scrollTop === 0", arg=selector
    )


def _at_bottom(page: Page, selector: str) -> None:
    page.wait_for_function(
        """(sel) => {
            const e = document.querySelector(sel);
            return e.scrollTop > 0 && e.scrollTop + e.clientHeight >= e.scrollHeight - 1;
        }""",
        arg=selector,
    )


def test_no_header_has_buttons_to_the_top_and_the_bottom(
    page: Page, habit_for_scroll: Habit
) -> None:
    _open(page, habit_for_scroll)

    # A trunk, a leaf and a section split out into a column: the title is what
    # takes a column to the top, and `End` to the bottom, so no buttons.
    for header in (
        "#trunk-panel-controls",
        "#leaf-panel-controls",
        f"#split-panel-controls-{_SPLIT}",
    ):
        expect(page.locator(f"{header} [data-strata-scroll-button]")).to_have_count(0)
        expect(page.locator(f"{header} [data-strata-title]")).to_have_count(1)


def test_a_click_on_the_title_goes_to_the_top_of_the_column(
    page: Page, habit_for_scroll: Habit
) -> None:
    _open(page, habit_for_scroll)

    page.keyboard.press("End")
    _at_bottom(page, _DETAIL_BODY)
    expect(page.locator("#leaf-panel-controls [data-strata-title]")).to_have_attribute(
        "title", "Scroll to the top"
    )
    page.locator("#leaf-panel-controls [data-strata-title]").click()

    _at_top(page, _DETAIL_BODY)


def test_shift_j_and_shift_k_go_to_the_bottom_and_the_top_of_the_focused_column(
    page: Page, habit_for_scroll: Habit
) -> None:
    _open(page, habit_for_scroll)

    page.keyboard.press("Shift+J")
    _at_bottom(page, _DETAIL_BODY)
    page.keyboard.press("Shift+K")
    _at_top(page, _DETAIL_BODY)


def test_end_and_home_go_to_the_bottom_and_the_top_of_the_focused_column(
    page: Page, habit_for_scroll: Habit
) -> None:
    _open(page, habit_for_scroll)

    page.keyboard.press("End")
    _at_bottom(page, _DETAIL_BODY)
    page.keyboard.press("Home")
    _at_top(page, _DETAIL_BODY)


def test_the_keys_work_in_a_split_column_too(
    page: Page, habit_for_scroll: Habit
) -> None:
    _open(page, habit_for_scroll)

    # The split is the column after the leaf: `l` focuses it.
    page.keyboard.press("l")
    expect(page.locator(f"#split-panel-{_SPLIT}")).to_have_attribute(
        "data-focused", "true"
    )

    page.keyboard.press("Shift+J")
    _at_bottom(page, _SPLIT_BODY)
    # Only the focused column moved.
    _at_top(page, _DETAIL_BODY)

    page.keyboard.press("Shift+K")
    _at_top(page, _SPLIT_BODY)


def test_the_title_of_a_split_column_scrolls_it_to_the_top(
    page: Page, habit_for_scroll: Habit
) -> None:
    _open(page, habit_for_scroll)
    title = page.locator(f"#split-panel-controls-{_SPLIT} [data-strata-title]")

    page.keyboard.press("l")
    expect(page.locator(f"#split-panel-{_SPLIT}")).to_have_attribute(
        "data-focused", "true"
    )
    page.keyboard.press("End")
    _at_bottom(page, _SPLIT_BODY)

    title.click()

    _at_top(page, _SPLIT_BODY)


def test_the_footer_lists_them_for_a_column_that_scrolls(
    page: Page, habit_for_scroll: Habit
) -> None:
    _open(page, habit_for_scroll)
    # The footer looks again when the window changes size, which is also what
    # the room added above does to what a column holds.
    page.evaluate("window.dispatchEvent(new Event('resize'))")

    entry = page.locator("#strata-footer [data-strata-footer-key='top bottom']")
    expect(entry).to_be_visible()
    expect(entry.locator("kbd")).to_have_text(["⇧k", "⇧j"])


def test_shift_j_in_a_field_is_typing(page: Page, habit_for_scroll: Habit) -> None:
    _open(page, habit_for_scroll)
    name = page.locator('#habit-properties-section input[name="name"]')

    name.click()
    page.keyboard.press("Shift+J")

    expect(name).to_have_value("Habit for scrollingJ")
    _at_top(page, _DETAIL_BODY)
