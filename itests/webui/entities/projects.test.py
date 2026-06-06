"""Tests about projects."""

import pytest
from jupiter_webapi_client.api.projects.project_create import (
    sync_detailed as project_create_sync,
)
from jupiter_webapi_client.api.test_helper.workspace_set_feature import (
    sync_detailed as workspace_set_feature_sync,
)
from jupiter_webapi_client.client import AuthenticatedClient
from jupiter_webapi_client.models.project import Project
from jupiter_webapi_client.models.project_create_args import ProjectCreateArgs
from jupiter_webapi_client.models.project_create_result import ProjectCreateResult
from jupiter_webapi_client.models.difficulty import Difficulty
from jupiter_webapi_client.models.eisen import Eisen
from jupiter_webapi_client.models.time_plan_activity_feasability import (
    TimePlanActivityFeasability,
)
from jupiter_webapi_client.models.time_plan_activity_kind import TimePlanActivityKind
from jupiter_webapi_client.models.workspace_feature import WorkspaceFeature
from jupiter_webapi_client.models.workspace_set_feature_args import (
    WorkspaceSetFeatureArgs,
)
from playwright.sync_api import Page, expect

from itests.helpers import get_parsed_from_response


@pytest.fixture(autouse=True, scope="module")
def _enable_projects_feature(logged_in_client: AuthenticatedClient):
    try:
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.PROJECTS, value=True
            ),
        )
        yield
    finally:
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.PROJECTS, value=False
            ),
        )


@pytest.fixture(autouse=True, scope="module")
def create_project(logged_in_client: AuthenticatedClient):
    def _create_project(
        name: str,
        is_key: bool = False,
        eisen: Eisen = Eisen.REGULAR,
        difficulty: Difficulty = Difficulty.MEDIUM,
        actionable_date: str | None = None,
        due_date: str | None = None,
        time_plan_activity_kind: TimePlanActivityKind | None = None,
        time_plan_activity_feasability: TimePlanActivityFeasability | None = None,
    ) -> Project:
        result = project_create_sync(
            client=logged_in_client,
            body=ProjectCreateArgs(
                name=name,
                is_key=is_key,
                eisen=eisen,
                difficulty=difficulty,
                actionable_date=actionable_date,
                due_date=due_date,
                time_plan_activity_kind=time_plan_activity_kind,
                time_plan_activity_feasability=time_plan_activity_feasability,
            ),
        )
        return get_parsed_from_response(ProjectCreateResult, result).new_project

    return _create_project


def test_webui_project_view_nothing(page: Page) -> None:
    page.goto("/app/workspace/projects")

    expect(page.locator("#trunk-panel")).to_contain_text(
        "There are no projects to show"
    )


def test_webui_project_view_all(page: Page, create_project) -> None:
    project1 = create_project("Project 1", False, Eisen.REGULAR, Difficulty.MEDIUM)
    project2 = create_project(
        "Project 2", True, Eisen.IMPORTANT, Difficulty.HARD, "2024-01-01", "2024-12-31"
    )
    project3 = create_project(
        "Project 3",
        False,
        Eisen.URGENT,
        Difficulty.EASY,
        None,
        "2024-06-30",
        TimePlanActivityKind.MAKE_PROGRESS,
        TimePlanActivityFeasability.MUST_DO,
    )

    page.goto("/app/workspace/projects")

    expect(page.locator(f"#project-{project1.ref_id}")).to_contain_text("Project 1")
    expect(page.locator(f"#project-{project2.ref_id}")).to_contain_text("Project 2")
    expect(page.locator(f"#project-{project3.ref_id}")).to_contain_text("Project 3")
