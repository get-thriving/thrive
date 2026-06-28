"""Tests for email and slack push integration ACL."""

from collections.abc import Iterator

import pytest
from jupiter_webapi_client.api.test_helper.create_email_task_for_test import (
    sync_detailed as create_email_task_for_test_sync,
)
from jupiter_webapi_client.api.test_helper.create_slack_task_for_test import (
    sync_detailed as create_slack_task_for_test_sync,
)
from jupiter_webapi_client.api.test_helper.workspace_set_feature import (
    sync_detailed as workspace_set_feature_sync,
)
from jupiter_webapi_client.client import AuthenticatedClient
from jupiter_webapi_client.models.create_email_task_for_test_args import (
    CreateEmailTaskForTestArgs,
)
from jupiter_webapi_client.models.create_email_task_for_test_result import (
    CreateEmailTaskForTestResult,
)
from jupiter_webapi_client.models.create_slack_task_for_test_args import (
    CreateSlackTaskForTestArgs,
)
from jupiter_webapi_client.models.create_slack_task_for_test_result import (
    CreateSlackTaskForTestResult,
)
from jupiter_webapi_client.models.email_task import EmailTask
from jupiter_webapi_client.models.slack_task import SlackTask
from jupiter_webapi_client.models.workspace_feature import WorkspaceFeature
from jupiter_webapi_client.models.workspace_set_feature_args import (
    WorkspaceSetFeatureArgs,
)
from playwright.sync_api import Page, expect

from itests.helpers import get_parsed_from_response
from itests.webui.entities.conftest import AnotherUserAndWorkspace


@pytest.fixture(autouse=True, scope="module")
def _enable_push_integration_features(logged_in_client: AuthenticatedClient):
    try:
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.EMAIL_TASKS, value=True
            ),
        )
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.SLACK_TASKS, value=True
            ),
        )
        yield
    finally:
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.EMAIL_TASKS, value=False
            ),
        )
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.SLACK_TASKS, value=False
            ),
        )


@pytest.fixture()
def create_email_task(logged_in_client: AuthenticatedClient):
    def _create_email_task(subject: str) -> EmailTask:
        result = create_email_task_for_test_sync(
            client=logged_in_client,
            body=CreateEmailTaskForTestArgs(subject=subject),
        )
        return get_parsed_from_response(
            CreateEmailTaskForTestResult, result
        ).new_email_task

    return _create_email_task


@pytest.fixture()
def create_slack_task(logged_in_client: AuthenticatedClient):
    def _create_slack_task(message: str) -> SlackTask:
        result = create_slack_task_for_test_sync(
            client=logged_in_client,
            body=CreateSlackTaskForTestArgs(message=message),
        )
        return get_parsed_from_response(
            CreateSlackTaskForTestResult, result
        ).new_slack_task

    return _create_slack_task


@pytest.fixture()
def another_user_with_push_integrations_enabled(
    webapi_url: str,
    another_user_and_workspace: AnotherUserAndWorkspace,
) -> Iterator[AnotherUserAndWorkspace]:
    def make_client() -> AuthenticatedClient:
        return AuthenticatedClient(
            base_url=webapi_url,
            token=another_user_and_workspace.init_result.auth_token_ext,
        )

    try:
        workspace_set_feature_sync(
            client=make_client(),
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.EMAIL_TASKS, value=True
            ),
        )
        workspace_set_feature_sync(
            client=make_client(),
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.SLACK_TASKS, value=True
            ),
        )
        yield another_user_and_workspace
    finally:
        workspace_set_feature_sync(
            client=make_client(),
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.EMAIL_TASKS, value=False
            ),
        )
        workspace_set_feature_sync(
            client=make_client(),
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.SLACK_TASKS, value=False
            ),
        )


@pytest.mark.skip(reason="Not implemented")
def test_webui_email_task_acl(
    page: Page,
    create_email_task,
    another_user_with_push_integrations_enabled: AnotherUserAndWorkspace,
) -> None:
    email_task = create_email_task("ACL Email Subject")
    other_user = another_user_with_push_integrations_enabled.user
    subject_snippet = "ACL Email Subject"

    page.locator("#account-menu").click()
    page.locator("#logout").click()
    page.wait_for_url("/app/lifecycle/login/local/login")

    page.locator('input[name="emailAddress"]').fill(other_user.email)
    page.locator('input[name="password"]').fill(other_user.password)
    page.locator("#login").locator("button", has_text="Login").click()
    page.wait_for_url("/app/workspace")

    page.goto("/app/workspace/push-integrations/email-tasks")
    expect(page.locator(f"#email-task-{email_task.ref_id}")).to_have_count(0)
    expect(page.locator("#trunk-panel")).not_to_contain_text(subject_snippet)

    page.goto(f"/app/workspace/push-integrations/email-tasks/{email_task.ref_id}")
    expect(page.locator("body")).to_contain_text(
        f"There was an error loading email task #{email_task.ref_id}! Please try again!"
    )


@pytest.mark.skip(reason="Not implemented")
def test_webui_slack_task_acl(
    page: Page,
    create_slack_task,
    another_user_with_push_integrations_enabled: AnotherUserAndWorkspace,
) -> None:
    slack_task = create_slack_task("ACL Slack Message")
    other_user = another_user_with_push_integrations_enabled.user

    page.locator("#account-menu").click()
    page.locator("#logout").click()
    page.wait_for_url("/app/lifecycle/login/local/login")

    page.locator('input[name="emailAddress"]').fill(other_user.email)
    page.locator('input[name="password"]').fill(other_user.password)
    page.locator("#login").locator("button", has_text="Login").click()
    page.wait_for_url("/app/workspace")

    page.goto("/app/workspace/push-integrations/slack-tasks")
    expect(page.locator(f"#slack-task-{slack_task.ref_id}")).to_have_count(0)
    expect(page.locator("#trunk-panel")).not_to_contain_text("ACL Slack Message")

    page.goto(f"/app/workspace/push-integrations/slack-tasks/{slack_task.ref_id}")
    expect(page.locator("body")).to_contain_text(
        f"There was an error loading slack task #{slack_task.ref_id}! Please try again!"
    )
