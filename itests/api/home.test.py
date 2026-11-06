"""Tests for the home WebAPI use cases."""

from collections.abc import Iterator
from http import HTTPStatus
from typing import Protocol

import pytest
from jupiter_webapi_client.api.big_plans.big_plan_archive import (
    sync_detailed as big_plan_archive_sync,
)
from jupiter_webapi_client.api.big_plans.big_plan_create import (
    sync_detailed as big_plan_create_sync,
)
from jupiter_webapi_client.api.habits.habit_archive import (
    sync_detailed as habit_archive_sync,
)
from jupiter_webapi_client.api.habits.habit_create import (
    sync_detailed as habit_create_sync,
)
from jupiter_webapi_client.api.home.home_tab_archive import (
    sync_detailed as home_tab_archive_sync,
)
from jupiter_webapi_client.api.home.home_tab_create import (
    sync_detailed as home_tab_create_sync,
)
from jupiter_webapi_client.api.home.home_tab_load import (
    sync_detailed as home_tab_load_sync,
)
from jupiter_webapi_client.api.home.home_tab_remove import (
    sync_detailed as home_tab_remove_sync,
)
from jupiter_webapi_client.api.home.home_tab_update import (
    sync_detailed as home_tab_update_sync,
)
from jupiter_webapi_client.api.home.home_widget_archive import (
    sync_detailed as home_widget_archive_sync,
)
from jupiter_webapi_client.api.home.home_widget_create import (
    sync_detailed as home_widget_create_sync,
)
from jupiter_webapi_client.api.home.home_widget_load import (
    sync_detailed as home_widget_load_sync,
)
from jupiter_webapi_client.api.home.home_widget_move_and_resize import (
    sync_detailed as home_widget_move_and_resize_sync,
)
from jupiter_webapi_client.api.home.home_widget_remove import (
    sync_detailed as home_widget_remove_sync,
)
from jupiter_webapi_client.api.home.home_widget_update_properties import (
    sync_detailed as home_widget_update_properties_sync,
)
from jupiter_webapi_client.api.test_helper.workspace_set_feature import (
    sync_detailed as workspace_set_feature_sync,
)
from jupiter_webapi_client.client import AuthenticatedClient
from jupiter_webapi_client.models.big_plan import BigPlan
from jupiter_webapi_client.models.big_plan_archive_args import BigPlanArchiveArgs
from jupiter_webapi_client.models.big_plan_create_args import BigPlanCreateArgs
from jupiter_webapi_client.models.big_plan_create_result import BigPlanCreateResult
from jupiter_webapi_client.models.difficulty import Difficulty
from jupiter_webapi_client.models.eisen import Eisen
from jupiter_webapi_client.models.empty_home_widget_properties import (
    EmptyHomeWidgetProperties,
)
from jupiter_webapi_client.models.empty_home_widget_properties_kind import (
    EmptyHomeWidgetPropertiesKind,
)
from jupiter_webapi_client.models.habit import Habit
from jupiter_webapi_client.models.habit_archive_args import HabitArchiveArgs
from jupiter_webapi_client.models.habit_create_args import HabitCreateArgs
from jupiter_webapi_client.models.habit_create_result import HabitCreateResult
from jupiter_webapi_client.models.home_tab import HomeTab
from jupiter_webapi_client.models.home_tab_archive_args import HomeTabArchiveArgs
from jupiter_webapi_client.models.home_tab_create_args import HomeTabCreateArgs
from jupiter_webapi_client.models.home_tab_create_result import HomeTabCreateResult
from jupiter_webapi_client.models.home_tab_load_args import HomeTabLoadArgs
from jupiter_webapi_client.models.home_tab_remove_args import HomeTabRemoveArgs
from jupiter_webapi_client.models.home_tab_target import HomeTabTarget
from jupiter_webapi_client.models.home_tab_update_args import HomeTabUpdateArgs
from jupiter_webapi_client.models.home_tab_update_args_icon import HomeTabUpdateArgsIcon
from jupiter_webapi_client.models.home_tab_update_args_name import HomeTabUpdateArgsName
from jupiter_webapi_client.models.home_widget import HomeWidget
from jupiter_webapi_client.models.home_widget_archive_args import HomeWidgetArchiveArgs
from jupiter_webapi_client.models.home_widget_create_args import HomeWidgetCreateArgs
from jupiter_webapi_client.models.home_widget_create_result import (
    HomeWidgetCreateResult,
)
from jupiter_webapi_client.models.home_widget_load_args import HomeWidgetLoadArgs
from jupiter_webapi_client.models.home_widget_load_result import HomeWidgetLoadResult
from jupiter_webapi_client.models.home_widget_move_and_resize_args import (
    HomeWidgetMoveAndResizeArgs,
)
from jupiter_webapi_client.models.home_widget_remove_args import HomeWidgetRemoveArgs
from jupiter_webapi_client.models.home_widget_update_properties_args import (
    HomeWidgetUpdatePropertiesArgs,
)
from jupiter_webapi_client.models.key_big_plans_progress_home_widget_properties import (
    KeyBigPlansProgressHomeWidgetProperties,
)
from jupiter_webapi_client.models.key_big_plans_progress_home_widget_properties_kind import (
    KeyBigPlansProgressHomeWidgetPropertiesKind,
)
from jupiter_webapi_client.models.key_habits_streaks_home_widget_properties import (
    KeyHabitsStreaksHomeWidgetProperties,
)
from jupiter_webapi_client.models.key_habits_streaks_home_widget_properties_kind import (
    KeyHabitsStreaksHomeWidgetPropertiesKind,
)
from jupiter_webapi_client.models.recurring_task_period import RecurringTaskPeriod
from jupiter_webapi_client.models.widget_dimension import WidgetDimension
from jupiter_webapi_client.models.widget_type import WidgetType
from jupiter_webapi_client.models.workspace_feature import WorkspaceFeature
from jupiter_webapi_client.models.workspace_set_feature_args import (
    WorkspaceSetFeatureArgs,
)

from itests.api.conftest import AnotherUserAndWorkspace
from itests.helpers import get_parsed_from_response


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
        properties: (
            KeyHabitsStreaksHomeWidgetProperties
            | KeyBigPlansProgressHomeWidgetProperties
            | EmptyHomeWidgetProperties
            | None
        ) = None,
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
                properties=properties,
            ),
        )
        return get_parsed_from_response(HomeWidgetCreateResult, result).new_widget

    return _create


@pytest.fixture(autouse=True, scope="module")
def _enable_big_plans_feature(logged_in_client: AuthenticatedClient) -> Iterator[None]:
    try:
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.BIG_PLANS, value=True
            ),
        )
        yield
    finally:
        workspace_set_feature_sync(
            client=logged_in_client,
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


def _other_client(
    webapi_url: str, another_user_and_workspace: AnotherUserAndWorkspace
) -> AuthenticatedClient:
    return AuthenticatedClient(
        base_url=webapi_url,
        token=another_user_and_workspace.init_result.auth_token_ext,
    )


class _HttpResponse(Protocol):
    status_code: HTTPStatus


def _assert_acl_denied(response: _HttpResponse) -> None:
    assert int(response.status_code) == 401


def test_api_home_tab_acl(
    create_home_tab,
    another_user_and_workspace: AnotherUserAndWorkspace,
    webapi_url: str,
) -> None:
    tab = create_home_tab("ACL Tab")
    other_client = _other_client(webapi_url, another_user_and_workspace)

    load_response = home_tab_load_sync(
        client=other_client,
        body=HomeTabLoadArgs(ref_id=tab.ref_id, allow_archived=False),
    )
    _assert_acl_denied(load_response)

    update_response = home_tab_update_sync(
        client=other_client,
        body=HomeTabUpdateArgs(
            ref_id=tab.ref_id,
            name=HomeTabUpdateArgsName(should_change=True, value="Hacked Tab"),
            icon=HomeTabUpdateArgsIcon(should_change=False),
        ),
    )
    _assert_acl_denied(update_response)

    archive_response = home_tab_archive_sync(
        client=other_client,
        body=HomeTabArchiveArgs(ref_id=tab.ref_id),
    )
    _assert_acl_denied(archive_response)

    remove_response = home_tab_remove_sync(
        client=other_client,
        body=HomeTabRemoveArgs(ref_id=tab.ref_id),
    )
    _assert_acl_denied(remove_response)


def test_api_home_widget_acl(
    create_home_tab,
    create_home_widget,
    another_user_and_workspace: AnotherUserAndWorkspace,
    webapi_url: str,
) -> None:
    tab = create_home_tab("ACL Tab")
    widget = create_home_widget(tab.ref_id)
    other_client = _other_client(webapi_url, another_user_and_workspace)

    load_response = home_widget_load_sync(
        client=other_client,
        body=HomeWidgetLoadArgs(ref_id=widget.ref_id, allow_archived=False),
    )
    _assert_acl_denied(load_response)

    move_response = home_widget_move_and_resize_sync(
        client=other_client,
        body=HomeWidgetMoveAndResizeArgs(
            ref_id=widget.ref_id,
            row=1,
            col=0,
            dimension=WidgetDimension.DIM_1X1,
        ),
    )
    _assert_acl_denied(move_response)

    update_properties_response = home_widget_update_properties_sync(
        client=other_client,
        body=HomeWidgetUpdatePropertiesArgs(
            ref_id=widget.ref_id,
            properties=EmptyHomeWidgetProperties(
                kind=EmptyHomeWidgetPropertiesKind.EMPTY
            ),
        ),
    )
    _assert_acl_denied(update_properties_response)

    archive_response = home_widget_archive_sync(
        client=other_client,
        body=HomeWidgetArchiveArgs(ref_id=widget.ref_id),
    )
    _assert_acl_denied(archive_response)

    remove_response = home_widget_remove_sync(
        client=other_client,
        body=HomeWidgetRemoveArgs(ref_id=widget.ref_id),
    )
    _assert_acl_denied(remove_response)


def _habits_properties(*habit_ref_ids: str) -> KeyHabitsStreaksHomeWidgetProperties:
    return KeyHabitsStreaksHomeWidgetProperties(
        kind=KeyHabitsStreaksHomeWidgetPropertiesKind.KEY_HABITS_STREAKS,
        habit_ref_ids=list(habit_ref_ids),
    )


def _big_plans_properties(
    *big_plan_ref_ids: str,
) -> KeyBigPlansProgressHomeWidgetProperties:
    return KeyBigPlansProgressHomeWidgetProperties(
        kind=KeyBigPlansProgressHomeWidgetPropertiesKind.KEY_BIG_PLANS_PROGRESS,
        big_plan_ref_ids=list(big_plan_ref_ids),
    )


def _load_widget(client: AuthenticatedClient, ref_id: str) -> HomeWidget:
    result = home_widget_load_sync(
        client=client,
        body=HomeWidgetLoadArgs(ref_id=ref_id, allow_archived=False),
    )
    return get_parsed_from_response(HomeWidgetLoadResult, result).widget


def _update_properties(
    client: AuthenticatedClient,
    ref_id: str,
    properties: (
        KeyHabitsStreaksHomeWidgetProperties
        | KeyBigPlansProgressHomeWidgetProperties
        | EmptyHomeWidgetProperties
    ),
):
    return home_widget_update_properties_sync(
        client=client,
        body=HomeWidgetUpdatePropertiesArgs(ref_id=ref_id, properties=properties),
    )


def test_api_home_widget_starts_with_the_default_properties_of_its_type(
    create_home_tab,
    create_home_widget,
) -> None:
    tab = create_home_tab("Default Properties Tab")

    habits_widget = create_home_widget(tab.ref_id, WidgetType.KEY_HABITS_STREAKS, 0)
    motd_widget = create_home_widget(tab.ref_id, WidgetType.MOTD, 1)

    assert isinstance(habits_widget.properties, KeyHabitsStreaksHomeWidgetProperties)
    assert habits_widget.properties.habit_ref_ids == []
    assert isinstance(motd_widget.properties, EmptyHomeWidgetProperties)


def test_api_home_widget_created_with_properties_keeps_habits_in_order(
    create_home_tab,
    create_home_widget,
    create_habit,
    logged_in_client: AuthenticatedClient,
) -> None:
    habit_a = create_habit("Habit A")
    habit_b = create_habit("Habit B")
    tab = create_home_tab("Created With Properties Tab")

    widget = create_home_widget(
        tab.ref_id,
        WidgetType.KEY_HABITS_STREAKS,
        properties=_habits_properties(habit_b.ref_id, habit_a.ref_id),
    )

    loaded = _load_widget(logged_in_client, widget.ref_id)
    assert isinstance(loaded.properties, KeyHabitsStreaksHomeWidgetProperties)
    assert loaded.properties.habit_ref_ids == [habit_b.ref_id, habit_a.ref_id]


def test_api_home_widget_update_properties_changes_habits_and_their_order(
    create_home_tab,
    create_home_widget,
    create_habit,
    logged_in_client: AuthenticatedClient,
) -> None:
    habit_a = create_habit("Habit A")
    habit_b = create_habit("Habit B")
    habit_c = create_habit("Habit C")
    tab = create_home_tab("Update Properties Tab")
    widget = create_home_widget(tab.ref_id, WidgetType.KEY_HABITS_STREAKS)

    for chosen in (
        [habit_b, habit_a, habit_c],
        [habit_c, habit_a],
        [],
    ):
        response = _update_properties(
            logged_in_client,
            widget.ref_id,
            _habits_properties(*[h.ref_id for h in chosen]),
        )
        assert int(response.status_code) == 200

        loaded = _load_widget(logged_in_client, widget.ref_id)
        assert isinstance(loaded.properties, KeyHabitsStreaksHomeWidgetProperties)
        assert loaded.properties.habit_ref_ids == [h.ref_id for h in chosen]


def test_api_home_widget_update_properties_leaves_the_placement_alone(
    create_home_tab,
    create_home_widget,
    create_habit,
    logged_in_client: AuthenticatedClient,
) -> None:
    habit = create_habit("Habit A")
    tab = create_home_tab("Placement Tab")
    widget = create_home_widget(tab.ref_id, WidgetType.KEY_HABITS_STREAKS, 2)

    _update_properties(
        logged_in_client, widget.ref_id, _habits_properties(habit.ref_id)
    )

    loaded = _load_widget(logged_in_client, widget.ref_id)
    assert loaded.geometry.row == 2
    assert loaded.geometry.col == 0
    assert loaded.geometry.dimension == WidgetDimension.DIM_1X1


def test_api_home_widget_update_properties_refuses_properties_of_another_type(
    create_home_tab,
    create_home_widget,
    create_habit,
    logged_in_client: AuthenticatedClient,
) -> None:
    habit = create_habit("Habit A")
    tab = create_home_tab("Wrong Kind Tab")
    motd_widget = create_home_widget(tab.ref_id, WidgetType.MOTD)
    habits_widget = create_home_widget(tab.ref_id, WidgetType.KEY_HABITS_STREAKS, 1)

    wrong_for_motd = _update_properties(
        logged_in_client, motd_widget.ref_id, _habits_properties(habit.ref_id)
    )
    wrong_for_habits = _update_properties(
        logged_in_client,
        habits_widget.ref_id,
        EmptyHomeWidgetProperties(kind=EmptyHomeWidgetPropertiesKind.EMPTY),
    )

    assert int(wrong_for_motd.status_code) == 422
    assert int(wrong_for_habits.status_code) == 422


def test_api_home_widget_update_properties_refuses_habits_that_cannot_be_shown(
    create_home_tab,
    create_home_widget,
    create_habit,
    logged_in_client: AuthenticatedClient,
) -> None:
    habit = create_habit("Habit A")
    archived_habit = create_habit("Archived Habit")
    habit_archive_sync(
        client=logged_in_client,
        body=HabitArchiveArgs(ref_id=archived_habit.ref_id),
    )
    tab = create_home_tab("Bad Habits Tab")
    widget = create_home_widget(tab.ref_id, WidgetType.KEY_HABITS_STREAKS)

    duplicate = _update_properties(
        logged_in_client, widget.ref_id, _habits_properties(habit.ref_id, habit.ref_id)
    )
    archived = _update_properties(
        logged_in_client, widget.ref_id, _habits_properties(archived_habit.ref_id)
    )
    missing = _update_properties(
        logged_in_client, widget.ref_id, _habits_properties("999999999")
    )

    assert int(duplicate.status_code) == 422
    assert int(archived.status_code) == 422
    assert int(missing.status_code) == 404
    # None of the refused attempts changed the widget.
    loaded = _load_widget(logged_in_client, widget.ref_id)
    assert isinstance(loaded.properties, KeyHabitsStreaksHomeWidgetProperties)
    assert loaded.properties.habit_ref_ids == []


def test_api_home_widget_properties_cannot_point_at_a_habit_the_user_cannot_read(
    create_home_tab,
    create_home_widget,
    logged_in_client: AuthenticatedClient,
    another_user_and_workspace: AnotherUserAndWorkspace,
    webapi_url: str,
) -> None:
    other_client = _other_client(webapi_url, another_user_and_workspace)
    workspace_set_feature_sync(
        client=other_client,
        body=WorkspaceSetFeatureArgs(feature=WorkspaceFeature.HABITS, value=True),
    )
    other_habit = get_parsed_from_response(
        HabitCreateResult,
        habit_create_sync(
            client=other_client,
            body=HabitCreateArgs(
                name="Someone Else's Habit",
                period=RecurringTaskPeriod.WEEKLY,
                is_key=False,
                eisen=Eisen.REGULAR,
                difficulty=Difficulty.EASY,
            ),
        ),
    ).new_habit
    tab = create_home_tab("Unreadable Habit Tab")
    widget = create_home_widget(tab.ref_id, WidgetType.KEY_HABITS_STREAKS)

    # The widget is ours, but the habit belongs to someone it was never shared
    # with us by, so it cannot go on our home page.
    updated = _update_properties(
        logged_in_client, widget.ref_id, _habits_properties(other_habit.ref_id)
    )
    created = home_widget_create_sync(
        client=logged_in_client,
        body=HomeWidgetCreateArgs(
            home_tab_ref_id=tab.ref_id,
            the_type=WidgetType.KEY_HABITS_STREAKS,
            row=5,
            col=0,
            dimension=WidgetDimension.DIM_1X1,
            properties=_habits_properties(other_habit.ref_id),
        ),
    )

    _assert_acl_denied(updated)
    _assert_acl_denied(created)


def test_api_home_big_plans_widget_starts_with_no_big_plans(
    create_home_tab,
    create_home_widget,
) -> None:
    tab = create_home_tab("Big Plans Default Tab")

    widget = create_home_widget(
        tab.ref_id,
        WidgetType.KEY_BIG_PLANS_PROGRESS,
        dimension=WidgetDimension.DIM_3X1,
    )

    assert isinstance(widget.properties, KeyBigPlansProgressHomeWidgetProperties)
    assert widget.properties.big_plan_ref_ids == []


def test_api_home_big_plans_widget_keeps_the_big_plans_it_is_given(
    create_home_tab,
    create_home_widget,
    create_big_plan,
    logged_in_client: AuthenticatedClient,
) -> None:
    plan_a = create_big_plan("Plan A")
    plan_b = create_big_plan("Plan B")
    plan_c = create_big_plan("Plan C")
    tab = create_home_tab("Big Plans Update Tab")

    widget = create_home_widget(
        tab.ref_id,
        WidgetType.KEY_BIG_PLANS_PROGRESS,
        properties=_big_plans_properties(plan_a.ref_id, plan_b.ref_id),
        dimension=WidgetDimension.DIM_3X1,
    )
    created = _load_widget(logged_in_client, widget.ref_id)
    assert isinstance(created.properties, KeyBigPlansProgressHomeWidgetProperties)
    assert created.properties.big_plan_ref_ids == [plan_a.ref_id, plan_b.ref_id]

    for chosen in ([plan_c, plan_a], []):
        response = _update_properties(
            logged_in_client,
            widget.ref_id,
            _big_plans_properties(*[p.ref_id for p in chosen]),
        )
        assert int(response.status_code) == 200

        loaded = _load_widget(logged_in_client, widget.ref_id)
        assert isinstance(loaded.properties, KeyBigPlansProgressHomeWidgetProperties)
        assert loaded.properties.big_plan_ref_ids == [p.ref_id for p in chosen]


def test_api_home_widgets_refuse_properties_meant_for_another_type(
    create_home_tab,
    create_home_widget,
    create_big_plan,
    create_habit,
    logged_in_client: AuthenticatedClient,
) -> None:
    plan = create_big_plan("Plan A")
    habit = create_habit("Habit A")
    tab = create_home_tab("Mixed Kinds Tab")
    big_plans_widget = create_home_widget(
        tab.ref_id,
        WidgetType.KEY_BIG_PLANS_PROGRESS,
        dimension=WidgetDimension.DIM_3X1,
    )
    habits_widget = create_home_widget(tab.ref_id, WidgetType.KEY_HABITS_STREAKS, 3)
    motd_widget = create_home_widget(tab.ref_id, WidgetType.MOTD, 4)

    habits_on_big_plans = _update_properties(
        logged_in_client, big_plans_widget.ref_id, _habits_properties(habit.ref_id)
    )
    big_plans_on_habits = _update_properties(
        logged_in_client, habits_widget.ref_id, _big_plans_properties(plan.ref_id)
    )
    big_plans_on_motd = _update_properties(
        logged_in_client, motd_widget.ref_id, _big_plans_properties(plan.ref_id)
    )
    empty_on_big_plans = _update_properties(
        logged_in_client,
        big_plans_widget.ref_id,
        EmptyHomeWidgetProperties(kind=EmptyHomeWidgetPropertiesKind.EMPTY),
    )

    assert int(habits_on_big_plans.status_code) == 422
    assert int(big_plans_on_habits.status_code) == 422
    assert int(big_plans_on_motd.status_code) == 422
    assert int(empty_on_big_plans.status_code) == 422


def test_api_home_big_plans_widget_refuses_big_plans_that_cannot_be_shown(
    create_home_tab,
    create_home_widget,
    create_big_plan,
    logged_in_client: AuthenticatedClient,
) -> None:
    plan = create_big_plan("Plan A")
    archived_plan = create_big_plan("Archived Plan")
    big_plan_archive_sync(
        client=logged_in_client,
        body=BigPlanArchiveArgs(ref_id=archived_plan.ref_id),
    )
    tab = create_home_tab("Bad Big Plans Tab")
    widget = create_home_widget(
        tab.ref_id,
        WidgetType.KEY_BIG_PLANS_PROGRESS,
        dimension=WidgetDimension.DIM_3X1,
    )

    duplicate = _update_properties(
        logged_in_client, widget.ref_id, _big_plans_properties(plan.ref_id, plan.ref_id)
    )
    archived = _update_properties(
        logged_in_client, widget.ref_id, _big_plans_properties(archived_plan.ref_id)
    )
    missing = _update_properties(
        logged_in_client, widget.ref_id, _big_plans_properties("999999999")
    )

    assert int(duplicate.status_code) == 422
    assert int(archived.status_code) == 422
    assert int(missing.status_code) == 404
    loaded = _load_widget(logged_in_client, widget.ref_id)
    assert isinstance(loaded.properties, KeyBigPlansProgressHomeWidgetProperties)
    assert loaded.properties.big_plan_ref_ids == []


def test_api_home_big_plans_widget_cannot_include_a_big_plan_the_user_cannot_read(
    create_home_tab,
    create_home_widget,
    logged_in_client: AuthenticatedClient,
    another_user_and_workspace: AnotherUserAndWorkspace,
    webapi_url: str,
) -> None:
    other_client = _other_client(webapi_url, another_user_and_workspace)
    workspace_set_feature_sync(
        client=other_client,
        body=WorkspaceSetFeatureArgs(feature=WorkspaceFeature.BIG_PLANS, value=True),
    )
    other_plan = get_parsed_from_response(
        BigPlanCreateResult,
        big_plan_create_sync(
            client=other_client,
            body=BigPlanCreateArgs(
                name="Someone Else's Plan",
                is_key=False,
                eisen=Eisen.REGULAR,
                difficulty=Difficulty.EASY,
            ),
        ),
    ).new_big_plan
    tab = create_home_tab("Unreadable Big Plan Tab")
    widget = create_home_widget(
        tab.ref_id,
        WidgetType.KEY_BIG_PLANS_PROGRESS,
        dimension=WidgetDimension.DIM_3X1,
    )

    updated = _update_properties(
        logged_in_client, widget.ref_id, _big_plans_properties(other_plan.ref_id)
    )
    created = home_widget_create_sync(
        client=logged_in_client,
        body=HomeWidgetCreateArgs(
            home_tab_ref_id=tab.ref_id,
            the_type=WidgetType.KEY_BIG_PLANS_PROGRESS,
            row=5,
            col=0,
            dimension=WidgetDimension.DIM_3X1,
            properties=_big_plans_properties(other_plan.ref_id),
        ),
    )

    _assert_acl_denied(updated)
    _assert_acl_denied(created)
