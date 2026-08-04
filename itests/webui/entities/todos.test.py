"""Tests about todo tasks."""

import re
from collections.abc import Iterator

import pytest
from jupiter_webapi_client.api.application.init import sync_detailed as init_sync
from jupiter_webapi_client.api.application.invite_users_to_entity import (
    sync_detailed as invite_users_to_entity_sync,
)
from jupiter_webapi_client.api.test_helper.remove_all import (
    sync_detailed as remove_all_sync,
)
from jupiter_webapi_client.api.test_helper.workspace_set_feature import (
    sync_detailed as workspace_set_feature_sync,
)
from jupiter_webapi_client.api.todo.todo_task_create import (
    sync_detailed as todo_task_create_sync,
)
from jupiter_webapi_client.client import AuthenticatedClient
from jupiter_webapi_client.models.access_level import AccessLevel
from jupiter_webapi_client.models.difficulty import Difficulty
from jupiter_webapi_client.models.eisen import Eisen
from jupiter_webapi_client.models.init_args import InitArgs
from jupiter_webapi_client.models.init_result import InitResult
from jupiter_webapi_client.models.invite_users_to_entity_args import (
    InviteUsersToEntityArgs,
)
from jupiter_webapi_client.models.named_entity_tag import NamedEntityTag
from jupiter_webapi_client.models.remove_all_args import RemoveAllArgs
from jupiter_webapi_client.models.todo_task import TodoTask
from jupiter_webapi_client.models.todo_task_create_args import TodoTaskCreateArgs
from jupiter_webapi_client.models.todo_task_create_result import TodoTaskCreateResult
from jupiter_webapi_client.models.user_feature import UserFeature
from jupiter_webapi_client.models.workspace_feature import WorkspaceFeature
from jupiter_webapi_client.models.workspace_set_feature_args import (
    WorkspaceSetFeatureArgs,
)
from playwright.sync_api import Page, expect

from itests.conftest import TestUser
from itests.helpers import (
    get_parsed_from_response,
    open_leaf_publish_panel,
    type_entity_note_editor_and_wait_for_save,
)
from itests.webui.entities.conftest import AnotherUserAndWorkspace

_FAKE_TOKEN = "eyJhbGciOiJub25lIn0.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTczNjI5MjEyNH0."  # nosec
_ACCESS_DENIED_LABEL = "You do not have the right access for this entity"


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
    assert "/publish/" in public_url

    page.goto(public_url)
    page.wait_for_url(re.compile(r"/publish/todo-task/"))
    page.wait_for_selector("#leaf-panel")

    expect(page.locator('input[name="name"]')).to_have_value("Published Todo")


@pytest.fixture(scope="module")
def another_user_with_todos_enabled(
    webapi_url: str,
) -> Iterator[AnotherUserAndWorkspace]:
    other_user = TestUser.new_random()
    guest_client = AuthenticatedClient(base_url=webapi_url, token=_FAKE_TOKEN)

    init_response = init_sync(
        client=guest_client,
        body=InitArgs(
            user_email_address=other_user.email,
            user_name=other_user.name,
            user_timezone="UTC",
            user_feature_flags=[UserFeature.GAMIFICATION],
            auth_password=other_user.password,
            auth_password_repeat=other_user.password,
            user_birthday="12 Sep",
            user_birth_year=1990,
            workspace_name="Other Test Workspace",
            workspace_root_aspect_name="Root Aspect",
            workspace_first_schedule_stream_name="Life",
            workspace_feature_flags=[
                WorkspaceFeature.TODO_TASK,
                WorkspaceFeature.HABITS,
                WorkspaceFeature.DOCS,
            ],
        ),
    )

    if init_response.status_code != 200:
        raise Exception(init_response.content)

    init_result = get_parsed_from_response(InitResult, init_response)
    logged_in_client = AuthenticatedClient(
        base_url=webapi_url,
        token=init_result.auth_token_ext,
    )

    try:
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.TODO_TASK,
                value=True,
            ),
        )
        yield AnotherUserAndWorkspace(user=other_user, init_result=init_result)
    finally:
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.TODO_TASK,
                value=False,
            ),
        )
        remove_all_sync(client=logged_in_client, body=RemoveAllArgs())


@pytest.fixture()
def grant_todo_access(
    logged_in_client: AuthenticatedClient,
    another_user_with_todos_enabled: AnotherUserAndWorkspace,
):
    def _grant(todo: TodoTask, access_level: AccessLevel) -> None:
        response = invite_users_to_entity_sync(
            client=logged_in_client,
            body=InviteUsersToEntityArgs(
                entity_type=NamedEntityTag.TODOTASK,
                entity_ref_id=todo.ref_id,
                user_ref_ids=[
                    another_user_with_todos_enabled.init_result.new_user.ref_id
                ],
                access_level=access_level,
            ),
        )
        assert response.status_code == 200

    return _grant


def _login_as_other_user(page: Page, other_user: AnotherUserAndWorkspace) -> None:
    page.locator("#account-menu").click()
    page.locator("#logout").click()
    page.wait_for_url("/app/lifecycle/login/local/login")

    page.locator('input[name="emailAddress"]').fill(other_user.user.email)
    page.locator('input[name="password"]').fill(other_user.user.password)
    page.locator("#login").locator("button", has_text="Login").click()
    page.wait_for_url("/app/workspace")


def _assert_other_user_cannot_access_todo_webui(
    page: Page,
    *,
    todo: TodoTask,
) -> None:
    page.goto("/app/workspace/todos")
    expect(page.locator("#trunk-panel")).not_to_contain_text(todo.name)

    page.goto(f"/app/workspace/todos/{todo.ref_id}")
    expect(page.locator("body")).to_contain_text(_ACCESS_DENIED_LABEL)


def test_webui_todo_acl_reader_can_read_but_not_update_or_archive(
    page: Page,
    create_todo,
    grant_todo_access,
    another_user_with_todos_enabled: AnotherUserAndWorkspace,
) -> None:
    todo = create_todo("Reader ACL Todo")

    _login_as_other_user(page, another_user_with_todos_enabled)
    _assert_other_user_cannot_access_todo_webui(page, todo=todo)

    grant_todo_access(todo, AccessLevel.READER)

    _login_as_other_user(page, another_user_with_todos_enabled)

    page.goto("/app/workspace/todos")
    expect(page.locator("#trunk-panel")).to_contain_text("Reader ACL Todo")

    page.goto(f"/app/workspace/todos/{todo.ref_id}")
    page.wait_for_selector("#leaf-panel")

    expect(page.locator('input[name="name"]')).to_have_value("Reader ACL Todo")
    expect(page.locator('input[name="name"]')).to_be_disabled()
    expect(page.locator("button[id='todo-update']")).to_be_disabled()
    expect(page.locator("button[id='leaf-entity-archive']")).to_be_disabled()


def test_webui_todo_acl_writer_can_read_and_update(
    page: Page,
    create_todo,
    grant_todo_access,
    another_user_with_todos_enabled: AnotherUserAndWorkspace,
) -> None:
    todo = create_todo("Writer Update Todo")
    grant_todo_access(todo, AccessLevel.WRITER)

    _login_as_other_user(page, another_user_with_todos_enabled)

    page.goto(f"/app/workspace/todos/{todo.ref_id}")
    page.wait_for_selector("#leaf-panel")
    expect(page.locator('input[name="name"]')).to_have_value("Writer Update Todo")

    page.locator('input[name="name"]').fill("Updated By Writer")
    page.locator("button[id='todo-update']").click()

    page.wait_for_url("/app/workspace/todos")

    page.goto(f"/app/workspace/todos/{todo.ref_id}")
    page.wait_for_selector("#leaf-panel")
    expect(page.locator('input[name="name"]')).to_have_value("Updated By Writer")


def test_webui_todo_acl_writer_can_read_and_archive(
    page: Page,
    create_todo,
    grant_todo_access,
    another_user_with_todos_enabled: AnotherUserAndWorkspace,
) -> None:
    todo = create_todo("Writer Archive Todo")
    grant_todo_access(todo, AccessLevel.WRITER)

    _login_as_other_user(page, another_user_with_todos_enabled)

    page.goto(f"/app/workspace/todos/{todo.ref_id}")
    page.wait_for_selector("#leaf-panel")
    expect(page.locator('input[name="name"]')).to_have_value("Writer Archive Todo")

    page.locator("button[id='leaf-entity-archive']").click()
    page.locator("button[id='leaf-entity-archive-confirm']").click()

    page.wait_for_url("/app/workspace/todos")

    page.goto(f"/app/workspace/todos/{todo.ref_id}")
    page.wait_for_selector("#leaf-panel")

    expect(page.locator('input[name="name"]')).to_be_disabled()
    expect(page.locator("button[id='todo-update']")).to_be_disabled()
    expect(page.locator("button[id='todo-create-note']")).to_be_disabled()


def test_webui_todo_acl_z_denied_without_grant(
    page: Page,
    create_todo,
    another_user_with_todos_enabled: AnotherUserAndWorkspace,
) -> None:
    todo = create_todo("ACL Todo")

    _login_as_other_user(page, another_user_with_todos_enabled)
    _assert_other_user_cannot_access_todo_webui(page, todo=todo)
