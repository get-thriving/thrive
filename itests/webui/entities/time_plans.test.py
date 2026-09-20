"""Tests about time plans."""

import re
import uuid
from collections.abc import Iterator

import pendulum
import pytest
from jupiter_webapi_client.api.application.invite_users_to_entity import (
    sync_detailed as invite_users_to_entity_sync,
)
from jupiter_webapi_client.api.big_plans.big_plan_create import (
    sync_detailed as big_plan_create_sync,
)
from jupiter_webapi_client.api.big_plans.big_plan_create_inbox_task import (
    sync_detailed as big_plan_create_inbox_task_sync,
)
from jupiter_webapi_client.api.big_plans.big_plan_update import (
    sync_detailed as big_plan_update_sync,
)
from jupiter_webapi_client.api.chores.chore_create import (
    sync_detailed as chore_create_sync,
)
from jupiter_webapi_client.api.chores.chore_stack_create import (
    sync_detailed as chore_stack_create_sync,
)
from jupiter_webapi_client.api.habits.habit_create import (
    sync_detailed as habit_create_sync,
)
from jupiter_webapi_client.api.habits.habit_stack_create import (
    sync_detailed as habit_stack_create_sync,
)
from jupiter_webapi_client.api.inbox_tasks.inbox_task_update import (
    sync_detailed as inbox_task_update_sync,
)
from jupiter_webapi_client.api.test_helper.workspace_set_feature import (
    sync_detailed as workspace_set_feature_sync,
)
from jupiter_webapi_client.api.time_events.time_event_in_day_block_create_for_time_plan_activity import (
    sync_detailed as time_event_in_day_block_create_for_time_plan_activity_sync,
)
from jupiter_webapi_client.api.time_plans.time_plan_associate_with_big_plans import (
    sync_detailed as time_plan_activity_create_big_plan_sync,
)
from jupiter_webapi_client.api.time_plans.time_plan_associate_with_chore_stacks import (
    sync_detailed as time_plan_associate_with_chore_stacks_sync,
)
from jupiter_webapi_client.api.time_plans.time_plan_associate_with_chores import (
    sync_detailed as time_plan_associate_with_chores_sync,
)
from jupiter_webapi_client.api.time_plans.time_plan_associate_with_habit_stacks import (
    sync_detailed as time_plan_associate_with_habit_stacks_sync,
)
from jupiter_webapi_client.api.time_plans.time_plan_associate_with_habits import (
    sync_detailed as time_plan_associate_with_habits_sync,
)
from jupiter_webapi_client.api.time_plans.time_plan_associate_with_inbox_tasks import (
    sync_detailed as time_plan_activity_associate_inbox_task_sync,
)
from jupiter_webapi_client.api.time_plans.time_plan_create import (
    sync_detailed as time_plan_create_sync,
)
from jupiter_webapi_client.api.time_plans.time_plan_question_create import (
    sync_detailed as time_plan_question_create_sync,
)
from jupiter_webapi_client.api.todo.todo_task_create import (
    sync_detailed as todo_task_create_sync,
)
from jupiter_webapi_client.client import AuthenticatedClient
from jupiter_webapi_client.models.access_level import AccessLevel
from jupiter_webapi_client.models.big_plan import BigPlan
from jupiter_webapi_client.models.big_plan_create_args import BigPlanCreateArgs
from jupiter_webapi_client.models.big_plan_create_inbox_task_args import (
    BigPlanCreateInboxTaskArgs,
)
from jupiter_webapi_client.models.big_plan_create_inbox_task_result import (
    BigPlanCreateInboxTaskResult,
)
from jupiter_webapi_client.models.big_plan_create_result import BigPlanCreateResult
from jupiter_webapi_client.models.big_plan_status import BigPlanStatus
from jupiter_webapi_client.models.big_plan_update_args import BigPlanUpdateArgs
from jupiter_webapi_client.models.big_plan_update_args_actionable_date import (
    BigPlanUpdateArgsActionableDate,
)
from jupiter_webapi_client.models.big_plan_update_args_aspect_ref_id import (
    BigPlanUpdateArgsAspectRefId,
)
from jupiter_webapi_client.models.big_plan_update_args_chapter_ref_id import (
    BigPlanUpdateArgsChapterRefId,
)
from jupiter_webapi_client.models.big_plan_update_args_dependency_ref_ids import (
    BigPlanUpdateArgsDependencyRefIds,
)
from jupiter_webapi_client.models.big_plan_update_args_difficulty import (
    BigPlanUpdateArgsDifficulty,
)
from jupiter_webapi_client.models.big_plan_update_args_due_date import (
    BigPlanUpdateArgsDueDate,
)
from jupiter_webapi_client.models.big_plan_update_args_eisen import (
    BigPlanUpdateArgsEisen,
)
from jupiter_webapi_client.models.big_plan_update_args_goal_ref_id import (
    BigPlanUpdateArgsGoalRefId,
)
from jupiter_webapi_client.models.big_plan_update_args_is_key import (
    BigPlanUpdateArgsIsKey,
)
from jupiter_webapi_client.models.big_plan_update_args_name import BigPlanUpdateArgsName
from jupiter_webapi_client.models.big_plan_update_args_schedulability import (
    BigPlanUpdateArgsSchedulability,
)
from jupiter_webapi_client.models.big_plan_update_args_scheduling_event_count import (
    BigPlanUpdateArgsSchedulingEventCount,
)
from jupiter_webapi_client.models.big_plan_update_args_scheduling_event_duration_mins import (
    BigPlanUpdateArgsSchedulingEventDurationMins,
)
from jupiter_webapi_client.models.big_plan_update_args_status import (
    BigPlanUpdateArgsStatus,
)
from jupiter_webapi_client.models.chore import Chore
from jupiter_webapi_client.models.chore_create_args import ChoreCreateArgs
from jupiter_webapi_client.models.chore_create_result import ChoreCreateResult
from jupiter_webapi_client.models.chore_stack import ChoreStack
from jupiter_webapi_client.models.chore_stack_create_args import ChoreStackCreateArgs
from jupiter_webapi_client.models.chore_stack_create_result import (
    ChoreStackCreateResult,
)
from jupiter_webapi_client.models.difficulty import Difficulty
from jupiter_webapi_client.models.eisen import Eisen
from jupiter_webapi_client.models.habit import Habit
from jupiter_webapi_client.models.habit_create_args import HabitCreateArgs
from jupiter_webapi_client.models.habit_create_result import HabitCreateResult
from jupiter_webapi_client.models.habit_stack import HabitStack
from jupiter_webapi_client.models.habit_stack_create_args import HabitStackCreateArgs
from jupiter_webapi_client.models.habit_stack_create_result import (
    HabitStackCreateResult,
)
from jupiter_webapi_client.models.inbox_task import InboxTask
from jupiter_webapi_client.models.inbox_task_status import InboxTaskStatus
from jupiter_webapi_client.models.inbox_task_update_args import InboxTaskUpdateArgs
from jupiter_webapi_client.models.inbox_task_update_args_actionable_date import (
    InboxTaskUpdateArgsActionableDate,
)
from jupiter_webapi_client.models.inbox_task_update_args_difficulty import (
    InboxTaskUpdateArgsDifficulty,
)
from jupiter_webapi_client.models.inbox_task_update_args_due_date import (
    InboxTaskUpdateArgsDueDate,
)
from jupiter_webapi_client.models.inbox_task_update_args_eisen import (
    InboxTaskUpdateArgsEisen,
)
from jupiter_webapi_client.models.inbox_task_update_args_is_key import (
    InboxTaskUpdateArgsIsKey,
)
from jupiter_webapi_client.models.inbox_task_update_args_name import (
    InboxTaskUpdateArgsName,
)
from jupiter_webapi_client.models.inbox_task_update_args_status import (
    InboxTaskUpdateArgsStatus,
)
from jupiter_webapi_client.models.invite_users_to_entity_args import (
    InviteUsersToEntityArgs,
)
from jupiter_webapi_client.models.named_entity_tag import NamedEntityTag
from jupiter_webapi_client.models.recurring_task_period import RecurringTaskPeriod
from jupiter_webapi_client.models.time_event_in_day_block import TimeEventInDayBlock
from jupiter_webapi_client.models.time_event_in_day_block_create_for_time_plan_activity_args import (
    TimeEventInDayBlockCreateForTimePlanActivityArgs,
)
from jupiter_webapi_client.models.time_event_in_day_block_create_for_time_plan_activity_result import (
    TimeEventInDayBlockCreateForTimePlanActivityResult,
)
from jupiter_webapi_client.models.time_plan import TimePlan
from jupiter_webapi_client.models.time_plan_activity import TimePlanActivity
from jupiter_webapi_client.models.time_plan_activity_feasability import (
    TimePlanActivityFeasability,
)
from jupiter_webapi_client.models.time_plan_activity_kind import TimePlanActivityKind
from jupiter_webapi_client.models.time_plan_associate_with_big_plans_args import (
    TimePlanAssociateWithBigPlansArgs,
)
from jupiter_webapi_client.models.time_plan_associate_with_big_plans_result import (
    TimePlanAssociateWithBigPlansResult,
)
from jupiter_webapi_client.models.time_plan_associate_with_chore_stacks_args import (
    TimePlanAssociateWithChoreStacksArgs,
)
from jupiter_webapi_client.models.time_plan_associate_with_chore_stacks_result import (
    TimePlanAssociateWithChoreStacksResult,
)
from jupiter_webapi_client.models.time_plan_associate_with_chores_args import (
    TimePlanAssociateWithChoresArgs,
)
from jupiter_webapi_client.models.time_plan_associate_with_chores_result import (
    TimePlanAssociateWithChoresResult,
)
from jupiter_webapi_client.models.time_plan_associate_with_habit_stacks_args import (
    TimePlanAssociateWithHabitStacksArgs,
)
from jupiter_webapi_client.models.time_plan_associate_with_habit_stacks_result import (
    TimePlanAssociateWithHabitStacksResult,
)
from jupiter_webapi_client.models.time_plan_associate_with_habits_args import (
    TimePlanAssociateWithHabitsArgs,
)
from jupiter_webapi_client.models.time_plan_associate_with_habits_result import (
    TimePlanAssociateWithHabitsResult,
)
from jupiter_webapi_client.models.time_plan_associate_with_inbox_tasks_args import (
    TimePlanAssociateWithInboxTasksArgs,
)
from jupiter_webapi_client.models.time_plan_associate_with_inbox_tasks_result import (
    TimePlanAssociateWithInboxTasksResult,
)
from jupiter_webapi_client.models.time_plan_create_args import TimePlanCreateArgs
from jupiter_webapi_client.models.time_plan_create_result import TimePlanCreateResult
from jupiter_webapi_client.models.time_plan_question import TimePlanQuestion
from jupiter_webapi_client.models.time_plan_question_create_args import (
    TimePlanQuestionCreateArgs,
)
from jupiter_webapi_client.models.time_plan_question_create_result import (
    TimePlanQuestionCreateResult,
)
from jupiter_webapi_client.models.todo_task_create_args import TodoTaskCreateArgs
from jupiter_webapi_client.models.todo_task_create_result import TodoTaskCreateResult
from jupiter_webapi_client.models.workspace_feature import WorkspaceFeature
from jupiter_webapi_client.models.workspace_set_feature_args import (
    WorkspaceSetFeatureArgs,
)
from jupiter_webapi_client.types import UNSET
from playwright.sync_api import Page, expect
from playwright.sync_api import TimeoutError as PlaywrightTimeoutError

from itests.helpers import (
    fill_after_hydration,
    get_parsed_from_response,
    open_branch_publish_panel,
    type_entity_note_editor_and_wait_for_save,
    wait_for_hydration,
)
from itests.webui.entities.conftest import AnotherUserAndWorkspace


@pytest.fixture(autouse=True, scope="module")
def _enable_time_plans_feature(logged_in_client: AuthenticatedClient) -> Iterator[None]:
    try:
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.TIME_PLANS, value=True
            ),
        )
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.BIG_PLANS, value=True
            ),
        )
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.TODO_TASK, value=True
            ),
        )
        yield
    finally:
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.TODO_TASK, value=False
            ),
        )
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.BIG_PLANS, value=False
            ),
        )
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.TIME_PLANS, value=False
            ),
        )


@pytest.fixture()
def create_time_plan(logged_in_client: AuthenticatedClient):
    def _create_time_plan(day: str, period: RecurringTaskPeriod) -> TimePlan:
        result = time_plan_create_sync(
            client=logged_in_client,
            body=TimePlanCreateArgs(right_now=day, period=period),
        )
        return get_parsed_from_response(TimePlanCreateResult, result).new_time_plan

    return _create_time_plan


@pytest.fixture()
def create_question(logged_in_client: AuthenticatedClient):
    def _create(
        name: str, period: RecurringTaskPeriod = RecurringTaskPeriod.WEEKLY
    ) -> TimePlanQuestion:
        result = time_plan_question_create_sync(
            client=logged_in_client,
            body=TimePlanQuestionCreateArgs(name=name, period=period),
        )
        return get_parsed_from_response(
            TimePlanQuestionCreateResult, result
        ).new_time_plan_question

    return _create


def _wait_for_note_editor(page: Page) -> None:
    editor = page.locator("#entity-block-editor")
    editor.wait_for(state="visible")
    handle = editor.element_handle()
    if handle is not None:
        page.wait_for_function(
            """(el) =>
                el.dataset.editorReady === "true" ||
                !!el.querySelector("[data-editor-ready='true']")
            """,
            arg=handle,
        )


def _note_heading_texts(page: Page) -> list[str]:
    _wait_for_note_editor(page)
    return [
        text.strip()
        for text in page.locator("#entity-block-editor .ce-header").all_text_contents()
    ]


def _deselect_all_new_time_plan_questions(page: Page) -> None:
    cards = page.locator("[id^='time-plan-new-question-']")
    for index in range(cards.count()):
        _set_new_time_plan_question_selected(
            page, cards.nth(index).get_attribute("id"), selected=False
        )


def _set_new_time_plan_question_selected(
    page: Page, entity_id: str | None, *, selected: bool
) -> None:
    assert entity_id is not None
    card = page.locator(f"#{entity_id}")
    is_selected = "el => getComputedStyle(el).boxShadow.includes('inset')"
    for _ in range(4):
        if card.evaluate(is_selected) == selected:
            return
        card.click()
        # The card animates its shadow, and mid-animation it still reads as
        # selected; wait for the click to show before looking again.
        try:
            page.wait_for_function(
                "([el, want]) => getComputedStyle(el).boxShadow.includes('inset') === want",
                arg=[card.element_handle(), selected],
                timeout=2000,
            )
        except PlaywrightTimeoutError:
            continue
    raise AssertionError(f"Could not set {entity_id} selected={selected}")


@pytest.fixture()
def create_time_plan_activity_from_big_plan(logged_in_client: AuthenticatedClient):
    def _create_time_plan_activity(
        time_plan_id: int, big_plan_id: int
    ) -> TimePlanActivity:
        result = time_plan_activity_create_big_plan_sync(
            client=logged_in_client,
            body=TimePlanAssociateWithBigPlansArgs(
                ref_id=str(time_plan_id),
                big_plan_ref_ids=[str(big_plan_id)],
                override_existing_dates=False,
                kind=TimePlanActivityKind.FINISH,
                feasability=TimePlanActivityFeasability.MUST_DO,
            ),
        )
        return get_parsed_from_response(
            TimePlanAssociateWithBigPlansResult, result
        ).new_time_plan_activities[0]

    return _create_time_plan_activity


@pytest.fixture()
def create_time_plan_activity_from_habit(logged_in_client: AuthenticatedClient):
    def _create_time_plan_activity(
        time_plan_id: str, habit_id: str
    ) -> TimePlanActivity:
        result = time_plan_associate_with_habits_sync(
            client=logged_in_client,
            body=TimePlanAssociateWithHabitsArgs(
                ref_id=str(time_plan_id),
                habit_ref_ids=[str(habit_id)],
                kind=TimePlanActivityKind.FINISH,
                feasability=TimePlanActivityFeasability.MUST_DO,
            ),
        )
        return next(
            activity
            for activity in get_parsed_from_response(
                TimePlanAssociateWithHabitsResult, result
            ).new_time_plan_activities
            if activity.target == f"Habit:std:{habit_id}"
        )

    return _create_time_plan_activity


@pytest.fixture()
def create_time_plan_activity_from_chore(logged_in_client: AuthenticatedClient):
    def _create_time_plan_activity(
        time_plan_id: str, chore_id: str
    ) -> TimePlanActivity:
        result = time_plan_associate_with_chores_sync(
            client=logged_in_client,
            body=TimePlanAssociateWithChoresArgs(
                ref_id=str(time_plan_id),
                chore_ref_ids=[str(chore_id)],
                kind=TimePlanActivityKind.FINISH,
                feasability=TimePlanActivityFeasability.MUST_DO,
            ),
        )
        return next(
            activity
            for activity in get_parsed_from_response(
                TimePlanAssociateWithChoresResult, result
            ).new_time_plan_activities
            if activity.target == f"Chore:std:{chore_id}"
        )

    return _create_time_plan_activity


@pytest.fixture()
def create_time_plan_activity_from_habit_stack(logged_in_client: AuthenticatedClient):
    def _create_time_plan_activity(
        time_plan_id: str, stack_id: str
    ) -> TimePlanActivity:
        result = time_plan_associate_with_habit_stacks_sync(
            client=logged_in_client,
            body=TimePlanAssociateWithHabitStacksArgs(
                ref_id=str(time_plan_id),
                habit_stack_ref_ids=[str(stack_id)],
                kind=TimePlanActivityKind.FINISH,
                feasability=TimePlanActivityFeasability.MUST_DO,
            ),
        )
        return next(
            activity
            for activity in get_parsed_from_response(
                TimePlanAssociateWithHabitStacksResult, result
            ).new_time_plan_activities
            if activity.target == f"HabitStack:std:{stack_id}"
        )

    return _create_time_plan_activity


@pytest.fixture()
def create_time_plan_activity_from_chore_stack(logged_in_client: AuthenticatedClient):
    def _create_time_plan_activity(
        time_plan_id: str, stack_id: str
    ) -> TimePlanActivity:
        result = time_plan_associate_with_chore_stacks_sync(
            client=logged_in_client,
            body=TimePlanAssociateWithChoreStacksArgs(
                ref_id=str(time_plan_id),
                chore_stack_ref_ids=[str(stack_id)],
                kind=TimePlanActivityKind.FINISH,
                feasability=TimePlanActivityFeasability.MUST_DO,
            ),
        )
        return next(
            activity
            for activity in get_parsed_from_response(
                TimePlanAssociateWithChoreStacksResult, result
            ).new_time_plan_activities
            if activity.target == f"ChoreStack:std:{stack_id}"
        )

    return _create_time_plan_activity


@pytest.fixture()
def create_time_event_for_time_plan_activity(logged_in_client: AuthenticatedClient):
    def _create_time_event(
        activity_id: str, start_date: str, start_time_in_day: str, duration_mins: int
    ) -> TimeEventInDayBlock:
        result = time_event_in_day_block_create_for_time_plan_activity_sync(
            client=logged_in_client,
            body=TimeEventInDayBlockCreateForTimePlanActivityArgs(
                time_plan_activity_ref_id=str(activity_id),
                start_date=start_date,
                start_time_in_day=start_time_in_day,
                duration_mins=duration_mins,
            ),
        )
        return get_parsed_from_response(
            TimeEventInDayBlockCreateForTimePlanActivityResult, result
        ).new_time_event

    return _create_time_event


@pytest.fixture()
def create_time_plan_activity_from_todo_task(logged_in_client: AuthenticatedClient):
    def _create_time_plan_activity(time_plan_id: int, name: str) -> TimePlanActivity:
        result = todo_task_create_sync(
            client=logged_in_client,
            body=TodoTaskCreateArgs(
                name=name,
                is_key=False,
                eisen=Eisen.REGULAR,
                difficulty=Difficulty.EASY,
                time_plan_ref_id=str(time_plan_id),
                time_plan_activity_kind=TimePlanActivityKind.FINISH,
                time_plan_activity_feasability=TimePlanActivityFeasability.MUST_DO,
            ),
        )
        activity = get_parsed_from_response(
            TodoTaskCreateResult, result
        ).new_time_plan_activity
        assert isinstance(activity, TimePlanActivity)
        return activity

    return _create_time_plan_activity


@pytest.fixture()
def create_time_plan_activity_from_inbox_task(logged_in_client: AuthenticatedClient):
    def _create_time_plan_activity(
        time_plan_id: int, inbox_task_id: int
    ) -> TimePlanActivity:
        result = time_plan_activity_associate_inbox_task_sync(
            client=logged_in_client,
            body=TimePlanAssociateWithInboxTasksArgs(
                ref_id=str(time_plan_id),
                inbox_task_ref_ids=[str(inbox_task_id)],
                override_existing_dates=False,
                kind=TimePlanActivityKind.FINISH,
                feasability=TimePlanActivityFeasability.MUST_DO,
            ),
        )
        return get_parsed_from_response(
            TimePlanAssociateWithInboxTasksResult, result
        ).new_time_plan_activities[0]

    return _create_time_plan_activity


@pytest.fixture()
def create_inbox_task(logged_in_client: AuthenticatedClient):
    def _create_inbox_task(
        name: str, big_plan_id: int | None = None, due_date: str | None = None
    ) -> InboxTask:
        if big_plan_id is not None:
            big_plan_result = big_plan_create_inbox_task_sync(
                client=logged_in_client,
                body=BigPlanCreateInboxTaskArgs(
                    big_plan_ref_id=str(big_plan_id),
                    name=name,
                    is_key=False,
                    eisen=Eisen.REGULAR,
                    difficulty=Difficulty.EASY,
                    due_date=due_date or UNSET,
                ),
            )
            return get_parsed_from_response(
                BigPlanCreateInboxTaskResult, big_plan_result
            ).new_inbox_task
        else:
            todo_task_result = todo_task_create_sync(
                client=logged_in_client,
                body=TodoTaskCreateArgs(
                    name=name,
                    is_key=False,
                    due_date=due_date or UNSET,
                    eisen=Eisen.REGULAR,
                    difficulty=Difficulty.EASY,
                ),
            )
            return get_parsed_from_response(
                TodoTaskCreateResult, todo_task_result
            ).new_inbox_task

    return _create_inbox_task


@pytest.fixture()
def create_big_plan(logged_in_client: AuthenticatedClient):
    def _create_big_plan(
        name: str, actionable_date: str | None = None, due_date: str | None = None
    ) -> BigPlan:
        result = big_plan_create_sync(
            client=logged_in_client,
            body=BigPlanCreateArgs(
                name=name,
                is_key=False,
                eisen=Eisen.REGULAR,
                difficulty=Difficulty.EASY,
                actionable_date=actionable_date or UNSET,
                due_date=due_date or UNSET,
            ),
        )
        return get_parsed_from_response(BigPlanCreateResult, result).new_big_plan

    return _create_big_plan


@pytest.fixture()
def _with_habits_enabled(logged_in_client: AuthenticatedClient) -> Iterator[None]:
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


@pytest.fixture()
def _with_schedule_enabled(logged_in_client: AuthenticatedClient) -> Iterator[None]:
    try:
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(feature=WorkspaceFeature.SCHEDULE, value=True),
        )
        yield
    finally:
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.SCHEDULE, value=False
            ),
        )


@pytest.fixture()
def create_habit(logged_in_client: AuthenticatedClient):
    def _create(
        name: str, period: RecurringTaskPeriod = RecurringTaskPeriod.WEEKLY
    ) -> Habit:
        result = habit_create_sync(
            client=logged_in_client,
            body=HabitCreateArgs(
                name=name,
                period=period,
                is_key=False,
                eisen=Eisen.REGULAR,
                difficulty=Difficulty.EASY,
            ),
        )
        return get_parsed_from_response(HabitCreateResult, result).new_habit

    return _create


@pytest.fixture()
def create_habit_stack(logged_in_client: AuthenticatedClient):
    def _create(
        name: str,
        habit_ref_ids: list[str] | None = None,
        period: RecurringTaskPeriod = RecurringTaskPeriod.WEEKLY,
    ) -> HabitStack:
        result = habit_stack_create_sync(
            client=logged_in_client,
            body=HabitStackCreateArgs(
                name=name,
                period=period,
                habit_ref_ids=habit_ref_ids or [],
            ),
        )
        return get_parsed_from_response(HabitStackCreateResult, result).new_habit_stack

    return _create


@pytest.fixture()
def _with_chores_enabled(logged_in_client: AuthenticatedClient) -> Iterator[None]:
    try:
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(feature=WorkspaceFeature.CHORES, value=True),
        )
        yield
    finally:
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(feature=WorkspaceFeature.CHORES, value=False),
        )


@pytest.fixture()
def create_chore(logged_in_client: AuthenticatedClient):
    def _create(
        name: str, period: RecurringTaskPeriod = RecurringTaskPeriod.WEEKLY
    ) -> Chore:
        result = chore_create_sync(
            client=logged_in_client,
            body=ChoreCreateArgs(
                name=name,
                period=period,
                is_key=False,
                eisen=Eisen.REGULAR,
                difficulty=Difficulty.EASY,
                must_do=False,
            ),
        )
        return get_parsed_from_response(ChoreCreateResult, result).new_chore

    return _create


@pytest.fixture()
def create_chore_stack(logged_in_client: AuthenticatedClient):
    def _create(
        name: str,
        chore_ref_ids: list[str] | None = None,
        period: RecurringTaskPeriod = RecurringTaskPeriod.WEEKLY,
    ) -> ChoreStack:
        result = chore_stack_create_sync(
            client=logged_in_client,
            body=ChoreStackCreateArgs(
                name=name,
                period=period,
                chore_ref_ids=chore_ref_ids or [],
            ),
        )
        return get_parsed_from_response(ChoreStackCreateResult, result).new_chore_stack

    return _create


def test_webui_time_plan_view_all(page: Page, create_time_plan) -> None:
    time_plan1 = create_time_plan("2024-06-18", RecurringTaskPeriod.DAILY)
    time_plan2 = create_time_plan("2024-06-19", RecurringTaskPeriod.DAILY)
    time_plan3 = create_time_plan("2024-06-19", RecurringTaskPeriod.WEEKLY)

    page.goto("/app/workspace/apps/time-plans")

    expect(page.locator(f"#time-plan-{time_plan1.ref_id}")).to_contain_text(
        "Daily plan for 2024-06-18"
    )
    expect(page.locator(f"#time-plan-{time_plan2.ref_id}")).to_contain_text(
        "Daily plan for 2024-06-19"
    )
    expect(page.locator(f"#time-plan-{time_plan3.ref_id}")).to_contain_text(
        "Weekly plan for 2024-06-19"
    )


def test_webui_time_plan_view_one(page: Page, create_time_plan) -> None:
    time_plan = create_time_plan("2024-06-18", RecurringTaskPeriod.DAILY)
    page.goto(f"/app/workspace/apps/time-plans/{time_plan.ref_id}")
    page.wait_for_selector("#branch-panel")

    expect(page.locator('input[name="rightNow"]')).to_have_value("2024-06-18")
    expect(page.locator('input[name="period"]')).to_have_value("daily")


def test_webui_time_plan_publish_and_view_public(page: Page, create_time_plan) -> None:
    time_plan = create_time_plan("2024-06-18", RecurringTaskPeriod.DAILY)
    page.goto(f"/app/workspace/apps/time-plans/{time_plan.ref_id}")
    page.wait_for_selector("#branch-panel")

    open_branch_publish_panel(page, "TimePlan-publish")
    page.locator("button[id='TimePlan-publish-create']").click()
    page.wait_for_url(re.compile(rf"/app/workspace/apps/time-plans/{time_plan.ref_id}"))
    page.wait_for_selector("#branch-panel")

    open_branch_publish_panel(page, "TimePlan-publish")
    expect(page.locator("#TimePlan-publish")).to_contain_text("draft")

    page.locator("button[id='TimePlan-publish-toggle-status']").click()
    page.wait_for_url(re.compile(rf"/app/workspace/apps/time-plans/{time_plan.ref_id}"))
    page.wait_for_selector("#branch-panel")

    open_branch_publish_panel(page, "TimePlan-publish")
    expect(page.locator("#TimePlan-publish")).to_contain_text("active")

    public_url = page.locator('input[name="publicUrl"]').input_value()
    assert "/publish/" in public_url

    page.goto(public_url)
    page.wait_for_url(re.compile(r"/publish/time-plan/"))
    page.wait_for_selector("#leaf-panel")

    expect(page.locator('input[name="rightNow"]')).to_have_value("2024-06-18")


def test_webui_time_plan_create(page: Page, create_time_plan) -> None:
    page.goto("/app/workspace/apps/time-plans/new")
    page.wait_for_selector("#leaf-panel")

    page.locator('input[name="rightNow"]').fill("2024-06-18")
    page.locator('button[id="period-weekly"]').click()
    page.locator("#time-plan-create").click()

    page.wait_for_url(re.compile(r"/app/workspace/apps/time-plans/\d+"))

    page.wait_for_selector("#branch-panel")
    expect(page.locator('input[name="rightNow"]')).to_have_value("2024-06-18")
    # After creation, we're on the view page which uses compact mode (Select dropdown)
    expect(page.locator('input[name="period"]')).to_have_value("weekly")


def test_webui_time_plan_question_create_and_update(page: Page) -> None:
    page.goto("/app/workspace/apps/time-plans")
    page.wait_for_selector("#trunk-panel")
    page.locator("#time-plans-questions").click()
    page.wait_for_selector("#branch-panel")

    page.locator("#branch-new-leaf-entity").click()
    page.wait_for_selector("#leaf-panel")
    fill_after_hydration(page.locator('input[name="name"]'), "What went well?")
    page.locator("button[id='period-weekly']").click()
    page.locator("button[id='time-plan-question-create']").click()

    page.wait_for_url(re.compile(r"/app/workspace/apps/time-plans/questions/\d+"))
    page.wait_for_selector("#leaf-panel")
    expect(page.locator('input[name="name"]')).to_have_value("What went well?")

    fill_after_hydration(page.locator('input[name="name"]'), "What went better?")
    page.locator("button[id='time-plan-question-update']").click()
    page.wait_for_selector("#leaf-panel")
    expect(page.locator('input[name="name"]')).to_have_value("What went better?")


def test_webui_time_plan_create_shows_period_questions(
    page: Page, logged_in_client: AuthenticatedClient
) -> None:
    question = get_parsed_from_response(
        TimePlanQuestionCreateResult,
        time_plan_question_create_sync(
            client=logged_in_client,
            body=TimePlanQuestionCreateArgs(
                name="Weekly wins",
                period=RecurringTaskPeriod.WEEKLY,
            ),
        ),
    ).new_time_plan_question

    page.goto("/app/workspace/apps/time-plans/new")
    page.wait_for_selector("#leaf-panel")
    expect(page.locator(f"#time-plan-new-question-{question.ref_id}")).to_contain_text(
        "Weekly wins"
    )


def test_webui_time_plan_question_create_find_and_load(page: Page) -> None:
    name = f"What went well {uuid.uuid4().hex[:8]}"

    page.goto("/app/workspace/apps/time-plans")
    page.wait_for_selector("#trunk-panel")
    page.locator("#time-plans-questions").click()
    page.wait_for_selector("#branch-panel")

    page.locator("#branch-new-leaf-entity").click()
    page.wait_for_selector("#leaf-panel")
    fill_after_hydration(page.locator('input[name="name"]'), name)
    page.locator("button[id='period-weekly']").click()
    page.locator("button[id='time-plan-question-create']").click()

    page.wait_for_url(re.compile(r"/app/workspace/apps/time-plans/questions/\d+"))
    page.wait_for_selector("#leaf-panel")
    expect(page.locator('input[name="name"]')).to_have_value(name)
    expect(page.locator("#leaf-panel")).to_contain_text("Weekly")

    question_match = re.search(r"/questions/(\d+)", page.url)
    assert question_match is not None
    question_id = question_match.group(1)

    page.goto("/app/workspace/apps/time-plans/questions")
    page.wait_for_selector("#branch-panel")
    expect(page.locator("#branch-panel")).to_contain_text("Weekly Questions")
    expect(page.locator(f"#time-plan-question-{question_id}")).to_contain_text(name)

    page.locator(f"#time-plan-question-{question_id} a").click()
    page.wait_for_url(
        re.compile(rf"/app/workspace/apps/time-plans/questions/{question_id}")
    )
    page.wait_for_selector("#leaf-panel")
    expect(page.locator('input[name="name"]')).to_have_value(name)


def test_webui_time_plan_question_update_archive_and_remove(page: Page) -> None:
    original_name = f"What should I change {uuid.uuid4().hex[:8]}"
    updated_name = f"What will I change {uuid.uuid4().hex[:8]}"

    page.goto("/app/workspace/apps/time-plans/questions/new")
    page.wait_for_selector("#leaf-panel")
    fill_after_hydration(page.locator('input[name="name"]'), original_name)
    page.locator("button[id='period-weekly']").click()
    page.locator("button[id='time-plan-question-create']").click()

    page.wait_for_url(re.compile(r"/app/workspace/apps/time-plans/questions/\d+"))
    page.wait_for_selector("#leaf-panel")
    question_match = re.search(r"/questions/(\d+)", page.url)
    assert question_match is not None
    question_id = question_match.group(1)

    fill_after_hydration(page.locator('input[name="name"]'), updated_name)
    page.locator("button[id='time-plan-question-update']").click()
    page.wait_for_selector("#leaf-panel")
    expect(page.locator('input[name="name"]')).to_have_value(updated_name)

    page.locator("button[id='leaf-entity-archive']").click()
    page.locator("button[id='leaf-entity-archive-confirm']").click()
    expect(page.locator("#leaf-entity-archive-confirm")).to_have_attribute(
        "value", "remove"
    )

    page.goto("/app/workspace/apps/time-plans/questions")
    page.wait_for_selector("#branch-panel")
    expect(page.locator(f"#time-plan-question-{question_id}")).to_have_count(0)

    page.goto(f"/app/workspace/apps/time-plans/questions/{question_id}")
    page.wait_for_selector("#leaf-panel")
    expect(page.locator('input[name="name"]')).to_have_value(updated_name)

    page.locator("button[id='leaf-entity-archive']").click()
    page.locator("button[id='leaf-entity-archive-confirm']").click()
    page.wait_for_url("/app/workspace/apps/time-plans/questions")

    page.goto(f"/app/workspace/apps/time-plans/questions/{question_id}")
    expect(page.locator("body")).to_contain_text(
        f"Could not find time plan question #{question_id}"
    )


def test_webui_time_plan_question_reorder(page: Page, create_question) -> None:
    first = create_question(f"First question {uuid.uuid4().hex[:8]}")
    second = create_question(f"Second question {uuid.uuid4().hex[:8]}")

    page.goto("/app/workspace/apps/time-plans/questions")
    page.wait_for_selector("#branch-panel")
    expect(page.locator(f"#time-plan-question-{first.ref_id}")).to_be_visible()
    expect(page.locator(f"#time-plan-question-{second.ref_id}")).to_be_visible()

    page.locator(f"#time-plan-question-{first.ref_id}-down").click()
    page.wait_for_function(
        """([secondId, firstId]) => {
            const ids = [...document.querySelectorAll("[id^='time-plan-question-']")]
                .map((el) => el.id)
                .filter((id) => /^time-plan-question-\\d+$/.test(id));
            return (
                ids.indexOf(secondId) !== -1 &&
                ids.indexOf(firstId) !== -1 &&
                ids.indexOf(secondId) < ids.indexOf(firstId)
            );
        }""",
        arg=[
            f"time-plan-question-{second.ref_id}",
            f"time-plan-question-{first.ref_id}",
        ],
    )


def test_webui_time_plan_question_list_groups_by_period(
    page: Page, create_question
) -> None:
    weekly = create_question(
        f"Weekly grouped {uuid.uuid4().hex[:8]}", RecurringTaskPeriod.WEEKLY
    )
    daily = create_question(
        f"Daily grouped {uuid.uuid4().hex[:8]}", RecurringTaskPeriod.DAILY
    )

    page.goto("/app/workspace/apps/time-plans/questions")
    page.wait_for_selector("#branch-panel")
    expect(page.locator("#branch-panel")).to_contain_text("Weekly Questions")
    expect(page.locator("#branch-panel")).to_contain_text("Daily Questions")
    expect(page.locator(f"#time-plan-question-{weekly.ref_id}")).to_contain_text(
        weekly.name
    )
    expect(page.locator(f"#time-plan-question-{daily.ref_id}")).to_contain_text(
        daily.name
    )


def test_webui_time_plan_create_includes_selected_questions_in_note(
    page: Page, create_question
) -> None:
    first = create_question(f"Wins {uuid.uuid4().hex[:8]}")
    second = create_question(f"Lessons {uuid.uuid4().hex[:8]}")
    ignored = create_question(f"Ignored {uuid.uuid4().hex[:8]}")

    page.goto("/app/workspace/apps/time-plans/new")
    page.wait_for_selector("#leaf-panel")
    expect(page.locator(f"#time-plan-new-question-{first.ref_id}")).to_be_visible()

    fill_after_hydration(page.locator('input[name="rightNow"]'), "2025-04-07")
    page.locator("button[id='period-weekly']").click()
    expect(page.locator("button[id='time-plan-create']")).to_be_enabled()
    _deselect_all_new_time_plan_questions(page)
    _set_new_time_plan_question_selected(
        page, f"time-plan-new-question-{first.ref_id}", selected=True
    )
    _set_new_time_plan_question_selected(
        page, f"time-plan-new-question-{second.ref_id}", selected=True
    )
    page.locator("button[id='time-plan-create']").click()

    page.wait_for_url(re.compile(r"/app/workspace/apps/time-plans/\d+"))
    page.wait_for_selector("#branch-panel")
    headings = _note_heading_texts(page)
    assert headings == [first.name, second.name]
    expect(page.locator("#entity-block-editor")).not_to_contain_text(ignored.name)


def test_webui_time_plan_create_defaults_to_all_period_questions(
    page: Page, create_question
) -> None:
    first = create_question(f"Default all first {uuid.uuid4().hex[:8]}")
    second = create_question(f"Default all second {uuid.uuid4().hex[:8]}")

    page.goto("/app/workspace/apps/time-plans/new")
    page.wait_for_selector("#leaf-panel")
    expect(page.locator(f"#time-plan-new-question-{first.ref_id}")).to_be_visible()
    expect(page.locator(f"#time-plan-new-question-{second.ref_id}")).to_be_visible()

    fill_after_hydration(page.locator('input[name="rightNow"]'), "2025-04-14")
    page.locator("button[id='period-weekly']").click()
    page.locator("button[id='time-plan-create']").click()

    page.wait_for_url(re.compile(r"/app/workspace/apps/time-plans/\d+"))
    page.wait_for_selector("#branch-panel")
    headings = _note_heading_texts(page)
    assert first.name in headings
    assert second.name in headings
    assert headings.index(first.name) < headings.index(second.name)


def test_webui_time_plan_create_with_no_questions_selected(
    page: Page, create_question
) -> None:
    ignored = create_question(f"Should not appear {uuid.uuid4().hex[:8]}")

    page.goto("/app/workspace/apps/time-plans/new")
    page.wait_for_selector("#leaf-panel")
    expect(page.locator(f"#time-plan-new-question-{ignored.ref_id}")).to_be_visible()

    fill_after_hydration(page.locator('input[name="rightNow"]'), "2025-04-21")
    page.locator("button[id='period-weekly']").click()
    expect(page.locator("button[id='time-plan-create']")).to_be_enabled()
    _deselect_all_new_time_plan_questions(page)
    page.locator("button[id='time-plan-create']").click()

    page.wait_for_url(re.compile(r"/app/workspace/apps/time-plans/\d+"))
    page.wait_for_selector("#branch-panel")
    _wait_for_note_editor(page)
    expect(page.locator("#entity-block-editor")).not_to_contain_text(ignored.name)
    assert _note_heading_texts(page) == []


def test_webui_time_plan_update(page: Page, create_time_plan) -> None:
    time_plan = create_time_plan("2024-06-18", RecurringTaskPeriod.DAILY)
    page.goto(f"/app/workspace/apps/time-plans/{time_plan.ref_id}")
    page.wait_for_selector("#branch-panel")

    page.locator('input[name="rightNow"]').fill("2024-06-19")
    page.get_by_label("Period").click()
    page.get_by_role("option", name="Daily").click()
    page.locator("#time-plan-change-time-config").click()

    page.wait_for_url(re.compile(r"/app/workspace/apps/time-plans/\d+"))

    page.wait_for_selector("#branch-panel")
    expect(page.locator('input[name="rightNow"]')).to_have_value("2024-06-19")
    # Check the Select has the correct value
    expect(page.locator('input[name="period"]')).to_have_value("daily")


def test_webui_time_plan_change_note(page: Page, create_time_plan) -> None:
    time_plan = create_time_plan("2024-06-18", RecurringTaskPeriod.DAILY)
    page.goto(f"/app/workspace/apps/time-plans/{time_plan.ref_id}")
    page.wait_for_selector("#branch-panel")
    page.reload()
    page.wait_for_selector("#branch-panel")
    page.wait_for_selector("#entity-block-editor")

    type_entity_note_editor_and_wait_for_save(page, "This is a note.")

    page.wait_for_url(re.compile(r"/app/workspace/apps/time-plans/\d+"))

    expect(
        page.locator('#entity-block-editor [contenteditable="true"]').first
    ).to_contain_text("This is a note.")

    page.reload()

    page.wait_for_selector("#branch-panel")

    expect(
        page.locator('#entity-block-editor [contenteditable="true"]').first
    ).to_contain_text("This is a note.")


def test_webui_time_plan_archive(page: Page, create_time_plan) -> None:
    time_plan = create_time_plan("2024-06-18", RecurringTaskPeriod.DAILY)
    page.goto(f"/app/workspace/apps/time-plans/{time_plan.ref_id}")
    page.wait_for_selector("#branch-panel")

    page.locator("#branch-entity-archive").click()
    page.locator("#branch-entity-archive-confirm").click()

    page.wait_for_url("/app/workspace/apps/time-plans")

    page.goto(f"/app/workspace/apps/time-plans/{time_plan.ref_id}")
    page.wait_for_selector("#branch-panel")

    expect(page.locator("#time-plan-change-time-config")).to_be_disabled()

    entity_id = page.url.split("/")[-1]
    expect(page.locator(f"#time-plan-{entity_id}")).to_have_count(0)


def test_webui_time_plan_link_untracked_inbox_tasks(
    logged_in_client: AuthenticatedClient,
    page: Page,
    create_time_plan,
    create_inbox_task,
) -> None:
    this_year = pendulum.now().year
    time_plan = create_time_plan(f"{this_year}-06-18", RecurringTaskPeriod.YEARLY)
    inbox_task = create_inbox_task("Untracked Inbox Task")
    _mark_inbox_task_done(logged_in_client, inbox_task)

    page.goto(f"/app/workspace/apps/time-plans/{time_plan.ref_id}")
    page.wait_for_selector("#branch-panel")

    expect(page.locator("#time-plan-untracked-inbox-tasks")).to_contain_text(
        "Untracked Inbox Task"
    )


def test_webui_time_plan_link_untracked_big_plans(
    logged_in_client: AuthenticatedClient, page: Page, create_time_plan, create_big_plan
) -> None:
    this_year = pendulum.now().year
    time_plan = create_time_plan(f"{this_year}-06-18", RecurringTaskPeriod.YEARLY)
    big_plan = create_big_plan("Untracked Big Plan")
    _mark_big_plan_done(logged_in_client, big_plan)

    page.goto(f"/app/workspace/apps/time-plans/{time_plan.ref_id}")
    page.wait_for_selector("#branch-panel")

    expect(page.locator("#time-plan-untracked-big-plans")).to_contain_text(
        "Untracked Big Plan"
    )


def test_webui_time_plan_link_lower_time_plans(page: Page, create_time_plan) -> None:
    _ = create_time_plan("2024-06-18", RecurringTaskPeriod.DAILY)
    _ = create_time_plan("2024-06-19", RecurringTaskPeriod.DAILY)
    time_plan2 = create_time_plan("2024-06-19", RecurringTaskPeriod.WEEKLY)

    page.goto(f"/app/workspace/apps/time-plans/{time_plan2.ref_id}")
    page.wait_for_selector("#branch-panel")

    expect(page.locator("#time-plan-lower")).to_contain_text(
        "Daily plan for 2024-06-18"
    )
    expect(page.locator("#time-plan-lower")).to_contain_text(
        "Daily plan for 2024-06-19"
    )


def test_webui_time_plan_link_higher_time_plan(page: Page, create_time_plan) -> None:
    time_plan1 = create_time_plan("2024-06-18", RecurringTaskPeriod.DAILY)
    _ = create_time_plan("2024-06-19", RecurringTaskPeriod.DAILY)
    _ = create_time_plan("2024-06-19", RecurringTaskPeriod.WEEKLY)

    page.goto(f"/app/workspace/apps/time-plans/{time_plan1.ref_id}")
    page.wait_for_selector("#branch-panel")

    expect(page.locator("#time-plan-higher")).to_contain_text(
        "Weekly plan for 2024-06-19"
    )


def test_webui_time_plan_link_previous_time_plan(page: Page, create_time_plan) -> None:
    _ = create_time_plan("2024-06-18", RecurringTaskPeriod.DAILY)
    time_plan1 = create_time_plan("2024-06-19", RecurringTaskPeriod.DAILY)
    _ = create_time_plan("2024-06-19", RecurringTaskPeriod.WEEKLY)

    page.goto(f"/app/workspace/apps/time-plans/{time_plan1.ref_id}")
    page.wait_for_selector("#branch-panel")

    expect(page.locator("#time-plan-previous")).to_contain_text(
        "Daily plan for 2024-06-18"
    )


def test_webui_time_plan_create_new_todo_task_activity(
    page: Page, create_time_plan
) -> None:
    time_plan = create_time_plan("2024-06-18", RecurringTaskPeriod.DAILY)
    page.goto(f"/app/workspace/apps/time-plans/{time_plan.ref_id}")
    wait_for_hydration(page)

    page.locator("#section-action-nav-multiple-compact-button").click()
    page.get_by_role("menuitem", name="New Todo").click()

    page.wait_for_url(re.compile(r"/app/workspace/apps/time-plans/\d+/new-todo-task"))

    page.locator('input[name="name"]').fill("New Todo Task")
    page.locator("button[id='todo-create']").click()

    page.wait_for_url(
        re.compile(rf"/app/workspace/apps/time-plans/{time_plan.ref_id}/\d+")
    )

    expect(
        page.locator("button[id='time-plan-activity-kind-finish']")
    ).to_have_attribute("aria-pressed", "true")
    expect(
        page.locator("button[id='time-plan-activity-feasability-nice-to-have']")
    ).to_have_attribute("aria-pressed", "true")

    expect(page.locator("input[name='targetTodoTaskName']")).to_have_value(
        "New Todo Task"
    )


def test_webui_time_plan_create_new_todo_task_shows_in_activities(
    page: Page, create_time_plan
) -> None:
    time_plan = create_time_plan("2024-06-18", RecurringTaskPeriod.DAILY)
    page.goto(f"/app/workspace/apps/time-plans/{time_plan.ref_id}")
    wait_for_hydration(page)

    page.locator("#section-action-nav-multiple-compact-button").click()
    page.get_by_role("menuitem", name="New Todo").click()

    page.wait_for_url(re.compile(r"/app/workspace/apps/time-plans/\d+/new-todo-task"))

    page.locator('input[name="name"]').fill("New Todo Task")
    page.locator("button[id='todo-create']").click()

    page.wait_for_url(
        re.compile(rf"/app/workspace/apps/time-plans/{time_plan.ref_id}/\d+")
    )

    expect(
        page.locator("button[id='time-plan-activity-kind-finish']")
    ).to_have_attribute("aria-pressed", "true")
    expect(
        page.locator("button[id='time-plan-activity-feasability-nice-to-have']")
    ).to_have_attribute("aria-pressed", "true")

    page.goto(f"/app/workspace/apps/time-plans/{time_plan.ref_id}")

    expect(page.locator("#time-plan-activities")).to_contain_text("New Todo Task")


def test_webui_time_plan_create_new_big_plan_activity(
    page: Page, create_time_plan, create_big_plan
) -> None:
    time_plan = create_time_plan("2024-06-18", RecurringTaskPeriod.DAILY)
    page.goto(f"/app/workspace/apps/time-plans/{time_plan.ref_id}")
    wait_for_hydration(page)

    page.locator("#section-action-nav-multiple-compact-button").click()
    page.get_by_role("menuitem", name="New Big Plan").click()

    page.wait_for_url(re.compile(r"/app/workspace/apps/time-plans/\d+/new-big-plan"))

    page.locator('input[name="name"]').fill("New Big Plan")
    page.locator("button[id='big-plan-create']").click()

    page.wait_for_url(
        re.compile(rf"/app/workspace/apps/time-plans/{time_plan.ref_id}/\d+")
    )

    expect(
        page.locator("button[id='time-plan-activity-kind-finish']")
    ).to_have_attribute("aria-pressed", "true")
    expect(
        page.locator("button[id='time-plan-activity-feasability-nice-to-have']")
    ).to_have_attribute("aria-pressed", "true")

    expect(page.locator("input[name='targetBigPlanName']")).to_have_value(
        "New Big Plan"
    )


def test_webui_time_plan_create_new_inbox_task_from_big_plan_activity(
    page: Page,
    create_time_plan,
    create_big_plan,
    create_time_plan_activity_from_big_plan,
) -> None:
    time_plan = create_time_plan("2024-06-18", RecurringTaskPeriod.DAILY)
    big_plan = create_big_plan("The Big Plan")
    big_plan_activity = create_time_plan_activity_from_big_plan(
        time_plan.ref_id, big_plan.ref_id
    )

    page.goto(
        f"/app/workspace/apps/time-plans/{time_plan.ref_id}/{big_plan_activity.ref_id}"
    )

    page.locator("#leaf-panel").locator("a", has_text="New Inbox Task").click()

    page.wait_for_url(
        re.compile(
            rf"/app/workspace/apps/time-plans/{time_plan.ref_id}/new-big-plan-inbox-task"
        )
    )

    page.locator("#leaf-panel").locator('input[name="name"]').fill("The New Inbox Task")
    page.locator("#leaf-panel").locator(
        "button[id='big-plan-inbox-task-create']"
    ).click()

    page.wait_for_url(
        re.compile(rf"/app/workspace/apps/time-plans/{time_plan.ref_id}/\d+")
    )

    expect(page.locator("#time-plan-activities")).to_contain_text("The New Inbox Task")

    page.locator("#time-plan-activities").locator(
        "a", has_text="The New Inbox Task"
    ).click(force=True)

    page.wait_for_url(
        re.compile(rf"/app/workspace/apps/time-plans/{time_plan.ref_id}/\d+")
    )

    expect(
        page.locator("button[id='time-plan-activity-kind-finish']")
    ).to_have_attribute("aria-pressed", "true")
    expect(
        page.locator("button[id='time-plan-activity-feasability-must-do']")
    ).to_have_attribute("aria-pressed", "true")


def test_webui_time_plan_create_activities_from_inbox_tasks_of_an_associated_big_plan(
    page: Page,
    create_time_plan,
    create_big_plan,
    create_inbox_task,
    create_time_plan_activity_from_big_plan,
) -> None:
    time_plan = create_time_plan("2024-06-18", RecurringTaskPeriod.DAILY)
    big_plan = create_big_plan("The Big Plan")
    _ = create_inbox_task("The Inbox Task", big_plan_id=big_plan.ref_id)
    _ = create_inbox_task("Other Inbox Task", big_plan_id=big_plan.ref_id)
    big_plan_activity = create_time_plan_activity_from_big_plan(
        time_plan.ref_id, big_plan.ref_id
    )

    page.goto(
        f"/app/workspace/apps/time-plans/{time_plan.ref_id}/{big_plan_activity.ref_id}"
    )

    page.locator("#leaf-panel").locator(
        "a", has_text="From Big Plan Inbox Tasks"
    ).click()

    page.wait_for_url(
        re.compile(
            rf"workspace/apps/time-plans/{time_plan.ref_id}/add-from-big-plan-inbox-tasks"
        )
    )

    page.locator("#time-plan-big-plan-inbox-tasks").locator(
        "p", has_text="The Inbox Task"
    ).click()

    page.locator("#time-plan-big-plan-inbox-tasks").locator(
        "button", has_text=re.compile(r"^Add$")
    ).click()

    page.wait_for_url(
        re.compile(rf"/app/workspace/apps/time-plans/{time_plan.ref_id}/\d+")
    )

    page.goto(f"/app/workspace/apps/time-plans/{time_plan.ref_id}")

    expect(page.locator("#time-plan-activities")).to_contain_text("The Inbox Task")
    expect(page.locator("#time-plan-activities")).not_to_contain_text(
        "Other Inbox Task"
    )


def test_webui_time_plan_associate_with_big_plan(
    page: Page, create_time_plan, create_big_plan
) -> None:
    time_plan = create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    big_plan = create_big_plan(
        "The Big Plan", actionable_date="2024-06-10", due_date="2024-06-19"
    )

    page.goto(f"/app/workspace/apps/time-plans/{time_plan.ref_id}")

    page.locator("#section-action-nav-multiple-compact-button").click()
    page.get_by_role("menuitem", name="From Existing Big Plans").click()

    page.wait_for_url(
        re.compile(r"/app/workspace/apps/time-plans/\d+/add-from-current-big-plans")
    )

    page.locator("#time-plan-current-big-plans").locator(
        "p", has_text="The Big Plan"
    ).click()

    page.locator("#time-plan-current-big-plans").locator(
        "button", has_text=re.compile(r"^Add$")
    ).click()

    page.wait_for_url(re.compile(rf"/app/workspace/apps/time-plans/{time_plan.ref_id}"))

    expect(page.locator("#time-plan-activities")).to_contain_text("The Big Plan")

    page.goto(f"/app/workspace/apps/big-plans/{big_plan.ref_id}")
    expect(page.locator("input[name='actionableDate']")).to_have_value("2024-06-10")
    expect(page.locator("input[name='dueDate']")).to_have_value("2024-06-19")


def test_webui_time_plan_associate_with_big_plan_no_dates(
    page: Page, create_time_plan, create_big_plan
) -> None:
    time_plan = create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    big_plan = create_big_plan("The Big Plan")

    page.goto(f"/app/workspace/apps/time-plans/{time_plan.ref_id}")

    page.locator("#section-action-nav-multiple-compact-button").click()
    page.get_by_role("menuitem", name="From Existing Big Plans").click()

    page.wait_for_url(
        re.compile(r"/app/workspace/apps/time-plans/\d+/add-from-current-big-plans")
    )

    page.locator("#time-plan-current-big-plans").locator(
        "p", has_text="The Big Plan"
    ).click()

    page.locator("#time-plan-current-big-plans").locator(
        "button", has_text=re.compile(r"^Add$")
    ).click()

    page.wait_for_url(re.compile(rf"/app/workspace/apps/time-plans/{time_plan.ref_id}"))

    expect(page.locator("#time-plan-activities")).to_contain_text("The Big Plan")

    page.goto(f"/app/workspace/apps/big-plans/{big_plan.ref_id}")
    expect(page.locator("input[name='actionableDate']")).to_have_value("2024-06-17")
    expect(page.locator("input[name='dueDate']")).to_have_value("2024-06-23")


def test_webui_time_plan_associate_with_big_plan_and_override_dates(
    page: Page, create_time_plan, create_big_plan
) -> None:
    time_plan = create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    big_plan = create_big_plan(
        "The Big Plan", actionable_date="2024-06-10", due_date="2024-06-19"
    )

    page.goto(f"/app/workspace/apps/time-plans/{time_plan.ref_id}")

    page.locator("#section-action-nav-multiple-compact-button").click()
    page.get_by_role("menuitem", name="From Existing Big Plans").click()

    page.wait_for_url(
        re.compile(r"/app/workspace/apps/time-plans/\d+/add-from-current-big-plans")
    )

    page.locator("#time-plan-current-big-plans").locator(
        "p", has_text="The Big Plan"
    ).click()

    page.locator("#time-plan-current-big-plans").locator(
        "button", has_text=re.compile(r"^Add And Override Dates$")
    ).click()

    page.wait_for_url(re.compile(rf"/app/workspace/apps/time-plans/{time_plan.ref_id}"))

    expect(page.locator("#time-plan-activities")).to_contain_text("The Big Plan")

    page.goto(f"/app/workspace/apps/big-plans/{big_plan.ref_id}")
    expect(page.locator("input[name='actionableDate']")).to_have_value("2024-06-17")
    expect(page.locator("input[name='dueDate']")).to_have_value("2024-06-23")


def test_webui_time_plan_associate_previous_activity_inbox_task(
    page: Page,
    create_time_plan,
    create_inbox_task,
    create_time_plan_activity_from_inbox_task,
) -> None:
    time_plan_1 = create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    time_plan_2 = create_time_plan("2024-06-25", RecurringTaskPeriod.WEEKLY)
    inbox_task = create_inbox_task("The Inbox Task", due_date="2024-06-18")
    _ = create_time_plan_activity_from_inbox_task(time_plan_1.ref_id, inbox_task.ref_id)

    page.goto(f"/app/workspace/apps/time-plans/{time_plan_2.ref_id}")

    page.locator("#section-action-nav-multiple-compact-button").click()
    page.locator("a", has_text="From Time Plans").click()

    page.wait_for_url(
        re.compile(
            rf"/app/workspace/apps/time-plans/{time_plan_2.ref_id}/add-from-current-time-plans/{time_plan_2.ref_id}"
        )
    )

    page.locator("#time-plan-previous-time-plan").locator(
        "a", has_text="Weekly plan for 2024-06-18"
    ).click()

    page.wait_for_url(
        re.compile(
            rf"/app/workspace/apps/time-plans/{time_plan_2.ref_id}/add-from-current-time-plans/{time_plan_1.ref_id}"
        )
    )

    page.locator("#time-plan-current-activities").get_by_text(
        "The Inbox Task", exact=True
    ).click()

    page.locator("#time-plan-current-activities").locator(
        "button", has_text=re.compile(r"^Add$")
    ).click()

    page.wait_for_url(
        re.compile(rf"/app/workspace/apps/time-plans/{time_plan_2.ref_id}")
    )

    expect(page.locator("#time-plan-activities")).to_contain_text("The Inbox Task")

    page.goto(f"/app/workspace/core/inbox-tasks/{inbox_task.ref_id}")

    expect(page.locator("input[name='actionableDate']")).to_have_value("")
    expect(page.locator("input[name='dueDate']")).to_have_value("2024-06-18")


def test_webui_time_plan_associate_previous_activity_inbox_task_no_dates(
    page: Page,
    logged_in_client: AuthenticatedClient,
    create_time_plan,
    create_inbox_task,
    create_time_plan_activity_from_inbox_task,
) -> None:
    time_plan_1 = create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    time_plan_2 = create_time_plan("2024-06-25", RecurringTaskPeriod.WEEKLY)
    inbox_task = create_inbox_task("The Inbox Task", due_date="2024-06-18")
    _ = create_time_plan_activity_from_inbox_task(time_plan_1.ref_id, inbox_task.ref_id)
    _clear_inbox_task_dates(logged_in_client, inbox_task)

    page.goto(f"/app/workspace/apps/time-plans/{time_plan_2.ref_id}")

    page.locator("#section-action-nav-multiple-compact-button").click()
    page.locator("a", has_text="From Time Plans").click()

    page.wait_for_url(
        re.compile(
            rf"/app/workspace/apps/time-plans/{time_plan_2.ref_id}/add-from-current-time-plans/{time_plan_2.ref_id}"
        )
    )

    page.locator("#time-plan-previous-time-plan").locator(
        "a", has_text="Weekly plan for 2024-06-18"
    ).click()

    page.wait_for_url(
        re.compile(
            rf"/app/workspace/apps/time-plans/{time_plan_2.ref_id}/add-from-current-time-plans/{time_plan_1.ref_id}"
        )
    )

    page.locator("#time-plan-current-activities").get_by_text(
        "The Inbox Task", exact=True
    ).click()

    page.locator("#time-plan-current-activities").locator(
        "button", has_text=re.compile(r"^Add$")
    ).click()

    page.wait_for_url(
        re.compile(rf"/app/workspace/apps/time-plans/{time_plan_2.ref_id}")
    )

    expect(page.locator("#time-plan-activities")).to_contain_text("The Inbox Task")

    page.goto(f"/app/workspace/core/inbox-tasks/{inbox_task.ref_id}")

    expect(page.locator("input[name='actionableDate']")).to_have_value("")
    expect(page.locator("input[name='dueDate']")).to_have_value("2024-06-30")


def test_webui_time_plan_associate_previous_activity_inbox_task_override_dates(
    page: Page,
    create_time_plan,
    create_inbox_task,
    create_time_plan_activity_from_inbox_task,
) -> None:
    time_plan_1 = create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    time_plan_2 = create_time_plan("2024-06-25", RecurringTaskPeriod.WEEKLY)
    inbox_task = create_inbox_task("The Inbox Task", due_date="2024-06-18")
    _ = create_time_plan_activity_from_inbox_task(time_plan_1.ref_id, inbox_task.ref_id)

    page.goto(f"/app/workspace/apps/time-plans/{time_plan_2.ref_id}")

    page.locator("#section-action-nav-multiple-compact-button").click()
    page.locator("a", has_text="From Time Plans").click()

    page.wait_for_url(
        re.compile(
            rf"/app/workspace/apps/time-plans/{time_plan_2.ref_id}/add-from-current-time-plans/{time_plan_2.ref_id}"
        )
    )

    page.locator("#time-plan-previous-time-plan").locator(
        "a", has_text="Weekly plan for 2024-06-18"
    ).click()

    page.wait_for_url(
        re.compile(
            rf"/app/workspace/apps/time-plans/{time_plan_2.ref_id}/add-from-current-time-plans/{time_plan_1.ref_id}"
        )
    )

    page.locator("#time-plan-current-activities").get_by_text(
        "The Inbox Task", exact=True
    ).click()

    page.locator("#time-plan-current-activities").locator(
        "button", has_text=re.compile(r"^Add And Override Dates$")
    ).click()

    page.wait_for_url(
        re.compile(rf"/app/workspace/apps/time-plans/{time_plan_2.ref_id}")
    )

    expect(page.locator("#time-plan-activities")).to_contain_text("The Inbox Task")

    page.goto(f"/app/workspace/core/inbox-tasks/{inbox_task.ref_id}")

    expect(page.locator("input[name='actionableDate']")).to_have_value("")
    expect(page.locator("input[name='dueDate']")).to_have_value("2024-06-30")


def test_webui_time_plan_associate_previous_activity_inbox_task_and_pulls_big_plan(
    page: Page,
    create_time_plan,
    create_inbox_task,
    create_big_plan,
    create_time_plan_activity_from_inbox_task,
) -> None:
    time_plan_1 = create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    time_plan_2 = create_time_plan("2024-06-25", RecurringTaskPeriod.WEEKLY)
    big_plan = create_big_plan(
        "The Big Plan", actionable_date="2024-06-10", due_date="2024-06-19"
    )
    inbox_task = create_inbox_task("The Inbox Task", big_plan_id=big_plan.ref_id)
    _ = create_time_plan_activity_from_inbox_task(time_plan_1.ref_id, inbox_task.ref_id)

    page.goto(f"/app/workspace/apps/time-plans/{time_plan_2.ref_id}")

    page.locator("#section-action-nav-multiple-compact-button").click()
    page.locator("a", has_text="From Time Plans").click()

    page.wait_for_url(
        re.compile(
            rf"/app/workspace/apps/time-plans/{time_plan_2.ref_id}/add-from-current-time-plans/{time_plan_2.ref_id}"
        )
    )

    page.locator("#time-plan-previous-time-plan").locator(
        "a", has_text="Weekly plan for 2024-06-18"
    ).click()

    page.wait_for_url(
        re.compile(
            rf"/app/workspace/apps/time-plans/{time_plan_2.ref_id}/add-from-current-time-plans/{time_plan_1.ref_id}"
        )
    )

    page.locator("#time-plan-current-activities").get_by_text(
        "The Inbox Task", exact=True
    ).click()

    page.locator("#time-plan-current-activities").locator(
        "button", has_text=re.compile(r"^Add$")
    ).click()

    page.wait_for_url(
        re.compile(rf"/app/workspace/apps/time-plans/{time_plan_2.ref_id}")
    )

    expect(page.locator("#time-plan-activities")).to_contain_text("The Inbox Task")
    expect(page.locator("#time-plan-activities")).to_contain_text("The Big Plan")

    page.goto(f"/app/workspace/apps/big-plans/{big_plan.ref_id}")
    expect(page.locator("input[name='actionableDate']")).to_have_value("2024-06-10")
    expect(page.locator("input[name='dueDate']")).to_have_value("2024-06-19")


def test_webui_time_plan_associate_previous_activity_inbox_task_and_pulls_big_plan_no_dates(
    page: Page,
    logged_in_client: AuthenticatedClient,
    create_time_plan,
    create_inbox_task,
    create_big_plan,
    create_time_plan_activity_from_inbox_task,
) -> None:
    time_plan_1 = create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    time_plan_2 = create_time_plan("2024-06-25", RecurringTaskPeriod.WEEKLY)
    big_plan = create_big_plan("The Big Plan")
    inbox_task = create_inbox_task("The Inbox Task", big_plan_id=big_plan.ref_id)
    _ = create_time_plan_activity_from_inbox_task(time_plan_1.ref_id, inbox_task.ref_id)
    _clear_big_plan_dates(logged_in_client, big_plan)

    page.goto(f"/app/workspace/apps/time-plans/{time_plan_2.ref_id}")

    page.locator("#section-action-nav-multiple-compact-button").click()
    page.locator("a", has_text="From Time Plans").click()

    page.wait_for_url(
        re.compile(
            rf"/app/workspace/apps/time-plans/{time_plan_2.ref_id}/add-from-current-time-plans/{time_plan_2.ref_id}"
        )
    )

    page.locator("#time-plan-previous-time-plan").locator(
        "a", has_text="Weekly plan for 2024-06-18"
    ).click()

    page.wait_for_url(
        re.compile(
            rf"/app/workspace/apps/time-plans/{time_plan_2.ref_id}/add-from-current-time-plans/{time_plan_1.ref_id}"
        )
    )

    page.locator("#time-plan-current-activities").get_by_text(
        "The Inbox Task", exact=True
    ).click()

    page.locator("#time-plan-current-activities").locator(
        "button", has_text=re.compile(r"^Add$")
    ).click()

    page.wait_for_url(
        re.compile(rf"/app/workspace/apps/time-plans/{time_plan_2.ref_id}")
    )

    expect(page.locator("#time-plan-activities")).to_contain_text("The Inbox Task")
    expect(page.locator("#time-plan-activities")).to_contain_text("The Big Plan")

    page.goto(f"/app/workspace/apps/big-plans/{big_plan.ref_id}")
    expect(page.locator("input[name='actionableDate']")).to_have_value("2024-06-24")
    expect(page.locator("input[name='dueDate']")).to_have_value("2024-06-30")


def test_webui_time_plan_associate_previous_activity_inbox_task_and_pulls_big_plan_but_overwrites_dates_leave_alone(
    page: Page,
    create_time_plan,
    create_inbox_task,
    create_big_plan,
    create_time_plan_activity_from_inbox_task,
) -> None:
    time_plan_1 = create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    time_plan_2 = create_time_plan("2024-06-25", RecurringTaskPeriod.WEEKLY)
    big_plan = create_big_plan(
        "The Big Plan", actionable_date="2024-06-10", due_date="2024-06-19"
    )
    inbox_task = create_inbox_task("The Inbox Task", big_plan_id=big_plan.ref_id)
    _ = create_time_plan_activity_from_inbox_task(time_plan_1.ref_id, inbox_task.ref_id)

    page.goto(f"/app/workspace/apps/time-plans/{time_plan_2.ref_id}")

    page.locator("#section-action-nav-multiple-compact-button").click()
    page.locator("a", has_text="From Time Plans").click()

    page.wait_for_url(
        re.compile(
            rf"/app/workspace/apps/time-plans/{time_plan_2.ref_id}/add-from-current-time-plans/{time_plan_2.ref_id}"
        )
    )

    page.locator("#time-plan-previous-time-plan").locator(
        "a", has_text="Weekly plan for 2024-06-18"
    ).click()

    page.wait_for_url(
        re.compile(
            rf"/app/workspace/apps/time-plans/{time_plan_2.ref_id}/add-from-current-time-plans/{time_plan_1.ref_id}"
        )
    )

    page.locator("#time-plan-current-activities").get_by_text(
        "The Inbox Task", exact=True
    ).click()

    page.locator("#time-plan-current-activities").locator(
        "button", has_text=re.compile(r"^Add And Override Dates$")
    ).click()

    page.wait_for_url(
        re.compile(rf"/app/workspace/apps/time-plans/{time_plan_2.ref_id}")
    )

    expect(page.locator("#time-plan-activities")).to_contain_text("The Inbox Task")
    expect(page.locator("#time-plan-activities")).to_contain_text("The Big Plan")

    page.goto(f"/app/workspace/apps/big-plans/{big_plan.ref_id}")
    expect(page.locator("input[name='actionableDate']")).to_have_value("2024-06-10")
    expect(page.locator("input[name='dueDate']")).to_have_value("2024-06-19")


def test_webui_time_plan_associate_previous_activity_two_of_three_inbox_tasks(
    page: Page,
    create_time_plan,
    create_inbox_task,
    create_time_plan_activity_from_inbox_task,
) -> None:
    time_plan_1 = create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    time_plan_2 = create_time_plan("2024-06-25", RecurringTaskPeriod.WEEKLY)
    inbox_task1 = create_inbox_task("The Inbox Task 1", due_date="2024-06-18")
    inbox_task2 = create_inbox_task("The Inbox Task 2", due_date="2024-06-18")
    inbox_task3 = create_inbox_task("The Inbox Task 3", due_date="2024-06-19")
    _ = create_time_plan_activity_from_inbox_task(
        time_plan_1.ref_id, inbox_task1.ref_id
    )
    _ = create_time_plan_activity_from_inbox_task(
        time_plan_1.ref_id, inbox_task2.ref_id
    )
    _ = create_time_plan_activity_from_inbox_task(
        time_plan_1.ref_id, inbox_task3.ref_id
    )

    page.goto(f"/app/workspace/apps/time-plans/{time_plan_2.ref_id}")

    page.locator("#section-action-nav-multiple-compact-button").click()
    page.locator("a", has_text="From Time Plans").click()

    page.wait_for_url(
        re.compile(
            rf"/app/workspace/apps/time-plans/{time_plan_2.ref_id}/add-from-current-time-plans/{time_plan_2.ref_id}"
        )
    )

    page.locator("#time-plan-previous-time-plan").locator(
        "a", has_text="Weekly plan for 2024-06-18"
    ).click()

    page.wait_for_url(
        re.compile(
            rf"/app/workspace/apps/time-plans/{time_plan_2.ref_id}/add-from-current-time-plans/{time_plan_1.ref_id}"
        )
    )

    page.locator("#time-plan-current-activities").get_by_text(
        "The Inbox Task 1", exact=True
    ).click()
    page.locator("#time-plan-current-activities").get_by_text(
        "The Inbox Task 3", exact=True
    ).click()

    page.locator("#time-plan-current-activities").locator(
        "button", has_text=re.compile(r"^Add$")
    ).click()

    page.wait_for_url(
        re.compile(rf"/app/workspace/apps/time-plans/{time_plan_2.ref_id}")
    )

    expect(page.locator("#time-plan-activities")).to_contain_text("The Inbox Task 1")
    expect(page.locator("#time-plan-activities")).not_to_contain_text(
        "The Inbox Task 2"
    )
    expect(page.locator("#time-plan-activities")).to_contain_text("The Inbox Task 3")


def test_webui_time_plan_associate_previous_activity_tasks_that_pull_in_some_more_big_plans(
    page: Page,
    create_time_plan,
    create_inbox_task,
    create_big_plan,
    create_time_plan_activity_from_inbox_task,
    create_time_plan_activity_from_big_plan,
) -> None:
    time_plan_1 = create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    time_plan_2 = create_time_plan("2024-06-25", RecurringTaskPeriod.WEEKLY)
    big_plan1 = create_big_plan(
        "The Big Plan 1", actionable_date="2024-06-10", due_date="2024-06-19"
    )
    inbox_task1 = create_inbox_task("The Inbox Task 1", big_plan_id=big_plan1.ref_id)
    inbox_task2 = create_inbox_task("The Inbox Task 2", big_plan_id=big_plan1.ref_id)
    big_plan2 = create_big_plan(
        "The Big Plan 2", actionable_date="2024-06-10", due_date="2024-06-19"
    )
    inbox_task3 = create_inbox_task("The Inbox Task 3", big_plan_id=big_plan2.ref_id)
    big_plan3 = create_big_plan(
        "The Big Plan 3", actionable_date="2024-06-10", due_date="2024-06-19"
    )
    _ = create_time_plan_activity_from_inbox_task(
        time_plan_1.ref_id, inbox_task1.ref_id
    )
    _ = create_time_plan_activity_from_inbox_task(
        time_plan_1.ref_id, inbox_task2.ref_id
    )
    _ = create_time_plan_activity_from_inbox_task(
        time_plan_1.ref_id, inbox_task3.ref_id
    )
    _ = create_time_plan_activity_from_big_plan(time_plan_1.ref_id, big_plan3.ref_id)

    page.goto(f"/app/workspace/apps/time-plans/{time_plan_2.ref_id}")

    page.locator("#section-action-nav-multiple-compact-button").click()
    page.locator("a", has_text="From Time Plans").click()

    page.wait_for_url(
        re.compile(
            rf"/app/workspace/apps/time-plans/{time_plan_2.ref_id}/add-from-current-time-plans/{time_plan_2.ref_id}"
        )
    )

    page.locator("#time-plan-previous-time-plan").locator(
        "a", has_text="Weekly plan for 2024-06-18"
    ).click()

    page.wait_for_url(
        re.compile(
            rf"/app/workspace/apps/time-plans/{time_plan_2.ref_id}/add-from-current-time-plans/{time_plan_1.ref_id}"
        )
    )

    page.locator("#time-plan-current-activities").get_by_text(
        "The Inbox Task 1", exact=True
    ).click()
    page.locator("#time-plan-current-activities").get_by_text(
        "The Inbox Task 3", exact=True
    ).click()

    page.locator("#time-plan-current-activities").locator(
        "button", has_text=re.compile(r"^Add$")
    ).click()

    page.wait_for_url(
        re.compile(rf"/app/workspace/apps/time-plans/{time_plan_2.ref_id}")
    )

    expect(page.locator("#time-plan-activities")).to_contain_text("The Inbox Task 1")
    expect(page.locator("#time-plan-activities")).not_to_contain_text(
        "The Inbox Task 2"
    )
    expect(page.locator("#time-plan-activities")).to_contain_text("The Inbox Task 3")
    expect(page.locator("#time-plan-activities")).to_contain_text("The Big Plan 1")
    expect(page.locator("#time-plan-activities")).to_contain_text("The Big Plan 2")
    expect(page.locator("#time-plan-activities")).not_to_contain_text("The Big Plan 3")


def test_webui_time_plan_associate_previous_activity_big_plan(
    page: Page,
    create_time_plan,
    create_big_plan,
    create_time_plan_activity_from_big_plan,
) -> None:
    time_plan_1 = create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    time_plan_2 = create_time_plan("2024-06-25", RecurringTaskPeriod.WEEKLY)
    big_plan = create_big_plan(
        "The Big Plan", actionable_date="2024-06-10", due_date="2024-06-19"
    )
    _ = create_time_plan_activity_from_big_plan(time_plan_1.ref_id, big_plan.ref_id)

    page.goto(f"/app/workspace/apps/time-plans/{time_plan_2.ref_id}")

    page.locator("#section-action-nav-multiple-compact-button").click()
    page.locator("a", has_text="From Time Plans").click()

    page.wait_for_url(
        re.compile(
            rf"/app/workspace/apps/time-plans/{time_plan_2.ref_id}/add-from-current-time-plans/{time_plan_2.ref_id}"
        )
    )

    page.locator("#time-plan-previous-time-plan").locator(
        "a", has_text="Weekly plan for 2024-06-18"
    ).click()

    page.wait_for_url(
        re.compile(
            rf"/app/workspace/apps/time-plans/{time_plan_2.ref_id}/add-from-current-time-plans/{time_plan_1.ref_id}"
        )
    )

    page.locator("#time-plan-current-activities").get_by_text(
        "The Big Plan", exact=True
    ).click()

    page.locator("#time-plan-current-activities").locator(
        "button", has_text=re.compile(r"^Add$")
    ).click()

    page.wait_for_url(
        re.compile(rf"/app/workspace/apps/time-plans/{time_plan_2.ref_id}")
    )

    expect(page.locator("#time-plan-activities")).to_contain_text("The Big Plan")

    page.goto(f"/app/workspace/apps/big-plans/{big_plan.ref_id}")
    expect(page.locator("input[name='actionableDate']")).to_have_value("2024-06-10")
    expect(page.locator("input[name='dueDate']")).to_have_value("2024-06-19")


def test_webui_time_plan_associate_previous_activity_big_plan_no_dates(
    page: Page,
    logged_in_client: AuthenticatedClient,
    create_time_plan,
    create_big_plan,
    create_time_plan_activity_from_big_plan,
) -> None:
    time_plan_1 = create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    time_plan_2 = create_time_plan("2024-06-25", RecurringTaskPeriod.WEEKLY)
    big_plan = create_big_plan("The Big Plan")
    _ = create_time_plan_activity_from_big_plan(time_plan_1.ref_id, big_plan.ref_id)
    _clear_big_plan_dates(logged_in_client, big_plan)

    page.goto(f"/app/workspace/apps/time-plans/{time_plan_2.ref_id}")

    page.locator("#section-action-nav-multiple-compact-button").click()
    page.locator("a", has_text="From Time Plans").click()

    page.wait_for_url(
        re.compile(
            rf"/app/workspace/apps/time-plans/{time_plan_2.ref_id}/add-from-current-time-plans/{time_plan_2.ref_id}"
        )
    )

    page.locator("#time-plan-previous-time-plan").locator(
        "a", has_text="Weekly plan for 2024-06-18"
    ).click()

    page.wait_for_url(
        re.compile(
            rf"/app/workspace/apps/time-plans/{time_plan_2.ref_id}/add-from-current-time-plans/{time_plan_1.ref_id}"
        )
    )

    page.locator("#time-plan-current-activities").get_by_text(
        "The Big Plan", exact=True
    ).click()

    page.locator("#time-plan-current-activities").locator(
        "button", has_text=re.compile(r"^Add$")
    ).click()

    page.wait_for_url(
        re.compile(rf"/app/workspace/apps/time-plans/{time_plan_2.ref_id}")
    )

    expect(page.locator("#time-plan-activities")).to_contain_text("The Big Plan")

    page.goto(f"/app/workspace/apps/big-plans/{big_plan.ref_id}")
    expect(page.locator("input[name='actionableDate']")).to_have_value("2024-06-24")
    expect(page.locator("input[name='dueDate']")).to_have_value("2024-06-30")


def test_webui_time_plan_associate_previous_activity_big_plan_and_override_dates(
    page: Page,
    create_time_plan,
    create_big_plan,
    create_time_plan_activity_from_big_plan,
) -> None:
    time_plan_1 = create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    time_plan_2 = create_time_plan("2024-06-25", RecurringTaskPeriod.WEEKLY)
    big_plan = create_big_plan(
        "The Big Plan", actionable_date="2024-06-10", due_date="2024-06-19"
    )
    _ = create_time_plan_activity_from_big_plan(time_plan_1.ref_id, big_plan.ref_id)

    page.goto(f"/app/workspace/apps/time-plans/{time_plan_2.ref_id}")

    page.locator("#section-action-nav-multiple-compact-button").click()
    page.locator("a", has_text="From Time Plans").click()

    page.wait_for_url(
        re.compile(
            rf"/app/workspace/apps/time-plans/{time_plan_2.ref_id}/add-from-current-time-plans/{time_plan_2.ref_id}"
        )
    )

    page.locator("#time-plan-previous-time-plan").locator(
        "a", has_text="Weekly plan for 2024-06-18"
    ).click()

    page.wait_for_url(
        re.compile(
            rf"/app/workspace/apps/time-plans/{time_plan_2.ref_id}/add-from-current-time-plans/{time_plan_1.ref_id}"
        )
    )

    page.locator("#time-plan-current-activities").get_by_text(
        "The Big Plan", exact=True
    ).click()

    page.locator("#time-plan-current-activities").locator(
        "button", has_text=re.compile(r"^Add And Override Dates$")
    ).click()

    page.wait_for_url(
        re.compile(rf"/app/workspace/apps/time-plans/{time_plan_2.ref_id}")
    )

    expect(page.locator("#time-plan-activities")).to_contain_text("The Big Plan")

    page.goto(f"/app/workspace/apps/big-plans/{big_plan.ref_id}")
    expect(page.locator("input[name='actionableDate']")).to_have_value("2024-06-24")
    expect(page.locator("input[name='dueDate']")).to_have_value("2024-06-30")


def test_webui_time_plan_associate_previous_activity_some_already_associated(
    page: Page,
    create_time_plan,
    create_inbox_task,
    create_time_plan_activity_from_inbox_task,
) -> None:
    time_plan_1 = create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    time_plan_2 = create_time_plan("2024-06-25", RecurringTaskPeriod.WEEKLY)
    inbox_task1 = create_inbox_task("The Inbox Task 1", due_date="2024-06-18")
    inbox_task2 = create_inbox_task("The Inbox Task 2", due_date="2024-06-18")
    inbox_task3 = create_inbox_task("The Inbox Task 3", due_date="2024-06-19")
    _ = create_time_plan_activity_from_inbox_task(
        time_plan_1.ref_id, inbox_task1.ref_id
    )
    _ = create_time_plan_activity_from_inbox_task(
        time_plan_1.ref_id, inbox_task2.ref_id
    )
    _ = create_time_plan_activity_from_inbox_task(
        time_plan_1.ref_id, inbox_task3.ref_id
    )
    _ = create_time_plan_activity_from_inbox_task(
        time_plan_2.ref_id, inbox_task2.ref_id
    )

    page.goto(f"/app/workspace/apps/time-plans/{time_plan_2.ref_id}")

    page.locator("#section-action-nav-multiple-compact-button").click()
    page.locator("a", has_text="From Time Plans").click()

    page.wait_for_url(
        re.compile(
            rf"/app/workspace/apps/time-plans/{time_plan_2.ref_id}/add-from-current-time-plans/{time_plan_2.ref_id}"
        )
    )

    page.locator("#time-plan-previous-time-plan").locator(
        "a", has_text="Weekly plan for 2024-06-18"
    ).click()

    page.wait_for_url(
        re.compile(
            rf"/app/workspace/apps/time-plans/{time_plan_2.ref_id}/add-from-current-time-plans/{time_plan_1.ref_id}"
        )
    )

    page.locator("#time-plan-current-activities").get_by_text(
        "The Inbox Task 1", exact=True
    ).click()
    page.locator("#time-plan-current-activities").get_by_text(
        "The Inbox Task 3", exact=True
    ).click()

    page.locator("#time-plan-current-activities").locator(
        "button", has_text=re.compile(r"^Add$")
    ).click()

    page.wait_for_url(
        re.compile(rf"/app/workspace/apps/time-plans/{time_plan_2.ref_id}")
    )

    expect(page.locator("#time-plan-activities")).to_contain_text("The Inbox Task 1")
    expect(page.locator("#time-plan-activities")).to_contain_text("The Inbox Task 2")
    expect(page.locator("#time-plan-activities")).to_contain_text("The Inbox Task 3")


def test_webui_time_plan_inbox_task_with_big_plan_shows_in_all_time_plans(
    page: Page,
    logged_in_client: AuthenticatedClient,
    create_time_plan,
    create_inbox_task,
    create_big_plan,
    create_time_plan_activity_from_inbox_task,
) -> None:
    time_plan_1 = create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    time_plan_2 = create_time_plan("2024-06-25", RecurringTaskPeriod.WEEKLY)
    big_plan = create_big_plan(
        "The Big Plan", actionable_date="2024-06-10", due_date="2024-06-19"
    )
    inbox_task = create_inbox_task("The Inbox Task", big_plan_id=big_plan.ref_id)
    _ = create_time_plan_activity_from_inbox_task(time_plan_1.ref_id, inbox_task.ref_id)
    _ = create_time_plan_activity_from_inbox_task(time_plan_2.ref_id, inbox_task.ref_id)

    page.goto(f"/app/workspace/apps/time-plans/{time_plan_1.ref_id}")

    expect(page.locator("#time-plan-activities")).to_contain_text("The Inbox Task")
    expect(page.locator("#time-plan-activities")).to_contain_text("The Big Plan")

    page.goto(f"/app/workspace/apps/time-plans/{time_plan_2.ref_id}")

    expect(page.locator("#time-plan-activities")).to_contain_text("The Inbox Task")
    expect(page.locator("#time-plan-activities")).to_contain_text("The Big Plan")


def test_webui_time_plan_add_an_inbox_task_to_an_already_existing_time_plan(
    page: Page,
    logged_in_client: AuthenticatedClient,
    create_time_plan,
    create_inbox_task,
    create_time_plan_activity_from_inbox_task,
) -> None:
    create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    inbox_task = create_inbox_task("The Inbox Task")

    page.goto(f"/app/workspace/core/inbox-tasks/{inbox_task.ref_id}")

    page.locator("#inbox-task-time-plans").locator("a", has_text="Add").click()

    page.wait_for_url(
        re.compile(
            rf"/app/workspace/apps/time-plans/add-inbox-task-to-plans\?inboxTaskRefId={inbox_task.ref_id}"
        )
    )

    page.locator("#all-time-plans").locator(
        "p", has_text="Weekly plan for 2024-06-18"
    ).click()

    page.locator("#add-inbox-task-to-plans").locator("button", has_text="Add").click()

    page.wait_for_url(
        re.compile(rf"/app/workspace/core/inbox-tasks/{inbox_task.ref_id}")
    )

    expect(page.locator("#inbox-task-time-plans")).to_contain_text(
        "Weekly plan for 2024-06-18"
    )


def test_webui_time_plan_add_an_inbox_task_to_an_already_existing_time_plan_no_dates(
    page: Page,
    logged_in_client: AuthenticatedClient,
    create_time_plan,
    create_inbox_task,
    create_time_plan_activity_from_inbox_task,
) -> None:
    create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    inbox_task = create_inbox_task("The Inbox Task")

    page.goto(f"/app/workspace/core/inbox-tasks/{inbox_task.ref_id}")

    page.locator("#inbox-task-time-plans").locator("a", has_text="Add").click()

    page.wait_for_url(
        re.compile(
            rf"/app/workspace/apps/time-plans/add-inbox-task-to-plans\?inboxTaskRefId={inbox_task.ref_id}"
        )
    )

    page.locator("#all-time-plans").locator(
        "p", has_text="Weekly plan for 2024-06-18"
    ).click()

    page.locator("#add-inbox-task-to-plans").locator("button", has_text="Add").click()

    page.wait_for_url(
        re.compile(rf"/app/workspace/core/inbox-tasks/{inbox_task.ref_id}")
    )

    expect(page.locator("#inbox-task-time-plans")).to_contain_text(
        "Weekly plan for 2024-06-18"
    )

    page.goto(f"/app/workspace/core/inbox-tasks/{inbox_task.ref_id}")
    expect(page.locator("input[name='actionableDate']")).to_have_value("")
    expect(page.locator("input[name='dueDate']")).to_have_value("2024-06-23")


def test_webui_time_plan_add_an_inbox_task_to_an_already_existing_time_plan_with_dates(
    page: Page,
    logged_in_client: AuthenticatedClient,
    create_time_plan,
    create_inbox_task,
    create_time_plan_activity_from_inbox_task,
) -> None:
    create_time_plan("2024-06-18", RecurringTaskPeriod.DAILY)
    inbox_task = create_inbox_task("The Inbox Task", due_date="2024-06-18")

    page.goto(f"/app/workspace/core/inbox-tasks/{inbox_task.ref_id}")

    page.locator("#inbox-task-time-plans").locator("a", has_text="Add").click()

    page.wait_for_url(
        re.compile(
            rf"/app/workspace/apps/time-plans/add-inbox-task-to-plans\?inboxTaskRefId={inbox_task.ref_id}"
        )
    )

    page.locator("#all-time-plans").locator(
        "p", has_text="Daily plan for 2024-06-18"
    ).click()

    page.locator("#add-inbox-task-to-plans").locator("button", has_text="Add").click()

    page.wait_for_url(
        re.compile(rf"/app/workspace/core/inbox-tasks/{inbox_task.ref_id}")
    )

    expect(page.locator("#inbox-task-time-plans")).to_contain_text(
        "Daily plan for 2024-06-18"
    )

    page.goto(f"/app/workspace/core/inbox-tasks/{inbox_task.ref_id}")
    expect(page.locator("input[name='actionableDate']")).to_have_value("")
    expect(page.locator("input[name='dueDate']")).to_have_value("2024-06-18")


def test_webui_time_plan_add_an_inbox_task_to_an_already_existing_time_plan_and_pulls_big_plan(
    page: Page,
    logged_in_client: AuthenticatedClient,
    create_time_plan,
    create_inbox_task,
    create_big_plan,
    create_time_plan_activity_from_inbox_task,
) -> None:
    time_plan = create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    big_plan = create_big_plan(
        "The Big Plan", actionable_date="2024-06-10", due_date="2024-06-19"
    )
    inbox_task = create_inbox_task("The Inbox Task", big_plan_id=big_plan.ref_id)

    page.goto(f"/app/workspace/core/inbox-tasks/{inbox_task.ref_id}")

    page.locator("#inbox-task-time-plans").locator("a", has_text="Add").click()

    page.wait_for_url(
        re.compile(
            rf"/app/workspace/apps/time-plans/add-inbox-task-to-plans\?inboxTaskRefId={inbox_task.ref_id}"
        )
    )

    page.locator("#all-time-plans").locator(
        "p", has_text="Weekly plan for 2024-06-18"
    ).click()

    page.locator("#add-inbox-task-to-plans").locator("button", has_text="Add").click()

    page.wait_for_url(
        re.compile(rf"/app/workspace/core/inbox-tasks/{inbox_task.ref_id}")
    )

    expect(page.locator("#inbox-task-time-plans")).to_contain_text(
        "Weekly plan for 2024-06-18"
    )

    page.goto(f"/app/workspace/apps/time-plans/{time_plan.ref_id}")
    expect(page.locator("#time-plan-activities")).to_contain_text("The Inbox Task")
    expect(page.locator("#time-plan-activities")).to_contain_text("The Big Plan")

    page.goto(f"/app/workspace/apps/big-plans/{big_plan.ref_id}")
    expect(page.locator("input[name='actionableDate']")).to_have_value("2024-06-10")
    expect(page.locator("input[name='dueDate']")).to_have_value("2024-06-19")


def test_webui_time_plan_add_an_inbox_task_to_an_already_existing_time_plan_and_pulls_big_plan_no_dates(
    page: Page,
    logged_in_client: AuthenticatedClient,
    create_time_plan,
    create_inbox_task,
    create_big_plan,
    create_time_plan_activity_from_inbox_task,
) -> None:
    time_plan = create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    big_plan = create_big_plan("The Big Plan")
    inbox_task = create_inbox_task("The Inbox Task", big_plan_id=big_plan.ref_id)

    page.goto(f"/app/workspace/core/inbox-tasks/{inbox_task.ref_id}")

    page.locator("#inbox-task-time-plans").locator("a", has_text="Add").click()

    page.wait_for_url(
        re.compile(
            rf"/app/workspace/apps/time-plans/add-inbox-task-to-plans\?inboxTaskRefId={inbox_task.ref_id}"
        )
    )

    page.locator("#all-time-plans").locator(
        "p", has_text="Weekly plan for 2024-06-18"
    ).click()

    page.locator("#add-inbox-task-to-plans").locator("button", has_text="Add").click()

    page.wait_for_url(
        re.compile(rf"/app/workspace/core/inbox-tasks/{inbox_task.ref_id}")
    )

    expect(page.locator("#inbox-task-time-plans")).to_contain_text(
        "Weekly plan for 2024-06-18"
    )

    page.goto(f"/app/workspace/apps/time-plans/{time_plan.ref_id}")
    expect(page.locator("#time-plan-activities")).to_contain_text("The Inbox Task")
    expect(page.locator("#time-plan-activities")).to_contain_text("The Big Plan")

    page.goto(f"/app/workspace/apps/big-plans/{big_plan.ref_id}")
    expect(page.locator("input[name='actionableDate']")).to_have_value("2024-06-17")
    expect(page.locator("input[name='dueDate']")).to_have_value("2024-06-23")


def test_webui_time_plan_add_an_inbox_task_to_an_already_existing_time_plan_and_pulls_big_plan_but_overwrites_dates_leave_alone(
    page: Page,
    logged_in_client: AuthenticatedClient,
    create_time_plan,
    create_inbox_task,
    create_big_plan,
    create_time_plan_activity_from_inbox_task,
) -> None:
    time_plan = create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    big_plan = create_big_plan(
        "The Big Plan", actionable_date="2024-06-10", due_date="2024-06-19"
    )
    inbox_task = create_inbox_task("The Inbox Task", big_plan_id=big_plan.ref_id)

    page.goto(f"/app/workspace/core/inbox-tasks/{inbox_task.ref_id}")

    page.locator("#inbox-task-time-plans").locator("a", has_text="Add").click()

    page.wait_for_url(
        re.compile(
            rf"/app/workspace/apps/time-plans/add-inbox-task-to-plans\?inboxTaskRefId={inbox_task.ref_id}"
        )
    )

    page.locator("#all-time-plans").locator(
        "p", has_text="Weekly plan for 2024-06-18"
    ).click()

    page.locator("#add-inbox-task-to-plans").locator("button", has_text="Add").click()

    page.wait_for_url(
        re.compile(rf"/app/workspace/core/inbox-tasks/{inbox_task.ref_id}")
    )

    expect(page.locator("#inbox-task-time-plans")).to_contain_text(
        "Weekly plan for 2024-06-18"
    )

    page.goto(f"/app/workspace/apps/time-plans/{time_plan.ref_id}")
    expect(page.locator("#time-plan-activities")).to_contain_text("The Inbox Task")
    expect(page.locator("#time-plan-activities")).to_contain_text("The Big Plan")

    page.goto(f"/app/workspace/apps/big-plans/{big_plan.ref_id}")
    expect(page.locator("input[name='actionableDate']")).to_have_value("2024-06-10")
    expect(page.locator("input[name='dueDate']")).to_have_value("2024-06-19")


def test_webui_time_plan_add_an_inbox_task_to_multiple_already_existing_time_plans(
    page: Page,
    logged_in_client: AuthenticatedClient,
    create_time_plan,
    create_inbox_task,
    create_time_plan_activity_from_inbox_task,
) -> None:
    time_plan1 = create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    time_plan2 = create_time_plan("2024-06-25", RecurringTaskPeriod.WEEKLY)
    inbox_task = create_inbox_task("The Inbox Task")

    page.goto(f"/app/workspace/core/inbox-tasks/{inbox_task.ref_id}")

    page.locator("#inbox-task-time-plans").locator("a", has_text="Add").click()

    page.wait_for_url(
        re.compile(
            rf"/app/workspace/apps/time-plans/add-inbox-task-to-plans\?inboxTaskRefId={inbox_task.ref_id}"
        )
    )

    page.locator("#all-time-plans").locator(
        "p", has_text="Weekly plan for 2024-06-18"
    ).click()
    page.locator("#all-time-plans").locator(
        "p", has_text="Weekly plan for 2024-06-25"
    ).click()

    page.locator("#add-inbox-task-to-plans").locator("button", has_text="Add").click()

    page.wait_for_url(
        re.compile(rf"/app/workspace/core/inbox-tasks/{inbox_task.ref_id}")
    )

    expect(page.locator("#inbox-task-time-plans")).to_contain_text(
        "Weekly plan for 2024-06-18"
    )
    expect(page.locator("#inbox-task-time-plans")).to_contain_text(
        "Weekly plan for 2024-06-25"
    )

    page.goto(f"/app/workspace/apps/time-plans/{time_plan1.ref_id}")
    expect(page.locator("#time-plan-activities")).to_contain_text("The Inbox Task")

    page.goto(f"/app/workspace/apps/time-plans/{time_plan2.ref_id}")
    expect(page.locator("#time-plan-activities")).to_contain_text("The Inbox Task")


def test_webui_time_plan_add_an_inbox_task_to_an_already_existing_time_plan_with_tasks_that_pull_in_some_more_big_plans(
    page: Page,
    logged_in_client: AuthenticatedClient,
    create_time_plan,
    create_inbox_task,
    create_big_plan,
    create_time_plan_activity_from_inbox_task,
) -> None:
    time_plan = create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    big_plan1 = create_big_plan(
        "The Big Plan 1", actionable_date="2024-06-10", due_date="2024-06-19"
    )
    inbox_task1 = create_inbox_task("The Inbox Task 1", big_plan_id=big_plan1.ref_id)
    create_inbox_task("The Inbox Task 2", big_plan_id=big_plan1.ref_id)
    big_plan2 = create_big_plan(
        "The Big Plan 2", actionable_date="2024-06-10", due_date="2024-06-19"
    )
    inbox_task3 = create_inbox_task("The Inbox Task 3", big_plan_id=big_plan2.ref_id)
    create_big_plan(
        "The Big Plan 3", actionable_date="2024-06-10", due_date="2024-06-19"
    )

    # Add first inbox task
    page.goto(f"/app/workspace/core/inbox-tasks/{inbox_task1.ref_id}")

    page.locator("#inbox-task-time-plans").locator("a", has_text="Add").click()

    page.wait_for_url(
        re.compile(
            rf"/app/workspace/apps/time-plans/add-inbox-task-to-plans\?inboxTaskRefId={inbox_task1.ref_id}"
        )
    )

    page.locator("#all-time-plans").locator(
        "p", has_text="Weekly plan for 2024-06-18"
    ).click()

    page.locator("#add-inbox-task-to-plans").locator("button", has_text="Add").click()

    page.wait_for_url(
        re.compile(rf"/app/workspace/core/inbox-tasks/{inbox_task1.ref_id}")
    )

    # Add third inbox task
    page.goto(f"/app/workspace/core/inbox-tasks/{inbox_task3.ref_id}")

    page.locator("#inbox-task-time-plans").locator("a", has_text="Add").click()

    page.wait_for_url(
        re.compile(
            rf"/app/workspace/apps/time-plans/add-inbox-task-to-plans\?inboxTaskRefId={inbox_task3.ref_id}"
        )
    )

    page.locator("#all-time-plans").locator(
        "p", has_text="Weekly plan for 2024-06-18"
    ).click()

    page.locator("#add-inbox-task-to-plans").locator("button", has_text="Add").click()

    page.wait_for_url(
        re.compile(rf"/app/workspace/core/inbox-tasks/{inbox_task3.ref_id}")
    )

    page.goto(f"/app/workspace/apps/time-plans/{time_plan.ref_id}")
    expect(page.locator("#time-plan-activities")).to_contain_text("The Inbox Task 1")
    expect(page.locator("#time-plan-activities")).not_to_contain_text(
        "The Inbox Task 2"
    )
    expect(page.locator("#time-plan-activities")).to_contain_text("The Inbox Task 3")
    expect(page.locator("#time-plan-activities")).to_contain_text("The Big Plan 1")
    expect(page.locator("#time-plan-activities")).to_contain_text("The Big Plan 2")
    expect(page.locator("#time-plan-activities")).not_to_contain_text("The Big Plan 3")


def test_webui_time_plan_show_activity_doneness(
    page: Page,
    logged_in_client: AuthenticatedClient,
    create_time_plan,
    create_inbox_task,
    create_time_plan_activity_from_inbox_task,
) -> None:
    time_plan = create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    inbox_task = create_inbox_task("The Inbox Task")
    _ = create_time_plan_activity_from_inbox_task(time_plan.ref_id, inbox_task.ref_id)

    page.goto(f"/app/workspace/apps/time-plans/{time_plan.ref_id}")

    expect(
        page.locator("#time-plan-activities").get_by_text("The Inbox Task", exact=True)
    ).not_to_have_css("font-weight", "100")

    _mark_inbox_task_done(logged_in_client, inbox_task)
    page.reload()

    expect(
        page.locator("#time-plan-activities").get_by_text("The Inbox Task", exact=True)
    ).to_have_css("font-weight", "700")


def test_webui_time_plan_activity_update(
    page: Page,
    create_time_plan,
    create_inbox_task,
    create_time_plan_activity_from_inbox_task,
) -> None:
    time_plan = create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    inbox_task = create_inbox_task("The Inbox Task")
    inbox_task_activity = create_time_plan_activity_from_inbox_task(
        time_plan.ref_id, inbox_task.ref_id
    )

    page.goto(
        f"/app/workspace/apps/time-plans/{time_plan.ref_id}/{inbox_task_activity.ref_id}"
    )

    wait_for_hydration(page)
    page.locator("#time-plan-activity-kind-make-progress").click()
    page.locator("#time-plan-activity-feasability-stretch").click()
    page.locator("#time-plan-activity-properties").locator(
        "button", has_text="Save"
    ).click()

    page.wait_for_url(
        re.compile(rf"/app/workspace/apps/time-plans/{time_plan.ref_id}$")
    )

    page.goto(
        f"/app/workspace/apps/time-plans/{time_plan.ref_id}/{inbox_task_activity.ref_id}"
    )

    expect(
        page.locator('button[id="time-plan-activity-kind-finish"]')
    ).to_have_attribute("aria-pressed", "false")
    expect(
        page.locator('button[id="time-plan-activity-kind-make-progress"]')
    ).to_have_attribute("aria-pressed", "true")
    expect(
        page.locator('button[id="time-plan-activity-feasability-must-do"]')
    ).to_have_attribute("aria-pressed", "false")
    expect(
        page.locator('button[id="time-plan-activity-feasability-nice-to-have"]')
    ).to_have_attribute("aria-pressed", "false")
    expect(
        page.locator('button[id="time-plan-activity-feasability-stretch"]')
    ).to_have_attribute("aria-pressed", "true")


def test_webui_time_plan_activity_inbox_task_update(
    page: Page,
    create_time_plan,
    create_inbox_task,
    create_time_plan_activity_from_inbox_task,
) -> None:
    time_plan = create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    inbox_task = create_inbox_task("The Inbox Task")
    inbox_task_activity = create_time_plan_activity_from_inbox_task(
        time_plan.ref_id, inbox_task.ref_id
    )

    page.goto(
        f"/app/workspace/apps/time-plans/{time_plan.ref_id}/{inbox_task_activity.ref_id}"
    )

    fill_after_hydration(
        page.locator('input[name="targetInboxTaskName"]'), "The Renamed Inbox Task"
    )
    page.locator("#inbox-task-editor").locator("button", has_text="Save").click()

    page.wait_for_url(
        re.compile(rf"/app/workspace/apps/time-plans/{time_plan.ref_id}$")
    )
    expect(page.locator("#time-plan-activities")).to_contain_text(
        "The Renamed Inbox Task"
    )

    page.goto(
        f"/app/workspace/apps/time-plans/{time_plan.ref_id}/{inbox_task_activity.ref_id}"
    )

    expect(page.locator('input[name="targetInboxTaskName"]')).to_have_value(
        "The Renamed Inbox Task"
    )


def test_webui_time_plan_activity_inbox_task_mark_done(
    page: Page,
    create_time_plan,
    create_inbox_task,
    create_time_plan_activity_from_inbox_task,
) -> None:
    time_plan = create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    inbox_task = create_inbox_task("The Inbox Task")
    inbox_task_activity = create_time_plan_activity_from_inbox_task(
        time_plan.ref_id, inbox_task.ref_id
    )

    page.goto(
        f"/app/workspace/apps/time-plans/{time_plan.ref_id}/{inbox_task_activity.ref_id}"
    )

    wait_for_hydration(page)
    page.locator('button[value="target-inbox-task-mark-done"]').click()

    page.wait_for_url(
        re.compile(rf"/app/workspace/apps/time-plans/{time_plan.ref_id}$")
    )

    page.goto(
        f"/app/workspace/apps/time-plans/{time_plan.ref_id}/{inbox_task_activity.ref_id}"
    )

    expect(page.locator('button[value="target-inbox-task-reactivate"]')).to_be_visible()


def test_webui_time_plan_activity_inbox_task_delay(
    page: Page,
    create_time_plan,
    create_inbox_task,
    create_time_plan_activity_from_inbox_task,
) -> None:
    time_plan = create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    inbox_task = create_inbox_task("The Inbox Task")
    inbox_task_activity = create_time_plan_activity_from_inbox_task(
        time_plan.ref_id, inbox_task.ref_id
    )

    page.goto(
        f"/app/workspace/apps/time-plans/{time_plan.ref_id}/{inbox_task_activity.ref_id}"
    )

    wait_for_hydration(page)
    page.locator('button[value="target-inbox-task-delay-1-week"]').click()

    page.wait_for_url(
        re.compile(rf"/app/workspace/apps/time-plans/{time_plan.ref_id}$")
    )

    page.goto(
        f"/app/workspace/apps/time-plans/{time_plan.ref_id}/{inbox_task_activity.ref_id}"
    )

    expect(page.locator('input[name="targetInboxTaskActionableDate"]')).to_have_value(
        re.compile(r"^\d{4}-\d{2}-\d{2}$")
    )


def test_webui_time_plan_activity_todo_task_update(
    page: Page,
    create_time_plan,
    create_time_plan_activity_from_todo_task,
) -> None:
    time_plan = create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    todo_task_activity = create_time_plan_activity_from_todo_task(
        time_plan.ref_id, "The Todo Task"
    )

    page.goto(
        f"/app/workspace/apps/time-plans/{time_plan.ref_id}/{todo_task_activity.ref_id}"
    )

    fill_after_hydration(
        page.locator('input[name="targetTodoTaskName"]'), "The Renamed Todo Task"
    )
    page.locator("button#todo-update").click()

    page.wait_for_url(
        re.compile(rf"/app/workspace/apps/time-plans/{time_plan.ref_id}$")
    )
    expect(page.locator("#time-plan-activities")).to_contain_text(
        "The Renamed Todo Task"
    )

    page.goto(
        f"/app/workspace/apps/time-plans/{time_plan.ref_id}/{todo_task_activity.ref_id}"
    )

    expect(page.locator('input[name="targetTodoTaskName"]')).to_have_value(
        "The Renamed Todo Task"
    )


def test_webui_time_plan_activity_todo_task_mark_done(
    page: Page,
    create_time_plan,
    create_time_plan_activity_from_todo_task,
) -> None:
    time_plan = create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    todo_task_activity = create_time_plan_activity_from_todo_task(
        time_plan.ref_id, "The Todo Task"
    )

    page.goto(
        f"/app/workspace/apps/time-plans/{time_plan.ref_id}/{todo_task_activity.ref_id}"
    )

    wait_for_hydration(page)
    page.locator('button[value="target-todo-task-mark-done"]').click()

    page.wait_for_url(
        re.compile(rf"/app/workspace/apps/time-plans/{time_plan.ref_id}$")
    )

    page.goto(
        f"/app/workspace/apps/time-plans/{time_plan.ref_id}/{todo_task_activity.ref_id}"
    )

    expect(page.locator('button[value="target-todo-task-reactivate"]')).to_be_visible()


def test_webui_time_plan_activity_todo_task_delay(
    page: Page,
    create_time_plan,
    create_time_plan_activity_from_todo_task,
) -> None:
    time_plan = create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    todo_task_activity = create_time_plan_activity_from_todo_task(
        time_plan.ref_id, "The Todo Task"
    )

    page.goto(
        f"/app/workspace/apps/time-plans/{time_plan.ref_id}/{todo_task_activity.ref_id}"
    )

    wait_for_hydration(page)
    page.locator('button[value="target-todo-task-delay-1-week"]').click()

    page.wait_for_url(
        re.compile(rf"/app/workspace/apps/time-plans/{time_plan.ref_id}$")
    )

    page.goto(
        f"/app/workspace/apps/time-plans/{time_plan.ref_id}/{todo_task_activity.ref_id}"
    )

    expect(page.locator('input[name="targetTodoTaskActionableDate"]')).to_have_value(
        re.compile(r"^\d{4}-\d{2}-\d{2}$")
    )


def test_webui_time_plan_activity_big_plan_update(
    page: Page,
    create_time_plan,
    create_big_plan,
    create_time_plan_activity_from_big_plan,
) -> None:
    time_plan = create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    big_plan = create_big_plan("The Big Plan")
    big_plan_activity = create_time_plan_activity_from_big_plan(
        time_plan.ref_id, big_plan.ref_id
    )

    page.goto(
        f"/app/workspace/apps/time-plans/{time_plan.ref_id}/{big_plan_activity.ref_id}"
    )

    fill_after_hydration(
        page.locator('input[name="targetBigPlanName"]'), "The Renamed Big Plan"
    )
    page.locator("#big-plan-editor-save").click()

    page.wait_for_url(
        re.compile(rf"/app/workspace/apps/time-plans/{time_plan.ref_id}$")
    )
    expect(page.locator("#time-plan-activities")).to_contain_text(
        "The Renamed Big Plan"
    )

    page.goto(
        f"/app/workspace/apps/time-plans/{time_plan.ref_id}/{big_plan_activity.ref_id}"
    )

    expect(page.locator('input[name="targetBigPlanName"]')).to_have_value(
        "The Renamed Big Plan"
    )


def test_webui_time_plan_activity_big_plan_mark_done(
    page: Page,
    create_time_plan,
    create_big_plan,
    create_time_plan_activity_from_big_plan,
) -> None:
    time_plan = create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    big_plan = create_big_plan("The Big Plan")
    big_plan_activity = create_time_plan_activity_from_big_plan(
        time_plan.ref_id, big_plan.ref_id
    )

    page.goto(
        f"/app/workspace/apps/time-plans/{time_plan.ref_id}/{big_plan_activity.ref_id}"
    )

    wait_for_hydration(page)
    page.locator('button[value="target-big-plan-mark-done"]').click()

    page.wait_for_url(
        re.compile(rf"/app/workspace/apps/time-plans/{time_plan.ref_id}$")
    )

    page.goto(
        f"/app/workspace/apps/time-plans/{time_plan.ref_id}/{big_plan_activity.ref_id}"
    )

    expect(page.locator('button[value="target-big-plan-reactivate"]')).to_be_visible()


@pytest.mark.usefixtures("_with_habits_enabled")
def test_webui_time_plan_activity_habit_update(
    page: Page,
    create_time_plan,
    create_habit,
    create_time_plan_activity_from_habit,
) -> None:
    time_plan = create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    habit = create_habit("The Habit")
    activity = create_time_plan_activity_from_habit(time_plan.ref_id, habit.ref_id)

    page.goto(f"/app/workspace/apps/time-plans/{time_plan.ref_id}/{activity.ref_id}")

    fill_after_hydration(
        page.locator('input[name="targetHabitName"]'), "The Renamed Habit"
    )
    page.locator("button#habit-update").click()

    page.wait_for_url(
        re.compile(rf"/app/workspace/apps/time-plans/{time_plan.ref_id}$")
    )
    expect(page.locator("#time-plan-activities")).to_contain_text("The Renamed Habit")

    page.goto(f"/app/workspace/apps/time-plans/{time_plan.ref_id}/{activity.ref_id}")

    expect(page.locator('input[name="targetHabitName"]')).to_have_value(
        "The Renamed Habit"
    )
    # A rename doesn't change what the habit generates, so there's no regen to
    # offer.
    expect(page.get_by_role("button", name="Regenerate")).to_have_count(0)


@pytest.mark.usefixtures("_with_habits_enabled")
def test_webui_time_plan_activity_habit_update_offers_regen(
    page: Page,
    create_time_plan,
    create_habit,
    create_time_plan_activity_from_habit,
) -> None:
    time_plan = create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    habit = create_habit("The Habit")
    activity = create_time_plan_activity_from_habit(time_plan.ref_id, habit.ref_id)

    page.goto(f"/app/workspace/apps/time-plans/{time_plan.ref_id}/{activity.ref_id}")
    wait_for_hydration(page)

    page.locator("#leaf-panel").locator("#eisen-important").click()
    page.locator("button#habit-update").click()

    page.wait_for_url(
        re.compile(rf"/app/workspace/apps/time-plans/{time_plan.ref_id}$")
    )
    regenerate = page.get_by_role("button", name="Regenerate")
    expect(regenerate).to_be_visible()

    with page.expect_response(
        lambda response: "mutations/regen-habit" in response.url
    ) as response_info:
        regenerate.click()

    assert response_info.value.json()["theType"] == "no-error-no-data"


@pytest.mark.usefixtures("_with_habits_enabled")
def test_webui_time_plan_activity_habit_gen(
    page: Page,
    create_time_plan,
    create_habit,
    create_time_plan_activity_from_habit,
) -> None:
    time_plan = create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    habit = create_habit("The Habit")
    activity = create_time_plan_activity_from_habit(time_plan.ref_id, habit.ref_id)

    page.goto(f"/app/workspace/apps/time-plans/{time_plan.ref_id}/{activity.ref_id}")
    wait_for_hydration(page)

    with page.expect_response(
        lambda response: "mutations/regen-habit" in response.url
    ) as response_info:
        page.locator("#leaf-panel").locator('button[value="target-habit-gen"]').click()

    assert response_info.value.json()["theType"] == "no-error-no-data"
    # Regen keeps the panel open, like the redirect it replaces.
    expect(page).to_have_url(
        re.compile(
            rf"/app/workspace/apps/time-plans/{time_plan.ref_id}/{activity.ref_id}"
        )
    )


@pytest.mark.usefixtures("_with_chores_enabled")
def test_webui_time_plan_activity_chore_update(
    page: Page,
    create_time_plan,
    create_chore,
    create_time_plan_activity_from_chore,
) -> None:
    time_plan = create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    chore = create_chore("The Chore")
    activity = create_time_plan_activity_from_chore(time_plan.ref_id, chore.ref_id)

    page.goto(f"/app/workspace/apps/time-plans/{time_plan.ref_id}/{activity.ref_id}")

    fill_after_hydration(
        page.locator('input[name="targetChoreName"]'), "The Renamed Chore"
    )
    page.locator("button#chore-update").click()

    page.wait_for_url(
        re.compile(rf"/app/workspace/apps/time-plans/{time_plan.ref_id}$")
    )
    expect(page.locator("#time-plan-activities")).to_contain_text("The Renamed Chore")

    page.goto(f"/app/workspace/apps/time-plans/{time_plan.ref_id}/{activity.ref_id}")

    expect(page.locator('input[name="targetChoreName"]')).to_have_value(
        "The Renamed Chore"
    )


@pytest.mark.usefixtures("_with_habits_enabled")
def test_webui_time_plan_activity_habit_stack_update(
    page: Page,
    create_time_plan,
    create_habit,
    create_habit_stack,
    create_time_plan_activity_from_habit_stack,
) -> None:
    time_plan = create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    habit = create_habit("The Stacked Habit")
    stack = create_habit_stack("The Habit Stack", [habit.ref_id])
    activity = create_time_plan_activity_from_habit_stack(
        time_plan.ref_id, stack.ref_id
    )

    page.goto(f"/app/workspace/apps/time-plans/{time_plan.ref_id}/{activity.ref_id}")

    fill_after_hydration(
        page.locator('input[name="targetHabitStackName"]'), "The Renamed Habit Stack"
    )
    page.locator("button#habit-stack-update").click()

    page.wait_for_url(
        re.compile(rf"/app/workspace/apps/time-plans/{time_plan.ref_id}$")
    )
    expect(page.locator("#time-plan-activities")).to_contain_text(
        "The Renamed Habit Stack"
    )

    page.goto(f"/app/workspace/apps/time-plans/{time_plan.ref_id}/{activity.ref_id}")

    expect(page.locator('input[name="targetHabitStackName"]')).to_have_value(
        "The Renamed Habit Stack"
    )


@pytest.mark.usefixtures("_with_chores_enabled")
def test_webui_time_plan_activity_chore_stack_update(
    page: Page,
    create_time_plan,
    create_chore,
    create_chore_stack,
    create_time_plan_activity_from_chore_stack,
) -> None:
    time_plan = create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    chore = create_chore("The Stacked Chore")
    stack = create_chore_stack("The Chore Stack", [chore.ref_id])
    activity = create_time_plan_activity_from_chore_stack(
        time_plan.ref_id, stack.ref_id
    )

    page.goto(f"/app/workspace/apps/time-plans/{time_plan.ref_id}/{activity.ref_id}")

    fill_after_hydration(
        page.locator('input[name="targetChoreStackName"]'), "The Renamed Chore Stack"
    )
    page.locator("button#chore-stack-update").click()

    page.wait_for_url(
        re.compile(rf"/app/workspace/apps/time-plans/{time_plan.ref_id}$")
    )
    expect(page.locator("#time-plan-activities")).to_contain_text(
        "The Renamed Chore Stack"
    )

    page.goto(f"/app/workspace/apps/time-plans/{time_plan.ref_id}/{activity.ref_id}")

    expect(page.locator('input[name="targetChoreStackName"]')).to_have_value(
        "The Renamed Chore Stack"
    )


def test_webui_time_plan_kanban_drag_moves_inbox_task(
    page: Page,
    create_time_plan,
    create_inbox_task,
    create_time_plan_activity_from_inbox_task,
) -> None:
    time_plan = create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    inbox_task = create_inbox_task("The Kanban Task")
    create_time_plan_activity_from_inbox_task(time_plan.ref_id, inbox_task.ref_id)

    page.goto(f"/app/workspace/apps/time-plans/{time_plan.ref_id}?timePlanView=kanban")
    wait_for_hydration(page)

    card_selector = f"#inbox-task-{inbox_task.ref_id}"
    not_started = page.locator(
        "[data-rfd-droppable-id="
        f'"inbox-tasks-column:undefined:{InboxTaskStatus.NOT_STARTED.value}"]'
    )
    in_progress = page.locator(
        "[data-rfd-droppable-id="
        f'"inbox-tasks-column:undefined:{InboxTaskStatus.IN_PROGRESS.value}"]'
    )
    expect(not_started.locator(card_selector)).to_be_visible()

    card = not_started.locator(card_selector)
    card.scroll_into_view_if_needed()
    card_box = card.bounding_box()
    target_box = in_progress.bounding_box()
    assert card_box is not None
    assert target_box is not None
    start_x = card_box["x"] + card_box["width"] / 2
    start_y = card_box["y"] + card_box["height"] / 2

    with page.expect_response(
        lambda response: "update-status-and-eisen" in response.url
    ) as response_info:
        page.mouse.move(start_x, start_y)
        page.mouse.down()
        page.mouse.move(start_x, start_y + 10, steps=5)
        page.mouse.move(
            target_box["x"] + target_box["width"] / 2,
            target_box["y"] + 40,
            steps=20,
        )
        page.mouse.up()

    body = response_info.value.json()
    assert (
        body["data"]["updated_inbox_task"]["status"]
        == InboxTaskStatus.IN_PROGRESS.value
    )
    expect(in_progress.locator(card_selector)).to_be_visible()

    page.reload()

    expect(in_progress.locator(card_selector)).to_be_visible()


def test_webui_time_plan_activity_big_plan_card_mark_done(
    page: Page,
    create_time_plan,
    create_big_plan,
    create_inbox_task,
    create_time_plan_activity_from_big_plan,
) -> None:
    time_plan = create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    big_plan = create_big_plan("The Big Plan")
    inbox_task = create_inbox_task("The Big Plan Task", big_plan_id=big_plan.ref_id)
    big_plan_activity = create_time_plan_activity_from_big_plan(
        time_plan.ref_id, big_plan.ref_id
    )

    page.goto(
        f"/app/workspace/apps/time-plans/{time_plan.ref_id}/{big_plan_activity.ref_id}"
    )
    wait_for_hydration(page)

    with page.expect_response(
        lambda response: "update-status-and-eisen" in response.url
    ) as response_info:
        page.locator("#leaf-panel").locator(
            f"#inbox-task-{inbox_task.ref_id} button.MuiIconButton-colorSuccess"
        ).click()

    body = response_info.value.json()
    assert body["data"]["updated_inbox_task"]["status"] == InboxTaskStatus.DONE.value
    expect(page).to_have_url(
        re.compile(
            rf"/app/workspace/apps/time-plans/{time_plan.ref_id}/{big_plan_activity.ref_id}"
        )
    )


def test_webui_time_plan_activity_remove(
    page: Page,
    create_time_plan,
    create_inbox_task,
    create_time_plan_activity_from_inbox_task,
) -> None:
    time_plan = create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    inbox_task = create_inbox_task("The Removed Inbox Task")
    inbox_task_activity = create_time_plan_activity_from_inbox_task(
        time_plan.ref_id, inbox_task.ref_id
    )
    activity_url = f"/app/workspace/apps/time-plans/{time_plan.ref_id}/{inbox_task_activity.ref_id}"

    page.goto(activity_url)
    wait_for_hydration(page)
    page.locator("#leaf-entity-archive").click()
    with page.expect_response(
        lambda response: "mutations/archive-activity" in response.url
    ) as archive_info:
        page.locator("#leaf-entity-archive-confirm").click()
    assert [
        activity["ref_id"]
        for activity in archive_info.value.json()["data"][
            "archived_time_plan_activities"
        ]
    ] == [inbox_task_activity.ref_id]
    page.wait_for_url(f"/app/workspace/apps/time-plans/{time_plan.ref_id}")

    page.goto(activity_url)
    wait_for_hydration(page)
    page.locator("#leaf-entity-archive").click()
    with page.expect_response(
        lambda response: "mutations/remove-activity" in response.url
    ) as remove_info:
        page.locator("#leaf-entity-archive-confirm").click()
    assert remove_info.value.json()["data"]["removed_time_plan_activity_ref_ids"] == [
        inbox_task_activity.ref_id
    ]
    page.wait_for_url(f"/app/workspace/apps/time-plans/{time_plan.ref_id}")

    expect(page.locator("#time-plan-activities")).not_to_contain_text(
        "The Removed Inbox Task"
    )


def test_webui_time_plan_activity_time_event_update(
    page: Page,
    create_time_plan,
    create_inbox_task,
    create_time_plan_activity_from_inbox_task,
    create_time_event_for_time_plan_activity,
) -> None:
    time_plan = create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    inbox_task = create_inbox_task("The Scheduled Inbox Task")
    inbox_task_activity = create_time_plan_activity_from_inbox_task(
        time_plan.ref_id, inbox_task.ref_id
    )
    time_event = create_time_event_for_time_plan_activity(
        inbox_task_activity.ref_id, "2024-06-18", "09:00", 30
    )
    time_event_url = (
        f"/app/workspace/apps/time-plans/{time_plan.ref_id}/{inbox_task_activity.ref_id}"
        f"?timeEventRefId={time_event.ref_id}"
    )

    page.goto(time_event_url)
    fill_after_hydration(page.locator('input[name="durationMins"]'), "45")
    with page.expect_response(
        lambda response: "mutations/update-time-event" in response.url
    ) as response_info:
        page.locator('button[value="update-time-event"]').click()

    body = response_info.value.json()
    assert body["data"]["updated_time_event_in_day_block"]["duration_mins"] == 45
    expect(page.locator('input[name="durationMins"]')).to_be_visible()

    page.goto(time_event_url)

    expect(page.locator('input[name="durationMins"]')).to_have_value("45")


def test_webui_time_plan_activity_time_event_remove(
    page: Page,
    create_time_plan,
    create_inbox_task,
    create_time_plan_activity_from_inbox_task,
    create_time_event_for_time_plan_activity,
) -> None:
    time_plan = create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    inbox_task = create_inbox_task("The Unscheduled Inbox Task")
    inbox_task_activity = create_time_plan_activity_from_inbox_task(
        time_plan.ref_id, inbox_task.ref_id
    )
    time_event = create_time_event_for_time_plan_activity(
        inbox_task_activity.ref_id, "2024-06-18", "09:00", 30
    )

    page.goto(
        f"/app/workspace/apps/time-plans/{time_plan.ref_id}/{inbox_task_activity.ref_id}"
        f"?timeEventRefId={time_event.ref_id}"
    )
    wait_for_hydration(page)
    with page.expect_response(
        lambda response: "mutations/archive-time-event" in response.url
    ) as response_info:
        page.locator('button[value="remove-time-event"]').click()

    body = response_info.value.json()
    assert body["data"]["archived_time_event_in_day_block"]["archived"] is True
    page.wait_for_url(
        re.compile(
            rf"/app/workspace/apps/time-plans/{time_plan.ref_id}/{inbox_task_activity.ref_id}$"
        )
    )
    expect(page.locator('button[value="update-time-event"]')).to_have_count(0)


def test_webui_time_plan_activity_big_plan_create_note(
    page: Page,
    create_time_plan,
    create_big_plan,
    create_time_plan_activity_from_big_plan,
) -> None:
    time_plan = create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    big_plan = create_big_plan("The Noted Big Plan")
    big_plan_activity = create_time_plan_activity_from_big_plan(
        time_plan.ref_id, big_plan.ref_id
    )
    activity_url = (
        f"/app/workspace/apps/time-plans/{time_plan.ref_id}/{big_plan_activity.ref_id}"
    )

    page.goto(activity_url)
    wait_for_hydration(page)
    with page.expect_response(
        lambda response: "mutations/create-note" in response.url
    ) as response_info:
        page.locator("#leaf-panel").locator(
            'button[value="target-big-plan-create-note"]'
        ).click()

    assert "new_note" in response_info.value.json()["data"]
    expect(page.locator("#leaf-panel #entity-block-editor")).to_be_visible()
    expect(page).to_have_url(re.compile(rf"{re.escape(activity_url)}$"))

    page.goto(activity_url)

    expect(page.locator("#leaf-panel #entity-block-editor")).to_be_visible()


def test_webui_time_plan_activity_new_time_event(
    page: Page,
    create_time_plan,
    create_inbox_task,
    create_time_plan_activity_from_inbox_task,
) -> None:
    time_plan = create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    inbox_task = create_inbox_task("The Newly Scheduled Inbox Task")
    inbox_task_activity = create_time_plan_activity_from_inbox_task(
        time_plan.ref_id, inbox_task.ref_id
    )

    page.goto(
        f"/app/workspace/apps/time-plans/{time_plan.ref_id}/new-activity-time-event"
        f"?timePlanActivityRefId={inbox_task_activity.ref_id}&date=2024-06-18"
    )
    wait_for_hydration(page)
    with page.expect_response(
        lambda response: "place-activity-time-event" in response.url
    ) as response_info:
        page.locator("#leaf-panel").locator('button[value="create"]').click()

    new_time_events = response_info.value.json()["data"]["new_time_events"]
    assert [event["owner"] for event in new_time_events] == [
        f"TimePlanActivity:std:{inbox_task_activity.ref_id}"
    ]
    page.wait_for_url(
        re.compile(
            rf"/app/workspace/apps/time-plans/{time_plan.ref_id}/{inbox_task_activity.ref_id}$"
        )
    )


def test_webui_time_plan_activity_archive_inbox_task(
    page: Page,
    logged_in_client: AuthenticatedClient,
    create_time_plan,
    create_inbox_task,
    create_time_plan_activity_from_inbox_task,
) -> None:
    time_plan = create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    inbox_task = create_inbox_task("The Inbox Task")
    inbox_task_activity = create_time_plan_activity_from_inbox_task(
        time_plan.ref_id, inbox_task.ref_id
    )

    page.goto(f"/app/workspace/apps/time-plans/{time_plan.ref_id}")

    expect(page.locator("#time-plan-activities")).to_contain_text("The Inbox Task")

    page.goto(
        f"/app/workspace/apps/time-plans/{time_plan.ref_id}/{inbox_task_activity.ref_id}"
    )

    page.locator("#leaf-entity-archive").click()
    page.locator("#leaf-entity-archive-confirm").click()

    page.wait_for_url(f"/app/workspace/apps/time-plans/{time_plan.ref_id}")

    page.goto(
        f"/app/workspace/apps/time-plans/{time_plan.ref_id}/{inbox_task_activity.ref_id}"
    )

    expect(
        page.locator('button[id="time-plan-activity-feasability-must-do"]')
    ).to_be_disabled()

    page.goto(f"/app/workspace/apps/time-plans/{time_plan.ref_id}")

    expect(page.locator("#time-plan-activities")).not_to_contain_text("The Inbox Task")


def test_webui_time_plan_activity_archive_big_plan_with_inbox_task(
    page: Page,
    logged_in_client: AuthenticatedClient,
    create_time_plan,
    create_inbox_task,
    create_big_plan,
    create_time_plan_activity_from_inbox_task,
    create_time_plan_activity_from_big_plan,
) -> None:
    time_plan = create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    big_plan = create_big_plan("The Big Plan")
    inbox_task = create_inbox_task("The Inbox Task", big_plan_id=big_plan.ref_id)
    big_plan_activity = create_time_plan_activity_from_big_plan(
        time_plan.ref_id, big_plan.ref_id
    )
    inbox_task_activity = create_time_plan_activity_from_inbox_task(
        time_plan.ref_id, inbox_task.ref_id
    )

    page.goto(f"/app/workspace/apps/time-plans/{time_plan.ref_id}")

    expect(page.locator("#time-plan-activities")).to_contain_text("The Inbox Task")
    expect(page.locator("#time-plan-activities")).to_contain_text("The Big Plan")

    page.goto(
        f"/app/workspace/apps/time-plans/{time_plan.ref_id}/{big_plan_activity.ref_id}"
    )

    page.locator("#leaf-entity-archive").click()
    page.locator("#leaf-entity-archive-confirm").click()

    page.wait_for_url(f"/app/workspace/apps/time-plans/{time_plan.ref_id}")

    page.goto(
        f"/app/workspace/apps/time-plans/{time_plan.ref_id}/{inbox_task_activity.ref_id}"
    )

    expect(page.locator("#inbox-task-editor-save")).to_be_disabled()

    page.goto(f"/app/workspace/apps/time-plans/{time_plan.ref_id}")

    expect(page.locator("#time-plan-activities")).not_to_contain_text("The Inbox Task")
    expect(page.locator("#time-plan-activities")).not_to_contain_text("The Big Plan")


def test_webui_time_plan_periods_settings_standard(page: Page) -> None:
    page.goto("/app/workspace/apps/time-plans")

    expect(page.locator("a", has_text="Create a quarterly time plan")).to_be_attached()
    expect(page.locator("a", has_text="Create a weekly time plan")).to_be_attached()


def test_webui_time_plan_periods_settings_add_monthly(page: Page) -> None:
    page.goto("/app/workspace/apps/time-plans/settings")

    page.locator("button", has_text="Monthly").click()
    page.locator("button", has_text="None").click()

    page.locator("#time-plans-settings-save").click()

    page.wait_for_url("/app/workspace/apps/time-plans/settings")

    page.goto("/app/workspace/apps/time-plans")
    page.reload()

    expect(page.locator("a", has_text="Create a monthly time plan")).to_be_attached()
    expect(page.locator("a", has_text="Create a quarterly time plan")).to_be_attached()
    expect(page.locator("a", has_text="Create a weekly time plan")).to_be_attached()


def test_webui_time_plan_generate_standard_config_via_gen(page: Page, new_user) -> None:
    page.goto("/app/workspace/tools/gen")

    page.locator("#generate").click()

    page.goto("/app/workspace/apps/time-plans")
    page.reload()

    expect(page.locator("#time-plans-all")).to_contain_text("Weekly plan for")
    expect(page.locator("#time-plans-all")).to_contain_text("Quarterly plan for")

    page.goto("/app/workspace/core/inbox-tasks")

    expect(page.locator("html")).to_contain_text("Make weekly plan for")
    expect(page.locator("html")).to_contain_text("Make quarterly plan for")


def test_webui_time_plan_generate_includes_period_questions_in_note(
    page: Page, create_question
) -> None:
    question = create_question(f"Generated weekly prompt {uuid.uuid4().hex[:8]}")

    page.goto("/app/workspace/tools/gen")
    fill_after_hydration(page.locator('input[name="today"]'), "2098-06-01")
    page.get_by_text("Advanced Options & Filtering").click()
    page.get_by_label("Generate Even If Not Modified").click()
    with page.expect_response(
        lambda response: response.request.method == "POST"
        and "/tools/gen" in response.url
        and response.ok,
        timeout=120_000,
    ):
        page.locator("#generate").click()

    page.goto("/app/workspace/apps/time-plans")
    page.wait_for_selector("#trunk-panel")
    page.reload()
    page.wait_for_selector("#trunk-panel")
    expect(page.locator("#time-plans-all")).to_contain_text(
        "Weekly plan for 2098-06-04"
    )
    page.locator("a", has_text="Weekly plan for 2098-06-04").click()
    page.wait_for_url(re.compile(r"/app/workspace/apps/time-plans/\d+"))
    page.wait_for_selector("#branch-panel")
    headings = _note_heading_texts(page)
    assert question.name in headings


def test_webui_time_plan_generate_standard_config_via_save(page: Page) -> None:
    page.goto("/app/workspace/apps/time-plans/settings")

    page.locator("#time-plans-settings-save").click()

    page.goto("/app/workspace/apps/time-plans")
    page.reload()

    expect(page.locator("#time-plans-all")).to_contain_text("Weekly plan for")
    expect(page.locator("#time-plans-all")).to_contain_text("Quarterly plan for")

    page.goto("/app/workspace/core/inbox-tasks")

    expect(page.locator("html")).to_contain_text("Make weekly plan for")
    expect(page.locator("html")).to_contain_text("Make quarterly plan for")


def test_webui_time_plan_generate_different_config_add_monthly(page: Page) -> None:
    page.goto("/app/workspace/apps/time-plans/settings")

    page.locator("#period-monthly").click()
    expect(page.locator("#period-weekly")).to_have_attribute("aria-pressed", "true")
    expect(page.locator("#period-quarterly")).to_have_attribute("aria-pressed", "true")
    expect(page.locator("#period-monthly")).to_have_attribute("aria-pressed", "true")

    page.locator("#time-plans-settings-save").click()
    page.wait_for_load_state("networkidle")

    page.goto("/app/workspace/apps/time-plans")
    page.reload()

    expect(page.locator("#time-plans-all")).to_contain_text("Monthly plan for")
    expect(page.locator("#time-plans-all")).to_contain_text("Weekly plan for")
    expect(page.locator("#time-plans-all")).to_contain_text("Quarterly plan for")

    page.goto("/app/workspace/core/inbox-tasks")

    expect(page.locator("html")).to_contain_text("Make monthly plan for")
    expect(page.locator("html")).to_contain_text("Make weekly plan for")
    expect(page.locator("html")).to_contain_text("Make quarterly plan for")


def test_webui_time_plan_generate_different_config_remove_quarterly(page: Page) -> None:
    page.goto("/app/workspace/apps/time-plans/settings")

    page.locator("button", has_text="Quarterly").click()

    page.locator("#time-plans-settings-save").click()

    page.goto("/app/workspace/apps/time-plans")
    page.reload()

    expect(page.locator("#time-plans-all")).to_contain_text("Weekly plan for")
    expect(page.locator("#time-plans-all")).not_to_contain_text("Quarterly plan for")

    page.goto("/app/workspace/core/inbox-tasks")

    expect(page.locator("html")).to_contain_text("Make weekly plan for")
    expect(page.locator("html")).not_to_contain_text("Make quarterly plan for")


def test_webui_time_plan_generate_no_planning_tasks(page: Page) -> None:
    page.goto("/app/workspace/apps/time-plans/settings")

    page.locator("button", has_text="Only Plan").click()

    page.locator("#time-plans-settings-save").click()

    page.goto("/app/workspace/apps/time-plans")
    page.reload()

    expect(page.locator("#time-plans-all")).to_contain_text("Weekly plan for")
    expect(page.locator("#time-plans-all")).to_contain_text("Quarterly plan for")

    page.goto("/app/workspace/core/inbox-tasks")

    expect(page.locator("html")).not_to_contain_text("Make weekly plan for")
    expect(page.locator("html")).not_to_contain_text("Make quarterly plan for")


def test_webui_time_plan_generate_no_nothing(page: Page) -> None:
    page.goto("/app/workspace/apps/time-plans/settings")

    page.locator("button", has_text="None").click()

    page.locator("#time-plans-settings-save").click()

    page.goto("/app/workspace/apps/time-plans")
    page.reload()

    expect(page.locator("#time-plans-all")).not_to_contain_text("Weekly plan for")
    expect(page.locator("#time-plans-all")).not_to_contain_text("Quarterly plan for")

    page.goto("/app/workspace/core/inbox-tasks")

    expect(page.locator("html")).not_to_contain_text("Make weekly plan for")
    expect(page.locator("html")).not_to_contain_text("Make quarterly plan for")


def test_webui_time_plan_generate_no_nothing_and_regenerate(page: Page) -> None:
    page.goto("/app/workspace/apps/time-plans/settings")

    page.locator("button", has_text="None").click()

    page.locator("#time-plans-settings-save").click()

    page.goto("/app/workspace/apps/time-plans")
    page.reload()

    expect(page.locator("#time-plans-all")).not_to_contain_text("Weekly plan for")
    expect(page.locator("#time-plans-all")).not_to_contain_text("Quarterly plan for")

    page.goto("/app/workspace/apps/time-plans/settings")

    page.locator("button", has_text="Both Plan And Task").click()

    page.locator("#time-plans-settings-save").click()

    page.goto("/app/workspace/apps/time-plans")
    page.reload()

    expect(page.locator("#time-plans-all")).to_contain_text("Weekly plan for")
    expect(page.locator("#time-plans-all")).to_contain_text("Quarterly plan for")

    page.goto("/app/workspace/core/inbox-tasks")

    expect(page.locator("html")).to_contain_text("Make weekly plan for")
    expect(page.locator("html")).to_contain_text("Make quarterly plan for")


def test_webui_time_plan_generate_does_not_override_existing_time_plans(
    page: Page, create_time_plan
) -> None:
    # Gen targets the week of (today + generation_in_advance_days[WEEKLY]). That
    # target always falls in either the current ISO week or the next one, but a
    # single "now + 3" can straddle a week boundary (e.g. when run late in the
    # week) and land in a different week than gen's target, making the test
    # flaky. Pre-create a user weekly plan for both the current week and the
    # next week so gen's target week always already has a user plan and is
    # therefore skipped (no "Make weekly plan" task generated).
    now = pendulum.now(tz="UTC")
    _ = create_time_plan(now.strftime("%Y-%m-%d"), RecurringTaskPeriod.WEEKLY)
    _ = create_time_plan(
        now.add(days=7).strftime("%Y-%m-%d"), RecurringTaskPeriod.WEEKLY
    )

    page.goto("/app/workspace/apps/time-plans/settings")

    page.locator("#time-plans-settings-save").click()

    page.goto("/app/workspace/apps/time-plans")
    page.reload()

    expect(page.locator("#time-plans-all")).to_contain_text("Weekly plan for")
    expect(page.locator("#time-plans-all", has_text="Weekly plan for")).to_contain_text(
        "User"
    )
    expect(page.locator("#time-plans-all")).to_contain_text("Quarterly plan for")
    expect(
        page.locator("#time-plans-all", has_text="Quarterly plan for")
    ).to_contain_text("Recurring")

    page.goto("/app/workspace/core/inbox-tasks")

    expect(page.locator("html")).not_to_contain_text("Make weekly plan for")
    expect(page.locator("html")).to_contain_text("Make quarterly plan for")


def test_webui_time_plan_generate_does_not_override_existing_time_plans_with_no_periods(
    page: Page, create_time_plan
) -> None:
    right_now = pendulum.now(tz="UTC").add(days=3)
    _ = create_time_plan(right_now.strftime("%Y-%m-%d"), RecurringTaskPeriod.WEEKLY)

    page.goto("/app/workspace/apps/time-plans/settings")

    page.locator("button", has_text="Weekly").click()

    page.locator("#time-plans-settings-save").click()

    page.goto("/app/workspace/apps/time-plans")
    page.reload()

    expect(page.locator("#time-plans-all")).to_contain_text("Weekly plan for")
    expect(page.locator("#time-plans-all", has_text="Weekly plan for")).to_contain_text(
        "User"
    )
    expect(page.locator("#time-plans-all")).to_contain_text("Quarterly plan for")
    expect(
        page.locator("#time-plans-all", has_text="Quarterly plan for")
    ).to_contain_text("Recurring")

    page.goto("/app/workspace/core/inbox-tasks")

    expect(page.locator("html")).not_to_contain_text("Make weekly plan for")
    expect(page.locator("html")).to_contain_text("Make quarterly plan for")


def test_webui_time_plan_generate_time_plan_is_not_editable(page: Page) -> None:
    page.goto("/app/workspace/tools/gen")

    page.locator("#generate").click()

    page.goto("/app/workspace/apps/time-plans")
    page.reload()

    page.locator("#time-plans-all", has_text="Weekly plan for").click()

    expect(page.locator("input[name='rightNow']")).to_have_attribute("readonly", "")
    # Check the Select dropdown is disabled (compact mode)
    expect(page.locator('div[aria-labelledby="period"]')).to_have_attribute(
        "aria-disabled", "true"
    )


def test_webui_time_plan_generate_planning_task_links_to_time_plan(page: Page) -> None:
    page.goto("/app/workspace/tools/gen")

    page.locator("#generate").click()

    page.goto("/app/workspace/core/inbox-tasks")
    page.reload()

    page.get_by_role("link", name=re.compile(r"Make weekly plan for")).first.click()

    page.wait_for_url(re.compile(r"/app/workspace/core/inbox-tasks/\d+"))

    page.locator("#leaf-panel").locator("a", has_text="Time Plan").click()

    page.wait_for_url(re.compile(r"/app/workspace/apps/time-plans/\d+"))
    page.reload()

    # Check the Select dropdown has "weekly" as the value (compact mode)
    expect(page.locator('input[name="period"]')).to_have_value("weekly")


def _mark_inbox_task_done(
    logged_in_client: AuthenticatedClient, inbox_task: InboxTask
) -> None:
    inbox_task_update_sync(
        client=logged_in_client,
        body=InboxTaskUpdateArgs(
            ref_id=inbox_task.ref_id,
            name=InboxTaskUpdateArgsName(should_change=False),
            status=InboxTaskUpdateArgsStatus(
                should_change=True, value=InboxTaskStatus.DONE
            ),
            eisen=InboxTaskUpdateArgsEisen(should_change=False),
            difficulty=InboxTaskUpdateArgsDifficulty(should_change=False),
            actionable_date=InboxTaskUpdateArgsActionableDate(should_change=False),
            due_date=InboxTaskUpdateArgsDueDate(should_change=False),
            is_key=InboxTaskUpdateArgsIsKey(should_change=False),
        ),
    )


def _clear_inbox_task_dates(
    logged_in_client: AuthenticatedClient, inbox_task: InboxTask
) -> None:
    inbox_task_update_sync(
        client=logged_in_client,
        body=InboxTaskUpdateArgs(
            ref_id=inbox_task.ref_id,
            name=InboxTaskUpdateArgsName(should_change=False),
            status=InboxTaskUpdateArgsStatus(should_change=False),
            eisen=InboxTaskUpdateArgsEisen(should_change=False),
            difficulty=InboxTaskUpdateArgsDifficulty(should_change=False),
            actionable_date=InboxTaskUpdateArgsActionableDate(
                should_change=True, value=None
            ),
            due_date=InboxTaskUpdateArgsDueDate(should_change=True, value=None),
            is_key=InboxTaskUpdateArgsIsKey(should_change=False),
        ),
    )


def _mark_big_plan_done(
    logged_in_client: AuthenticatedClient, big_plan: BigPlan
) -> None:
    big_plan_update_sync(
        client=logged_in_client,
        body=BigPlanUpdateArgs(
            ref_id=big_plan.ref_id,
            name=BigPlanUpdateArgsName(should_change=False),
            status=BigPlanUpdateArgsStatus(
                should_change=True, value=BigPlanStatus.DONE
            ),
            actionable_date=BigPlanUpdateArgsActionableDate(should_change=False),
            due_date=BigPlanUpdateArgsDueDate(should_change=False),
            aspect_ref_id=BigPlanUpdateArgsAspectRefId(should_change=False),
            chapter_ref_id=BigPlanUpdateArgsChapterRefId(should_change=False),
            goal_ref_id=BigPlanUpdateArgsGoalRefId(should_change=False),
            is_key=BigPlanUpdateArgsIsKey(should_change=False),
            eisen=BigPlanUpdateArgsEisen(should_change=False),
            difficulty=BigPlanUpdateArgsDifficulty(should_change=False),
            dependency_ref_ids=BigPlanUpdateArgsDependencyRefIds(should_change=False),
            schedulability=BigPlanUpdateArgsSchedulability(should_change=False),
            scheduling_event_duration_mins=(
                BigPlanUpdateArgsSchedulingEventDurationMins(should_change=False)
            ),
            scheduling_event_count=BigPlanUpdateArgsSchedulingEventCount(
                should_change=False
            ),
        ),
    )


def _clear_big_plan_dates(
    logged_in_client: AuthenticatedClient, big_plan: BigPlan
) -> None:
    big_plan_update_sync(
        client=logged_in_client,
        body=BigPlanUpdateArgs(
            ref_id=big_plan.ref_id,
            name=BigPlanUpdateArgsName(should_change=False),
            status=BigPlanUpdateArgsStatus(should_change=False),
            actionable_date=BigPlanUpdateArgsActionableDate(
                should_change=True, value=None
            ),
            due_date=BigPlanUpdateArgsDueDate(should_change=True, value=None),
            aspect_ref_id=BigPlanUpdateArgsAspectRefId(should_change=False),
            chapter_ref_id=BigPlanUpdateArgsChapterRefId(should_change=False),
            goal_ref_id=BigPlanUpdateArgsGoalRefId(should_change=False),
            is_key=BigPlanUpdateArgsIsKey(should_change=False),
            eisen=BigPlanUpdateArgsEisen(should_change=False),
            difficulty=BigPlanUpdateArgsDifficulty(should_change=False),
            dependency_ref_ids=BigPlanUpdateArgsDependencyRefIds(should_change=False),
            schedulability=BigPlanUpdateArgsSchedulability(should_change=False),
            scheduling_event_duration_mins=(
                BigPlanUpdateArgsSchedulingEventDurationMins(should_change=False)
            ),
            scheduling_event_count=BigPlanUpdateArgsSchedulingEventCount(
                should_change=False
            ),
        ),
    )


def test_webui_time_plan_add_big_plan_to_an_already_existing_time_plan(
    page: Page,
    logged_in_client: AuthenticatedClient,
    create_time_plan,
    create_big_plan,
    create_time_plan_activity_from_big_plan,
) -> None:
    create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    big_plan = create_big_plan("The Big Plan")

    page.goto(f"/app/workspace/apps/big-plans/{big_plan.ref_id}")
    wait_for_hydration(page)

    page.locator("#big-plan-time-plans").locator("a", has_text="Add").click()

    page.wait_for_url(
        re.compile(
            rf"/app/workspace/apps/time-plans/add-big-plan-to-plans\?bigPlanRefId={big_plan.ref_id}"
        )
    )

    page.locator("#all-time-plans").locator(
        "p", has_text="Weekly plan for 2024-06-18"
    ).click()

    page.locator("#add-big-plan-to-plans").locator("button", has_text="Add").click()

    page.wait_for_url(re.compile(rf"/app/workspace/apps/big-plans/{big_plan.ref_id}"))

    expect(page.locator("#big-plan-time-plans")).to_contain_text(
        "Weekly plan for 2024-06-18"
    )


def test_webui_time_plan_add_big_plan_to_an_already_existing_time_plan_no_dates(
    page: Page,
    logged_in_client: AuthenticatedClient,
    create_time_plan,
    create_big_plan,
    create_time_plan_activity_from_big_plan,
) -> None:
    create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    big_plan = create_big_plan("The Big Plan")

    page.goto(f"/app/workspace/apps/big-plans/{big_plan.ref_id}")
    wait_for_hydration(page)

    page.locator("#big-plan-time-plans").locator("a", has_text="Add").click()

    page.wait_for_url(
        re.compile(
            rf"/app/workspace/apps/time-plans/add-big-plan-to-plans\?bigPlanRefId={big_plan.ref_id}"
        )
    )

    page.locator("#all-time-plans").locator(
        "p", has_text="Weekly plan for 2024-06-18"
    ).click()

    page.locator("#add-big-plan-to-plans").locator("button", has_text="Add").click()

    page.wait_for_url(re.compile(rf"/app/workspace/apps/big-plans/{big_plan.ref_id}"))

    expect(page.locator("#big-plan-time-plans")).to_contain_text(
        "Weekly plan for 2024-06-18"
    )

    page.goto(f"/app/workspace/apps/big-plans/{big_plan.ref_id}")
    expect(page.locator("input[name='actionableDate']")).to_have_value("2024-06-17")
    expect(page.locator("input[name='dueDate']")).to_have_value("2024-06-23")


def test_webui_time_plan_add_big_plan_to_an_already_existing_time_plan_with_dates(
    page: Page,
    logged_in_client: AuthenticatedClient,
    create_time_plan,
    create_big_plan,
    create_time_plan_activity_from_big_plan,
) -> None:
    create_time_plan("2024-06-18", RecurringTaskPeriod.DAILY)
    big_plan = create_big_plan(
        "The Big Plan", actionable_date="2024-06-18", due_date="2024-06-18"
    )

    page.goto(f"/app/workspace/apps/big-plans/{big_plan.ref_id}")
    wait_for_hydration(page)

    page.locator("#big-plan-time-plans").locator("a", has_text="Add").click()

    page.wait_for_url(
        re.compile(
            rf"/app/workspace/apps/time-plans/add-big-plan-to-plans\?bigPlanRefId={big_plan.ref_id}"
        )
    )

    page.locator("#all-time-plans").locator(
        "p", has_text="Daily plan for 2024-06-18"
    ).click()

    page.locator("#add-big-plan-to-plans").locator("button", has_text="Add").click()

    page.wait_for_url(re.compile(rf"/app/workspace/apps/big-plans/{big_plan.ref_id}"))

    expect(page.locator("#big-plan-time-plans")).to_contain_text(
        "Daily plan for 2024-06-18"
    )

    page.goto(f"/app/workspace/apps/big-plans/{big_plan.ref_id}")
    expect(page.locator("input[name='actionableDate']")).to_have_value("2024-06-18")
    expect(page.locator("input[name='dueDate']")).to_have_value("2024-06-18")


def test_webui_time_plan_add_big_plan_to_multiple_already_existing_time_plans(
    page: Page,
    logged_in_client: AuthenticatedClient,
    create_time_plan,
    create_big_plan,
    create_time_plan_activity_from_big_plan,
) -> None:
    time_plan1 = create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    time_plan2 = create_time_plan("2024-06-25", RecurringTaskPeriod.WEEKLY)
    big_plan = create_big_plan("The Big Plan")

    page.goto(f"/app/workspace/apps/big-plans/{big_plan.ref_id}")
    wait_for_hydration(page)

    page.locator("#big-plan-time-plans").locator("a", has_text="Add").click()

    page.wait_for_url(
        re.compile(
            rf"/app/workspace/apps/time-plans/add-big-plan-to-plans\?bigPlanRefId={big_plan.ref_id}"
        )
    )

    page.locator("#all-time-plans").locator(
        "p", has_text="Weekly plan for 2024-06-18"
    ).click()
    page.locator("#all-time-plans").locator(
        "p", has_text="Weekly plan for 2024-06-25"
    ).click()

    page.locator("#add-big-plan-to-plans").locator("button", has_text="Add").click()

    page.wait_for_url(re.compile(rf"/app/workspace/apps/big-plans/{big_plan.ref_id}"))

    expect(page.locator("#big-plan-time-plans")).to_contain_text(
        "Weekly plan for 2024-06-18"
    )
    expect(page.locator("#big-plan-time-plans")).to_contain_text(
        "Weekly plan for 2024-06-25"
    )

    page.goto(f"/app/workspace/apps/time-plans/{time_plan1.ref_id}")
    expect(page.locator("#time-plan-activities")).to_contain_text("The Big Plan")

    page.goto(f"/app/workspace/apps/time-plans/{time_plan2.ref_id}")
    expect(page.locator("#time-plan-activities")).to_contain_text("The Big Plan")


def test_webui_time_plan_add_big_plan_to_an_already_existing_time_plan_with_inbox_tasks(
    page: Page,
    logged_in_client: AuthenticatedClient,
    create_time_plan,
    create_inbox_task,
    create_big_plan,
    create_time_plan_activity_from_big_plan,
) -> None:
    time_plan = create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    big_plan = create_big_plan(
        "The Big Plan", actionable_date="2024-06-10", due_date="2024-06-19"
    )
    create_inbox_task("The Inbox Task 1", big_plan_id=big_plan.ref_id)
    create_inbox_task("The Inbox Task 2", big_plan_id=big_plan.ref_id)

    page.goto(f"/app/workspace/apps/big-plans/{big_plan.ref_id}")
    wait_for_hydration(page)

    page.locator("#big-plan-time-plans").locator("a", has_text="Add").click()

    page.wait_for_url(
        re.compile(
            rf"/app/workspace/apps/time-plans/add-big-plan-to-plans\?bigPlanRefId={big_plan.ref_id}"
        )
    )

    page.locator("#all-time-plans").locator(
        "p", has_text="Weekly plan for 2024-06-18"
    ).click()

    page.locator("#add-big-plan-to-plans").locator("button", has_text="Add").click()

    page.wait_for_url(re.compile(rf"/app/workspace/apps/big-plans/{big_plan.ref_id}"))

    expect(page.locator("#big-plan-time-plans")).to_contain_text(
        "Weekly plan for 2024-06-18"
    )

    page.goto(f"/app/workspace/apps/time-plans/{time_plan.ref_id}")
    expect(page.locator("#time-plan-activities")).to_contain_text("The Big Plan")
    expect(page.locator("#time-plan-activities")).not_to_contain_text(
        "The Inbox Task 1"
    )
    expect(page.locator("#time-plan-activities")).not_to_contain_text(
        "The Inbox Task 2"
    )

    page.goto(f"/app/workspace/apps/big-plans/{big_plan.ref_id}")
    expect(page.locator("input[name='actionableDate']")).to_have_value("2024-06-10")
    expect(page.locator("input[name='dueDate']")).to_have_value("2024-06-19")


@pytest.fixture()
def another_user_with_time_plans_enabled(
    webapi_url: str,
    another_user_and_workspace: AnotherUserAndWorkspace,
) -> Iterator[AnotherUserAndWorkspace]:
    def make_client() -> AuthenticatedClient:
        return AuthenticatedClient(
            base_url=webapi_url,
            token=another_user_and_workspace.init_result.auth_token_ext,
        )

    try:
        workspace_set_feature_sync(
            client=make_client(),
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.TIME_PLANS, value=True
            ),
        )
        workspace_set_feature_sync(
            client=make_client(),
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.BIG_PLANS, value=True
            ),
        )
        workspace_set_feature_sync(
            client=make_client(),
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.TODO_TASK, value=True
            ),
        )
        yield another_user_and_workspace
    finally:
        workspace_set_feature_sync(
            client=make_client(),
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.TODO_TASK, value=False
            ),
        )
        workspace_set_feature_sync(
            client=make_client(),
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.BIG_PLANS, value=False
            ),
        )
        workspace_set_feature_sync(
            client=make_client(),
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.TIME_PLANS, value=False
            ),
        )


_ACCESS_DENIED_LABEL = "You do not have the right access for this entity"


def _login_as_other_user(page: Page, other_user: AnotherUserAndWorkspace) -> None:
    page.locator("#account-menu").click()
    page.locator("#logout").click()
    page.wait_for_url("/app/lifecycle/login/local/login")

    page.locator('input[name="emailAddress"]').fill(other_user.user.email)
    page.locator('input[name="password"]').fill(other_user.user.password)
    page.locator("#login").locator("button", has_text="Login").click()
    page.wait_for_url("/app/workspace")


@pytest.fixture()
def grant_time_plan_access(
    logged_in_client: AuthenticatedClient,
    another_user_with_time_plans_enabled: AnotherUserAndWorkspace,
):
    def _grant(time_plan: TimePlan, access_level: AccessLevel) -> None:
        response = invite_users_to_entity_sync(
            client=logged_in_client,
            body=InviteUsersToEntityArgs(
                entity_type=NamedEntityTag.TIMEPLAN,
                entity_ref_id=time_plan.ref_id,
                user_ref_ids=[
                    another_user_with_time_plans_enabled.init_result.new_user.ref_id
                ],
                access_level=access_level,
            ),
        )
        assert response.status_code == 200

    return _grant


def _assert_other_user_cannot_access_time_plan_webui(
    page: Page,
    *,
    time_plan: TimePlan,
) -> None:
    page.goto("/app/workspace/apps/time-plans")
    expect(page.locator(f"#time-plan-{time_plan.ref_id}")).to_have_count(0)

    page.goto(f"/app/workspace/apps/time-plans/{time_plan.ref_id}")
    expect(page.locator("body")).to_contain_text(_ACCESS_DENIED_LABEL)


def test_webui_time_plan_acl_reader_can_read_but_not_update_or_archive(
    page: Page,
    create_time_plan,
    grant_time_plan_access,
    another_user_with_time_plans_enabled: AnotherUserAndWorkspace,
) -> None:
    time_plan = create_time_plan("2025-01-06", RecurringTaskPeriod.WEEKLY)

    _login_as_other_user(page, another_user_with_time_plans_enabled)
    _assert_other_user_cannot_access_time_plan_webui(page, time_plan=time_plan)

    grant_time_plan_access(time_plan, AccessLevel.READER)

    _login_as_other_user(page, another_user_with_time_plans_enabled)

    page.goto("/app/workspace/apps/time-plans")
    expect(page.locator(f"#time-plan-{time_plan.ref_id}")).to_have_count(1)

    page.goto(f"/app/workspace/apps/time-plans/{time_plan.ref_id}")
    page.wait_for_selector("#branch-panel")

    expect(page.locator('input[name="rightNow"]')).to_be_disabled()
    expect(page.locator("#time-plan-change-time-config")).to_be_disabled()
    expect(page.locator("#branch-entity-archive")).to_be_disabled()


def test_webui_time_plan_acl_writer_can_read_and_update(
    page: Page,
    create_time_plan,
    grant_time_plan_access,
    another_user_with_time_plans_enabled: AnotherUserAndWorkspace,
) -> None:
    time_plan = create_time_plan("2025-01-20", RecurringTaskPeriod.WEEKLY)
    grant_time_plan_access(time_plan, AccessLevel.WRITER)

    _login_as_other_user(page, another_user_with_time_plans_enabled)

    page.goto(f"/app/workspace/apps/time-plans/{time_plan.ref_id}")
    page.wait_for_selector("#branch-panel")
    expect(page.locator('input[name="rightNow"]')).to_have_value("2025-01-20")

    page.locator('input[name="rightNow"]').fill("2025-01-27")
    page.locator("#time-plan-change-time-config").click()

    page.wait_for_url(re.compile(r"/app/workspace/apps/time-plans/\d+"))
    page.wait_for_selector("#branch-panel")
    expect(page.locator('input[name="rightNow"]')).to_have_value("2025-01-27")


def test_webui_time_plan_acl_writer_can_read_and_archive(
    page: Page,
    create_time_plan,
    grant_time_plan_access,
    another_user_with_time_plans_enabled: AnotherUserAndWorkspace,
) -> None:
    time_plan = create_time_plan("2025-02-03", RecurringTaskPeriod.WEEKLY)
    grant_time_plan_access(time_plan, AccessLevel.WRITER)

    _login_as_other_user(page, another_user_with_time_plans_enabled)

    page.goto(f"/app/workspace/apps/time-plans/{time_plan.ref_id}")
    page.wait_for_selector("#branch-panel")

    page.locator("#branch-entity-archive").click()
    page.locator("#branch-entity-archive-confirm").click()

    page.wait_for_url("/app/workspace/apps/time-plans")

    page.goto(f"/app/workspace/apps/time-plans/{time_plan.ref_id}")
    page.wait_for_selector("#branch-panel")

    expect(page.locator("#time-plan-change-time-config")).to_be_disabled()


def test_webui_time_plan_acl_z_denied_without_grant(
    page: Page,
    create_time_plan,
    another_user_with_time_plans_enabled: AnotherUserAndWorkspace,
) -> None:
    time_plan = create_time_plan("2025-02-10", RecurringTaskPeriod.WEEKLY)

    _login_as_other_user(page, another_user_with_time_plans_enabled)
    _assert_other_user_cannot_access_time_plan_webui(page, time_plan=time_plan)


def test_webui_time_plan_activity_acl(
    page: Page,
    create_time_plan,
    create_inbox_task,
    create_time_plan_activity_from_inbox_task,
    another_user_with_time_plans_enabled: AnotherUserAndWorkspace,
) -> None:
    time_plan = create_time_plan("2025-01-13", RecurringTaskPeriod.WEEKLY)
    inbox_task = create_inbox_task("ACL Activity Task")
    activity = create_time_plan_activity_from_inbox_task(
        time_plan.ref_id, inbox_task.ref_id
    )

    _login_as_other_user(page, another_user_with_time_plans_enabled)

    page.goto(f"/app/workspace/apps/time-plans/{time_plan.ref_id}/{activity.ref_id}")
    expect(page.locator("body")).to_contain_text(_ACCESS_DENIED_LABEL)


@pytest.mark.usefixtures("_with_habits_enabled")
def test_webui_time_plan_associate_with_habit_stack(
    page: Page,
    create_time_plan,
    create_habit,
    create_habit_stack,
) -> None:
    time_plan = create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    stacked_habit = create_habit("Stacked Habit")
    unstacked_habit = create_habit("Solo Habit")
    stack = create_habit_stack("Morning Stack", [stacked_habit.ref_id])

    page.goto(f"/app/workspace/apps/time-plans/{time_plan.ref_id}")

    page.locator("#section-action-nav-multiple-compact-button").click()
    page.get_by_role("menuitem", name="From Existing Habits").click()

    page.wait_for_url(
        re.compile(r"/app/workspace/apps/time-plans/\d+/add-from-current-habits")
    )

    current_habits = page.locator("#time-plan-current-habits")
    expect(current_habits.locator(f"#habit-stack-{stack.ref_id}")).to_contain_text(
        "Morning Stack"
    )
    expect(current_habits.locator(f"#habit-{unstacked_habit.ref_id}")).to_contain_text(
        "Solo Habit"
    )
    expect(current_habits.locator(f"#habit-{stacked_habit.ref_id}")).to_have_count(0)

    stack_box = current_habits.locator(f"#habit-stack-{stack.ref_id}")
    unstacked_box = current_habits.locator(f"#habit-{unstacked_habit.ref_id}")
    stack_pos = stack_box.bounding_box()
    unstacked_pos = unstacked_box.bounding_box()
    assert stack_pos is not None
    assert unstacked_pos is not None
    assert stack_pos["y"] < unstacked_pos["y"]

    current_habits.locator("p", has_text="Morning Stack").click()
    current_habits.locator("button", has_text=re.compile(r"^Add$")).click()

    page.wait_for_url(re.compile(rf"/app/workspace/apps/time-plans/{time_plan.ref_id}"))

    expect(page.locator("#time-plan-activities")).to_contain_text("Morning Stack")
    # Stacks show collapsed; their members appear once expanded.
    page.locator("#time-plan-activities").get_by_role("img", name="Show tasks").click()
    expect(page.locator("#time-plan-activities")).to_contain_text("Stacked Habit")


@pytest.mark.usefixtures("_with_habits_enabled")
def test_webui_time_plan_habit_stack_activity_view(
    page: Page,
    create_time_plan,
    create_habit,
    create_habit_stack,
    logged_in_client: AuthenticatedClient,
) -> None:
    time_plan = create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    habit = create_habit("Leaf Habit")
    stack = create_habit_stack("Leaf Stack", [habit.ref_id])

    result = time_plan_associate_with_habit_stacks_sync(
        client=logged_in_client,
        body=TimePlanAssociateWithHabitStacksArgs(
            ref_id=time_plan.ref_id,
            habit_stack_ref_ids=[stack.ref_id],
            kind=TimePlanActivityKind.FINISH,
            feasability=TimePlanActivityFeasability.MUST_DO,
        ),
    )
    activities = get_parsed_from_response(
        TimePlanAssociateWithHabitStacksResult, result
    ).new_time_plan_activities
    stack_activity = next(
        activity
        for activity in activities
        if activity.target == f"HabitStack:std:{stack.ref_id}"
    )

    page.goto(
        f"/app/workspace/apps/time-plans/{time_plan.ref_id}/{stack_activity.ref_id}"
    )
    page.wait_for_selector("#leaf-panel")

    expect(page.locator('input[name="targetHabitStackName"]')).to_have_value(
        "Leaf Stack"
    )
    expect(page.locator("#leaf-panel")).to_contain_text("Leaf Habit")
    expect(page.locator("#target-habit-stack-inbox-tasks")).to_be_visible()


@pytest.mark.usefixtures("_with_chores_enabled")
def test_webui_time_plan_associate_with_chore_stack(
    page: Page,
    create_time_plan,
    create_chore,
    create_chore_stack,
) -> None:
    time_plan = create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    stacked_chore = create_chore("Stacked Chore")
    unstacked_chore = create_chore("Solo Chore")
    stack = create_chore_stack("Morning Stack", [stacked_chore.ref_id])

    page.goto(f"/app/workspace/apps/time-plans/{time_plan.ref_id}")

    page.locator("#section-action-nav-multiple-compact-button").click()
    page.get_by_role("menuitem", name="From Existing Chores").click()

    page.wait_for_url(
        re.compile(r"/app/workspace/apps/time-plans/\d+/add-from-current-chores")
    )

    current_chores = page.locator("#time-plan-current-chores")
    expect(current_chores.locator(f"#chore-stack-{stack.ref_id}")).to_contain_text(
        "Morning Stack"
    )
    expect(current_chores.locator(f"#chore-{unstacked_chore.ref_id}")).to_contain_text(
        "Solo Chore"
    )
    expect(current_chores.locator(f"#chore-{stacked_chore.ref_id}")).to_have_count(0)

    stack_box = current_chores.locator(f"#chore-stack-{stack.ref_id}")
    unstacked_box = current_chores.locator(f"#chore-{unstacked_chore.ref_id}")
    stack_pos = stack_box.bounding_box()
    unstacked_pos = unstacked_box.bounding_box()
    assert stack_pos is not None
    assert unstacked_pos is not None
    assert stack_pos["y"] < unstacked_pos["y"]

    current_chores.locator("p", has_text="Morning Stack").click()
    current_chores.locator("button", has_text=re.compile(r"^Add$")).click()

    page.wait_for_url(re.compile(rf"/app/workspace/apps/time-plans/{time_plan.ref_id}"))

    expect(page.locator("#time-plan-activities")).to_contain_text("Morning Stack")
    # Stacks show collapsed; their members appear once expanded.
    page.locator("#time-plan-activities").get_by_role("img", name="Show tasks").click()
    expect(page.locator("#time-plan-activities")).to_contain_text("Stacked Chore")


@pytest.mark.usefixtures("_with_chores_enabled")
def test_webui_time_plan_chore_stack_activity_view(
    page: Page,
    create_time_plan,
    create_chore,
    create_chore_stack,
    logged_in_client: AuthenticatedClient,
) -> None:
    time_plan = create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    chore = create_chore("Leaf Chore")
    stack = create_chore_stack("Leaf Stack", [chore.ref_id])

    result = time_plan_associate_with_chore_stacks_sync(
        client=logged_in_client,
        body=TimePlanAssociateWithChoreStacksArgs(
            ref_id=time_plan.ref_id,
            chore_stack_ref_ids=[stack.ref_id],
            kind=TimePlanActivityKind.FINISH,
            feasability=TimePlanActivityFeasability.MUST_DO,
        ),
    )
    activities = get_parsed_from_response(
        TimePlanAssociateWithChoreStacksResult, result
    ).new_time_plan_activities
    stack_activity = next(
        activity
        for activity in activities
        if activity.target == f"ChoreStack:std:{stack.ref_id}"
    )

    page.goto(
        f"/app/workspace/apps/time-plans/{time_plan.ref_id}/{stack_activity.ref_id}"
    )
    page.wait_for_selector("#leaf-panel")

    expect(page.locator('input[name="targetChoreStackName"]')).to_have_value(
        "Leaf Stack"
    )
    expect(page.locator("#leaf-panel")).to_contain_text("Leaf Chore")
    expect(page.locator("#target-chore-stack-inbox-tasks")).to_be_visible()


# ideas
# * view time plan should show some activities
# * test that created activities show up in the timeplan too


def test_webui_time_plan_activity_no_parent_redirects_to_its_plan(
    page: Page,
    create_time_plan,
    create_inbox_task,
    create_time_plan_activity_from_inbox_task,
) -> None:
    time_plan = create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    inbox_task = create_inbox_task("The Unparented Inbox Task")
    activity = create_time_plan_activity_from_inbox_task(
        time_plan.ref_id, inbox_task.ref_id
    )

    page.goto(f"/app/workspace/apps/time-plans/no-parent/{activity.ref_id}")

    page.wait_for_url(
        re.compile(
            rf"/app/workspace/apps/time-plans/{time_plan.ref_id}/{activity.ref_id}"
        )
    )
    expect(page.locator('input[name="targetInboxTaskName"]')).to_have_value(
        "The Unparented Inbox Task"
    )


@pytest.mark.usefixtures("_with_schedule_enabled")
def test_webui_calendar_time_event_for_time_plan_activity(
    page: Page,
    create_time_plan,
    create_inbox_task,
    create_time_plan_activity_from_inbox_task,
    create_time_event_for_time_plan_activity,
) -> None:
    time_plan = create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    inbox_task = create_inbox_task("The Calendar Inbox Task")
    activity = create_time_plan_activity_from_inbox_task(
        time_plan.ref_id, inbox_task.ref_id
    )
    time_event = create_time_event_for_time_plan_activity(
        activity.ref_id, "2024-06-18", "09:00", 30
    )

    page.goto(f"/app/workspace/calendar/time-event/in-day-block/{time_event.ref_id}")

    expect(page.locator('input[name="durationMins"]')).to_have_value("30")
    expect(page.get_by_text("There was an error")).to_have_count(0)


@pytest.mark.usefixtures("_with_schedule_enabled")
def test_webui_calendar_new_time_event_for_time_plan_activity(
    page: Page,
    create_time_plan,
    create_inbox_task,
    create_time_plan_activity_from_inbox_task,
) -> None:
    time_plan = create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    inbox_task = create_inbox_task("The Calendar Inbox Task")
    activity = create_time_plan_activity_from_inbox_task(
        time_plan.ref_id, inbox_task.ref_id
    )

    page.goto(
        "/app/workspace/calendar/time-event/in-day-block/new-for-time-plan-activity"
        f"?timePlanActivityRefId={activity.ref_id}"
        f"&timePlanRefId={time_plan.ref_id}&date=2024-06-18"
    )

    expect(page.locator('input[name="name"]')).to_have_value("The Calendar Inbox Task")
    wait_for_hydration(page)
    page.locator('button[value="create"]').click()

    page.wait_for_url(
        re.compile(
            rf"/app/workspace/apps/time-plans/{time_plan.ref_id}/{activity.ref_id}"
        )
    )


def test_webui_time_plan_calendar_event_shows_activity_name(
    page: Page,
    create_time_plan,
    create_inbox_task,
    create_time_plan_activity_from_inbox_task,
    create_time_event_for_time_plan_activity,
) -> None:
    time_plan = create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    inbox_task = create_inbox_task("The Named Calendar Inbox Task")
    activity = create_time_plan_activity_from_inbox_task(
        time_plan.ref_id, inbox_task.ref_id
    )
    time_event = create_time_event_for_time_plan_activity(
        activity.ref_id, "2024-06-18", "09:00", 30
    )

    page.goto(
        f"/app/workspace/apps/time-plans/{time_plan.ref_id}"
        f"/calendar-event/time-event-in-day-block/{time_event.ref_id}"
    )

    expect(page.locator('input[name="name"]')).to_have_value(
        "The Named Calendar Inbox Task"
    )
