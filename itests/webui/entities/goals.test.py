"""Tests about goals."""

from typing import Callable, cast

import pytest
from jupiter_webapi_client.api.application.get_summaries import (
    sync_detailed as get_summaries_sync,
)
from jupiter_webapi_client.api.life_plan.goal_archive import (
    sync_detailed as goal_archive_sync,
)
from jupiter_webapi_client.api.life_plan.goal_create import (
    sync_detailed as goal_create_sync,
)
from jupiter_webapi_client.api.test_helper.workspace_set_feature import (
    sync_detailed as workspace_set_feature_sync,
)
from jupiter_webapi_client.client import AuthenticatedClient
from jupiter_webapi_client.models.get_summaries_args import GetSummariesArgs
from jupiter_webapi_client.models.get_summaries_result import GetSummariesResult
from jupiter_webapi_client.models.goal import Goal
from jupiter_webapi_client.models.goal_archive_args import GoalArchiveArgs
from jupiter_webapi_client.models.goal_create_args import GoalCreateArgs
from jupiter_webapi_client.models.goal_create_result import GoalCreateResult
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
def root_project_ref_id(logged_in_client: AuthenticatedClient) -> Callable[[], str]:
    def _get() -> str:
        response = get_summaries_sync(
            client=logged_in_client,
            body=GetSummariesArgs(include_projects=True),
        )
        root_project = get_parsed_from_response(
            GetSummariesResult, response
        ).root_project
        if root_project is None or isinstance(root_project, Unset):
            raise ValueError("Root project is None")
        return cast(str, root_project.ref_id)

    return _get


@pytest.fixture(autouse=True, scope="module")
def create_goal(
    logged_in_client: AuthenticatedClient,
    root_project_ref_id: Callable[[], str],
):
    def _create_goal(name: str, project_ref_id: str | None = None) -> Goal:
        if project_ref_id is None:
            project_ref_id = root_project_ref_id()

        result = goal_create_sync(
            client=logged_in_client,
            body=GoalCreateArgs(
                name=name,
                project_ref_id=project_ref_id,
            ),
        )
        return get_parsed_from_response(GoalCreateResult, result).new_goal

    return _create_goal


def test_webui_goal_view_nothing(page: Page) -> None:
    page.goto("/app/workspace/life-plan/goals")

    expect(page.locator("#leaf-panel-content")).to_contain_text(
        "There are no goals to show"
    )


def test_webui_goal_view_all(page: Page, create_goal: Callable[..., Goal]) -> None:
    goal1 = create_goal("Goal 1")
    goal2 = create_goal("Goal 2")
    goal3 = create_goal("Goal 3")

    page.goto("/app/workspace/life-plan/goals")

    expect(page.locator(f"#goal-{goal1.ref_id}")).to_contain_text("Goal 1")
    expect(page.locator(f"#goal-{goal2.ref_id}")).to_contain_text("Goal 2")
    expect(page.locator(f"#goal-{goal3.ref_id}")).to_contain_text("Goal 3")


def test_webui_goal_create(page: Page) -> None:
    page.goto("/app/workspace/life-plan/goals/new")

    page.locator('input[name="name"]').fill("New WebUI Goal")
    page.locator("#goal-create").click()

    page.wait_for_url("/app/workspace/life-plan/goals/**")

    expect(page.locator("#leaf-panel-content")).to_contain_text("New WebUI Goal")


def test_webui_goal_update(
    page: Page,
    create_goal: Callable[..., Goal],
) -> None:
    goal = create_goal("Goal To Update")

    page.goto(f"/app/workspace/life-plan/goals/{goal.ref_id}")

    page.locator('input[name="name"]').fill("Updated Goal Name")
    page.locator("#goal-properties").locator("button", has_text="Save").click()

    page.wait_for_url(f"/app/workspace/life-plan/goals/{goal.ref_id}")

    expect(page.locator("#leaf-panel-content")).to_contain_text("Updated Goal Name")


def test_webui_goal_archive(
    page: Page,
    create_goal: Callable[..., Goal],
) -> None:
    goal = create_goal("Goal To Archive")

    page.goto(f"/app/workspace/life-plan/goals/{goal.ref_id}")

    page.locator("#leaf-entity-archive").click()
    page.locator("#leaf-entity-archive-confirm").click()

    page.wait_for_url("/app/workspace/life-plan/goals")

    expect(page.locator(f"#goal-{goal.ref_id}")).not_to_be_visible()


def test_webui_goal_remove(
    page: Page,
    create_goal: Callable[..., Goal],
    logged_in_client: AuthenticatedClient,
) -> None:
    goal = create_goal("Goal To Remove")
    goal_archive_sync(
        client=logged_in_client,
        body=GoalArchiveArgs(ref_id=goal.ref_id),
    )

    page.goto(f"/app/workspace/life-plan/goals/{goal.ref_id}")

    page.locator("#leaf-entity-archive").click()
    page.locator("#leaf-entity-archive-confirm").click()

    page.wait_for_url("/app/workspace/life-plan/goals")
