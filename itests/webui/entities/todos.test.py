"""Tests about todo tasks."""

import re
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
from jupiter_webapi_client.models.todo_task import TodoTask
from jupiter_webapi_client.models.todo_task_create_args import TodoTaskCreateArgs
from jupiter_webapi_client.models.todo_task_create_result import TodoTaskCreateResult
from jupiter_webapi_client.models.workspace_feature import WorkspaceFeature
from jupiter_webapi_client.models.workspace_set_feature_args import (
    WorkspaceSetFeatureArgs,
)
from playwright.sync_api import Page, expect

from itests.helpers import (
    get_parsed_from_response,
    open_leaf_publish_panel,
    type_entity_note_editor_and_wait_for_save,
)


@pytest.fixture(autouse=True, scope="module")
def _enable_todo_feature(logged_in_client: AuthenticatedClient) -> Iterator[None]:
    try:
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.TODO_TASK,
                value=True,
            ),
        )
        yield
    finally:
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.TODO_TASK,
                value=False,
            ),
        )


@pytest.fixture(autouse=True, scope="module")
def create_todo(logged_in_client: AuthenticatedClient):
    def _create_todo(
        name: str,
        is_key: bool = False,
        eisen: Eisen = Eisen.REGULAR,
        difficulty: Difficulty = Difficulty.MEDIUM,
        actionable_date: str | None = None,
        due_date: str | None = None,
    ) -> TodoTask:
        result = todo_task_create_sync(
            client=logged_in_client,
            body=TodoTaskCreateArgs(
                name=name,
                is_key=is_key,
                eisen=eisen,
                difficulty=difficulty,
                actionable_date=actionable_date,
                due_date=due_date,
            ),
        )
        return get_parsed_from_response(TodoTaskCreateResult, result).new_todo_task

    return _create_todo


def test_webui_todo_view_nothing(page: Page) -> None:
    page.goto("/app/workspace/todos")

    expect(page.locator("#trunk-panel")).to_contain_text(
        "There are no todo tasks to show"
    )


def test_webui_todo_view_all(page: Page, create_todo) -> None:
    create_todo("Todo 1")
    create_todo("Todo 2", True, Eisen.IMPORTANT, Difficulty.HARD)
    create_todo(
        "Todo 3",
        False,
        Eisen.URGENT,
        Difficulty.EASY,
        "2024-01-01",
        "2024-12-31",
    )

    page.goto("/app/workspace/todos")

    expect(page.locator("#trunk-panel")).to_contain_text("Todo 1")
    expect(page.locator("#trunk-panel")).to_contain_text("Todo 2")
    expect(page.locator("#trunk-panel")).to_contain_text("Todo 3")


def test_webui_todo_create(page: Page) -> None:
    page.goto("/app/workspace/todos")
    page.wait_for_selector("#trunk-panel")
    page.locator("a[id='trunk-new-leaf-entity']").click()
    page.wait_for_selector("#leaf-panel")

    page.locator('input[name="name"]').fill("Created Todo")
    page.locator("button[id='todo-create']").click()

    page.wait_for_url(re.compile(r"/app/workspace/todos/[^/]+$"))
    page.wait_for_selector("#leaf-panel")

    expect(page.locator('input[name="name"]')).to_have_value("Created Todo")


def test_webui_todo_update(page: Page, create_todo) -> None:
    todo = create_todo("Original Todo Name")
    page.goto(f"/app/workspace/todos/{todo.ref_id}")
    page.wait_for_selector("#leaf-panel")

    page.locator('input[name="name"]').fill("Updated Todo Name")
    page.locator("button[id='todo-update']").click()

    page.wait_for_url("/app/workspace/todos")

    page.goto(f"/app/workspace/todos/{todo.ref_id}")
    page.wait_for_selector("#leaf-panel")
    expect(page.locator('input[name="name"]')).to_have_value("Updated Todo Name")

    page.reload()
    page.wait_for_selector("#leaf-panel")
    expect(page.locator('input[name="name"]')).to_have_value("Updated Todo Name")


def test_webui_todo_edit_note(page: Page, create_todo) -> None:
    todo = create_todo("Todo With Note")
    page.goto(f"/app/workspace/todos/{todo.ref_id}")
    page.wait_for_selector("#leaf-panel")

    page.locator("button[id='todo-create-note']").click()
    page.wait_for_selector("#entity-block-editor")

    type_entity_note_editor_and_wait_for_save(page, "This is a todo note.")

    expect(
        page.locator('#entity-block-editor [contenteditable="true"]').first
    ).to_contain_text("This is a todo note.")

    page.reload()
    page.wait_for_selector("#leaf-panel")
    expect(
        page.locator('#entity-block-editor [contenteditable="true"]').first
    ).to_contain_text("This is a todo note.")


def test_webui_todo_archive(page: Page, create_todo) -> None:
    todo = create_todo("Todo To Archive")
    page.goto(f"/app/workspace/todos/{todo.ref_id}")
    page.wait_for_selector("#leaf-panel")

    page.locator("button[id='leaf-entity-archive']").click()
    page.locator("button[id='leaf-entity-archive-confirm']").click()

    page.wait_for_url("/app/workspace/todos")

    page.goto(f"/app/workspace/todos/{todo.ref_id}")
    page.wait_for_selector("#leaf-panel")

    expect(page.locator('input[name="name"]')).to_be_disabled()
    expect(page.locator("button[id='todo-update']")).to_be_disabled()
    expect(page.locator("button[id='todo-create-note']")).to_be_disabled()


def test_webui_todo_publish_and_view_public(page: Page, create_todo) -> None:
    todo = create_todo("Published Todo")
    page.goto(f"/app/workspace/todos/{todo.ref_id}")
    page.wait_for_selector("#leaf-panel")

    open_leaf_publish_panel(page, "TodoTask-publish")
    page.locator("button[id='TodoTask-publish-create']").click()
    page.wait_for_url(re.compile(rf"/app/workspace/todos/{todo.ref_id}"))
    page.wait_for_selector("#leaf-panel")

    open_leaf_publish_panel(page, "TodoTask-publish")
    expect(page.locator("#TodoTask-publish")).to_contain_text("draft")

    page.locator("button[id='TodoTask-publish-toggle-status']").click()
    page.wait_for_url(re.compile(rf"/app/workspace/todos/{todo.ref_id}"))
    page.wait_for_selector("#leaf-panel")

    open_leaf_publish_panel(page, "TodoTask-publish")
    expect(page.locator("#TodoTask-publish")).to_contain_text("active")

    public_url = page.locator('input[name="publicUrl"]').input_value()
    assert "/app/public/published/" in public_url

    page.goto(public_url)
    page.wait_for_url(re.compile(r"/app/public/published/todo-task/"))
    page.wait_for_selector("#leaf-panel")

    expect(page.locator('input[name="name"]')).to_have_value("Published Todo")
