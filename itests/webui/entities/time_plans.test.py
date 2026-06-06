"""Tests about time plans."""

import re
from collections.abc import Iterator

import pendulum
import pytest
from jupiter_webapi_client.api.projects.project_create import (
    sync_detailed as project_create_sync,
)
from jupiter_webapi_client.api.projects.project_create_inbox_task import (
    sync_detailed as project_create_inbox_task_sync,
)
from jupiter_webapi_client.api.projects.project_update import (
    sync_detailed as project_update_sync,
)
from jupiter_webapi_client.api.inbox_tasks.inbox_task_update import (
    sync_detailed as inbox_task_update_sync,
)
from jupiter_webapi_client.api.test_helper.workspace_set_feature import (
    sync_detailed as workspace_set_feature_sync,
)
from jupiter_webapi_client.api.time_plans.time_plan_associate_with_projects import (
    sync_detailed as time_plan_activity_create_project_sync,
)
from jupiter_webapi_client.api.time_plans.time_plan_associate_with_inbox_tasks import (
    sync_detailed as time_plan_activity_associate_inbox_task_sync,
)
from jupiter_webapi_client.api.time_plans.time_plan_create import (
    sync_detailed as time_plan_create_sync,
)
from jupiter_webapi_client.api.todo.todo_task_create import (
    sync_detailed as todo_task_create_sync,
)
from jupiter_webapi_client.client import AuthenticatedClient
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
from jupiter_webapi_client.models.recurring_task_period import RecurringTaskPeriod
from jupiter_webapi_client.models.time_plan import TimePlan
from jupiter_webapi_client.models.time_plan_activity import TimePlanActivity
from jupiter_webapi_client.models.time_plan_activity_feasability import (
    TimePlanActivityFeasability,
)
from jupiter_webapi_client.models.time_plan_activity_kind import TimePlanActivityKind
from jupiter_webapi_client.models.time_plan_associate_with_projects_args import (
    TimePlanAssociateWithProjectsArgs,
)
from jupiter_webapi_client.models.time_plan_associate_with_projects_result import (
    TimePlanAssociateWithProjectsResult,
)
from jupiter_webapi_client.models.time_plan_associate_with_inbox_tasks_args import (
    TimePlanAssociateWithInboxTasksArgs,
)
from jupiter_webapi_client.models.time_plan_associate_with_inbox_tasks_result import (
    TimePlanAssociateWithInboxTasksResult,
)
from jupiter_webapi_client.models.time_plan_create_args import TimePlanCreateArgs
from jupiter_webapi_client.models.time_plan_create_result import TimePlanCreateResult
from jupiter_webapi_client.models.todo_task_create_args import TodoTaskCreateArgs
from jupiter_webapi_client.models.todo_task_create_result import TodoTaskCreateResult
from jupiter_webapi_client.models.workspace_feature import WorkspaceFeature
from jupiter_webapi_client.models.workspace_set_feature_args import (
    WorkspaceSetFeatureArgs,
)
from jupiter_webapi_client.types import UNSET
from playwright.sync_api import Page, expect

from itests.helpers import (
    get_parsed_from_response,
    type_entity_note_editor_and_wait_for_save,
)


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
                feature=WorkspaceFeature.PROJECTS, value=True
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

    page.goto("/app/workspace/time-plans")

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
    page.goto(f"/app/workspace/time-plans/{time_plan.ref_id}")
    page.wait_for_selector("#branch-panel")

    expect(page.locator('input[name="rightNow"]')).to_have_value("2024-06-18")
    expect(page.locator('input[name="period"]')).to_have_value("daily")


def test_webui_time_plan_create(page: Page, create_time_plan) -> None:
    page.goto("/app/workspace/time-plans/new")
    page.wait_for_selector("#leaf-panel")

    page.locator('input[name="rightNow"]').fill("2024-06-18")
    page.locator('button[id="period-weekly"]').click()
    page.locator("#time-plan-create").click()

    page.wait_for_url(re.compile(r"/app/workspace/time-plans/\d+"))

    page.wait_for_selector("#branch-panel")
    expect(page.locator('input[name="rightNow"]')).to_have_value("2024-06-18")
    # After creation, we're on the view page which uses compact mode (Select dropdown)
    expect(page.locator('input[name="period"]')).to_have_value("weekly")


def test_webui_time_plan_update(page: Page, create_time_plan) -> None:
    time_plan = create_time_plan("2024-06-18", RecurringTaskPeriod.DAILY)
    page.goto(f"/app/workspace/time-plans/{time_plan.ref_id}")
    page.wait_for_selector("#branch-panel")

    page.locator('input[name="rightNow"]').fill("2024-06-19")
    page.get_by_label("Period").click()
    page.get_by_role("option", name="Daily").click()
    page.locator("#time-plan-change-time-config").click()

    page.wait_for_url(re.compile(r"/app/workspace/time-plans/\d+"))

    page.wait_for_selector("#branch-panel")
    expect(page.locator('input[name="rightNow"]')).to_have_value("2024-06-19")
    # Check the Select has the correct value
    expect(page.locator('input[name="period"]')).to_have_value("daily")


def test_webui_time_plan_change_note(page: Page, create_time_plan) -> None:
    time_plan = create_time_plan("2024-06-18", RecurringTaskPeriod.DAILY)
    page.goto(f"/app/workspace/time-plans/{time_plan.ref_id}")
    page.wait_for_selector("#branch-panel")

    page.wait_for_selector("#entity-block-editor")

    type_entity_note_editor_and_wait_for_save(page, "This is a note.")

    page.wait_for_url(re.compile(r"/app/workspace/time-plans/\d+"))

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
    page.goto(f"/app/workspace/time-plans/{time_plan.ref_id}")
    page.wait_for_selector("#branch-panel")

    page.locator("#branch-entity-archive").click()
    page.locator("#branch-entity-archive-confirm").click()

    page.wait_for_url("/app/workspace/time-plans")

    page.goto(f"/app/workspace/time-plans/{time_plan.ref_id}")
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

    page.goto(f"/app/workspace/time-plans/{time_plan.ref_id}")
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

    page.goto(f"/app/workspace/time-plans/{time_plan.ref_id}")
    page.wait_for_selector("#branch-panel")

    expect(page.locator("#time-plan-untracked-projects")).to_contain_text(
        "Untracked Project"
    )


def test_webui_time_plan_link_lower_time_plans(page: Page, create_time_plan) -> None:
    _ = create_time_plan("2024-06-18", RecurringTaskPeriod.DAILY)
    _ = create_time_plan("2024-06-19", RecurringTaskPeriod.DAILY)
    time_plan2 = create_time_plan("2024-06-19", RecurringTaskPeriod.WEEKLY)

    page.goto(f"/app/workspace/time-plans/{time_plan2.ref_id}")
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

    page.goto(f"/app/workspace/time-plans/{time_plan1.ref_id}")
    page.wait_for_selector("#branch-panel")

    expect(page.locator("#time-plan-higher")).to_contain_text(
        "Weekly plan for 2024-06-19"
    )


def test_webui_time_plan_link_previous_time_plan(page: Page, create_time_plan) -> None:
    _ = create_time_plan("2024-06-18", RecurringTaskPeriod.DAILY)
    time_plan1 = create_time_plan("2024-06-19", RecurringTaskPeriod.DAILY)
    _ = create_time_plan("2024-06-19", RecurringTaskPeriod.WEEKLY)

    page.goto(f"/app/workspace/time-plans/{time_plan1.ref_id}")
    page.wait_for_selector("#branch-panel")

    expect(page.locator("#time-plan-previous")).to_contain_text(
        "Daily plan for 2024-06-18"
    )


def test_webui_time_plan_create_new_todo_task_activity(
    page: Page, create_time_plan
) -> None:
    time_plan = create_time_plan("2024-06-18", RecurringTaskPeriod.DAILY)
    page.goto(f"/app/workspace/time-plans/{time_plan.ref_id}")

    page.locator("#section-action-nav-multiple-compact-button").click()
    page.get_by_role("menuitem", name="New Todo").click()

    page.wait_for_url(re.compile("/app/workspace/todos/new"))

    page.locator('input[name="name"]').fill("New Todo Task")
    page.locator("button[id='todo-create']").click()

    page.wait_for_url(re.compile(rf"/app/workspace/time-plans/{time_plan.ref_id}/\d+"))

    expect(
        page.locator("button[id='time-plan-activity-kind-finish']")
    ).to_have_attribute("aria-pressed", "true")
    expect(
        page.locator("button[id='time-plan-activity-feasability-nice-to-have']")
    ).to_have_attribute("aria-pressed", "true")

    expect(page.locator("input[name='targetInboxTaskName']")).to_have_value(
        "New Todo Task"
    )


def test_webui_time_plan_create_new_todo_task_shows_in_activities(
    page: Page, create_time_plan
) -> None:
    time_plan = create_time_plan("2024-06-18", RecurringTaskPeriod.DAILY)
    page.goto(f"/app/workspace/time-plans/{time_plan.ref_id}")

    page.locator("#section-action-nav-multiple-compact-button").click()
    page.get_by_role("menuitem", name="New Todo").click()

    page.wait_for_url(re.compile("/app/workspace/todos/new"))

    page.locator('input[name="name"]').fill("New Todo Task")
    page.locator("button[id='todo-create']").click()

    page.wait_for_url(re.compile(rf"/app/workspace/time-plans/{time_plan.ref_id}/\d+"))

    expect(
        page.locator("button[id='time-plan-activity-kind-finish']")
    ).to_have_attribute("aria-pressed", "true")
    expect(
        page.locator("button[id='time-plan-activity-feasability-nice-to-have']")
    ).to_have_attribute("aria-pressed", "true")

    page.goto(f"/app/workspace/time-plans/{time_plan.ref_id}")

    expect(page.locator("#time-plan-activities")).to_contain_text("New Todo Task")


def test_webui_time_plan_create_new_project_activity(
    page: Page, create_time_plan, create_project
) -> None:
    time_plan = create_time_plan("2024-06-18", RecurringTaskPeriod.DAILY)
    page.goto(f"/app/workspace/time-plans/{time_plan.ref_id}")

    page.locator("#section-action-nav-multiple-compact-button").click()
    page.get_by_role("menuitem", name="New Project").click()

    page.wait_for_url(re.compile("/app/workspace/projects/new"))

    page.locator('input[name="name"]').fill("New Project")
    page.locator("button[id='project-create']").click()

    page.wait_for_url(re.compile(rf"/app/workspace/time-plans/{time_plan.ref_id}/\d+"))

    expect(
        page.locator("button[id='time-plan-activity-kind-finish']")
    ).to_have_attribute("aria-pressed", "true")
    expect(
        page.locator("button[id='time-plan-activity-feasability-nice-to-have']")
    ).to_have_attribute("aria-pressed", "true")

    expect(page.locator("input[name='targetProjectName']")).to_have_value(
        "New Project"
    )


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
        f"/app/workspace/time-plans/{time_plan.ref_id}/{project_activity.ref_id}"
    )

    page.locator("#leaf-panel").locator("a", has_text="New Inbox Task").click()

    page.wait_for_url(
        re.compile(rf"/app/workspace/projects/{project.ref_id}/inbox-tasks/new")
    )

    page.locator("#leaflet-panel").locator('input[name="name"]').fill(
        "The New Inbox Task"
    )
    page.locator("#leaflet-panel").locator(
        "button[id='project-inbox-task-create']"
    ).click()

    page.wait_for_url(re.compile(rf"/app/workspace/time-plans/{time_plan.ref_id}/\d+"))

    expect(page.locator("#time-plan-activities")).to_contain_text("The New Inbox Task")

    page.locator("#time-plan-activities").locator(
        "a", has_text="The New Inbox Task"
    ).click(force=True)

    page.wait_for_url(re.compile(rf"/app/workspace/time-plans/{time_plan.ref_id}/\d+"))

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
        f"/app/workspace/time-plans/{time_plan.ref_id}/{project_activity.ref_id}"
    )

    page.locator("#leaf-panel").locator(
        "a", has_text="From Current Inbox Tasks"
    ).click()

    page.wait_for_url(
        re.compile(
            rf"workspace/time-plans/{time_plan.ref_id}/add-from-current-inbox-tasks"
        )
    )

    page.locator("#time-plan-current-inbox-tasks").locator(
        "p", has_text="The Inbox Task"
    ).click()

    page.locator("#time-plan-current-inbox-tasks").locator(
        "button", has_text=re.compile(r"^Add$")
    ).click()

    page.wait_for_url(re.compile(rf"/app/workspace/time-plans/{time_plan.ref_id}/\d+"))

    page.goto(f"/app/workspace/time-plans/{time_plan.ref_id}")

    expect(page.locator("#time-plan-activities")).to_contain_text("The Inbox Task")
    expect(page.locator("#time-plan-activities")).not_to_contain_text(
        "Other Inbox Task"
    )


def test_webui_time_plan_associate_with_inbox_task(
    page: Page, create_time_plan, create_inbox_task
) -> None:
    time_plan = create_time_plan("2024-06-18", RecurringTaskPeriod.DAILY)
    inbox_task = create_inbox_task("The Inbox Task", due_date="2024-06-18")

    page.goto(f"/app/workspace/time-plans/{time_plan.ref_id}")

    page.locator("#section-action-nav-multiple-compact-button").click()
    page.locator("a", has_text="From Current Inbox Tasks").click()

    page.wait_for_url(
        re.compile(r"/app/workspace/time-plans/\d+/add-from-current-inbox-tasks")
    )

    page.locator("#time-plan-current-inbox-tasks").locator(
        "p", has_text="The Inbox Task"
    ).click()

    page.locator("#time-plan-current-inbox-tasks").locator(
        "button", has_text=re.compile(r"^Add$")
    ).click()

    page.wait_for_url(re.compile(rf"/app/workspace/time-plans/{time_plan.ref_id}"))

    expect(page.locator("#time-plan-activities")).to_contain_text("The Inbox Task")

    page.goto(f"/app/workspace/core/inbox-tasks/{inbox_task.ref_id}")
    expect(page.locator("input[name='actionableDate']")).to_have_value("")
    expect(page.locator("input[name='dueDate']")).to_have_value("2024-06-18")


def test_webui_time_plan_associate_with_inbox_task_no_dates(
    page: Page, create_time_plan, create_inbox_task
) -> None:
    time_plan = create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    inbox_task = create_inbox_task("The Inbox Task")

    page.goto(f"/app/workspace/time-plans/{time_plan.ref_id}")

    page.locator("#section-action-nav-multiple-compact-button").click()
    page.locator("a", has_text="From Current Inbox Tasks").click()

    page.wait_for_url(
        re.compile(r"/app/workspace/time-plans/\d+/add-from-current-inbox-tasks")
    )

    page.locator("#time-plan-current-inbox-tasks").locator(
        "p", has_text="The Inbox Task"
    ).click()

    page.locator("#time-plan-current-inbox-tasks").locator(
        "button", has_text=re.compile(r"^Add$")
    ).click()

    page.wait_for_url(re.compile(rf"/app/workspace/time-plans/{time_plan.ref_id}"))

    expect(page.locator("#time-plan-activities")).to_contain_text("The Inbox Task")

    page.goto(f"/app/workspace/core/inbox-tasks/{inbox_task.ref_id}")
    expect(page.locator("input[name='actionableDate']")).to_have_value("")
    expect(page.locator("input[name='dueDate']")).to_have_value("2024-06-23")


def test_webui_time_plan_associate_with_inbox_task_and_override_dates(
    page: Page, create_time_plan, create_inbox_task
) -> None:
    time_plan = create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    inbox_task = create_inbox_task("The Inbox Task", due_date="2024-06-18")

    page.goto(f"/app/workspace/time-plans/{time_plan.ref_id}")

    page.locator("#section-action-nav-multiple-compact-button").click()
    page.locator("a", has_text="From Current Inbox Tasks").click()

    page.wait_for_url(
        re.compile(r"/app/workspace/time-plans/\d+/add-from-current-inbox-tasks")
    )

    page.locator("#time-plan-current-inbox-tasks").locator(
        "p", has_text="The Inbox Task"
    ).click()

    page.locator("#time-plan-current-inbox-tasks").locator(
        "button", has_text=re.compile(r"^Add And Override Dates$")
    ).click()

    page.wait_for_url(re.compile(rf"/app/workspace/time-plans/{time_plan.ref_id}"))

    expect(page.locator("#time-plan-activities")).to_contain_text("The Inbox Task")

    page.goto(f"/app/workspace/core/inbox-tasks/{inbox_task.ref_id}")
    expect(page.locator("input[name='actionableDate']")).to_have_value("")
    expect(page.locator("input[name='dueDate']")).to_have_value("2024-06-23")


def test_webui_time_plan_associate_with_inbox_task_and_pulls_project(
    page: Page, create_time_plan, create_inbox_task, create_project
) -> None:
    time_plan = create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    project = create_project(
        "The Project", actionable_date="2024-06-10", due_date="2024-06-19"
    )
    _ = create_inbox_task("The Inbox Task", project_id=project.ref_id)

    page.goto(f"/app/workspace/time-plans/{time_plan.ref_id}")

    page.locator("#section-action-nav-multiple-compact-button").click()
    page.locator("a", has_text="From Current Inbox Tasks").click()

    page.wait_for_url(
        re.compile(r"/app/workspace/time-plans/\d+/add-from-current-inbox-tasks")
    )

    page.locator("#time-plan-current-inbox-tasks").locator(
        "p", has_text="The Inbox Task"
    ).click()

    page.locator("#time-plan-current-inbox-tasks").locator(
        "button", has_text=re.compile(r"^Add$")
    ).click()

    page.wait_for_url(re.compile(rf"/app/workspace/time-plans/{time_plan.ref_id}"))

    expect(page.locator("#time-plan-activities")).to_contain_text("The Inbox Task")
    expect(page.locator("#time-plan-activities")).to_contain_text("The Project")

    page.goto(f"/app/workspace/projects/{project.ref_id}")
    expect(page.locator("input[name='actionableDate']")).to_have_value("2024-06-10")
    expect(page.locator("input[name='dueDate']")).to_have_value("2024-06-19")


def test_webui_time_plan_associate_with_inbox_task_and_pulls_project_no_dates(
    page: Page, create_time_plan, create_inbox_task, create_project
) -> None:
    time_plan = create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    project = create_project("The Project")
    _ = create_inbox_task("The Inbox Task", project_id=project.ref_id)

    page.goto(f"/app/workspace/time-plans/{time_plan.ref_id}")

    page.locator("#section-action-nav-multiple-compact-button").click()
    page.locator("a", has_text="From Current Inbox Tasks").click()

    page.wait_for_url(
        re.compile(r"/app/workspace/time-plans/\d+/add-from-current-inbox-tasks")
    )

    page.locator("#time-plan-current-inbox-tasks").locator(
        "p", has_text="The Inbox Task"
    ).click()

    page.locator("#time-plan-current-inbox-tasks").locator(
        "button", has_text=re.compile(r"^Add$")
    ).click()

    page.wait_for_url(re.compile(rf"/app/workspace/time-plans/{time_plan.ref_id}"))

    expect(page.locator("#time-plan-activities")).to_contain_text("The Inbox Task")
    expect(page.locator("#time-plan-activities")).to_contain_text("The Project")

    page.goto(f"/app/workspace/projects/{project.ref_id}")
    expect(page.locator("input[name='actionableDate']")).to_have_value("2024-06-17")
    expect(page.locator("input[name='dueDate']")).to_have_value("2024-06-23")


def test_webui_time_plan_associate_with_inbox_task_and_pulls_project_but_overwrites_dates_leave_alone(
    page: Page, create_time_plan, create_inbox_task, create_project
) -> None:
    time_plan = create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    project = create_project(
        "The Project", actionable_date="2024-06-10", due_date="2024-06-19"
    )
    _ = create_inbox_task("The Inbox Task", project_id=project.ref_id)

    page.goto(f"/app/workspace/time-plans/{time_plan.ref_id}")

    page.locator("#section-action-nav-multiple-compact-button").click()
    page.locator("a", has_text="From Current Inbox Tasks").click()

    page.wait_for_url(
        re.compile(r"/app/workspace/time-plans/\d+/add-from-current-inbox-tasks")
    )

    page.locator("#time-plan-current-inbox-tasks").locator(
        "p", has_text="The Inbox Task"
    ).click()

    page.locator("#time-plan-current-inbox-tasks").locator(
        "button", has_text=re.compile(r"^Add And Override Dates$")
    ).click()

    page.wait_for_url(re.compile(rf"/app/workspace/time-plans/{time_plan.ref_id}"))

    expect(page.locator("#time-plan-activities")).to_contain_text("The Inbox Task")
    expect(page.locator("#time-plan-activities")).to_contain_text("The Project")

    page.goto(f"/app/workspace/projects/{project.ref_id}")
    expect(page.locator("input[name='actionableDate']")).to_have_value("2024-06-10")
    expect(page.locator("input[name='dueDate']")).to_have_value("2024-06-19")


def test_webui_time_plan_associate_with_two_out_of_three_inbox_tasks(
    page: Page, create_time_plan, create_inbox_task
) -> None:
    time_plan = create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    _ = create_inbox_task("The Inbox Task 1", due_date="2024-06-18")
    _ = create_inbox_task("The Inbox Task 2", due_date="2024-06-18")
    _ = create_inbox_task("The Inbox Task 3", due_date="2024-06-19")

    page.goto(f"/app/workspace/time-plans/{time_plan.ref_id}")

    page.locator("#section-action-nav-multiple-compact-button").click()
    page.locator("a", has_text="From Current Inbox Tasks").click()

    page.wait_for_url(
        re.compile(r"/app/workspace/time-plans/\d+/add-from-current-inbox-tasks")
    )

    page.locator("#time-plan-current-inbox-tasks").locator(
        "p", has_text="The Inbox Task 1"
    ).click()
    page.locator("#time-plan-current-inbox-tasks").locator(
        "p", has_text="The Inbox Task 2"
    ).click()

    page.locator("#time-plan-current-inbox-tasks").locator(
        "button", has_text=re.compile(r"^Add$")
    ).click()

    page.wait_for_url(re.compile(rf"/app/workspace/time-plans/{time_plan.ref_id}"))

    expect(page.locator("#time-plan-activities")).to_contain_text("The Inbox Task 1")
    expect(page.locator("#time-plan-activities")).to_contain_text("The Inbox Task 2")
    expect(page.locator("#time-plan-activities")).not_to_contain_text(
        "The Inbox Task 3"
    )


def test_webui_time_plan_associate_with_tasks_that_pull_in_some_more_projects(
    page: Page, create_time_plan, create_inbox_task, create_project
) -> None:
    time_plan = create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    project1 = create_project(
        "The Project 1", actionable_date="2024-06-10", due_date="2024-06-19"
    )
    _ = create_inbox_task("The Inbox Task 1", project_id=project1.ref_id)
    _ = create_inbox_task("The Inbox Task 2", project_id=project1.ref_id)
    project2 = create_project(
        "The Project 2", actionable_date="2024-06-10", due_date="2024-06-19"
    )
    _ = create_inbox_task("The Inbox Task 3", project_id=project2.ref_id)
    _ = create_project(
        "The Project 3", actionable_date="2024-06-10", due_date="2024-06-19"
    )

    page.goto(f"/app/workspace/time-plans/{time_plan.ref_id}")

    page.locator("#section-action-nav-multiple-compact-button").click()
    page.locator("a", has_text="From Current Inbox Tasks").click()

    page.wait_for_url(
        re.compile(r"/app/workspace/time-plans/\d+/add-from-current-inbox-tasks")
    )

    page.locator("#time-plan-current-inbox-tasks").locator(
        "p", has_text="The Inbox Task 1"
    ).click()
    page.locator("#time-plan-current-inbox-tasks").locator(
        "p", has_text="The Inbox Task 3"
    ).click()

    page.locator("#time-plan-current-inbox-tasks").locator(
        "button", has_text=re.compile(r"^Add$")
    ).click()

    page.wait_for_url(re.compile(rf"/app/workspace/time-plans/{time_plan.ref_id}"))

    expect(page.locator("#time-plan-activities")).to_contain_text("The Inbox Task 1")
    expect(page.locator("#time-plan-activities")).not_to_contain_text(
        "The Inbox Task 2"
    )
    expect(page.locator("#time-plan-activities")).to_contain_text("The Inbox Task 3")
    expect(page.locator("#time-plan-activities")).to_contain_text("The Project 1")
    expect(page.locator("#time-plan-activities")).to_contain_text("The Project 2")
    expect(page.locator("#time-plan-activities")).not_to_contain_text("The Project 3")


def test_webui_time_plan_associate_with_project(
    page: Page, create_time_plan, create_project
) -> None:
    time_plan = create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    project = create_project(
        "The Project", actionable_date="2024-06-10", due_date="2024-06-19"
    )

    page.goto(f"/app/workspace/time-plans/{time_plan.ref_id}")

    page.locator("#section-action-nav-multiple-compact-button").click()
    page.locator("a", has_text="From Current Projects").click()

    page.wait_for_url(
        re.compile(r"/app/workspace/time-plans/\d+/add-from-current-projects")
    )

    page.locator("#time-plan-current-projects").locator(
        "p", has_text="The Project"
    ).click()

    page.locator("#time-plan-current-projects").locator(
        "button", has_text=re.compile(r"^Add$")
    ).click()

    page.wait_for_url(re.compile(rf"/app/workspace/time-plans/{time_plan.ref_id}"))

    expect(page.locator("#time-plan-activities")).to_contain_text("The Project")

    page.goto(f"/app/workspace/projects/{project.ref_id}")
    expect(page.locator("input[name='actionableDate']")).to_have_value("2024-06-10")
    expect(page.locator("input[name='dueDate']")).to_have_value("2024-06-19")


def test_webui_time_plan_associate_with_project_no_dates(
    page: Page, create_time_plan, create_project
) -> None:
    time_plan = create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    project = create_project("The Project")

    page.goto(f"/app/workspace/time-plans/{time_plan.ref_id}")

    page.locator("#section-action-nav-multiple-compact-button").click()
    page.locator("a", has_text="From Current Projects").click()

    page.wait_for_url(
        re.compile(r"/app/workspace/time-plans/\d+/add-from-current-projects")
    )

    page.locator("#time-plan-current-projects").locator(
        "p", has_text="The Project"
    ).click()

    page.locator("#time-plan-current-projects").locator(
        "button", has_text=re.compile(r"^Add$")
    ).click()

    page.wait_for_url(re.compile(rf"/app/workspace/time-plans/{time_plan.ref_id}"))

    expect(page.locator("#time-plan-activities")).to_contain_text("The Project")

    page.goto(f"/app/workspace/projects/{project.ref_id}")
    expect(page.locator("input[name='actionableDate']")).to_have_value("2024-06-17")
    expect(page.locator("input[name='dueDate']")).to_have_value("2024-06-23")


def test_webui_time_plan_associate_with_project_and_override_dates(
    page: Page, create_time_plan, create_project
) -> None:
    time_plan = create_time_plan("2024-06-18", RecurringTaskPeriod.WEEKLY)
    project = create_project(
        "The Project", actionable_date="2024-06-10", due_date="2024-06-19"
    )

    page.goto(f"/app/workspace/time-plans/{time_plan.ref_id}")

    page.locator("#section-action-nav-multiple-compact-button").click()
    page.locator("a", has_text="From Current Projects").click()

    page.wait_for_url(
        re.compile(r"/app/workspace/time-plans/\d+/add-from-current-projects")
    )

    page.locator("#time-plan-current-projects").locator(
        "p", has_text="The Project"
    ).click()

    page.locator("#time-plan-current-projects").locator(
        "button", has_text=re.compile(r"^Add And Override Dates$")
    ).click()

    page.wait_for_url(re.compile(rf"/app/workspace/time-plans/{time_plan.ref_id}"))

    expect(page.locator("#time-plan-activities")).to_contain_text("The Project")

    page.goto(f"/app/workspace/projects/{project.ref_id}")
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

    page.goto(f"/app/workspace/time-plans/{time_plan_2.ref_id}")

    page.locator("#section-action-nav-multiple-compact-button").click()
    page.locator("a", has_text="From Time Plans").click()

    page.wait_for_url(
        re.compile(
            rf"/app/workspace/time-plans/{time_plan_2.ref_id}/add-from-current-time-plans/{time_plan_2.ref_id}"
        )
    )

    page.locator("#time-plan-previous-time-plan").locator(
        "a", has_text="Weekly plan for 2024-06-18"
    ).click()

    page.wait_for_url(
        re.compile(
            rf"/app/workspace/time-plans/{time_plan_2.ref_id}/add-from-current-time-plans/{time_plan_1.ref_id}"
        )
    )

    page.locator("#time-plan-current-activities").locator(
        "p", has_text="The Inbox Task"
    ).click()

    page.locator("#time-plan-current-activities").locator(
        "button", has_text=re.compile(r"^Add$")
    ).click()

    page.wait_for_url(re.compile(rf"/app/workspace/time-plans/{time_plan_2.ref_id}"))

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

    page.goto(f"/app/workspace/time-plans/{time_plan_2.ref_id}")

    page.locator("#section-action-nav-multiple-compact-button").click()
    page.locator("a", has_text="From Time Plans").click()

    page.wait_for_url(
        re.compile(
            rf"/app/workspace/time-plans/{time_plan_2.ref_id}/add-from-current-time-plans/{time_plan_2.ref_id}"
        )
    )

    page.locator("#time-plan-previous-time-plan").locator(
        "a", has_text="Weekly plan for 2024-06-18"
    ).click()

    page.wait_for_url(
        re.compile(
            rf"/app/workspace/time-plans/{time_plan_2.ref_id}/add-from-current-time-plans/{time_plan_1.ref_id}"
        )
    )

    page.locator("#time-plan-current-activities").locator(
        "p", has_text="The Inbox Task"
    ).click()

    page.locator("#time-plan-current-activities").locator(
        "button", has_text=re.compile(r"^Add$")
    ).click()

    page.wait_for_url(re.compile(rf"/app/workspace/time-plans/{time_plan_2.ref_id}"))

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

    page.goto(f"/app/workspace/time-plans/{time_plan_2.ref_id}")

    page.locator("#section-action-nav-multiple-compact-button").click()
    page.locator("a", has_text="From Time Plans").click()

    page.wait_for_url(
        re.compile(
            rf"/app/workspace/time-plans/{time_plan_2.ref_id}/add-from-current-time-plans/{time_plan_2.ref_id}"
        )
    )

    page.locator("#time-plan-previous-time-plan").locator(
        "a", has_text="Weekly plan for 2024-06-18"
    ).click()

    page.wait_for_url(
        re.compile(
            rf"/app/workspace/time-plans/{time_plan_2.ref_id}/add-from-current-time-plans/{time_plan_1.ref_id}"
        )
    )

    page.locator("#time-plan-current-activities").locator(
        "p", has_text="The Inbox Task"
    ).click()

    page.locator("#time-plan-current-activities").locator(
        "button", has_text=re.compile(r"^Add And Override Dates$")
    ).click()

    page.wait_for_url(re.compile(rf"/app/workspace/time-plans/{time_plan_2.ref_id}"))

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

    page.goto(f"/app/workspace/time-plans/{time_plan_2.ref_id}")

    page.locator("#section-action-nav-multiple-compact-button").click()
    page.locator("a", has_text="From Time Plans").click()

    page.wait_for_url(
        re.compile(
            rf"/app/workspace/time-plans/{time_plan_2.ref_id}/add-from-current-time-plans/{time_plan_2.ref_id}"
        )
    )

    page.locator("#time-plan-previous-time-plan").locator(
        "a", has_text="Weekly plan for 2024-06-18"
    ).click()

    page.wait_for_url(
        re.compile(
            rf"/app/workspace/time-plans/{time_plan_2.ref_id}/add-from-current-time-plans/{time_plan_1.ref_id}"
        )
    )

    page.locator("#time-plan-current-activities").locator(
        "p", has_text="The Inbox Task"
    ).click()

    page.locator("#time-plan-current-activities").locator(
        "button", has_text=re.compile(r"^Add$")
    ).click()

    page.wait_for_url(re.compile(rf"/app/workspace/time-plans/{time_plan_2.ref_id}"))

    expect(page.locator("#time-plan-activities")).to_contain_text("The Inbox Task")
    expect(page.locator("#time-plan-activities")).to_contain_text("The Project")

    page.goto(f"/app/workspace/projects/{project.ref_id}")
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

    page.goto(f"/app/workspace/time-plans/{time_plan_2.ref_id}")

    page.locator("#section-action-nav-multiple-compact-button").click()
    page.locator("a", has_text="From Time Plans").click()

    page.wait_for_url(
        re.compile(
            rf"/app/workspace/time-plans/{time_plan_2.ref_id}/add-from-current-time-plans/{time_plan_2.ref_id}"
        )
    )

    page.locator("#time-plan-previous-time-plan").locator(
        "a", has_text="Weekly plan for 2024-06-18"
    ).click()

    page.wait_for_url(
        re.compile(
            rf"/app/workspace/time-plans/{time_plan_2.ref_id}/add-from-current-time-plans/{time_plan_1.ref_id}"
        )
    )

    page.locator("#time-plan-current-activities").locator(
        "p", has_text="The Inbox Task"
    ).click()

    page.locator("#time-plan-current-activities").locator(
        "button", has_text=re.compile(r"^Add$")
    ).click()

    page.wait_for_url(re.compile(rf"/app/workspace/time-plans/{time_plan_2.ref_id}"))

    expect(page.locator("#time-plan-activities")).to_contain_text("The Inbox Task")
    expect(page.locator("#time-plan-activities")).to_contain_text("The Project")

    page.goto(f"/app/workspace/projects/{project.ref_id}")
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

    page.goto(f"/app/workspace/time-plans/{time_plan_2.ref_id}")

    page.locator("#section-action-nav-multiple-compact-button").click()
    page.locator("a", has_text="From Time Plans").click()

    page.wait_for_url(
        re.compile(
            rf"/app/workspace/time-plans/{time_plan_2.ref_id}/add-from-current-time-plans/{time_plan_2.ref_id}"
        )
    )

    page.locator("#time-plan-previous-time-plan").locator(
        "a", has_text="Weekly plan for 2024-06-18"
    ).click()

    page.wait_for_url(
        re.compile(
            rf"/app/workspace/time-plans/{time_plan_2.ref_id}/add-from-current-time-plans/{time_plan_1.ref_id}"
        )
    )

    page.locator("#time-plan-current-activities").locator(
        "p", has_text="The Inbox Task"
    ).click()

    page.locator("#time-plan-current-activities").locator(
        "button", has_text=re.compile(r"^Add And Override Dates$")
    ).click()

    page.wait_for_url(re.compile(rf"/app/workspace/time-plans/{time_plan_2.ref_id}"))

    expect(page.locator("#time-plan-activities")).to_contain_text("The Inbox Task")
    expect(page.locator("#time-plan-activities")).to_contain_text("The Project")

    page.goto(f"/app/workspace/projects/{project.ref_id}")
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

    page.goto(f"/app/workspace/time-plans/{time_plan_2.ref_id}")

    page.locator("#section-action-nav-multiple-compact-button").click()
    page.locator("a", has_text="From Time Plans").click()

    page.wait_for_url(
        re.compile(
            rf"/app/workspace/time-plans/{time_plan_2.ref_id}/add-from-current-time-plans/{time_plan_2.ref_id}"
        )
    )

    page.locator("#time-plan-previous-time-plan").locator(
        "a", has_text="Weekly plan for 2024-06-18"
    ).click()

    page.wait_for_url(
        re.compile(
            rf"/app/workspace/time-plans/{time_plan_2.ref_id}/add-from-current-time-plans/{time_plan_1.ref_id}"
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

    page.wait_for_url(re.compile(rf"/app/workspace/time-plans/{time_plan_2.ref_id}"))

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

    page.goto(f"/app/workspace/time-plans/{time_plan_2.ref_id}")

    page.locator("#section-action-nav-multiple-compact-button").click()
    page.locator("a", has_text="From Time Plans").click()

    page.wait_for_url(
        re.compile(
            rf"/app/workspace/time-plans/{time_plan_2.ref_id}/add-from-current-time-plans/{time_plan_2.ref_id}"
        )
    )

    page.locator("#time-plan-previous-time-plan").locator(
        "a", has_text="Weekly plan for 2024-06-18"
    ).click()

    page.wait_for_url(
        re.compile(
            rf"/app/workspace/time-plans/{time_plan_2.ref_id}/add-from-current-time-plans/{time_plan_1.ref_id}"
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

    page.wait_for_url(re.compile(rf"/app/workspace/time-plans/{time_plan_2.ref_id}"))

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

    page.goto(f"/app/workspace/time-plans/{time_plan_2.ref_id}")

    page.locator("#section-action-nav-multiple-compact-button").click()
    page.locator("a", has_text="From Time Plans").click()

    page.wait_for_url(
        re.compile(
            rf"/app/workspace/time-plans/{time_plan_2.ref_id}/add-from-current-time-plans/{time_plan_2.ref_id}"
        )
    )

    page.locator("#time-plan-previous-time-plan").locator(
        "a", has_text="Weekly plan for 2024-06-18"
    ).click()

    page.wait_for_url(
        re.compile(
            rf"/app/workspace/time-plans/{time_plan_2.ref_id}/add-from-current-time-plans/{time_plan_1.ref_id}"
        )
    )

    page.locator("#time-plan-current-activities").locator(
        "p", has_text="The Project"
    ).click()

    page.locator("#time-plan-current-activities").locator(
        "button", has_text=re.compile(r"^Add$")
    ).click()

    page.wait_for_url(re.compile(rf"/app/workspace/time-plans/{time_plan_2.ref_id}"))

    expect(page.locator("#time-plan-activities")).to_contain_text("The Project")

    page.goto(f"/app/workspace/projects/{project.ref_id}")
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

    page.goto(f"/app/workspace/time-plans/{time_plan_2.ref_id}")

    page.locator("#section-action-nav-multiple-compact-button").click()
    page.locator("a", has_text="From Time Plans").click()

    page.wait_for_url(
        re.compile(
            rf"/app/workspace/time-plans/{time_plan_2.ref_id}/add-from-current-time-plans/{time_plan_2.ref_id}"
        )
    )

    page.locator("#time-plan-previous-time-plan").locator(
        "a", has_text="Weekly plan for 2024-06-18"
    ).click()

    page.wait_for_url(
        re.compile(
            rf"/app/workspace/time-plans/{time_plan_2.ref_id}/add-from-current-time-plans/{time_plan_1.ref_id}"
        )
    )

    page.locator("#time-plan-current-activities").locator(
        "p", has_text="The Project"
    ).click()

    page.locator("#time-plan-current-activities").locator(
        "button", has_text=re.compile(r"^Add$")
    ).click()

    page.wait_for_url(re.compile(rf"/app/workspace/time-plans/{time_plan_2.ref_id}"))

    expect(page.locator("#time-plan-activities")).to_contain_text("The Project")

    page.goto(f"/app/workspace/projects/{project.ref_id}")
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

    page.goto(f"/app/workspace/time-plans/{time_plan_2.ref_id}")

    page.locator("#section-action-nav-multiple-compact-button").click()
    page.locator("a", has_text="From Time Plans").click()

    page.wait_for_url(
        re.compile(
            rf"/app/workspace/time-plans/{time_plan_2.ref_id}/add-from-current-time-plans/{time_plan_2.ref_id}"
        )
    )

    page.locator("#time-plan-previous-time-plan").locator(
        "a", has_text="Weekly plan for 2024-06-18"
    ).click()

    page.wait_for_url(
        re.compile(
            rf"/app/workspace/time-plans/{time_plan_2.ref_id}/add-from-current-time-plans/{time_plan_1.ref_id}"
        )
    )

    page.locator("#time-plan-current-activities").locator(
        "p", has_text="The Project"
    ).click()

    page.locator("#time-plan-current-activities").locator(
        "button", has_text=re.compile(r"^Add And Override Dates$")
    ).click()

    page.wait_for_url(re.compile(rf"/app/workspace/time-plans/{time_plan_2.ref_id}"))

    expect(page.locator("#time-plan-activities")).to_contain_text("The Project")

    page.goto(f"/app/workspace/projects/{project.ref_id}")
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

    page.goto(f"/app/workspace/time-plans/{time_plan_2.ref_id}")

    page.locator("#section-action-nav-multiple-compact-button").click()
    page.locator("a", has_text="From Time Plans").click()

    page.wait_for_url(
        re.compile(
            rf"/app/workspace/time-plans/{time_plan_2.ref_id}/add-from-current-time-plans/{time_plan_2.ref_id}"
        )
    )

    page.locator("#time-plan-previous-time-plan").locator(
        "a", has_text="Weekly plan for 2024-06-18"
    ).click()

    page.wait_for_url(
        re.compile(
            rf"/app/workspace/time-plans/{time_plan_2.ref_id}/add-from-current-time-plans/{time_plan_1.ref_id}"
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

    page.wait_for_url(re.compile(rf"/app/workspace/time-plans/{time_plan_2.ref_id}"))

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

    page.goto(f"/app/workspace/time-plans/{time_plan_1.ref_id}")

    expect(page.locator("#time-plan-activities")).to_contain_text("The Inbox Task")
    expect(page.locator("#time-plan-activities")).to_contain_text("The Project")

    page.goto(f"/app/workspace/time-plans/{time_plan_2.ref_id}")

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
            rf"/app/workspace/time-plans/add-inbox-task-to-plans\?inboxTaskRefId={inbox_task.ref_id}"
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
            rf"/app/workspace/time-plans/add-inbox-task-to-plans\?inboxTaskRefId={inbox_task.ref_id}"
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
            rf"/app/workspace/time-plans/add-inbox-task-to-plans\?inboxTaskRefId={inbox_task.ref_id}"
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
            rf"/app/workspace/time-plans/add-inbox-task-to-plans\?inboxTaskRefId={inbox_task.ref_id}"
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

    page.goto(f"/app/workspace/time-plans/{time_plan.ref_id}")
    expect(page.locator("#time-plan-activities")).to_contain_text("The Inbox Task")
    expect(page.locator("#time-plan-activities")).to_contain_text("The Project")

    page.goto(f"/app/workspace/projects/{project.ref_id}")
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
            rf"/app/workspace/time-plans/add-inbox-task-to-plans\?inboxTaskRefId={inbox_task.ref_id}"
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

    page.goto(f"/app/workspace/time-plans/{time_plan.ref_id}")
    expect(page.locator("#time-plan-activities")).to_contain_text("The Inbox Task")
    expect(page.locator("#time-plan-activities")).to_contain_text("The Project")

    page.goto(f"/app/workspace/projects/{project.ref_id}")
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
            rf"/app/workspace/time-plans/add-inbox-task-to-plans\?inboxTaskRefId={inbox_task.ref_id}"
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

    page.goto(f"/app/workspace/time-plans/{time_plan.ref_id}")
    expect(page.locator("#time-plan-activities")).to_contain_text("The Inbox Task")
    expect(page.locator("#time-plan-activities")).to_contain_text("The Project")

    page.goto(f"/app/workspace/projects/{project.ref_id}")
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
            rf"/app/workspace/time-plans/add-inbox-task-to-plans\?inboxTaskRefId={inbox_task.ref_id}"
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

    page.goto(f"/app/workspace/time-plans/{time_plan1.ref_id}")
    expect(page.locator("#time-plan-activities")).to_contain_text("The Inbox Task")

    page.goto(f"/app/workspace/time-plans/{time_plan2.ref_id}")
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
    create_project(
        "The Project 3", actionable_date="2024-06-10", due_date="2024-06-19"
    )

    # Add first inbox task
    page.goto(f"/app/workspace/core/inbox-tasks/{inbox_task1.ref_id}")

    page.locator("#inbox-task-time-plans").locator("a", has_text="Add").click()

    page.wait_for_url(
        re.compile(
            rf"/app/workspace/time-plans/add-inbox-task-to-plans\?inboxTaskRefId={inbox_task1.ref_id}"
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
            rf"/app/workspace/time-plans/add-inbox-task-to-plans\?inboxTaskRefId={inbox_task3.ref_id}"
        )
    )

    page.locator("#all-time-plans").locator(
        "p", has_text="Weekly plan for 2024-06-18"
    ).click()

    page.locator("#add-inbox-task-to-plans").locator("button", has_text="Add").click()

    page.wait_for_url(
        re.compile(rf"/app/workspace/core/inbox-tasks/{inbox_task3.ref_id}")
    )

    page.goto(f"/app/workspace/time-plans/{time_plan.ref_id}")
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

    page.goto(f"/app/workspace/time-plans/{time_plan.ref_id}")

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
        f"/app/workspace/time-plans/{time_plan.ref_id}/{inbox_task_activity.ref_id}"
    )

    page.locator("#time-plan-activity-kind-make-progress").click()
    page.locator("#time-plan-activity-feasability-stretch").click()
    page.locator("#time-plan-activity-properties").locator(
        "button", has_text="Save"
    ).click()

    page.wait_for_url(re.compile(rf"/app/workspace/time-plans/{time_plan.ref_id}$"))

    page.goto(
        f"/app/workspace/time-plans/{time_plan.ref_id}/{inbox_task_activity.ref_id}"
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

    page.goto(f"/app/workspace/time-plans/{time_plan.ref_id}")

    expect(page.locator("#time-plan-activities")).to_contain_text("The Inbox Task")

    page.goto(
        f"/app/workspace/time-plans/{time_plan.ref_id}/{inbox_task_activity.ref_id}"
    )

    page.locator("#leaf-entity-archive").click()
    page.locator("#leaf-entity-archive-confirm").click()

    page.wait_for_url(f"/app/workspace/time-plans/{time_plan.ref_id}")

    page.goto(
        f"/app/workspace/time-plans/{time_plan.ref_id}/{inbox_task_activity.ref_id}"
    )

    expect(
        page.locator('button[id="time-plan-activity-feasability-must-do"]')
    ).to_be_disabled()

    page.goto(f"/app/workspace/time-plans/{time_plan.ref_id}")

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

    page.goto(f"/app/workspace/time-plans/{time_plan.ref_id}")

    expect(page.locator("#time-plan-activities")).to_contain_text("The Inbox Task")
    expect(page.locator("#time-plan-activities")).to_contain_text("The Project")

    page.goto(
        f"/app/workspace/time-plans/{time_plan.ref_id}/{project_activity.ref_id}"
    )

    page.locator("#leaf-entity-archive").click()
    page.locator("#leaf-entity-archive-confirm").click()

    page.wait_for_url(f"/app/workspace/time-plans/{time_plan.ref_id}")

    page.goto(
        f"/app/workspace/time-plans/{time_plan.ref_id}/{inbox_task_activity.ref_id}"
    )

    expect(page.locator("#inbox-task-editor-save")).to_be_disabled()

    page.goto(f"/app/workspace/time-plans/{time_plan.ref_id}")

    expect(page.locator("#time-plan-activities")).not_to_contain_text("The Inbox Task")
    expect(page.locator("#time-plan-activities")).not_to_contain_text("The Project")


def test_webui_time_plan_periods_settings_standard(page: Page) -> None:
    page.goto("/app/workspace/time-plans")

    expect(page.locator("a", has_text="Create a quarterly time plan")).to_be_attached()
    expect(page.locator("a", has_text="Create a weekly time plan")).to_be_attached()


def test_webui_time_plan_periods_settings_add_monthly(page: Page) -> None:
    page.goto("/app/workspace/time-plans/settings")

    page.locator("button", has_text="Monthly").click()
    page.locator("button", has_text="None").click()

    page.locator("#time-plans-settings-save").click()

    page.wait_for_url("/app/workspace/time-plans/settings")

    page.goto("/app/workspace/time-plans")
    page.reload()

    expect(page.locator("a", has_text="Create a monthly time plan")).to_be_attached()
    expect(page.locator("a", has_text="Create a quarterly time plan")).to_be_attached()
    expect(page.locator("a", has_text="Create a weekly time plan")).to_be_attached()


def test_webui_time_plan_generate_standard_config_via_gen(page: Page, new_user) -> None:
    page.goto("/app/workspace/tools/gen")

    page.locator("#generate").click()

    page.goto("/app/workspace/time-plans")
    page.reload()

    expect(page.locator("#time-plans-all")).to_contain_text("Weekly plan for")
    expect(page.locator("#time-plans-all")).to_contain_text("Quarterly plan for")

    page.goto("/app/workspace/core/inbox-tasks")

    expect(page.locator("html")).to_contain_text("Make weekly plan for")
    expect(page.locator("html")).to_contain_text("Make quarterly plan for")


def test_webui_time_plan_generate_standard_config_via_save(page: Page) -> None:
    page.goto("/app/workspace/time-plans/settings")

    page.locator("#time-plans-settings-save").click()

    page.goto("/app/workspace/time-plans")
    page.reload()

    expect(page.locator("#time-plans-all")).to_contain_text("Weekly plan for")
    expect(page.locator("#time-plans-all")).to_contain_text("Quarterly plan for")

    page.goto("/app/workspace/core/inbox-tasks")

    expect(page.locator("html")).to_contain_text("Make weekly plan for")
    expect(page.locator("html")).to_contain_text("Make quarterly plan for")


def test_webui_time_plan_generate_different_config_add_monthly(page: Page) -> None:
    page.goto("/app/workspace/time-plans/settings")

    page.locator("button", has_text="Monthly").click()

    page.locator("#time-plans-settings-save").click()

    page.goto("/app/workspace/time-plans")
    page.reload()

    expect(page.locator("#time-plans-all")).to_contain_text("Monthly plan for")
    expect(page.locator("#time-plans-all")).to_contain_text("Weekly plan for")
    expect(page.locator("#time-plans-all")).to_contain_text("Quarterly plan for")

    page.goto("/app/workspace/core/inbox-tasks")

    expect(page.locator("html")).to_contain_text("Make monthly plan for")
    expect(page.locator("html")).to_contain_text("Make weekly plan for")
    expect(page.locator("html")).to_contain_text("Make quarterly plan for")


def test_webui_time_plan_generate_different_config_remove_quarterly(page: Page) -> None:
    page.goto("/app/workspace/time-plans/settings")

    page.locator("button", has_text="Quarterly").click()

    page.locator("#time-plans-settings-save").click()

    page.goto("/app/workspace/time-plans")
    page.reload()

    expect(page.locator("#time-plans-all")).to_contain_text("Weekly plan for")
    expect(page.locator("#time-plans-all")).not_to_contain_text("Quarterly plan for")

    page.goto("/app/workspace/core/inbox-tasks")

    expect(page.locator("html")).to_contain_text("Make weekly plan for")
    expect(page.locator("html")).not_to_contain_text("Make quarterly plan for")


def test_webui_time_plan_generate_no_planning_tasks(page: Page) -> None:
    page.goto("/app/workspace/time-plans/settings")

    page.locator("button", has_text="Only Plan").click()

    page.locator("#time-plans-settings-save").click()

    page.goto("/app/workspace/time-plans")
    page.reload()

    expect(page.locator("#time-plans-all")).to_contain_text("Weekly plan for")
    expect(page.locator("#time-plans-all")).to_contain_text("Quarterly plan for")

    page.goto("/app/workspace/core/inbox-tasks")

    expect(page.locator("html")).not_to_contain_text("Make weekly plan for")
    expect(page.locator("html")).not_to_contain_text("Make quarterly plan for")


def test_webui_time_plan_generate_no_nothing(page: Page) -> None:
    page.goto("/app/workspace/time-plans/settings")

    page.locator("button", has_text="None").click()

    page.locator("#time-plans-settings-save").click()

    page.goto("/app/workspace/time-plans")
    page.reload()

    expect(page.locator("#time-plans-all")).not_to_contain_text("Weekly plan for")
    expect(page.locator("#time-plans-all")).not_to_contain_text("Quarterly plan for")

    page.goto("/app/workspace/core/inbox-tasks")

    expect(page.locator("html")).not_to_contain_text("Make weekly plan for")
    expect(page.locator("html")).not_to_contain_text("Make quarterly plan for")


def test_webui_time_plan_generate_no_nothing_and_regenerate(page: Page) -> None:
    page.goto("/app/workspace/time-plans/settings")

    page.locator("button", has_text="None").click()

    page.locator("#time-plans-settings-save").click()

    page.goto("/app/workspace/time-plans")
    page.reload()

    expect(page.locator("#time-plans-all")).not_to_contain_text("Weekly plan for")
    expect(page.locator("#time-plans-all")).not_to_contain_text("Quarterly plan for")

    page.goto("/app/workspace/time-plans/settings")

    page.locator("button", has_text="Both Plan And Task").click()

    page.locator("#time-plans-settings-save").click()

    page.goto("/app/workspace/time-plans")
    page.reload()

    expect(page.locator("#time-plans-all")).to_contain_text("Weekly plan for")
    expect(page.locator("#time-plans-all")).to_contain_text("Quarterly plan for")

    page.goto("/app/workspace/core/inbox-tasks")

    expect(page.locator("html")).to_contain_text("Make weekly plan for")
    expect(page.locator("html")).to_contain_text("Make quarterly plan for")


def test_webui_time_plan_generate_does_not_override_existing_time_plans(
    page: Page, create_time_plan
) -> None:
    # We add a couple of days in advance here to match the behaviour of the gen tool.
    right_now = pendulum.now(tz="UTC").add(days=3)
    _ = create_time_plan(right_now.strftime("%Y-%m-%d"), RecurringTaskPeriod.WEEKLY)

    page.goto("/app/workspace/time-plans/settings")

    page.locator("#time-plans-settings-save").click()

    page.goto("/app/workspace/time-plans")
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

    page.goto("/app/workspace/time-plans/settings")

    page.locator("button", has_text="Weekly").click()

    page.locator("#time-plans-settings-save").click()

    page.goto("/app/workspace/time-plans")
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

    page.goto("/app/workspace/time-plans")
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

    # SwiftView can show the same task in multiple due-date stacks (e.g. today and this week).
    page.get_by_role("link", name=re.compile(r"Make weekly plan for")).first.click()

    page.wait_for_url(re.compile(r"/app/workspace/core/inbox-tasks/\d+"))

    page.locator("#leaf-panel").locator("a", has_text="Time Plan").click()

    page.wait_for_url(re.compile(r"/app/workspace/time-plans/\d+"))
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


def _mark_project_done(
    logged_in_client: AuthenticatedClient, project: Project
) -> None:
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

    page.goto(f"/app/workspace/projects/{project.ref_id}")

    page.locator("#project-time-plans").locator("a", has_text="Add").click()

    page.wait_for_url(
        re.compile(
            rf"/app/workspace/time-plans/add-project-to-plans\?bigPlanRefId={project.ref_id}"
        )
    )

    page.locator("#all-time-plans").locator(
        "p", has_text="Weekly plan for 2024-06-18"
    ).click()

    page.locator("#add-project-to-plans").locator("button", has_text="Add").click()

    page.wait_for_url(re.compile(rf"/app/workspace/projects/{project.ref_id}"))

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

    page.goto(f"/app/workspace/projects/{project.ref_id}")

    page.locator("#project-time-plans").locator("a", has_text="Add").click()

    page.wait_for_url(
        re.compile(
            rf"/app/workspace/time-plans/add-project-to-plans\?bigPlanRefId={project.ref_id}"
        )
    )

    page.locator("#all-time-plans").locator(
        "p", has_text="Weekly plan for 2024-06-18"
    ).click()

    page.locator("#add-project-to-plans").locator("button", has_text="Add").click()

    page.wait_for_url(re.compile(rf"/app/workspace/projects/{project.ref_id}"))

    expect(page.locator("#project-time-plans")).to_contain_text(
        "Weekly plan for 2024-06-18"
    )

    page.goto(f"/app/workspace/projects/{project.ref_id}")
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

    page.goto(f"/app/workspace/projects/{project.ref_id}")

    page.locator("#project-time-plans").locator("a", has_text="Add").click()

    page.wait_for_url(
        re.compile(
            rf"/app/workspace/time-plans/add-project-to-plans\?bigPlanRefId={project.ref_id}"
        )
    )

    page.locator("#all-time-plans").locator(
        "p", has_text="Daily plan for 2024-06-18"
    ).click()

    page.locator("#add-project-to-plans").locator("button", has_text="Add").click()

    page.wait_for_url(re.compile(rf"/app/workspace/projects/{project.ref_id}"))

    expect(page.locator("#project-time-plans")).to_contain_text(
        "Daily plan for 2024-06-18"
    )

    page.goto(f"/app/workspace/projects/{project.ref_id}")
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

    page.goto(f"/app/workspace/projects/{project.ref_id}")

    page.locator("#project-time-plans").locator("a", has_text="Add").click()

    page.wait_for_url(
        re.compile(
            rf"/app/workspace/time-plans/add-project-to-plans\?bigPlanRefId={project.ref_id}"
        )
    )

    page.locator("#all-time-plans").locator(
        "p", has_text="Weekly plan for 2024-06-18"
    ).click()
    page.locator("#all-time-plans").locator(
        "p", has_text="Weekly plan for 2024-06-25"
    ).click()

    page.locator("#add-project-to-plans").locator("button", has_text="Add").click()

    page.wait_for_url(re.compile(rf"/app/workspace/projects/{project.ref_id}"))

    expect(page.locator("#project-time-plans")).to_contain_text(
        "Weekly plan for 2024-06-18"
    )
    expect(page.locator("#project-time-plans")).to_contain_text(
        "Weekly plan for 2024-06-25"
    )

    page.goto(f"/app/workspace/time-plans/{time_plan1.ref_id}")
    expect(page.locator("#time-plan-activities")).to_contain_text("The Project")

    page.goto(f"/app/workspace/time-plans/{time_plan2.ref_id}")
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

    page.goto(f"/app/workspace/projects/{project.ref_id}")

    page.locator("#project-time-plans").locator("a", has_text="Add").click()

    page.wait_for_url(
        re.compile(
            rf"/app/workspace/time-plans/add-project-to-plans\?bigPlanRefId={project.ref_id}"
        )
    )

    page.locator("#all-time-plans").locator(
        "p", has_text="Weekly plan for 2024-06-18"
    ).click()

    page.locator("#add-project-to-plans").locator("button", has_text="Add").click()

    page.wait_for_url(re.compile(rf"/app/workspace/projects/{project.ref_id}"))

    expect(page.locator("#project-time-plans")).to_contain_text(
        "Weekly plan for 2024-06-18"
    )

    page.goto(f"/app/workspace/time-plans/{time_plan.ref_id}")
    expect(page.locator("#time-plan-activities")).to_contain_text("The Project")
    expect(page.locator("#time-plan-activities")).not_to_contain_text(
        "The Inbox Task 1"
    )
    expect(page.locator("#time-plan-activities")).not_to_contain_text(
        "The Inbox Task 2"
    )

    page.goto(f"/app/workspace/projects/{project.ref_id}")
    expect(page.locator("input[name='actionableDate']")).to_have_value("2024-06-10")
    expect(page.locator("input[name='dueDate']")).to_have_value("2024-06-19")


# ideas
# * view time plan should show some activities
# * test that created activities show up in the timeplan too
