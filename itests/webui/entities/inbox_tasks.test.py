"""Tests about inbox tasks."""

from collections.abc import Iterator

import pytest
from jupiter_webapi_client.api.test_helper.workspace_set_feature import (
    sync_detailed as workspace_set_feature_sync,
)
from jupiter_webapi_client.api.todo.todo_task_create import (
    sync_detailed as todo_task_create_sync,
)
from jupiter_webapi_client.client import AuthenticatedClient
from jupiter_webapi_client.models.difficulty import Difficulty
from jupiter_webapi_client.models.eisen import Eisen
from jupiter_webapi_client.models.inbox_task import InboxTask
from jupiter_webapi_client.models.todo_task_create_args import TodoTaskCreateArgs
from jupiter_webapi_client.models.todo_task_create_result import TodoTaskCreateResult
from jupiter_webapi_client.models.workspace_feature import WorkspaceFeature
from jupiter_webapi_client.models.workspace_set_feature_args import (
    WorkspaceSetFeatureArgs,
)
from playwright.sync_api import Page, expect

from itests.helpers import get_parsed_from_response


@pytest.fixture(autouse=True, scope="module")
def _enable_todo_feature(logged_in_client: AuthenticatedClient) -> Iterator[None]:
    try:
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.TODO_TASK, value=True
            ),
        )
        yield
    finally:
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.TODO_TASK, value=False
            ),
        )


@pytest.fixture(autouse=True, scope="module")
def create_inbox_task(logged_in_client: AuthenticatedClient):
    def _create_inbox_task(
        name: str,
        eisen: Eisen,
        difficulty: Difficulty,
    ) -> InboxTask:
        result = todo_task_create_sync(
            client=logged_in_client,
            body=TodoTaskCreateArgs(
                name=name,
                is_key=False,
                eisen=eisen,
                difficulty=difficulty,
            ),
        )
        return get_parsed_from_response(TodoTaskCreateResult, result).new_inbox_task

    return _create_inbox_task


def test_webui_inbox_task_view_nothing(page: Page) -> None:
    page.goto("/app/workspace/inbox-tasks")

    expect(page.locator("#trunk-panel")).to_contain_text("You have to start somewhere")


def test_webui_inbox_task_view_all(page: Page, create_inbox_task) -> None:
    inbox_task1 = create_inbox_task("Inbox Task 1", Eisen.REGULAR, Difficulty.EASY)
    inbox_task2 = create_inbox_task("Inbox Task 2", Eisen.REGULAR, Difficulty.EASY)
    inbox_task3 = create_inbox_task("Inbox Task 3", Eisen.REGULAR, Difficulty.EASY)

    page.goto("/app/workspace/inbox-tasks")

    expect(page.locator(f"#inbox-task-{inbox_task1.ref_id}")).to_contain_text(
        "Inbox Task 1"
    )
    expect(page.locator(f"#inbox-task-{inbox_task2.ref_id}")).to_contain_text(
        "Inbox Task 2"
    )
    expect(page.locator(f"#inbox-task-{inbox_task3.ref_id}")).to_contain_text(
        "Inbox Task 3"
    )
