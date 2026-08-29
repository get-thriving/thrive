"""Tests about time plans."""

import re
import uuid
from collections.abc import Iterator

import pendulum
import pytest
from jupiter_webapi_client.api.application.invite_users_to_entity import (
    sync_detailed as invite_users_to_entity_sync,
)
from jupiter_webapi_client.api.inbox_tasks.inbox_task_update import (
    sync_detailed as inbox_task_update_sync,
)
from jupiter_webapi_client.api.projects.project_create import (
    sync_detailed as project_create_sync,
)
from jupiter_webapi_client.api.projects.project_create_inbox_task import (
    sync_detailed as project_create_inbox_task_sync,
)
from jupiter_webapi_client.api.projects.project_update import (
    sync_detailed as project_update_sync,
)
from jupiter_webapi_client.api.test_helper.workspace_set_feature import (
    sync_detailed as workspace_set_feature_sync,
)
from jupiter_webapi_client.api.time_plans.time_plan_associate_with_inbox_tasks import (
    sync_detailed as time_plan_activity_associate_inbox_task_sync,
)
from jupiter_webapi_client.api.time_plans.time_plan_associate_with_projects import (
    sync_detailed as time_plan_activity_create_project_sync,
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
from jupiter_webapi_client.models.difficulty import Difficulty
from jupiter_webapi_client.models.eisen import Eisen
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
from jupiter_webapi_client.models.project import Project
from jupiter_webapi_client.models.project_create_args import ProjectCreateArgs
from jupiter_webapi_client.models.project_create_inbox_task_args import (
    ProjectCreateInboxTaskArgs,
)
from jupiter_webapi_client.models.project_create_inbox_task_result import (
    ProjectCreateInboxTaskResult,
)
from jupiter_webapi_client.models.project_create_result import ProjectCreateResult
from jupiter_webapi_client.models.project_status import ProjectStatus
from jupiter_webapi_client.models.project_update_args import ProjectUpdateArgs
from jupiter_webapi_client.models.project_update_args_actionable_date import (
    ProjectUpdateArgsActionableDate,
)
from jupiter_webapi_client.models.project_update_args_aspect_ref_id import (
    ProjectUpdateArgsAspectRefId,
)
from jupiter_webapi_client.models.project_update_args_chapter_ref_id import (
    ProjectUpdateArgsChapterRefId,
)
from jupiter_webapi_client.models.project_update_args_dependency_ref_ids import (
    ProjectUpdateArgsDependencyRefIds,
)
from jupiter_webapi_client.models.project_update_args_difficulty import (
    ProjectUpdateArgsDifficulty,
)
from jupiter_webapi_client.models.project_update_args_due_date import (
    ProjectUpdateArgsDueDate,
)
from jupiter_webapi_client.models.project_update_args_eisen import (
    ProjectUpdateArgsEisen,
)
from jupiter_webapi_client.models.project_update_args_goal_ref_id import (
    ProjectUpdateArgsGoalRefId,
)
from jupiter_webapi_client.models.project_update_args_is_key import (
    ProjectUpdateArgsIsKey,
)
from jupiter_webapi_client.models.project_update_args_name import ProjectUpdateArgsName
from jupiter_webapi_client.models.project_update_args_status import (
    ProjectUpdateArgsStatus,
)
from jupiter_webapi_client.models.recurring_task_period import RecurringTaskPeriod
from jupiter_webapi_client.models.time_plan import TimePlan
from jupiter_webapi_client.models.time_plan_activity import TimePlanActivity
from jupiter_webapi_client.models.time_plan_activity_feasability import (
    TimePlanActivityFeasability,
)
from jupiter_webapi_client.models.time_plan_activity_kind import TimePlanActivityKind
from jupiter_webapi_client.models.time_plan_associate_with_inbox_tasks_args import (
    TimePlanAssociateWithInboxTasksArgs,
)
from jupiter_webapi_client.models.time_plan_associate_with_inbox_tasks_result import (
    TimePlanAssociateWithInboxTasksResult,
)
from jupiter_webapi_client.models.time_plan_associate_with_projects_args import (
    TimePlanAssociateWithProjectsArgs,
)
from jupiter_webapi_client.models.time_plan_associate_with_projects_result import (
    TimePlanAssociateWithProjectsResult,
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

from itests.helpers import (
    fill_after_hydration,
    get_parsed_from_response,
    open_branch_publish_panel,
    type_entity_note_editor_and_wait_for_save,
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
            body=WorkspaceSetFeatureArgs(feature=WorkspaceFeature.PROJECTS, value=True),
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
                feature=WorkspaceFeature.PROJECTS, value=False
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
    for _ in range(4):
        box_shadow = card.evaluate("el => getComputedStyle(el).boxShadow") or ""
        if ("inset" in box_shadow) == selected:
            return
        card.click()
    raise AssertionError(f"Could not set {entity_id} selected={selected}")


@pytest.fixture()
def create_time_plan_activity_from_project(logged_in_client: AuthenticatedClient):
    def _create_time_plan_activity(
        time_plan_id: int, project_id: int
    ) -> TimePlanActivity:
        result = time_plan_activity_create_project_sync(
            client=logged_in_client,
            body=TimePlanAssociateWithProjectsArgs(
                ref_id=str(time_plan_id),
                project_ref_ids=[str(project_id)],
                override_existing_dates=False,
                kind=TimePlanActivityKind.FINISH,
                feasability=TimePlanActivityFeasability.MUST_DO,
            ),
        )
        return get_parsed_from_response(
            TimePlanAssociateWithProjectsResult, result
        ).new_time_plan_activities[0]

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
        name: str, project_id: int | None = None, due_date: str | None = None
    ) -> InboxTask:
        if project_id is not None:
            project_result = project_create_inbox_task_sync(
                client=logged_in_client,
                body=ProjectCreateInboxTaskArgs(
                    project_ref_id=str(project_id),
                    name=name,
                    is_key=False,
                    eisen=Eisen.REGULAR,
                    difficulty=Difficulty.EASY,
                    due_date=due_date or UNSET,
                ),
            )
            return get_parsed_from_response(
                ProjectCreateInboxTaskResult, project_result
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
def create_project(logged_in_client: AuthenticatedClient):
    def _create_project(
        name: str, actionable_date: str | None = None, due_date: str | None = None
    ) -> Project:
        result = project_create_sync(
            client=logged_in_client,
            body=ProjectCreateArgs(
                name=name,
                is_key=False,
                eisen=Eisen.REGULAR,
                difficulty=Difficulty.EASY,
                actionable_date=actionable_date or UNSET,
                due_date=due_date or UNSET,
            ),
        )
        return get_parsed_from_response(ProjectCreateResult, result).new_project

    return _create_project


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


def test_webui_time_plan_link_untracked_projects(
    logged_in_client: AuthenticatedClient, page: Page, create_time_plan, create_project
) -> None:
    this_year = pendulum.now().year
    time_plan = create_time_plan(f"{this_year}-06-18", RecurringTaskPeriod.YEARLY)
    project = create_project("Untracked Project")
    _mark_project_done(logged_in_client, project)

    page.goto(f"/app/workspace/apps/time-plans/{time_plan.ref_id}")
    page.wait_for_selector("#branch-panel")

    expect(page.locator("#time-plan-untracked-projects")).to_contain_text(
        "Untracked Project"
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

    page.locator("#section-action-nav-multiple-compact-button").click()
    page.get_by_role("menuitem", name="New Todo").click()

    page.wait_for_url(re.compile("/app/workspace/apps/todos/new"))

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

    page.locator("#section-action-nav-multiple-compact-button").click()
    page.get_by_role("menuitem", name="New Todo").click()

    page.wait_for_url(re.compile("/app/workspace/apps/todos/new"))

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


def test_webui_time_plan_create_new_project_activity(
    page: Page, create_time_plan, create_project
) -> None:
    time_plan = create_time_plan("2024-06-18", RecurringTaskPeriod.DAILY)
    page.goto(f"/app/workspace/apps/time-plans/{time_plan.ref_id}")

    page.locator("#section-action-nav-multiple-compact-button").click()
    page.get_by_role("menuitem", name="New Project").click()

    page.wait_for_url(re.compile("/app/workspace/apps/projects/new"))

    page.locator('input[name="name"]').fill("New Project")
    page.locator("button[id='project-create']").click()

    page.wait_for_url(
        re.compile(rf"/app/workspace/apps/time-plans/{time_plan.ref_id}/\d+")
    )

    expect(
        page.locator("button[id='time-plan-activity-kind-finish']")
    ).to_have_attribute("aria-pressed", "true")
    expect(
        page.locator("button[id='time-plan-activity-feasability-nice-to-have']")
    ).to_have_attribute("aria-pressed", "true")

    expect(page.locator("input[name='targetProjectName']")).to_have_value("New Project")


def test_webui_time_plan_create_new_inbox_task_from_project_activity(
    page: Page,
    create_time_plan,
    create_project,
    create_time_plan_activity_from_project,
) -> None:
    time_plan = create_time_plan("2024-06-18", RecurringTaskPeriod.DAILY)
    project = create_project("The Project")
    project_activity = create_time_plan_activity_from_project(
        time_plan.ref_id, project.ref_id
    )

    page.goto(
        f"/app/workspace/apps/time-plans/{time_plan.ref_id}/{project_activity.ref_id}"
    )

    page.locator("#leaf-panel").locator("a", has_text="New Inbox Task").click()

    page.wait_for_url(
        re.compile(rf"/app/workspace/apps/projects/{project.ref_id}/inbox-tasks/new")
    )

    page.locator("#leaflet-panel").locator('input[name="name"]').fill(
        "The New Inbox Task"
    )
    page.locator("#leaflet-panel").locator(
        "button[id='project-inbox-task-create']"
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


def test_webui_time_plan_create_activities_from_inbox_tasks_of_an_associated_project(
    page: Page,
    create_time_plan,
    create_project,
    create_inbox_task,
    create_time_plan_activity_from_project,
) -> None:
    time_plan = create_time_plan("2024-06-18", RecurringTaskPeriod.DAILY)
    project = create_project("The Project")
    _ = create_inbox_task("The Inbox Task", project_id=project.ref_id)
    _ = create_inbox_task("Other Inbox Task", project_id=project.ref_id)
    project_activity = create_time_plan_activity_from_project(
        time_plan.ref_id, project.ref_id
    )

    page.goto(
        f"/app/workspace/apps/time-plans/{time_plan.ref_id}/{project_activity.ref_id}"
    )

    page.locator("#leaf-panel").locator(
        "a", has_text="From Project Inbox Tasks"
    ).click()

    page.wait_for_url(
        re.compile(
            rf"workspace/apps/time-plans/{time_plan.ref_id}/add-from-project-inbox-tasks"
        )
    )

    page.locator("#time-plan-project-inbox-tasks").locator(
        "p", has_text="The Inbox Task"
    ).click()

    page.locator("#time-plan-project-inbox-tasks").locator(
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


def test_webui_time_plan_associate_with_project(
    page: Page, create_time_plan, create_project
) -> None:
    time_plan = create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    project = create_project(
        "The Project", actionable_date="2024-06-10", due_date="2024-06-19"
    )

    page.goto(f"/app/workspace/apps/time-plans/{time_plan.ref_id}")

    page.locator("#section-action-nav-multiple-compact-button").click()
    page.get_by_role("menuitem", name="From Existing Projects").click()

    page.wait_for_url(
        re.compile(r"/app/workspace/apps/time-plans/\d+/add-from-current-projects")
    )

    page.locator("#time-plan-current-projects").locator(
        "p", has_text="The Project"
    ).click()

    page.locator("#time-plan-current-projects").locator(
        "button", has_text=re.compile(r"^Add$")
    ).click()

    page.wait_for_url(re.compile(rf"/app/workspace/apps/time-plans/{time_plan.ref_id}"))

    expect(page.locator("#time-plan-activities")).to_contain_text("The Project")

    page.goto(f"/app/workspace/apps/projects/{project.ref_id}")
    expect(page.locator("input[name='actionableDate']")).to_have_value("2024-06-10")
    expect(page.locator("input[name='dueDate']")).to_have_value("2024-06-19")


def test_webui_time_plan_associate_with_project_no_dates(
    page: Page, create_time_plan, create_project
) -> None:
    time_plan = create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    project = create_project("The Project")

    page.goto(f"/app/workspace/apps/time-plans/{time_plan.ref_id}")

    page.locator("#section-action-nav-multiple-compact-button").click()
    page.get_by_role("menuitem", name="From Existing Projects").click()

    page.wait_for_url(
        re.compile(r"/app/workspace/apps/time-plans/\d+/add-from-current-projects")
    )

    page.locator("#time-plan-current-projects").locator(
        "p", has_text="The Project"
    ).click()

    page.locator("#time-plan-current-projects").locator(
        "button", has_text=re.compile(r"^Add$")
    ).click()

    page.wait_for_url(re.compile(rf"/app/workspace/apps/time-plans/{time_plan.ref_id}"))

    expect(page.locator("#time-plan-activities")).to_contain_text("The Project")

    page.goto(f"/app/workspace/apps/projects/{project.ref_id}")
    expect(page.locator("input[name='actionableDate']")).to_have_value("2024-06-17")
    expect(page.locator("input[name='dueDate']")).to_have_value("2024-06-23")


def test_webui_time_plan_associate_with_project_and_override_dates(
    page: Page, create_time_plan, create_project
) -> None:
    time_plan = create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    project = create_project(
        "The Project", actionable_date="2024-06-10", due_date="2024-06-19"
    )

    page.goto(f"/app/workspace/apps/time-plans/{time_plan.ref_id}")

    page.locator("#section-action-nav-multiple-compact-button").click()
    page.get_by_role("menuitem", name="From Existing Projects").click()

    page.wait_for_url(
        re.compile(r"/app/workspace/apps/time-plans/\d+/add-from-current-projects")
    )

    page.locator("#time-plan-current-projects").locator(
        "p", has_text="The Project"
    ).click()

    page.locator("#time-plan-current-projects").locator(
        "button", has_text=re.compile(r"^Add And Override Dates$")
    ).click()

    page.wait_for_url(re.compile(rf"/app/workspace/apps/time-plans/{time_plan.ref_id}"))

    expect(page.locator("#time-plan-activities")).to_contain_text("The Project")

    page.goto(f"/app/workspace/apps/projects/{project.ref_id}")
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

    page.locator("#time-plan-current-activities").locator(
        "p", has_text="The Inbox Task"
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

    page.locator("#time-plan-current-activities").locator(
        "p", has_text="The Inbox Task"
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

    page.locator("#time-plan-current-activities").locator(
        "p", has_text="The Inbox Task"
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


def test_webui_time_plan_associate_previous_activity_inbox_task_and_pulls_project(
    page: Page,
    create_time_plan,
    create_inbox_task,
    create_project,
    create_time_plan_activity_from_inbox_task,
) -> None:
    time_plan_1 = create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    time_plan_2 = create_time_plan("2024-06-25", RecurringTaskPeriod.WEEKLY)
    project = create_project(
        "The Project", actionable_date="2024-06-10", due_date="2024-06-19"
    )
    inbox_task = create_inbox_task("The Inbox Task", project_id=project.ref_id)
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

    page.locator("#time-plan-current-activities").locator(
        "p", has_text="The Inbox Task"
    ).click()

    page.locator("#time-plan-current-activities").locator(
        "button", has_text=re.compile(r"^Add$")
    ).click()

    page.wait_for_url(
        re.compile(rf"/app/workspace/apps/time-plans/{time_plan_2.ref_id}")
    )

    expect(page.locator("#time-plan-activities")).to_contain_text("The Inbox Task")
    expect(page.locator("#time-plan-activities")).to_contain_text("The Project")

    page.goto(f"/app/workspace/apps/projects/{project.ref_id}")
    expect(page.locator("input[name='actionableDate']")).to_have_value("2024-06-10")
    expect(page.locator("input[name='dueDate']")).to_have_value("2024-06-19")


def test_webui_time_plan_associate_previous_activity_inbox_task_and_pulls_project_no_dates(
    page: Page,
    logged_in_client: AuthenticatedClient,
    create_time_plan,
    create_inbox_task,
    create_project,
    create_time_plan_activity_from_inbox_task,
) -> None:
    time_plan_1 = create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    time_plan_2 = create_time_plan("2024-06-25", RecurringTaskPeriod.WEEKLY)
    project = create_project("The Project")
    inbox_task = create_inbox_task("The Inbox Task", project_id=project.ref_id)
    _ = create_time_plan_activity_from_inbox_task(time_plan_1.ref_id, inbox_task.ref_id)
    _clear_project_dates(logged_in_client, project)

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

    page.locator("#time-plan-current-activities").locator(
        "p", has_text="The Inbox Task"
    ).click()

    page.locator("#time-plan-current-activities").locator(
        "button", has_text=re.compile(r"^Add$")
    ).click()

    page.wait_for_url(
        re.compile(rf"/app/workspace/apps/time-plans/{time_plan_2.ref_id}")
    )

    expect(page.locator("#time-plan-activities")).to_contain_text("The Inbox Task")
    expect(page.locator("#time-plan-activities")).to_contain_text("The Project")

    page.goto(f"/app/workspace/apps/projects/{project.ref_id}")
    expect(page.locator("input[name='actionableDate']")).to_have_value("2024-06-24")
    expect(page.locator("input[name='dueDate']")).to_have_value("2024-06-30")


def test_webui_time_plan_associate_previous_activity_inbox_task_and_pulls_project_but_overwrites_dates_leave_alone(
    page: Page,
    create_time_plan,
    create_inbox_task,
    create_project,
    create_time_plan_activity_from_inbox_task,
) -> None:
    time_plan_1 = create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    time_plan_2 = create_time_plan("2024-06-25", RecurringTaskPeriod.WEEKLY)
    project = create_project(
        "The Project", actionable_date="2024-06-10", due_date="2024-06-19"
    )
    inbox_task = create_inbox_task("The Inbox Task", project_id=project.ref_id)
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

    page.locator("#time-plan-current-activities").locator(
        "p", has_text="The Inbox Task"
    ).click()

    page.locator("#time-plan-current-activities").locator(
        "button", has_text=re.compile(r"^Add And Override Dates$")
    ).click()

    page.wait_for_url(
        re.compile(rf"/app/workspace/apps/time-plans/{time_plan_2.ref_id}")
    )

    expect(page.locator("#time-plan-activities")).to_contain_text("The Inbox Task")
    expect(page.locator("#time-plan-activities")).to_contain_text("The Project")

    page.goto(f"/app/workspace/apps/projects/{project.ref_id}")
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

    page.locator("#time-plan-current-activities").locator(
        "p", has_text="The Inbox Task 1"
    ).click()
    page.locator("#time-plan-current-activities").locator(
        "p", has_text="The Inbox Task 3"
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


def test_webui_time_plan_associate_previous_activity_tasks_that_pull_in_some_more_projects(
    page: Page,
    create_time_plan,
    create_inbox_task,
    create_project,
    create_time_plan_activity_from_inbox_task,
    create_time_plan_activity_from_project,
) -> None:
    time_plan_1 = create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    time_plan_2 = create_time_plan("2024-06-25", RecurringTaskPeriod.WEEKLY)
    project1 = create_project(
        "The Project 1", actionable_date="2024-06-10", due_date="2024-06-19"
    )
    inbox_task1 = create_inbox_task("The Inbox Task 1", project_id=project1.ref_id)
    inbox_task2 = create_inbox_task("The Inbox Task 2", project_id=project1.ref_id)
    project2 = create_project(
        "The Project 2", actionable_date="2024-06-10", due_date="2024-06-19"
    )
    inbox_task3 = create_inbox_task("The Inbox Task 3", project_id=project2.ref_id)
    project3 = create_project(
        "The Project 3", actionable_date="2024-06-10", due_date="2024-06-19"
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
    _ = create_time_plan_activity_from_project(time_plan_1.ref_id, project3.ref_id)

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

    page.locator("#time-plan-current-activities").locator(
        "p", has_text="The Inbox Task 1"
    ).click()
    page.locator("#time-plan-current-activities").locator(
        "p", has_text="The Inbox Task 3"
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
    expect(page.locator("#time-plan-activities")).to_contain_text("The Project 1")
    expect(page.locator("#time-plan-activities")).to_contain_text("The Project 2")
    expect(page.locator("#time-plan-activities")).not_to_contain_text("The Project 3")


def test_webui_time_plan_associate_previous_activity_project(
    page: Page,
    create_time_plan,
    create_project,
    create_time_plan_activity_from_project,
) -> None:
    time_plan_1 = create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    time_plan_2 = create_time_plan("2024-06-25", RecurringTaskPeriod.WEEKLY)
    project = create_project(
        "The Project", actionable_date="2024-06-10", due_date="2024-06-19"
    )
    _ = create_time_plan_activity_from_project(time_plan_1.ref_id, project.ref_id)

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

    page.locator("#time-plan-current-activities").locator(
        "p", has_text="The Project"
    ).click()

    page.locator("#time-plan-current-activities").locator(
        "button", has_text=re.compile(r"^Add$")
    ).click()

    page.wait_for_url(
        re.compile(rf"/app/workspace/apps/time-plans/{time_plan_2.ref_id}")
    )

    expect(page.locator("#time-plan-activities")).to_contain_text("The Project")

    page.goto(f"/app/workspace/apps/projects/{project.ref_id}")
    expect(page.locator("input[name='actionableDate']")).to_have_value("2024-06-10")
    expect(page.locator("input[name='dueDate']")).to_have_value("2024-06-19")


def test_webui_time_plan_associate_previous_activity_project_no_dates(
    page: Page,
    logged_in_client: AuthenticatedClient,
    create_time_plan,
    create_project,
    create_time_plan_activity_from_project,
) -> None:
    time_plan_1 = create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    time_plan_2 = create_time_plan("2024-06-25", RecurringTaskPeriod.WEEKLY)
    project = create_project("The Project")
    _ = create_time_plan_activity_from_project(time_plan_1.ref_id, project.ref_id)
    _clear_project_dates(logged_in_client, project)

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

    page.locator("#time-plan-current-activities").locator(
        "p", has_text="The Project"
    ).click()

    page.locator("#time-plan-current-activities").locator(
        "button", has_text=re.compile(r"^Add$")
    ).click()

    page.wait_for_url(
        re.compile(rf"/app/workspace/apps/time-plans/{time_plan_2.ref_id}")
    )

    expect(page.locator("#time-plan-activities")).to_contain_text("The Project")

    page.goto(f"/app/workspace/apps/projects/{project.ref_id}")
    expect(page.locator("input[name='actionableDate']")).to_have_value("2024-06-24")
    expect(page.locator("input[name='dueDate']")).to_have_value("2024-06-30")


def test_webui_time_plan_associate_previous_activity_project_and_override_dates(
    page: Page,
    create_time_plan,
    create_project,
    create_time_plan_activity_from_project,
) -> None:
    time_plan_1 = create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    time_plan_2 = create_time_plan("2024-06-25", RecurringTaskPeriod.WEEKLY)
    project = create_project(
        "The Project", actionable_date="2024-06-10", due_date="2024-06-19"
    )
    _ = create_time_plan_activity_from_project(time_plan_1.ref_id, project.ref_id)

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

    page.locator("#time-plan-current-activities").locator(
        "p", has_text="The Project"
    ).click()

    page.locator("#time-plan-current-activities").locator(
        "button", has_text=re.compile(r"^Add And Override Dates$")
    ).click()

    page.wait_for_url(
        re.compile(rf"/app/workspace/apps/time-plans/{time_plan_2.ref_id}")
    )

    expect(page.locator("#time-plan-activities")).to_contain_text("The Project")

    page.goto(f"/app/workspace/apps/projects/{project.ref_id}")
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

    page.locator("#time-plan-current-activities").locator(
        "p", has_text="The Inbox Task 1"
    ).click()
    page.locator("#time-plan-current-activities").locator(
        "p", has_text="The Inbox Task 3"
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


def test_webui_time_plan_inbox_task_with_project_shows_in_all_time_plans(
    page: Page,
    logged_in_client: AuthenticatedClient,
    create_time_plan,
    create_inbox_task,
    create_project,
    create_time_plan_activity_from_inbox_task,
) -> None:
    time_plan_1 = create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    time_plan_2 = create_time_plan("2024-06-25", RecurringTaskPeriod.WEEKLY)
    project = create_project(
        "The Project", actionable_date="2024-06-10", due_date="2024-06-19"
    )
    inbox_task = create_inbox_task("The Inbox Task", project_id=project.ref_id)
    _ = create_time_plan_activity_from_inbox_task(time_plan_1.ref_id, inbox_task.ref_id)
    _ = create_time_plan_activity_from_inbox_task(time_plan_2.ref_id, inbox_task.ref_id)

    page.goto(f"/app/workspace/apps/time-plans/{time_plan_1.ref_id}")

    expect(page.locator("#time-plan-activities")).to_contain_text("The Inbox Task")
    expect(page.locator("#time-plan-activities")).to_contain_text("The Project")

    page.goto(f"/app/workspace/apps/time-plans/{time_plan_2.ref_id}")

    expect(page.locator("#time-plan-activities")).to_contain_text("The Inbox Task")
    expect(page.locator("#time-plan-activities")).to_contain_text("The Project")


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


def test_webui_time_plan_add_an_inbox_task_to_an_already_existing_time_plan_and_pulls_project(
    page: Page,
    logged_in_client: AuthenticatedClient,
    create_time_plan,
    create_inbox_task,
    create_project,
    create_time_plan_activity_from_inbox_task,
) -> None:
    time_plan = create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    project = create_project(
        "The Project", actionable_date="2024-06-10", due_date="2024-06-19"
    )
    inbox_task = create_inbox_task("The Inbox Task", project_id=project.ref_id)

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
    expect(page.locator("#time-plan-activities")).to_contain_text("The Project")

    page.goto(f"/app/workspace/apps/projects/{project.ref_id}")
    expect(page.locator("input[name='actionableDate']")).to_have_value("2024-06-10")
    expect(page.locator("input[name='dueDate']")).to_have_value("2024-06-19")


def test_webui_time_plan_add_an_inbox_task_to_an_already_existing_time_plan_and_pulls_project_no_dates(
    page: Page,
    logged_in_client: AuthenticatedClient,
    create_time_plan,
    create_inbox_task,
    create_project,
    create_time_plan_activity_from_inbox_task,
) -> None:
    time_plan = create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    project = create_project("The Project")
    inbox_task = create_inbox_task("The Inbox Task", project_id=project.ref_id)

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
    expect(page.locator("#time-plan-activities")).to_contain_text("The Project")

    page.goto(f"/app/workspace/apps/projects/{project.ref_id}")
    expect(page.locator("input[name='actionableDate']")).to_have_value("2024-06-17")
    expect(page.locator("input[name='dueDate']")).to_have_value("2024-06-23")


def test_webui_time_plan_add_an_inbox_task_to_an_already_existing_time_plan_and_pulls_project_but_overwrites_dates_leave_alone(
    page: Page,
    logged_in_client: AuthenticatedClient,
    create_time_plan,
    create_inbox_task,
    create_project,
    create_time_plan_activity_from_inbox_task,
) -> None:
    time_plan = create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    project = create_project(
        "The Project", actionable_date="2024-06-10", due_date="2024-06-19"
    )
    inbox_task = create_inbox_task("The Inbox Task", project_id=project.ref_id)

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
    expect(page.locator("#time-plan-activities")).to_contain_text("The Project")

    page.goto(f"/app/workspace/apps/projects/{project.ref_id}")
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


def test_webui_time_plan_add_an_inbox_task_to_an_already_existing_time_plan_with_tasks_that_pull_in_some_more_projects(
    page: Page,
    logged_in_client: AuthenticatedClient,
    create_time_plan,
    create_inbox_task,
    create_project,
    create_time_plan_activity_from_inbox_task,
) -> None:
    time_plan = create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    project1 = create_project(
        "The Project 1", actionable_date="2024-06-10", due_date="2024-06-19"
    )
    inbox_task1 = create_inbox_task("The Inbox Task 1", project_id=project1.ref_id)
    create_inbox_task("The Inbox Task 2", project_id=project1.ref_id)
    project2 = create_project(
        "The Project 2", actionable_date="2024-06-10", due_date="2024-06-19"
    )
    inbox_task3 = create_inbox_task("The Inbox Task 3", project_id=project2.ref_id)
    create_project("The Project 3", actionable_date="2024-06-10", due_date="2024-06-19")

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
    expect(page.locator("#time-plan-activities")).to_contain_text("The Project 1")
    expect(page.locator("#time-plan-activities")).to_contain_text("The Project 2")
    expect(page.locator("#time-plan-activities")).not_to_contain_text("The Project 3")


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
        page.locator("#time-plan-activities").locator("p", has_text="The Inbox Task")
    ).not_to_have_css("font-weight", "100")

    _mark_inbox_task_done(logged_in_client, inbox_task)
    page.reload()

    expect(
        page.locator("#time-plan-activities").locator("p", has_text="The Inbox Task")
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


def test_webui_time_plan_activity_archive_project_with_inbox_task(
    page: Page,
    logged_in_client: AuthenticatedClient,
    create_time_plan,
    create_inbox_task,
    create_project,
    create_time_plan_activity_from_inbox_task,
    create_time_plan_activity_from_project,
) -> None:
    time_plan = create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    project = create_project("The Project")
    inbox_task = create_inbox_task("The Inbox Task", project_id=project.ref_id)
    project_activity = create_time_plan_activity_from_project(
        time_plan.ref_id, project.ref_id
    )
    inbox_task_activity = create_time_plan_activity_from_inbox_task(
        time_plan.ref_id, inbox_task.ref_id
    )

    page.goto(f"/app/workspace/apps/time-plans/{time_plan.ref_id}")

    expect(page.locator("#time-plan-activities")).to_contain_text("The Inbox Task")
    expect(page.locator("#time-plan-activities")).to_contain_text("The Project")

    page.goto(
        f"/app/workspace/apps/time-plans/{time_plan.ref_id}/{project_activity.ref_id}"
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
    expect(page.locator("#time-plan-activities")).not_to_contain_text("The Project")


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


def _mark_project_done(logged_in_client: AuthenticatedClient, project: Project) -> None:
    project_update_sync(
        client=logged_in_client,
        body=ProjectUpdateArgs(
            ref_id=project.ref_id,
            name=ProjectUpdateArgsName(should_change=False),
            status=ProjectUpdateArgsStatus(
                should_change=True, value=ProjectStatus.DONE
            ),
            actionable_date=ProjectUpdateArgsActionableDate(should_change=False),
            due_date=ProjectUpdateArgsDueDate(should_change=False),
            aspect_ref_id=ProjectUpdateArgsAspectRefId(should_change=False),
            chapter_ref_id=ProjectUpdateArgsChapterRefId(should_change=False),
            goal_ref_id=ProjectUpdateArgsGoalRefId(should_change=False),
            is_key=ProjectUpdateArgsIsKey(should_change=False),
            eisen=ProjectUpdateArgsEisen(should_change=False),
            difficulty=ProjectUpdateArgsDifficulty(should_change=False),
            dependency_ref_ids=ProjectUpdateArgsDependencyRefIds(should_change=False),
        ),
    )


def _clear_project_dates(
    logged_in_client: AuthenticatedClient, project: Project
) -> None:
    project_update_sync(
        client=logged_in_client,
        body=ProjectUpdateArgs(
            ref_id=project.ref_id,
            name=ProjectUpdateArgsName(should_change=False),
            status=ProjectUpdateArgsStatus(should_change=False),
            actionable_date=ProjectUpdateArgsActionableDate(
                should_change=True, value=None
            ),
            due_date=ProjectUpdateArgsDueDate(should_change=True, value=None),
            aspect_ref_id=ProjectUpdateArgsAspectRefId(should_change=False),
            chapter_ref_id=ProjectUpdateArgsChapterRefId(should_change=False),
            goal_ref_id=ProjectUpdateArgsGoalRefId(should_change=False),
            is_key=ProjectUpdateArgsIsKey(should_change=False),
            eisen=ProjectUpdateArgsEisen(should_change=False),
            difficulty=ProjectUpdateArgsDifficulty(should_change=False),
            dependency_ref_ids=ProjectUpdateArgsDependencyRefIds(should_change=False),
        ),
    )


def test_webui_time_plan_add_project_to_an_already_existing_time_plan(
    page: Page,
    logged_in_client: AuthenticatedClient,
    create_time_plan,
    create_project,
    create_time_plan_activity_from_project,
) -> None:
    create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    project = create_project("The Project")

    page.goto(f"/app/workspace/apps/projects/{project.ref_id}")

    page.locator("#project-time-plans").locator("a", has_text="Add").click()

    page.wait_for_url(
        re.compile(
            rf"/app/workspace/apps/time-plans/add-project-to-plans\?projectRefId={project.ref_id}"
        )
    )

    page.locator("#all-time-plans").locator(
        "p", has_text="Weekly plan for 2024-06-18"
    ).click()

    page.locator("#add-project-to-plans").locator("button", has_text="Add").click()

    page.wait_for_url(re.compile(rf"/app/workspace/apps/projects/{project.ref_id}"))

    expect(page.locator("#project-time-plans")).to_contain_text(
        "Weekly plan for 2024-06-18"
    )


def test_webui_time_plan_add_project_to_an_already_existing_time_plan_no_dates(
    page: Page,
    logged_in_client: AuthenticatedClient,
    create_time_plan,
    create_project,
    create_time_plan_activity_from_project,
) -> None:
    create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    project = create_project("The Project")

    page.goto(f"/app/workspace/apps/projects/{project.ref_id}")

    page.locator("#project-time-plans").locator("a", has_text="Add").click()

    page.wait_for_url(
        re.compile(
            rf"/app/workspace/apps/time-plans/add-project-to-plans\?projectRefId={project.ref_id}"
        )
    )

    page.locator("#all-time-plans").locator(
        "p", has_text="Weekly plan for 2024-06-18"
    ).click()

    page.locator("#add-project-to-plans").locator("button", has_text="Add").click()

    page.wait_for_url(re.compile(rf"/app/workspace/apps/projects/{project.ref_id}"))

    expect(page.locator("#project-time-plans")).to_contain_text(
        "Weekly plan for 2024-06-18"
    )

    page.goto(f"/app/workspace/apps/projects/{project.ref_id}")
    expect(page.locator("input[name='actionableDate']")).to_have_value("2024-06-17")
    expect(page.locator("input[name='dueDate']")).to_have_value("2024-06-23")


def test_webui_time_plan_add_project_to_an_already_existing_time_plan_with_dates(
    page: Page,
    logged_in_client: AuthenticatedClient,
    create_time_plan,
    create_project,
    create_time_plan_activity_from_project,
) -> None:
    create_time_plan("2024-06-18", RecurringTaskPeriod.DAILY)
    project = create_project(
        "The Project", actionable_date="2024-06-18", due_date="2024-06-18"
    )

    page.goto(f"/app/workspace/apps/projects/{project.ref_id}")

    page.locator("#project-time-plans").locator("a", has_text="Add").click()

    page.wait_for_url(
        re.compile(
            rf"/app/workspace/apps/time-plans/add-project-to-plans\?projectRefId={project.ref_id}"
        )
    )

    page.locator("#all-time-plans").locator(
        "p", has_text="Daily plan for 2024-06-18"
    ).click()

    page.locator("#add-project-to-plans").locator("button", has_text="Add").click()

    page.wait_for_url(re.compile(rf"/app/workspace/apps/projects/{project.ref_id}"))

    expect(page.locator("#project-time-plans")).to_contain_text(
        "Daily plan for 2024-06-18"
    )

    page.goto(f"/app/workspace/apps/projects/{project.ref_id}")
    expect(page.locator("input[name='actionableDate']")).to_have_value("2024-06-18")
    expect(page.locator("input[name='dueDate']")).to_have_value("2024-06-18")


def test_webui_time_plan_add_project_to_multiple_already_existing_time_plans(
    page: Page,
    logged_in_client: AuthenticatedClient,
    create_time_plan,
    create_project,
    create_time_plan_activity_from_project,
) -> None:
    time_plan1 = create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    time_plan2 = create_time_plan("2024-06-25", RecurringTaskPeriod.WEEKLY)
    project = create_project("The Project")

    page.goto(f"/app/workspace/apps/projects/{project.ref_id}")

    page.locator("#project-time-plans").locator("a", has_text="Add").click()

    page.wait_for_url(
        re.compile(
            rf"/app/workspace/apps/time-plans/add-project-to-plans\?projectRefId={project.ref_id}"
        )
    )

    page.locator("#all-time-plans").locator(
        "p", has_text="Weekly plan for 2024-06-18"
    ).click()
    page.locator("#all-time-plans").locator(
        "p", has_text="Weekly plan for 2024-06-25"
    ).click()

    page.locator("#add-project-to-plans").locator("button", has_text="Add").click()

    page.wait_for_url(re.compile(rf"/app/workspace/apps/projects/{project.ref_id}"))

    expect(page.locator("#project-time-plans")).to_contain_text(
        "Weekly plan for 2024-06-18"
    )
    expect(page.locator("#project-time-plans")).to_contain_text(
        "Weekly plan for 2024-06-25"
    )

    page.goto(f"/app/workspace/apps/time-plans/{time_plan1.ref_id}")
    expect(page.locator("#time-plan-activities")).to_contain_text("The Project")

    page.goto(f"/app/workspace/apps/time-plans/{time_plan2.ref_id}")
    expect(page.locator("#time-plan-activities")).to_contain_text("The Project")


def test_webui_time_plan_add_project_to_an_already_existing_time_plan_with_inbox_tasks(
    page: Page,
    logged_in_client: AuthenticatedClient,
    create_time_plan,
    create_inbox_task,
    create_project,
    create_time_plan_activity_from_project,
) -> None:
    time_plan = create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    project = create_project(
        "The Project", actionable_date="2024-06-10", due_date="2024-06-19"
    )
    create_inbox_task("The Inbox Task 1", project_id=project.ref_id)
    create_inbox_task("The Inbox Task 2", project_id=project.ref_id)

    page.goto(f"/app/workspace/apps/projects/{project.ref_id}")

    page.locator("#project-time-plans").locator("a", has_text="Add").click()

    page.wait_for_url(
        re.compile(
            rf"/app/workspace/apps/time-plans/add-project-to-plans\?projectRefId={project.ref_id}"
        )
    )

    page.locator("#all-time-plans").locator(
        "p", has_text="Weekly plan for 2024-06-18"
    ).click()

    page.locator("#add-project-to-plans").locator("button", has_text="Add").click()

    page.wait_for_url(re.compile(rf"/app/workspace/apps/projects/{project.ref_id}"))

    expect(page.locator("#project-time-plans")).to_contain_text(
        "Weekly plan for 2024-06-18"
    )

    page.goto(f"/app/workspace/apps/time-plans/{time_plan.ref_id}")
    expect(page.locator("#time-plan-activities")).to_contain_text("The Project")
    expect(page.locator("#time-plan-activities")).not_to_contain_text(
        "The Inbox Task 1"
    )
    expect(page.locator("#time-plan-activities")).not_to_contain_text(
        "The Inbox Task 2"
    )

    page.goto(f"/app/workspace/apps/projects/{project.ref_id}")
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
            body=WorkspaceSetFeatureArgs(feature=WorkspaceFeature.PROJECTS, value=True),
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
                feature=WorkspaceFeature.PROJECTS, value=False
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


# ideas
# * view time plan should show some activities
# * test that created activities show up in the timeplan too
