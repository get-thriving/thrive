"""Tests about chapters."""

from typing import Callable, cast

import pytest
from jupiter_webapi_client.api.application.get_summaries import (
    sync_detailed as get_summaries_sync,
)
from jupiter_webapi_client.api.life_plan.chapter_archive import (
    sync_detailed as chapter_archive_sync,
)
from jupiter_webapi_client.api.life_plan.chapter_create import (
    sync_detailed as chapter_create_sync,
)
from jupiter_webapi_client.api.test_helper.workspace_set_feature import (
    sync_detailed as workspace_set_feature_sync,
)
from jupiter_webapi_client.client import AuthenticatedClient
from jupiter_webapi_client.models.chapter import Chapter
from jupiter_webapi_client.models.chapter_archive_args import ChapterArchiveArgs
from jupiter_webapi_client.models.chapter_create_args import ChapterCreateArgs
from jupiter_webapi_client.models.chapter_create_result import ChapterCreateResult
from jupiter_webapi_client.models.get_summaries_args import GetSummariesArgs
from jupiter_webapi_client.models.get_summaries_result import GetSummariesResult
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
def create_chapter(
    logged_in_client: AuthenticatedClient,
    root_project_ref_id: Callable[[], str],
):
    def _create_chapter(
        name: str,
        project_ref_id: str | None = None,
        start_date: str = "absolute-year-month-day 2024 1 1",
        end_date: str = "absolute-year-month-day 2024 12 31",
    ) -> Chapter:
        if project_ref_id is None:
            project_ref_id = root_project_ref_id()

        result = chapter_create_sync(
            client=logged_in_client,
            body=ChapterCreateArgs(
                name=name,
                project_ref_id=project_ref_id,
                start_date=start_date,
                end_date=end_date,
            ),
        )
        return get_parsed_from_response(ChapterCreateResult, result).new_chapter

    return _create_chapter


def test_webui_chapter_view_nothing(page: Page) -> None:
    page.goto("/app/workspace/life-plan/chapters")

    expect(page.locator("#leaf-panel-content")).to_contain_text(
        "There are no chapters to show"
    )


def test_webui_chapter_view_all(
    page: Page, create_chapter: Callable[..., Chapter]
) -> None:
    chapter1 = create_chapter("Chapter 1")
    chapter2 = create_chapter("Chapter 2")
    chapter3 = create_chapter("Chapter 3")

    page.goto("/app/workspace/life-plan/chapters")

    expect(page.locator(f"#chapter-{chapter1.ref_id}")).to_contain_text("Chapter 1")
    expect(page.locator(f"#chapter-{chapter2.ref_id}")).to_contain_text("Chapter 2")
    expect(page.locator(f"#chapter-{chapter3.ref_id}")).to_contain_text("Chapter 3")


def test_webui_chapter_create(page: Page) -> None:
    page.goto("/app/workspace/life-plan/chapters/new")

    page.locator('input[name="name"]').fill("New WebUI Chapter")

    # Use "Present" for start date and "End" for end date to avoid complex date selection
    page.locator("#startDate-baseType").locator("button", has_text="Present").click()
    page.locator("#endDate-baseType").locator("button", has_text="End").click()

    page.locator("#chapter-create").click()

    page.wait_for_url("/app/workspace/life-plan/chapters/**")

    expect(page.locator("#leaf-panel-content")).to_contain_text("New WebUI Chapter")


def test_webui_chapter_update(
    page: Page,
    create_chapter: Callable[..., Chapter],
) -> None:
    chapter = create_chapter("Chapter To Update")

    page.goto(f"/app/workspace/life-plan/chapters/{chapter.ref_id}")

    page.locator('input[name="name"]').fill("Updated Chapter Name")
    page.locator("#chapter-properties").locator("button", has_text="Save").click()

    page.wait_for_url(f"/app/workspace/life-plan/chapters/{chapter.ref_id}")

    expect(page.locator("#leaf-panel-content")).to_contain_text("Updated Chapter Name")


def test_webui_chapter_archive(
    page: Page,
    create_chapter: Callable[..., Chapter],
) -> None:
    chapter = create_chapter("Chapter To Archive")

    page.goto(f"/app/workspace/life-plan/chapters/{chapter.ref_id}")

    page.locator("#leaf-entity-archive").click()
    page.locator("#leaf-entity-archive-confirm").click()

    page.wait_for_url("/app/workspace/life-plan/chapters")

    expect(page.locator(f"#chapter-{chapter.ref_id}")).not_to_be_visible()


def test_webui_chapter_remove(
    page: Page,
    create_chapter: Callable[..., Chapter],
    logged_in_client: AuthenticatedClient,
) -> None:
    chapter = create_chapter("Chapter To Remove")
    chapter_archive_sync(
        client=logged_in_client,
        body=ChapterArchiveArgs(ref_id=chapter.ref_id),
    )

    page.goto(f"/app/workspace/life-plan/chapters/{chapter.ref_id}")

    page.locator("#leaf-entity-archive").click()
    page.locator("#leaf-entity-archive-confirm").click()

    page.wait_for_url("/app/workspace/life-plan/chapters")
