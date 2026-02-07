"""Tests for the working mem."""

import time

import pytest
from jupiter_webapi_client.api.test_helper.workspace_set_feature import (
    sync_detailed as workspace_set_feature_sync,
)
from jupiter_webapi_client.client import AuthenticatedClient
from jupiter_webapi_client.models.workspace_feature import WorkspaceFeature
from jupiter_webapi_client.models.workspace_set_feature_args import (
    WorkspaceSetFeatureArgs,
)
from playwright.sync_api import Page, expect


@pytest.fixture(autouse=True, scope="module")
def _enable_working_mem_feature(logged_in_client: AuthenticatedClient):
    try:
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.WORKING_MEM, value=True
            ),
        )
        yield
    finally:
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.WORKING_MEM, value=False
            ),
        )


def test_working_mem_write(page: Page) -> None:
    page.goto("/app/workspace/working-mem")

    expect(page.locator("#trunk-panel")).to_contain_text("Working Mem")

    page.locator('#editorjs div[contenteditable="true"]').first.fill("This is a note.")

    time.sleep(1)

    page.reload()

    expect(page.locator('#editorjs div[contenteditable="true"]').first).to_contain_text(
        "This is a note."
    )
