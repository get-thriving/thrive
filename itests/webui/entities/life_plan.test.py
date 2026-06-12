"""Tests about life plan views."""

from typing import Callable, cast

import pytest
from jupiter_webapi_client.api.application.get_summaries import (
    sync_detailed as get_summaries_sync,
)
from jupiter_webapi_client.api.big_plans.big_plan_create import (
    sync_detailed as big_plan_create_sync,
)
from jupiter_webapi_client.api.chores.chore_create import (
    sync_detailed as chore_create_sync,
)
from jupiter_webapi_client.api.habits.habit_create import (
    sync_detailed as habit_create_sync,
)
from jupiter_webapi_client.api.life_plan.aspect_create import (
    sync_detailed as aspect_create_sync,
)
from jupiter_webapi_client.api.life_plan.chapter_create import (
    sync_detailed as chapter_create_sync,
)
from jupiter_webapi_client.api.life_plan.goal_create import (
    sync_detailed as goal_create_sync,
)
from jupiter_webapi_client.api.life_plan.milestone_create import (
    sync_detailed as milestone_create_sync,
)
from jupiter_webapi_client.api.life_plan.vision_create_draft import (
    sync_detailed as vision_create_draft_sync,
)
from jupiter_webapi_client.api.life_plan.vision_load import (
    sync_detailed as vision_load_sync,
)
from jupiter_webapi_client.api.test_helper.workspace_set_feature import (
    sync_detailed as workspace_set_feature_sync,
)
from jupiter_webapi_client.client import AuthenticatedClient
from jupiter_webapi_client.models.aspect import Aspect
from jupiter_webapi_client.models.aspect_create_args import AspectCreateArgs
from jupiter_webapi_client.models.aspect_create_result import AspectCreateResult
from jupiter_webapi_client.models.big_plan_create_args import BigPlanCreateArgs
from jupiter_webapi_client.models.big_plan_create_result import BigPlanCreateResult
from jupiter_webapi_client.models.chapter import Chapter
from jupiter_webapi_client.models.chapter_create_args import ChapterCreateArgs
from jupiter_webapi_client.models.chapter_create_result import ChapterCreateResult
from jupiter_webapi_client.models.chore_create_args import ChoreCreateArgs
from jupiter_webapi_client.models.chore_create_result import ChoreCreateResult
from jupiter_webapi_client.models.difficulty import Difficulty
from jupiter_webapi_client.models.eisen import Eisen
from jupiter_webapi_client.models.get_summaries_args import GetSummariesArgs
from jupiter_webapi_client.models.get_summaries_result import GetSummariesResult
from jupiter_webapi_client.models.goal import Goal
from jupiter_webapi_client.models.goal_create_args import GoalCreateArgs
from jupiter_webapi_client.models.goal_create_result import GoalCreateResult
from jupiter_webapi_client.models.habit_create_args import HabitCreateArgs
from jupiter_webapi_client.models.habit_create_result import HabitCreateResult
from jupiter_webapi_client.models.milestone import Milestone
from jupiter_webapi_client.models.milestone_create_args import MilestoneCreateArgs
from jupiter_webapi_client.models.milestone_create_result import MilestoneCreateResult
from jupiter_webapi_client.models.recurring_task_period import RecurringTaskPeriod
from jupiter_webapi_client.models.vision import Vision
from jupiter_webapi_client.models.vision_create_draft_args import VisionCreateDraftArgs
from jupiter_webapi_client.models.vision_create_draft_result import (
    VisionCreateDraftResult,
)
from jupiter_webapi_client.models.vision_load_args import VisionLoadArgs
from jupiter_webapi_client.models.vision_load_result import VisionLoadResult
from jupiter_webapi_client.models.vision_status import VisionStatus
from jupiter_webapi_client.models.workspace_feature import WorkspaceFeature
from jupiter_webapi_client.models.workspace_set_feature_args import (
    WorkspaceSetFeatureArgs,
)
from jupiter_webapi_client.types import Unset
from playwright.sync_api import Page, expect

from itests.helpers import get_parsed_from_response


@pytest.fixture(autouse=True, scope="module")
def _enable_life_plan_feature(logged_in_client: AuthenticatedClient):
    try:
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.LIFE_PLAN, value=True
            ),
        )
        yield
    finally:
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.LIFE_PLAN, value=False
            ),
        )


@pytest.fixture(autouse=True, scope="module")
def get_root_aspect_id(logged_in_client: AuthenticatedClient) -> Callable[[], str]:
    def _get_root_aspect_id() -> str:
        response = get_summaries_sync(
            client=logged_in_client,
            body=GetSummariesArgs(
                include_aspects=True,
            ),
        )
        root_aspect = get_parsed_from_response(GetSummariesResult, response).root_aspect
        if root_aspect is None or isinstance(root_aspect, Unset):
            raise ValueError("Root aspect is None")
        return cast(str, root_aspect.ref_id)

    return _get_root_aspect_id


@pytest.fixture(autouse=True, scope="module")
def create_aspect(
    logged_in_client: AuthenticatedClient,
    get_root_aspect_id: Callable[[], str],
):
    def _create_aspect(name: str, parent_aspect_ref_id: str | None = None) -> Aspect:
        if parent_aspect_ref_id is None:
            parent_aspect_ref_id = get_root_aspect_id()

        result = aspect_create_sync(
            client=logged_in_client,
            body=AspectCreateArgs(
                name=name,
                parent_aspect_ref_id=parent_aspect_ref_id,
            ),
        )
        return get_parsed_from_response(AspectCreateResult, result).new_aspect

    return _create_aspect


@pytest.fixture(autouse=True, scope="module")
def create_chapter(
    logged_in_client: AuthenticatedClient,
    get_root_aspect_id: Callable[[], str],
):
    def _create_chapter(
        name: str,
        start_date: str = "absolute-year-month-day 2021 01 01",
        end_date: str = "absolute-year-month-day 2031 01 01",
        aspect_ref_id: str | None = None,
    ) -> Chapter:
        if aspect_ref_id is None:
            aspect_ref_id = get_root_aspect_id()

        result = chapter_create_sync(
            client=logged_in_client,
            body=ChapterCreateArgs(
                name=name,
                aspect_ref_id=aspect_ref_id,
                start_date=start_date,
                end_date=end_date,
            ),
        )
        return get_parsed_from_response(ChapterCreateResult, result).new_chapter

    return _create_chapter


@pytest.fixture(autouse=True, scope="module")
def create_goal(
    logged_in_client: AuthenticatedClient,
    get_root_aspect_id: Callable[[], str],
):
    def _create_goal(
        name: str,
        start_date: str = "2021-01-01",
        end_date: str = "2031-01-01",
        aspect_ref_id: str | None = None,
    ) -> Goal:
        if aspect_ref_id is None:
            aspect_ref_id = get_root_aspect_id()

        goal_create_args = GoalCreateArgs(
            name=name,
            aspect_ref_id=aspect_ref_id,
        )
        goal_create_args["start_date"] = start_date
        goal_create_args["end_date"] = end_date

        result = goal_create_sync(
            client=logged_in_client,
            body=goal_create_args,
        )
        return get_parsed_from_response(GoalCreateResult, result).new_goal

    return _create_goal


@pytest.fixture(autouse=True, scope="module")
def create_milestone(
    logged_in_client: AuthenticatedClient,
    get_root_aspect_id: Callable[[], str],
):
    def _create_milestone(
        name: str, date: str = "2030-01-01", aspect_ref_id: str | None = None
    ) -> Milestone:
        if aspect_ref_id is None:
            aspect_ref_id = get_root_aspect_id()

        result = milestone_create_sync(
            client=logged_in_client,
            body=MilestoneCreateArgs(
                name=name,
                date=date,
                aspect_ref_id=aspect_ref_id,
            ),
        )
        return get_parsed_from_response(MilestoneCreateResult, result).new_milestone

    return _create_milestone


@pytest.fixture(autouse=True, scope="module")
def create_vision_draft(logged_in_client: AuthenticatedClient):
    def _create_vision_draft() -> Vision:
        result = vision_create_draft_sync(
            client=logged_in_client,
            body=VisionCreateDraftArgs(),
        )
        return get_parsed_from_response(VisionCreateDraftResult, result).vision

    return _create_vision_draft


def test_webui_life_plan_view_nothing(page: Page) -> None:
    page.goto("/app/workspace/life-plan")

    expect(page.locator("#trunk-panel")).to_contain_text("Life Months")
    expect(page.locator("#trunk-panel")).to_contain_text("Root Aspect")


def test_webui_life_plan_view_all(
    page: Page, create_aspect, create_chapter, create_goal, create_milestone
) -> None:
    aspect = create_aspect("Aspect in Life Plan")
    chapter = create_chapter("Chapter in Life Plan", aspect_ref_id=aspect.ref_id)
    goal = create_goal("Goal in Life Plan", aspect_ref_id=aspect.ref_id)
    milestone = create_milestone("Milestone in Life Plan", aspect_ref_id=aspect.ref_id)

    page.goto("/app/workspace/life-plan")

    expect(page.locator(f"#aspect-{aspect.ref_id}")).to_contain_text(
        "Aspect in Life Plan"
    )
    expect(page.locator("#trunk-panel")).to_contain_text(chapter.name)
    expect(page.locator("#trunk-panel")).to_contain_text(goal.name)
    expect(page.locator("#trunk-panel")).to_contain_text(milestone.name)


def test_webui_life_plan_visions_view_nothing(page: Page) -> None:
    page.goto("/app/workspace/life-plan/visions")

    expect(page.locator("#leaf-panel")).to_contain_text("There are no visions to show")


def test_webui_life_plan_visions_view_all(page: Page, create_vision_draft) -> None:
    vision = create_vision_draft()
    page.goto("/app/workspace/life-plan/visions")

    expect(page.locator(f"#vision-{vision.ref_id}")).to_be_visible()


def test_webui_life_plan_visions_create(page: Page) -> None:
    page.goto("/app/workspace/life-plan/visions")
    page.wait_for_selector("#leaf-panel")
    page.locator("a[id='new-vision']").click()
    page.wait_for_url("**/app/workspace/life-plan/visions/*")

    created_vision_ref_id = page.url.split("/")[-1]
    expect(page.locator(f"#vision-{created_vision_ref_id}")).to_be_visible()


def test_webui_life_plan_visions_mark_active(page: Page, create_vision_draft) -> None:
    vision = create_vision_draft()
    page.goto(f"/app/workspace/life-plan/visions/{vision.ref_id}")
    page.wait_for_selector("#leaf-panel")
    page.locator("#vision-actions button", has_text="Mark as Active").click()
    page.wait_for_url("/app/workspace/life-plan")

    page.goto("/app/workspace/life-plan/visions")
    expect(page.locator(f"#vision-{vision.ref_id}")).to_contain_text("Active")


def test_webui_life_plan_visions_create_new_draft(
    page: Page, create_vision_draft
) -> None:
    old_vision = create_vision_draft()
    page.goto(f"/app/workspace/life-plan/visions/{old_vision.ref_id}")
    page.wait_for_selector("#leaf-panel")
    page.locator("#vision-actions button", has_text="Mark as Active").click()
    page.wait_for_url("/app/workspace/life-plan")

    page.goto("/app/workspace/life-plan/visions")
    page.locator("a[id='new-vision']").click()
    page.wait_for_url("**/app/workspace/life-plan/visions/*")

    new_vision_ref_id = page.url.split("/")[-1]
    expect(page.locator(f"#vision-{new_vision_ref_id}")).to_contain_text("Draft")


def test_webui_life_plan_visions_activate_new_archives_old(
    page: Page, logged_in_client: AuthenticatedClient, create_vision_draft
) -> None:
    old_vision = create_vision_draft()
    page.goto(f"/app/workspace/life-plan/visions/{old_vision.ref_id}")
    page.wait_for_selector("#leaf-panel")
    page.locator("#vision-actions button", has_text="Mark as Active").click()
    page.wait_for_url("/app/workspace/life-plan")

    page.goto("/app/workspace/life-plan/visions")
    page.locator("a[id='new-vision']").click()
    page.wait_for_url("**/app/workspace/life-plan/visions/*")
    new_vision_ref_id = page.url.split("/")[-1]
    page.locator("#vision-actions button", has_text="Mark as Active").click()
    page.wait_for_url("/app/workspace/life-plan")

    old_vision_load_response = vision_load_sync(
        client=logged_in_client,
        body=VisionLoadArgs(
            ref_id=old_vision.ref_id,
            allow_archived=True,
        ),
    )
    old_vision_load = get_parsed_from_response(
        VisionLoadResult, old_vision_load_response
    )
    assert old_vision_load.vision.status == VisionStatus.OLD

    page.goto("/app/workspace/life-plan/visions")
    expect(page.locator(f"#vision-{new_vision_ref_id}")).to_contain_text("Active")


def test_webui_life_plan_aspects_view_all(page: Page, create_aspect) -> None:
    create_aspect("Aspect in Aspects View")
    page.goto("/app/workspace/life-plan/aspects")

    expect(page.locator("#leaf-panel")).to_contain_text("Root Aspect")
    expect(page.locator("#leaf-panel")).to_contain_text("Aspect in Aspects View")


def test_webui_life_plan_aspects_create(
    page: Page,
) -> None:
    page.goto("/app/workspace/life-plan/aspects")
    page.locator("a[id='new-aspect']").click()
    page.locator('input[name="name"]').fill("Aspect Lifecycle Created")
    page.locator("button[id='aspect-create']").click()
    page.wait_for_url("**/app/workspace/life-plan/aspects/*")

    expect(page.locator('input[name="name"]')).to_have_value("Aspect Lifecycle Created")


def test_webui_life_plan_aspects_update(page: Page, create_aspect) -> None:
    aspect = create_aspect("Aspect Lifecycle Initial")
    page.goto(f"/app/workspace/life-plan/aspects/{aspect.ref_id}")
    page.wait_for_selector("#leaf-panel")
    page.locator('input[name="name"]').fill("Aspect Lifecycle Updated")
    page.locator("#aspect-properties button", has_text="Save").click()
    page.wait_for_url(f"/app/workspace/life-plan/aspects/{aspect.ref_id}")

    # Reload to read the persisted value from the server instead of the in-place
    # form state. The aspect update redirects back to the same URL, so the input
    # is not remounted from a fresh mount; a post-save revalidation animation can
    # briefly render stale loader data and freeze the field's defaultValue at the
    # old value, making the in-place assertion flaky. Reloading forces a clean
    # load of the persisted aspect, matching the todo update test pattern.
    page.reload()
    page.wait_for_selector("#leaf-panel")
    expect(page.locator('input[name="name"]')).to_have_value("Aspect Lifecycle Updated")


def test_webui_life_plan_aspects_archive(page: Page, create_aspect) -> None:
    aspect = create_aspect("Aspect Lifecycle Archive")
    page.goto(f"/app/workspace/life-plan/aspects/{aspect.ref_id}")
    page.wait_for_selector("#leaf-panel")
    page.locator("button[id='leaf-entity-archive']").click()
    page.locator("button[id='leaf-entity-archive-confirm']").click()
    page.wait_for_url("/app/workspace/life-plan/aspects")

    page.goto(f"/app/workspace/life-plan/aspects/{aspect.ref_id}")
    expect(page.locator('input[name="name"]')).to_be_disabled()


def test_webui_life_plan_chapters_view_nothing(page: Page) -> None:
    page.goto("/app/workspace/life-plan/chapters")

    expect(page.locator("#leaf-panel")).to_contain_text("There are no chapters to show")


def test_webui_life_plan_chapters_view_all(page: Page, create_chapter) -> None:
    chapter = create_chapter("Chapter in Chapters View")
    page.goto("/app/workspace/life-plan/chapters")

    expect(page.locator(f"#chapter-{chapter.ref_id}")).to_contain_text(chapter.name)


def test_webui_life_plan_chapters_create(
    page: Page,
) -> None:
    page.goto("/app/workspace/life-plan/chapters")
    page.locator("a[id='new-chapter']").click()
    page.locator('input[name="name"]').fill("Chapter Lifecycle Created")
    page.locator('input[name="startDate"]').evaluate(
        "(el) => (el.value = 'absolute-year-month-day 2021 1 1')"
    )
    page.locator('input[name="endDate"]').evaluate(
        "(el) => (el.value = 'absolute-year-month-day 2031 1 1')"
    )
    page.locator("button[id='chapter-create']").click()
    page.wait_for_url("**/app/workspace/life-plan/chapters/*")

    expect(page.locator('input[name="name"]')).to_have_value(
        "Chapter Lifecycle Created"
    )


def test_webui_life_plan_chapters_update(
    page: Page, create_aspect, create_chapter
) -> None:
    aspect = create_aspect("Aspect for Chapter Lifecycle")
    chapter = create_chapter(
        "Chapter Lifecycle Initial",
        aspect_ref_id=aspect.ref_id,
    )
    page.goto(f"/app/workspace/life-plan/chapters/{chapter.ref_id}")
    page.wait_for_selector("#leaf-panel")
    page.locator('input[name="name"]').fill("Chapter Lifecycle Updated")
    page.locator("#chapter-properties button", has_text="Save").click()
    page.wait_for_url(f"/app/workspace/life-plan/chapters/{chapter.ref_id}")

    expect(page.locator('input[name="name"]')).to_have_value(
        "Chapter Lifecycle Updated"
    )
    expect(page.locator(f"#chapter-{chapter.ref_id}")).to_contain_text(
        "Chapter Lifecycle Updated"
    )


def test_webui_life_plan_chapters_archive(
    page: Page, create_aspect, create_chapter
) -> None:
    aspect = create_aspect("Aspect for Chapter Archive")
    chapter = create_chapter(
        "Chapter Lifecycle Archive",
        aspect_ref_id=aspect.ref_id,
    )
    page.goto(f"/app/workspace/life-plan/chapters/{chapter.ref_id}")
    page.wait_for_selector("#leaf-panel")
    page.locator("button[id='leaf-entity-archive']").click()
    page.locator("button[id='leaf-entity-archive-confirm']").click()
    page.wait_for_url("/app/workspace/life-plan/chapters")

    page.goto(f"/app/workspace/life-plan/chapters/{chapter.ref_id}")
    expect(page.locator('input[name="name"]')).to_be_disabled()
    expect(page.locator(f"#chapter-{chapter.ref_id}")).to_have_count(0)


def test_webui_life_plan_goals_view_nothing(page: Page) -> None:
    page.goto("/app/workspace/life-plan/goals")

    expect(page.locator("#leaf-panel")).to_contain_text("There are no goals to show")


def test_webui_life_plan_goals_view_all(page: Page, create_goal) -> None:
    goal = create_goal("Goal in Goals View")
    page.goto("/app/workspace/life-plan/goals")

    expect(page.locator(f"#goal-{goal.ref_id}")).to_contain_text(goal.name)


def test_webui_life_plan_goals_create(
    page: Page,
) -> None:
    page.goto("/app/workspace/life-plan/goals")
    page.locator("a[id='new-goal']").click()
    page.locator('input[name="name"]').fill("Goal Lifecycle Created")
    page.locator("button[id='goal-create']").click()
    page.wait_for_url("**/app/workspace/life-plan/goals/*")

    expect(page.locator('input[name="name"]')).to_have_value("Goal Lifecycle Created")


def test_webui_life_plan_goals_update(page: Page, create_aspect, create_goal) -> None:
    aspect = create_aspect("Aspect for Goal Lifecycle")
    goal = create_goal("Goal Lifecycle Initial", aspect_ref_id=aspect.ref_id)
    page.goto(f"/app/workspace/life-plan/goals/{goal.ref_id}")
    page.wait_for_selector("#leaf-panel")
    page.locator('input[name="name"]').fill("Goal Lifecycle Updated")
    page.locator("#goal-properties button", has_text="Save").click()
    page.wait_for_load_state("networkidle")
    page.reload()
    page.wait_for_selector("#leaf-panel")

    expect(page.locator('input[name="name"]')).to_have_value("Goal Lifecycle Updated")
    expect(page.locator(f"#goal-{goal.ref_id}")).to_contain_text(
        "Goal Lifecycle Updated"
    )


def test_webui_life_plan_goals_archive(page: Page, create_aspect, create_goal) -> None:
    aspect = create_aspect("Aspect for Goal Archive")
    goal = create_goal("Goal Lifecycle Archive", aspect_ref_id=aspect.ref_id)
    page.goto(f"/app/workspace/life-plan/goals/{goal.ref_id}")
    page.wait_for_selector("#leaf-panel")
    page.locator("button[id='leaf-entity-archive']").click()
    page.locator("button[id='leaf-entity-archive-confirm']").click()
    page.wait_for_url("/app/workspace/life-plan/goals")

    page.goto(f"/app/workspace/life-plan/goals/{goal.ref_id}")
    expect(page.locator('input[name="name"]')).to_be_disabled()
    expect(page.locator(f"#goal-{goal.ref_id}")).to_have_count(0)


def test_webui_life_plan_milestones_view_nothing(page: Page) -> None:
    page.goto("/app/workspace/life-plan/milestones")

    expect(page.locator("#leaf-panel")).to_contain_text(
        "There are no milestones to show"
    )


def test_webui_life_plan_milestones_view_all(page: Page, create_milestone) -> None:
    milestone = create_milestone("Milestone in Milestones View")
    page.goto("/app/workspace/life-plan/milestones")

    expect(page.locator(f"#milestone-{milestone.ref_id}")).to_contain_text(
        milestone.name
    )


def test_webui_life_plan_milestones_create(
    page: Page,
) -> None:
    page.goto("/app/workspace/life-plan/milestones")
    page.locator("a[id='new-milestone']").click()
    page.locator('input[name="name"]').fill("Milestone Lifecycle Created")
    page.locator('input[name="date"]').fill("2032-01-01")
    page.locator("button[id='milestone-create']").click()
    page.wait_for_url("**/app/workspace/life-plan/milestones/*")

    expect(page.locator('input[name="name"]')).to_have_value(
        "Milestone Lifecycle Created"
    )


def test_webui_life_plan_milestones_update(
    page: Page, create_aspect, create_milestone
) -> None:
    aspect = create_aspect("Aspect for Milestone Lifecycle")
    milestone = create_milestone(
        "Milestone Lifecycle Initial",
        date="2032-01-01",
        aspect_ref_id=aspect.ref_id,
    )
    page.goto(f"/app/workspace/life-plan/milestones/{milestone.ref_id}")
    page.wait_for_selector("#leaf-panel")
    page.locator('input[name="name"]').fill("Milestone Lifecycle Updated")
    page.locator("#milestone-properties button", has_text="Save").click()
    page.wait_for_url(f"/app/workspace/life-plan/milestones/{milestone.ref_id}")

    expect(page.locator('input[name="name"]')).to_have_value(
        "Milestone Lifecycle Updated"
    )


def test_webui_life_plan_milestones_archive(
    page: Page, create_aspect, create_milestone
) -> None:
    aspect = create_aspect("Aspect for Milestone Archive")
    milestone = create_milestone(
        "Milestone Lifecycle Archive",
        date="2032-01-01",
        aspect_ref_id=aspect.ref_id,
    )
    page.goto(f"/app/workspace/life-plan/milestones/{milestone.ref_id}")
    page.wait_for_selector("#leaf-panel")
    page.locator("button[id='leaf-entity-archive']").click()
    page.locator("button[id='leaf-entity-archive-confirm']").click()
    page.wait_for_url("/app/workspace/life-plan/milestones")

    page.goto(f"/app/workspace/life-plan/milestones/{milestone.ref_id}")
    expect(page.locator('input[name="name"]')).to_be_disabled()


def test_webui_life_plan_history_of_work_view(page: Page) -> None:
    page.goto("/app/workspace/life-plan/history-of-work")

    expect(page.locator("#branch-panel")).to_contain_text("History of Work")
    expect(page.locator("#branch-panel")).to_contain_text("Root Aspect")


def test_webui_life_plan_history_of_work_view_all_features_enabled(
    page: Page, logged_in_client: AuthenticatedClient, create_aspect, create_goal
) -> None:
    try:
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(feature=WorkspaceFeature.HABITS, value=True),
        )
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(feature=WorkspaceFeature.CHORES, value=True),
        )
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.BIG_PLANS, value=True
            ),
        )

        aspect = create_aspect("Aspect in History of Work")
        goal = create_goal("Goal in History of Work", aspect_ref_id=aspect.ref_id)

        habit = get_parsed_from_response(
            HabitCreateResult,
            habit_create_sync(
                client=logged_in_client,
                body=HabitCreateArgs(
                    name="Habit in History of Work",
                    period=RecurringTaskPeriod.DAILY,
                    is_key=False,
                    eisen=Eisen.REGULAR,
                    difficulty=Difficulty.MEDIUM,
                    aspect_ref_id=aspect.ref_id,
                    goal_ref_id=goal.ref_id,
                ),
            ),
        ).new_habit

        chore = get_parsed_from_response(
            ChoreCreateResult,
            chore_create_sync(
                client=logged_in_client,
                body=ChoreCreateArgs(
                    name="Chore in History of Work",
                    period=RecurringTaskPeriod.WEEKLY,
                    is_key=False,
                    eisen=Eisen.REGULAR,
                    difficulty=Difficulty.MEDIUM,
                    must_do=False,
                    aspect_ref_id=aspect.ref_id,
                    goal_ref_id=goal.ref_id,
                ),
            ),
        ).new_chore

        big_plan = get_parsed_from_response(
            BigPlanCreateResult,
            big_plan_create_sync(
                client=logged_in_client,
                body=BigPlanCreateArgs(
                    name="Big Plan in History of Work",
                    is_key=False,
                    eisen=Eisen.REGULAR,
                    difficulty=Difficulty.MEDIUM,
                    aspect_ref_id=aspect.ref_id,
                    goal_ref_id=goal.ref_id,
                ),
            ),
        ).new_big_plan

        page.goto("/app/workspace/life-plan/history-of-work")

        expect(page.locator("#branch-panel")).to_contain_text(habit.name)
        expect(page.locator("#branch-panel")).to_contain_text(chore.name)
        expect(page.locator("#branch-panel")).to_contain_text(big_plan.name)
    finally:
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.BIG_PLANS, value=False
            ),
        )
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(feature=WorkspaceFeature.CHORES, value=False),
        )


def test_webui_life_plan_settings_view(page: Page) -> None:
    page.goto("/app/workspace/life-plan/settings")

    expect(page.locator("#branch-panel")).to_contain_text("Settings")
    expect(page.locator("#branch-panel")).to_contain_text("Eval Settings")
    expect(page.locator("#branch-panel")).to_contain_text("Generated Eval Tasks")
