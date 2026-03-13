"""Tests about aspects."""

from typing import Callable, cast

import pytest
from jupiter_webapi_client.api.application.get_summaries import (
    sync_detailed as get_summaries_sync,
)
from jupiter_webapi_client.api.life_plan.aspect_create import (
    sync_detailed as aspect_create_sync,
)
from jupiter_webapi_client.api.test_helper.workspace_set_feature import (
    sync_detailed as workspace_set_feature_sync,
)
from jupiter_webapi_client.client import AuthenticatedClient
from jupiter_webapi_client.models.aspect import Aspect
from jupiter_webapi_client.models.aspect_create_args import AspectCreateArgs
from jupiter_webapi_client.models.aspect_create_result import AspectCreateResult
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
def _enable_aspects_feature(logged_in_client: AuthenticatedClient):
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


def test_webui_aspect_view_nothing(page: Page) -> None:
    page.goto("/app/workspace/life-plan")

    # Aspects always has at least the root aspect, so we check for the root aspect instead
    expect(page.locator("#trunk-panel")).to_contain_text("Root Aspect")


def test_webui_aspect_view_all(page: Page, create_aspect) -> None:
    aspect1 = create_aspect("Aspect 1")
    aspect2 = create_aspect("Aspect 2")
    aspect3 = create_aspect("Aspect 3", aspect1.ref_id)

    page.goto("/app/workspace/life-plan")

    expect(page.locator(f"#aspect-{aspect1.ref_id}")).to_contain_text("Aspect 1")
    expect(page.locator(f"#aspect-{aspect2.ref_id}")).to_contain_text("Aspect 2")
    expect(page.locator(f"#aspect-{aspect3.ref_id}")).to_contain_text("Aspect 3")
