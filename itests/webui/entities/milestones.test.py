"""Tests about milestones."""

from typing import Callable, cast

import pytest
from jupiter_webapi_client.api.application.get_summaries import (
    sync_detailed as get_summaries_sync,
)
from jupiter_webapi_client.api.life_plan.milestone_archive import (
    sync_detailed as milestone_archive_sync,
)
from jupiter_webapi_client.api.life_plan.milestone_create import (
    sync_detailed as milestone_create_sync,
)
from jupiter_webapi_client.api.test_helper.workspace_set_feature import (
    sync_detailed as workspace_set_feature_sync,
)
from jupiter_webapi_client.client import AuthenticatedClient
from jupiter_webapi_client.models.get_summaries_args import GetSummariesArgs
from jupiter_webapi_client.models.get_summaries_result import GetSummariesResult
from jupiter_webapi_client.models.milestone import Milestone
from jupiter_webapi_client.models.milestone_archive_args import MilestoneArchiveArgs
from jupiter_webapi_client.models.milestone_create_args import MilestoneCreateArgs
from jupiter_webapi_client.models.milestone_create_result import MilestoneCreateResult
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
def create_milestone(
    logged_in_client: AuthenticatedClient,
    root_project_ref_id: Callable[[], str],
):
    def _create_milestone(
        name: str,
        date: str = "2024-06-15",
        project_ref_id: str | None = None,
    ) -> Milestone:
        if project_ref_id is None:
            project_ref_id = root_project_ref_id()

        result = milestone_create_sync(
            client=logged_in_client,
            body=MilestoneCreateArgs(
                name=name,
                date=date,
                project_ref_id=project_ref_id,
            ),
        )
        return get_parsed_from_response(MilestoneCreateResult, result).new_milestone

    return _create_milestone


def test_webui_milestone_view_nothing(page: Page) -> None:
    page.goto("/app/workspace/life-plan/milestones")

    expect(page.locator("#leaf-panel-content")).to_contain_text(
        "There are no milestones to show"
    )


def test_webui_milestone_view_all(
    page: Page, create_milestone: Callable[..., Milestone]
) -> None:
    milestone1 = create_milestone("Milestone 1", "2024-01-15")
    milestone2 = create_milestone("Milestone 2", "2024-06-15")
    milestone3 = create_milestone("Milestone 3", "2024-12-15")

    page.goto("/app/workspace/life-plan/milestones")

    expect(page.locator(f"#milestone-{milestone1.ref_id}")).to_contain_text(
        "Milestone 1"
    )
    expect(page.locator(f"#milestone-{milestone2.ref_id}")).to_contain_text(
        "Milestone 2"
    )
    expect(page.locator(f"#milestone-{milestone3.ref_id}")).to_contain_text(
        "Milestone 3"
    )


def test_webui_milestone_create(page: Page) -> None:
    page.goto("/app/workspace/life-plan/milestones/new")

    page.locator('input[name="name"]').fill("New WebUI Milestone")
    # The date field defaults to today, so we just submit
    page.locator("#milestone-create").click()

    page.wait_for_url("/app/workspace/life-plan/milestones/**")

    expect(page.locator("#leaf-panel-content")).to_contain_text("New WebUI Milestone")


def test_webui_milestone_update(
    page: Page,
    create_milestone: Callable[..., Milestone],
) -> None:
    milestone = create_milestone("Milestone To Update")

    page.goto(f"/app/workspace/life-plan/milestones/{milestone.ref_id}")

    page.locator('input[name="name"]').fill("Updated Milestone Name")
    page.locator("#milestone-properties").locator("button", has_text="Save").click()

    page.wait_for_url(f"/app/workspace/life-plan/milestones/{milestone.ref_id}")

    expect(page.locator("#leaf-panel-content")).to_contain_text(
        "Updated Milestone Name"
    )


def test_webui_milestone_archive(
    page: Page,
    create_milestone: Callable[..., Milestone],
) -> None:
    milestone = create_milestone("Milestone To Archive")

    page.goto(f"/app/workspace/life-plan/milestones/{milestone.ref_id}")

    page.locator("#leaf-entity-archive").click()
    page.locator("#leaf-entity-archive-confirm").click()

    page.wait_for_url("/app/workspace/life-plan/milestones")

    expect(page.locator(f"#milestone-{milestone.ref_id}")).not_to_be_visible()


def test_webui_milestone_remove(
    page: Page,
    create_milestone: Callable[..., Milestone],
    logged_in_client: AuthenticatedClient,
) -> None:
    milestone = create_milestone("Milestone To Remove")
    milestone_archive_sync(
        client=logged_in_client,
        body=MilestoneArchiveArgs(ref_id=milestone.ref_id),
    )

    page.goto(f"/app/workspace/life-plan/milestones/{milestone.ref_id}")

    page.locator("#leaf-entity-archive").click()
    page.locator("#leaf-entity-archive-confirm").click()

    page.wait_for_url("/app/workspace/life-plan/milestones")
