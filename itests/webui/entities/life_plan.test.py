"""Tests about life plan views."""

from typing import Callable, cast

import pytest
from jupiter_webapi_client.api.application.get_summaries import (
    sync_detailed as get_summaries_sync,
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
from jupiter_webapi_client.api.test_helper.workspace_set_feature import (
    sync_detailed as workspace_set_feature_sync,
)
from jupiter_webapi_client.client import AuthenticatedClient
from jupiter_webapi_client.models.aspect import Aspect
from jupiter_webapi_client.models.aspect_create_args import AspectCreateArgs
from jupiter_webapi_client.models.aspect_create_result import AspectCreateResult
from jupiter_webapi_client.models.chapter import Chapter
from jupiter_webapi_client.models.chapter_create_args import ChapterCreateArgs
from jupiter_webapi_client.models.chapter_create_result import ChapterCreateResult
from jupiter_webapi_client.models.get_summaries_args import GetSummariesArgs
from jupiter_webapi_client.models.get_summaries_result import GetSummariesResult
from jupiter_webapi_client.models.goal import Goal
from jupiter_webapi_client.models.goal_create_args import GoalCreateArgs
from jupiter_webapi_client.models.goal_create_result import GoalCreateResult
from jupiter_webapi_client.models.milestone import Milestone
from jupiter_webapi_client.models.milestone_create_args import MilestoneCreateArgs
from jupiter_webapi_client.models.milestone_create_result import MilestoneCreateResult
from jupiter_webapi_client.models.vision import Vision
from jupiter_webapi_client.models.vision_create_draft_args import VisionCreateDraftArgs
from jupiter_webapi_client.models.vision_create_draft_result import (
    VisionCreateDraftResult,
)
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
        start_date: str = "2000-01-01",
        end_date: str = "2001-01-01",
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
    def _create_goal(name: str, aspect_ref_id: str | None = None) -> Goal:
        if aspect_ref_id is None:
            aspect_ref_id = get_root_aspect_id()

        result = goal_create_sync(
            client=logged_in_client,
            body=GoalCreateArgs(
                name=name,
                aspect_ref_id=aspect_ref_id,
            ),
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


def test_webui_life_plan_aspects_view_all(page: Page, create_aspect) -> None:
    aspect = create_aspect("Aspect in Aspects View")
    page.goto("/app/workspace/life-plan/aspects")

    expect(page.locator("#leaf-panel")).to_contain_text("Root Aspect")
    expect(page.locator(f"#aspect-{aspect.ref_id}")).to_contain_text(
        "Aspect in Aspects View"
    )


def test_webui_life_plan_chapters_view_nothing(page: Page) -> None:
    page.goto("/app/workspace/life-plan/chapters")

    expect(page.locator("#leaf-panel")).to_contain_text("There are no chapters to show")


def test_webui_life_plan_chapters_view_all(page: Page, create_chapter) -> None:
    chapter = create_chapter("Chapter in Chapters View")
    page.goto("/app/workspace/life-plan/chapters")

    expect(page.locator(f"#chapter-{chapter.ref_id}")).to_contain_text(chapter.name)


def test_webui_life_plan_goals_view_nothing(page: Page) -> None:
    page.goto("/app/workspace/life-plan/goals")

    expect(page.locator("#leaf-panel")).to_contain_text("There are no goals to show")


def test_webui_life_plan_goals_view_all(page: Page, create_goal) -> None:
    goal = create_goal("Goal in Goals View")
    page.goto("/app/workspace/life-plan/goals")

    expect(page.locator(f"#goal-{goal.ref_id}")).to_contain_text(goal.name)


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


def test_webui_life_plan_history_of_work_view(page: Page) -> None:
    page.goto("/app/workspace/life-plan/history-of-work")

    expect(page.locator("#branch-panel")).to_contain_text("History of Work")
    expect(page.locator("#branch-panel")).to_contain_text("Root Aspect")


def test_webui_life_plan_settings_view(page: Page) -> None:
    page.goto("/app/workspace/life-plan/settings")

    expect(page.locator("#branch-panel")).to_contain_text("Settings")
    expect(page.locator("#branch-panel")).to_contain_text("Eval Settings")
    expect(page.locator("#branch-panel")).to_contain_text("Generated Eval Tasks")
