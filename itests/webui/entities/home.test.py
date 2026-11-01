"""Tests about home tabs and widgets."""

import re
from collections.abc import Iterator

import pytest
from jupiter_webapi_client.api.big_plans.big_plan_create import (
    sync_detailed as big_plan_create_sync,
)
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
from jupiter_webapi_client.api.test_helper.workspace_set_feature import (
    sync_detailed as workspace_set_feature_sync,
)
from jupiter_webapi_client.client import AuthenticatedClient
from jupiter_webapi_client.models.big_plan import BigPlan
from jupiter_webapi_client.models.big_plan_create_args import BigPlanCreateArgs
from jupiter_webapi_client.models.big_plan_create_result import BigPlanCreateResult
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
from jupiter_webapi_client.models.init_result import InitResult
from jupiter_webapi_client.models.key_big_plans_progress_home_widget_properties import (
    KeyBigPlansProgressHomeWidgetProperties,
)
from jupiter_webapi_client.models.key_habits_streaks_home_widget_properties import (
    KeyHabitsStreaksHomeWidgetProperties,
)
from jupiter_webapi_client.models.recurring_task_period import RecurringTaskPeriod
from jupiter_webapi_client.models.widget_dimension import WidgetDimension
from jupiter_webapi_client.models.widget_type import WidgetType
from jupiter_webapi_client.models.workspace_feature import WorkspaceFeature
from jupiter_webapi_client.models.workspace_set_feature_args import (
    WorkspaceSetFeatureArgs,
)
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


@pytest.fixture(autouse=True, scope="module")
def _enable_big_plans_feature(
    webapi_url: str, new_user_and_workspace: InitResult
) -> Iterator[None]:
    def make_client() -> AuthenticatedClient:
        return AuthenticatedClient(
            base_url=webapi_url,
            token=new_user_and_workspace.auth_token_ext,
        )

    try:
        workspace_set_feature_sync(
            client=make_client(),
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.BIG_PLANS, value=True
            ),
        )
        yield
    finally:
        workspace_set_feature_sync(
            client=make_client(),
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.BIG_PLANS, value=False
            ),
        )


@pytest.fixture()
def create_big_plan(logged_in_client: AuthenticatedClient):
    def _create(name: str) -> BigPlan:
        result = big_plan_create_sync(
            client=logged_in_client,
            body=BigPlanCreateArgs(
                name=name,
                is_key=False,
                eisen=Eisen.REGULAR,
                difficulty=Difficulty.EASY,
            ),
        )
        return get_parsed_from_response(BigPlanCreateResult, result).new_big_plan

    return _create


@pytest.fixture()
def create_home_widget(logged_in_client: AuthenticatedClient):
    def _create(
        home_tab_ref_id: str,
        the_type: WidgetType = WidgetType.MOTD,
        row: int = 0,
        dimension: WidgetDimension = WidgetDimension.DIM_1X1,
    ) -> HomeWidget:
        result = home_widget_create_sync(
            client=logged_in_client,
            body=HomeWidgetCreateArgs(
                home_tab_ref_id=home_tab_ref_id,
                the_type=the_type,
                row=row,
                col=0,
                dimension=dimension,
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


def test_webui_home_key_big_plans_widget_properties(
    page: Page,
    create_home_tab,
    create_home_widget,
    create_big_plan,
    logged_in_client: AuthenticatedClient,
) -> None:
    plan_report = create_big_plan("Write The Report")
    plan_trip = create_big_plan("Plan The Trip")
    plan_piano = create_big_plan("Learn The Piano")
    tab = create_home_tab("Big Plans Properties Tab")
    # The widget does not come in 1x1, so each one takes three rows.
    configured = create_home_widget(
        tab.ref_id,
        WidgetType.KEY_BIG_PLANS_PROGRESS,
        0,
        WidgetDimension.DIM_3X1,
    )
    create_home_widget(
        tab.ref_id,
        WidgetType.KEY_BIG_PLANS_PROGRESS,
        3,
        WidgetDimension.DIM_3X1,
    )

    # Choose three big plans in the widget's settings, then take one out.
    page.goto(
        f"/app/workspace/home/settings/tabs/{tab.ref_id}/widgets/{configured.ref_id}"
    )
    expect(page.get_by_text("Widget Properties")).to_be_visible()
    expect(page.get_by_text("No big plans chosen yet")).to_be_visible()

    page.get_by_label("Big plans to include").click()
    for plan in (plan_report, plan_piano, plan_trip):
        page.get_by_role("option").filter(has_text=plan.name).first.click()
    page.keyboard.press("Escape")

    rows = page.locator("ol li")
    expect(rows).to_have_text(["Write The Report", "Learn The Piano", "Plan The Trip"])
    # The widget sorts its big plans itself, so there is no order to set.
    expect(page.get_by_role("button", name=re.compile("^Move "))).to_have_count(0)

    page.get_by_role("button", name="Remove Learn The Piano").click()
    expect(rows).to_have_text(["Write The Report", "Plan The Trip"])

    page.locator("#widget-update-properties").click()
    page.wait_for_url(re.compile(rf"/home/settings/tabs/{tab.ref_id}(\?.*)?$"))

    loaded = get_parsed_from_response(
        HomeWidgetLoadResult,
        home_widget_load_sync(
            client=logged_in_client,
            body=HomeWidgetLoadArgs(ref_id=configured.ref_id, allow_archived=False),
        ),
    ).widget
    assert isinstance(loaded.properties, KeyBigPlansProgressHomeWidgetProperties)
    assert loaded.properties.big_plan_ref_ids == [plan_report.ref_id, plan_trip.ref_id]

    # The home page includes exactly those big plans. The widget that was never
    # configured says so, and links to its settings.
    page.goto(f"/app/workspace?tabRefId={tab.ref_id}")
    expect(page.get_by_text("No Big Plans To Show", exact=True)).to_be_visible()
    body = page.locator("body")
    expect(body).to_contain_text("Write The Report")
    expect(body).to_contain_text("Plan The Trip")
    expect(body).not_to_contain_text("Learn The Piano")
    configure = page.get_by_role("link", name="Configure Widget")
    expect(configure).to_have_attribute(
        "href", re.compile(rf"/home/settings/tabs/{tab.ref_id}/widgets/\d+$")
    )
