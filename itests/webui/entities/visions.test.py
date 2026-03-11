"""Tests about visions.

Visions have a lifecycle: DRAFT -> ACTIVE -> OLD.
- A vision starts as a DRAFT.
- A DRAFT can be marked as ACTIVE.
- When a new vision is marked ACTIVE, the previously active vision becomes OLD.
- Only DRAFT visions can be edited.
- Any vision can be archived or removed.
"""

import pytest
from jupiter_webapi_client.api.life_plan.vision_archive import (
    sync_detailed as vision_archive_sync,
)
from jupiter_webapi_client.api.life_plan.vision_create_draft import (
    sync_detailed as vision_create_draft_sync,
)
from jupiter_webapi_client.api.life_plan.vision_mark_draft_as_active import (
    sync_detailed as vision_mark_active_sync,
)
from jupiter_webapi_client.api.test_helper.workspace_set_feature import (
    sync_detailed as workspace_set_feature_sync,
)
from jupiter_webapi_client.client import AuthenticatedClient
from jupiter_webapi_client.models.vision import Vision
from jupiter_webapi_client.models.vision_archive_args import VisionArchiveArgs
from jupiter_webapi_client.models.vision_create_draft_args import VisionCreateDraftArgs
from jupiter_webapi_client.models.vision_create_draft_result import (
    VisionCreateDraftResult,
)
from jupiter_webapi_client.models.vision_mark_draft_as_active_args import (
    VisionMarkDraftAsActiveArgs,
)
from jupiter_webapi_client.models.vision_status import VisionStatus
from jupiter_webapi_client.models.workspace_feature import WorkspaceFeature
from jupiter_webapi_client.models.workspace_set_feature_args import (
    WorkspaceSetFeatureArgs,
)
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
def create_vision(logged_in_client: AuthenticatedClient):
    def _create() -> Vision:
        result = vision_create_draft_sync(
            client=logged_in_client,
            body=VisionCreateDraftArgs(),
        )
        return get_parsed_from_response(VisionCreateDraftResult, result).vision

    return _create


@pytest.fixture(autouse=True, scope="module")
def activate_vision(logged_in_client: AuthenticatedClient):
    def _activate(ref_id: str) -> None:
        vision_mark_active_sync(
            client=logged_in_client,
            body=VisionMarkDraftAsActiveArgs(ref_id=ref_id),
        )

    return _activate


def test_webui_vision_view_nothing(page: Page) -> None:
    page.goto("/app/workspace/life-plan/visions")

    expect(page.locator("#leaf-panel-content")).to_contain_text(
        "There are no visions to show"
    )


def test_webui_vision_view_all(page: Page, create_vision, activate_vision) -> None:
    draft_vision = create_vision()
    active_vision = create_vision()
    activate_vision(active_vision.ref_id)

    page.goto("/app/workspace/life-plan/visions")

    expect(page.locator(f"#vision-{draft_vision.ref_id}")).to_be_visible()
    expect(page.locator(f"#vision-{active_vision.ref_id}")).to_be_visible()


def test_webui_vision_create_draft(page: Page) -> None:
    # Navigating to new-draft immediately creates a draft and redirects to the detail page
    page.goto("/app/workspace/life-plan/visions/new-draft")

    page.wait_for_url("/app/workspace/life-plan/visions/**")

    # The draft vision detail page shows a "Mark as Active" button
    expect(page.locator("#vision-actions").locator("button", has_text="Mark as Active")).to_be_visible()


def test_webui_vision_mark_active(page: Page, create_vision) -> None:
    vision = create_vision()

    page.goto(f"/app/workspace/life-plan/visions/{vision.ref_id}")

    # Draft vision has an enabled "Mark as Active" button
    mark_active_button = page.locator("#vision-actions").locator(
        "button", has_text="Mark as Active"
    )
    expect(mark_active_button).to_be_enabled()
    mark_active_button.click()

    # After marking as active, the page redirects to the life plan page
    page.wait_for_url("/app/workspace/life-plan")


def test_webui_vision_mark_active_makes_previous_old(
    page: Page, create_vision, activate_vision
) -> None:
    # Create and activate first vision
    first_vision = create_vision()
    activate_vision(first_vision.ref_id)

    # Create a second vision and mark it active via the WebUI
    second_vision = create_vision()

    page.goto(f"/app/workspace/life-plan/visions/{second_vision.ref_id}")
    page.locator("#vision-actions").locator(
        "button", has_text="Mark as Active"
    ).click()
    page.wait_for_url("/app/workspace/life-plan")

    # The first vision should now be OLD and the second ACTIVE
    page.goto("/app/workspace/life-plan/visions")

    # First vision card should show "old" status
    expect(page.locator(f"#vision-{first_vision.ref_id}")).to_contain_text(
        VisionStatus.OLD.value
    )
    # Second vision card should show "active" status
    expect(page.locator(f"#vision-{second_vision.ref_id}")).to_contain_text(
        VisionStatus.ACTIVE.value
    )


def test_webui_vision_active_cannot_be_activated_again(
    page: Page, create_vision, activate_vision
) -> None:
    vision = create_vision()
    activate_vision(vision.ref_id)

    page.goto(f"/app/workspace/life-plan/visions/{vision.ref_id}")

    # Already-active vision should have a disabled "Mark as Active" button
    mark_active_button = page.locator("#vision-actions").locator(
        "button", has_text="Mark as Active"
    )
    expect(mark_active_button).to_be_disabled()


def test_webui_vision_archive(page: Page, create_vision) -> None:
    vision = create_vision()

    page.goto(f"/app/workspace/life-plan/visions/{vision.ref_id}")

    page.locator("#leaf-entity-archive").click()
    page.locator("#leaf-entity-archive-confirm").click()

    page.wait_for_url("/app/workspace/life-plan")

    page.goto("/app/workspace/life-plan/visions")
    expect(page.locator(f"#vision-{vision.ref_id}")).not_to_be_visible()


def test_webui_vision_remove(
    page: Page,
    create_vision,
    logged_in_client: AuthenticatedClient,
) -> None:
    vision = create_vision()
    vision_archive_sync(
        client=logged_in_client,
        body=VisionArchiveArgs(ref_id=vision.ref_id),
    )

    page.goto(f"/app/workspace/life-plan/visions/{vision.ref_id}")

    page.locator("#leaf-entity-archive").click()
    page.locator("#leaf-entity-archive-confirm").click()

    page.wait_for_url("/app/workspace/life-plan")
