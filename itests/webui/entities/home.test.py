"""Tests about home tabs and widgets."""

import re

import pytest
from jupiter_webapi_client.api.habits.habit_create import (
    sync_detailed as habit_create_sync,
)
from jupiter_webapi_client.api.home.home_tab_create import (
    sync_detailed as home_tab_create_sync,
)
from jupiter_webapi_client.api.home.home_widget_create import (
    sync_detailed as home_widget_create_sync,
)
from jupiter_webapi_client.api.home.home_widget_load import (
    sync_detailed as home_widget_load_sync,
)
from jupiter_webapi_client.client import AuthenticatedClient
from jupiter_webapi_client.models.difficulty import Difficulty
from jupiter_webapi_client.models.eisen import Eisen
from jupiter_webapi_client.models.habit import Habit
from jupiter_webapi_client.models.habit_create_args import HabitCreateArgs
from jupiter_webapi_client.models.habit_create_result import HabitCreateResult
from jupiter_webapi_client.models.home_tab import HomeTab
from jupiter_webapi_client.models.home_tab_create_args import HomeTabCreateArgs
from jupiter_webapi_client.models.home_tab_create_result import HomeTabCreateResult
from jupiter_webapi_client.models.home_tab_target import HomeTabTarget
from jupiter_webapi_client.models.home_widget import HomeWidget
from jupiter_webapi_client.models.home_widget_create_args import HomeWidgetCreateArgs
from jupiter_webapi_client.models.home_widget_create_result import (
    HomeWidgetCreateResult,
)
from jupiter_webapi_client.models.home_widget_load_args import HomeWidgetLoadArgs
from jupiter_webapi_client.models.home_widget_load_result import HomeWidgetLoadResult
from jupiter_webapi_client.models.key_habits_streaks_home_widget_properties import (
    KeyHabitsStreaksHomeWidgetProperties,
)
from jupiter_webapi_client.models.recurring_task_period import RecurringTaskPeriod
from jupiter_webapi_client.models.widget_dimension import WidgetDimension
from jupiter_webapi_client.models.widget_type import WidgetType
from playwright.sync_api import Page, expect

from itests.helpers import get_parsed_from_response
from itests.webui.entities.conftest import AnotherUserAndWorkspace


@pytest.fixture()
def create_home_tab(logged_in_client: AuthenticatedClient):
    def _create(name: str = "ACL Tab") -> HomeTab:
        result = home_tab_create_sync(
            client=logged_in_client,
            body=HomeTabCreateArgs(
                target=HomeTabTarget.BIG_SCREEN,
                name=name,
            ),
        )
        return get_parsed_from_response(HomeTabCreateResult, result).new_home_tab

    return _create


@pytest.fixture()
def create_home_widget(logged_in_client: AuthenticatedClient):
    def _create(
        home_tab_ref_id: str,
        the_type: WidgetType = WidgetType.MOTD,
        row: int = 0,
    ) -> HomeWidget:
        result = home_widget_create_sync(
            client=logged_in_client,
            body=HomeWidgetCreateArgs(
                home_tab_ref_id=home_tab_ref_id,
                the_type=the_type,
                row=row,
                col=0,
                dimension=WidgetDimension.DIM_1X1,
                properties=None,
            ),
        )
        return get_parsed_from_response(HomeWidgetCreateResult, result).new_widget

    return _create


@pytest.fixture()
def create_habit(logged_in_client: AuthenticatedClient):
    def _create(name: str) -> Habit:
        result = habit_create_sync(
            client=logged_in_client,
            body=HabitCreateArgs(
                name=name,
                period=RecurringTaskPeriod.WEEKLY,
                is_key=False,
                eisen=Eisen.REGULAR,
                difficulty=Difficulty.EASY,
            ),
        )
        return get_parsed_from_response(HabitCreateResult, result).new_habit

    return _create


def test_webui_home_tab_acl(
    page: Page,
    create_home_tab,
    another_user_and_workspace: AnotherUserAndWorkspace,
) -> None:
    tab = create_home_tab("ACL Tab")
    other_user = another_user_and_workspace.user

    page.locator("#account-menu").click()
    page.locator("#logout").click()
    page.wait_for_url("/app/lifecycle/login/local/login")

    page.locator('input[name="emailAddress"]').fill(other_user.email)
    page.locator('input[name="password"]').fill(other_user.password)
    page.locator("#login").locator("button", has_text="Login").click()
    page.wait_for_url("/app/workspace")

    page.goto(f"/app/workspace/home/settings/tabs/{tab.ref_id}")
    expect(page.locator("body")).to_contain_text(
        "You do not have the right access for this entity"
    )


def test_webui_home_widget_acl(
    page: Page,
    create_home_tab,
    create_home_widget,
    another_user_and_workspace: AnotherUserAndWorkspace,
) -> None:
    tab = create_home_tab("ACL Tab")
    widget = create_home_widget(tab.ref_id)
    other_user = another_user_and_workspace.user

    page.locator("#account-menu").click()
    page.locator("#logout").click()
    page.wait_for_url("/app/lifecycle/login/local/login")

    page.locator('input[name="emailAddress"]').fill(other_user.email)
    page.locator('input[name="password"]').fill(other_user.password)
    page.locator("#login").locator("button", has_text="Login").click()
    page.wait_for_url("/app/workspace")

    page.goto(f"/app/workspace/home/settings/tabs/{tab.ref_id}/widgets/{widget.ref_id}")
    expect(page.locator("body")).to_contain_text(
        "You do not have the right access for this entity"
    )


def test_webui_home_key_habits_widget_properties(
    page: Page,
    create_home_tab,
    create_home_widget,
    create_habit,
    logged_in_client: AuthenticatedClient,
) -> None:
    habit_walk = create_habit("Walk The Dog")
    habit_read = create_habit("Read A Book")
    habit_stretch = create_habit("Stretch A Bit")
    tab = create_home_tab("Properties Tab")
    configured = create_home_widget(tab.ref_id, WidgetType.KEY_HABITS_STREAKS, 0)
    create_home_widget(tab.ref_id, WidgetType.KEY_HABITS_STREAKS, 1)

    # Choose habits in the widget's settings: three in one order, then move one
    # and remove another.
    page.goto(
        f"/app/workspace/home/settings/tabs/{tab.ref_id}/widgets/{configured.ref_id}"
    )
    expect(page.get_by_text("Widget Properties")).to_be_visible()
    expect(page.get_by_text("No habits chosen yet")).to_be_visible()

    for habit in (habit_read, habit_stretch, habit_walk):
        page.get_by_label("Habits to show").click()
        page.get_by_role("option").filter(has_text=habit.name).first.click()
    rows = page.locator("ol li")
    expect(rows).to_have_text(
        [
            re.compile(r"1\.\s*Read A Book"),
            re.compile(r"2\.\s*Stretch A Bit"),
            re.compile(r"3\.\s*Walk The Dog"),
        ]
    )

    page.get_by_role("button", name="Move Walk The Dog up").click()
    page.get_by_role("button", name="Remove Stretch A Bit").click()
    expect(rows).to_have_text(
        [
            re.compile(r"1\.\s*Read A Book"),
            re.compile(r"2\.\s*Walk The Dog"),
        ]
    )

    page.locator("#widget-update-properties").click()
    page.wait_for_url(re.compile(rf"/home/settings/tabs/{tab.ref_id}(\?.*)?$"))

    loaded = get_parsed_from_response(
        HomeWidgetLoadResult,
        home_widget_load_sync(
            client=logged_in_client,
            body=HomeWidgetLoadArgs(ref_id=configured.ref_id, allow_archived=False),
        ),
    ).widget
    assert isinstance(loaded.properties, KeyHabitsStreaksHomeWidgetProperties)
    assert loaded.properties.habit_ref_ids == [habit_read.ref_id, habit_walk.ref_id]

    # The home page shows exactly those habits, in that order. The widget that
    # was never configured says so, and links to its settings.
    page.goto(f"/app/workspace?tabRefId={tab.ref_id}")
    streaks = page.locator("#habit-key-habit-streak-widget-container")
    expect(streaks.get_by_role("tab")).to_have_text(["Read A Book", "Walk The Dog"])
    expect(streaks).not_to_contain_text("Stretch A Bit")
    expect(page.get_by_text("No Habits To Show", exact=True)).to_be_visible()
    configure = page.get_by_role("link", name="Configure Widget")
    expect(configure).to_have_attribute(
        "href", re.compile(rf"/home/settings/tabs/{tab.ref_id}/widgets/\d+$")
    )
    page.goto(configure.get_attribute("href"))
    expect(page.get_by_text("Widget Properties")).to_be_visible()
