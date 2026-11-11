"""Tests about chores."""

import re
from collections.abc import Iterator

import pytest
from jupiter_webapi_client.api.application.invite_users_to_entity import (
    sync_detailed as invite_users_to_entity_sync,
)
from jupiter_webapi_client.api.chores.chore_create import (
    sync_detailed as chore_create_sync,
)
from jupiter_webapi_client.api.chores.chore_load import (
    sync_detailed as chore_load_sync,
)
from jupiter_webapi_client.api.chores.chore_stack_create import (
    sync_detailed as chore_stack_create_sync,
)
from jupiter_webapi_client.api.gen.gen_do import (
    sync_detailed as gen_do_sync,
)
from jupiter_webapi_client.api.test_helper.workspace_set_feature import (
    sync_detailed as workspace_set_feature_sync,
)
from jupiter_webapi_client.client import AuthenticatedClient
from jupiter_webapi_client.models.access_level import AccessLevel
from jupiter_webapi_client.models.chore import Chore
from jupiter_webapi_client.models.chore_create_args import ChoreCreateArgs
from jupiter_webapi_client.models.chore_create_result import ChoreCreateResult
from jupiter_webapi_client.models.chore_load_args import ChoreLoadArgs
from jupiter_webapi_client.models.chore_load_result import ChoreLoadResult
from jupiter_webapi_client.models.chore_stack import ChoreStack
from jupiter_webapi_client.models.chore_stack_create_args import ChoreStackCreateArgs
from jupiter_webapi_client.models.chore_stack_create_result import (
    ChoreStackCreateResult,
)
from jupiter_webapi_client.models.difficulty import Difficulty
from jupiter_webapi_client.models.eisen import Eisen
from jupiter_webapi_client.models.gen_do_args import GenDoArgs
from jupiter_webapi_client.models.invite_users_to_entity_args import (
    InviteUsersToEntityArgs,
)
from jupiter_webapi_client.models.named_entity_tag import NamedEntityTag
from jupiter_webapi_client.models.recurring_task_period import RecurringTaskPeriod
from jupiter_webapi_client.models.sync_target import SyncTarget
from jupiter_webapi_client.models.workspace_feature import WorkspaceFeature
from jupiter_webapi_client.models.workspace_set_feature_args import (
    WorkspaceSetFeatureArgs,
)
from playwright.sync_api import Page, expect

from itests.helpers import get_parsed_from_response, open_leaf_publish_panel
from itests.webui.entities.conftest import AnotherUserAndWorkspace

_ACCESS_DENIED_LABEL = "You do not have the right access for this entity"


@pytest.fixture(autouse=True, scope="module")
def _enable_chores_feature(logged_in_client: AuthenticatedClient):
    try:
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(feature=WorkspaceFeature.CHORES, value=True),
        )
        yield
    finally:
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(feature=WorkspaceFeature.CHORES, value=False),
        )


@pytest.fixture(autouse=True, scope="module")
def create_chore(logged_in_client: AuthenticatedClient):
    def _create_chore(
        name: str,
        period: RecurringTaskPeriod = RecurringTaskPeriod.WEEKLY,
        is_key: bool = False,
        eisen: Eisen = Eisen.REGULAR,
        difficulty: Difficulty = Difficulty.MEDIUM,
        must_do: bool = False,
    ) -> Chore:
        result = chore_create_sync(
            client=logged_in_client,
            body=ChoreCreateArgs(
                name=name,
                period=period,
                is_key=is_key,
                eisen=eisen,
                difficulty=difficulty,
                must_do=must_do,
            ),
        )
        return get_parsed_from_response(ChoreCreateResult, result).new_chore

    return _create_chore


@pytest.fixture(autouse=True, scope="module")
def create_chore_stack(logged_in_client: AuthenticatedClient):
    def _create_chore_stack(
        name: str,
        chore_ref_ids: list[str] | None = None,
        period: RecurringTaskPeriod = RecurringTaskPeriod.DAILY,
    ) -> ChoreStack:
        result = chore_stack_create_sync(
            client=logged_in_client,
            body=ChoreStackCreateArgs(
                name=name,
                period=period,
                chore_ref_ids=chore_ref_ids or [],
            ),
        )
        return get_parsed_from_response(ChoreStackCreateResult, result).new_chore_stack

    return _create_chore_stack


def test_webui_chore_view_nothing(page: Page) -> None:
    page.goto("/app/workspace/apps/chores/chores")

    expect(page.locator("#trunk-panel")).to_contain_text("There are no chores to show")


def test_webui_chore_view_all(page: Page, create_chore) -> None:
    chore1 = create_chore(
        "Chore 1",
        RecurringTaskPeriod.WEEKLY,
        False,
        Eisen.REGULAR,
        Difficulty.MEDIUM,
        False,
    )
    chore2 = create_chore(
        "Chore 2",
        RecurringTaskPeriod.DAILY,
        True,
        Eisen.IMPORTANT,
        Difficulty.HARD,
        True,
    )
    chore3 = create_chore(
        "Chore 3",
        RecurringTaskPeriod.MONTHLY,
        False,
        Eisen.URGENT,
        Difficulty.EASY,
        False,
    )

    page.goto("/app/workspace/apps/chores/chores")

    expect(page.locator(f"#chore-{chore1.ref_id}")).to_contain_text("Chore 1")
    expect(page.locator(f"#chore-{chore2.ref_id}")).to_contain_text("Chore 2")
    expect(page.locator(f"#chore-{chore3.ref_id}")).to_contain_text("Chore 3")


def test_webui_chore_publish_and_view_public(page: Page, create_chore) -> None:
    chore = create_chore("Published Chore")
    page.goto(f"/app/workspace/apps/chores/chores/{chore.ref_id}")
    page.wait_for_selector("#leaf-panel")

    open_leaf_publish_panel(page, "Chore-publish")
    page.locator("button[id='Chore-publish-create']").click()
    page.wait_for_url(re.compile(rf"/app/workspace/apps/chores/chores/{chore.ref_id}"))
    page.wait_for_selector("#leaf-panel")

    open_leaf_publish_panel(page, "Chore-publish")
    expect(page.locator("#Chore-publish")).to_contain_text("draft")

    page.locator("button[id='Chore-publish-toggle-status']").click()
    page.wait_for_url(re.compile(rf"/app/workspace/apps/chores/chores/{chore.ref_id}"))
    page.wait_for_selector("#leaf-panel")

    open_leaf_publish_panel(page, "Chore-publish")
    expect(page.locator("#Chore-publish")).to_contain_text("active")

    public_url = page.locator('input[name="publicUrl"]').input_value()
    assert "/publish/" in public_url

    page.goto(public_url)
    page.wait_for_url(re.compile(r"/publish/chore/"))
    page.wait_for_selector("#leaf-panel")

    expect(page.locator('input[name="name"]')).to_have_value("Published Chore")


def test_webui_chore_action_that_redirects_keeps_the_layout(
    page: Page, create_chore
) -> None:
    chore = create_chore("Layout Chore")
    page.goto(
        f"/app/workspace/apps/chores/chores/{chore.ref_id}"
        "?chore%5Bcollapsed%5D=chore-note-section"
    )
    page.wait_for_selector("#leaf-panel")

    # An action that ends in a redirect to the same page hands back the
    # collapsed sections it was posted with, so the page looks as it did.
    open_leaf_publish_panel(page, "Chore-publish")
    page.locator("button[id='Chore-publish-create']").click()
    page.wait_for_url(re.compile(r"chore%5Bcollapsed%5D=chore-note-section"))
    expect(page.locator("#chore-note-section-body")).to_have_attribute("hidden", "")


@pytest.fixture()
def another_user_with_chores_enabled(
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
            body=WorkspaceSetFeatureArgs(feature=WorkspaceFeature.CHORES, value=True),
        )
        yield another_user_and_workspace
    finally:
        workspace_set_feature_sync(
            client=make_client(),
            body=WorkspaceSetFeatureArgs(feature=WorkspaceFeature.CHORES, value=False),
        )


@pytest.fixture()
def grant_chore_access(
    logged_in_client: AuthenticatedClient,
    another_user_with_chores_enabled: AnotherUserAndWorkspace,
):
    def _grant(chore: Chore, access_level: AccessLevel) -> None:
        response = invite_users_to_entity_sync(
            client=logged_in_client,
            body=InviteUsersToEntityArgs(
                entity_type=NamedEntityTag.CHORE,
                entity_ref_id=chore.ref_id,
                user_ref_ids=[
                    another_user_with_chores_enabled.init_result.new_user.ref_id
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


def _assert_other_user_cannot_access_chore_webui(
    page: Page,
    *,
    chore: Chore,
) -> None:
    page.goto("/app/workspace/apps/chores/chores")
    expect(page.locator("#trunk-panel")).to_contain_text("There are no chores to show")
    expect(page.locator(f"#chore-{chore.ref_id}")).to_have_count(0)

    page.goto(f"/app/workspace/apps/chores/chores/{chore.ref_id}")
    expect(page.locator("body")).to_contain_text(_ACCESS_DENIED_LABEL)


def test_webui_chore_acl_reader_can_read_but_not_update_or_archive(
    page: Page,
    create_chore,
    grant_chore_access,
    another_user_with_chores_enabled: AnotherUserAndWorkspace,
) -> None:
    chore = create_chore("Reader ACL Chore")

    _login_as_other_user(page, another_user_with_chores_enabled)
    _assert_other_user_cannot_access_chore_webui(page, chore=chore)

    grant_chore_access(chore, AccessLevel.READER)

    _login_as_other_user(page, another_user_with_chores_enabled)

    page.goto("/app/workspace/apps/chores/chores")
    expect(page.locator(f"#chore-{chore.ref_id}")).to_have_count(1)

    page.goto(f"/app/workspace/apps/chores/chores/{chore.ref_id}")
    page.wait_for_selector("#leaf-panel")

    expect(page.locator('input[name="name"]')).to_have_value("Reader ACL Chore")
    expect(page.locator('input[name="name"]')).to_be_disabled()
    expect(page.locator("button[id='chore-update']")).to_be_disabled()
    expect(page.locator("button[id='leaf-entity-archive']")).to_be_disabled()


def test_webui_chore_acl_writer_can_read_and_update(
    page: Page,
    create_chore,
    grant_chore_access,
    another_user_with_chores_enabled: AnotherUserAndWorkspace,
) -> None:
    chore = create_chore("Writer Update Chore")
    grant_chore_access(chore, AccessLevel.WRITER)

    _login_as_other_user(page, another_user_with_chores_enabled)

    page.goto(f"/app/workspace/apps/chores/chores/{chore.ref_id}")
    page.wait_for_selector("#leaf-panel")
    expect(page.locator('input[name="name"]')).to_have_value("Writer Update Chore")

    page.locator('input[name="name"]').fill("Writer Updated Chore")
    page.locator("button[id='chore-update']").click()

    page.wait_for_url("/app/workspace/apps/chores/chores")
    page.goto(f"/app/workspace/apps/chores/chores/{chore.ref_id}")
    page.wait_for_selector("#leaf-panel")
    expect(page.locator('input[name="name"]')).to_have_value("Writer Updated Chore")


def test_webui_chore_acl_writer_can_read_and_archive(
    page: Page,
    create_chore,
    grant_chore_access,
    another_user_with_chores_enabled: AnotherUserAndWorkspace,
) -> None:
    chore = create_chore("Writer Archive Chore")
    grant_chore_access(chore, AccessLevel.WRITER)

    _login_as_other_user(page, another_user_with_chores_enabled)

    page.goto(f"/app/workspace/apps/chores/chores/{chore.ref_id}")
    page.wait_for_selector("#leaf-panel")

    page.locator("button[id='leaf-entity-archive']").click()
    page.locator("button[id='leaf-entity-archive-confirm']").click()

    page.wait_for_url("/app/workspace/apps/chores/chores")
    page.goto(f"/app/workspace/apps/chores/chores/{chore.ref_id}")
    page.wait_for_selector("#leaf-panel")

    expect(page.locator('input[name="name"]')).to_be_disabled()
    expect(page.locator("button[id='chore-update']")).to_be_disabled()


def test_webui_chore_acl_z_denied_without_grant(
    page: Page,
    create_chore,
    another_user_with_chores_enabled: AnotherUserAndWorkspace,
) -> None:
    chore = create_chore("Denied ACL Chore")

    _login_as_other_user(page, another_user_with_chores_enabled)
    _assert_other_user_cannot_access_chore_webui(page, chore=chore)


def test_webui_chore_stack_view_all(page: Page, create_chore_stack) -> None:
    stack1 = create_chore_stack("Stack One")
    stack2 = create_chore_stack("Stack Two")

    page.goto("/app/workspace/apps/chores/stacks")

    expect(page.locator(f"#chore-stack-{stack1.ref_id}")).to_contain_text("Stack One")
    expect(page.locator(f"#chore-stack-{stack2.ref_id}")).to_contain_text("Stack Two")


def test_webui_chore_stack_view_one(page: Page, create_chore_stack) -> None:
    stack = create_chore_stack("View Stack")
    page.goto(f"/app/workspace/apps/chores/stacks/{stack.ref_id}")
    page.wait_for_selector("#leaf-panel")

    expect(page.locator('input[name="name"]')).to_have_value("View Stack")
    expect(page.locator('input[name="name"]')).to_be_editable()


def test_webui_chore_stack_create(page: Page) -> None:
    page.goto("/app/workspace/apps/chores/stacks")
    page.wait_for_selector("#trunk-panel")
    page.locator("a[id='trunk-new-leaf-entity']").click()
    page.wait_for_selector("#leaf-panel")

    page.locator('input[name="name"]').fill("Created Stack")
    page.locator("button[id='chore-stack-create']").click()

    page.wait_for_url(re.compile(r"/app/workspace/apps/chores/stacks/\d+"))
    expect(page.locator('input[name="name"]')).to_have_value("Created Stack")


def test_webui_chore_list_groups_by_stack(
    page: Page, create_chore, create_chore_stack
) -> None:
    chore1 = create_chore("Stacked Chore A", RecurringTaskPeriod.DAILY)
    chore2 = create_chore("Stacked Chore B", RecurringTaskPeriod.DAILY)
    unstacked = create_chore("Loose Chore", RecurringTaskPeriod.DAILY)
    stack = create_chore_stack(
        "Chip Stack", [chore1.ref_id, chore2.ref_id], RecurringTaskPeriod.DAILY
    )

    page.goto("/app/workspace/apps/chores/chores")
    group = page.locator(f"#chore-stack-group-{stack.ref_id}")
    expect(group).to_contain_text("Chip Stack")
    expect(group).to_contain_text("Stacked Chore A")
    expect(group).to_contain_text("Stacked Chore B")
    expect(group).not_to_contain_text("Loose Chore")
    expect(page.locator(f"#chore-{unstacked.ref_id}")).to_contain_text("Loose Chore")


def test_webui_chore_inbox_task_shows_stack(
    page: Page,
    logged_in_client: AuthenticatedClient,
    create_chore,
    create_chore_stack,
) -> None:
    chore = create_chore("Stacked Inbox Chore", RecurringTaskPeriod.DAILY)
    create_chore_stack("Morning Stack", [chore.ref_id], RecurringTaskPeriod.DAILY)

    gen_result = gen_do_sync(
        client=logged_in_client,
        body=GenDoArgs(
            gen_even_if_not_modified=True,
            today="2026-09-06",
            gen_targets=[SyncTarget.CHORES],
            period=[RecurringTaskPeriod.DAILY],
            filter_chore_ref_ids=[chore.ref_id],
        ),
    )
    assert gen_result.status_code == 200

    loaded = get_parsed_from_response(
        ChoreLoadResult,
        chore_load_sync(
            client=logged_in_client,
            body=ChoreLoadArgs(ref_id=chore.ref_id, allow_archived=False),
        ),
    )
    assert loaded.inbox_tasks
    inbox_task = loaded.inbox_tasks[0]

    page.goto(f"/app/workspace/apps/chores/chores/{chore.ref_id}")
    page.wait_for_selector("#leaf-panel")
    expect(
        page.locator(f"#leaf-panel-content #inbox-task-{inbox_task.ref_id}")
    ).to_contain_text("Morning Stack")

    page.goto("/app/workspace/core/inbox-tasks")
    page.wait_for_selector("#trunk-panel")
    expect(page.locator(f"#inbox-task-{inbox_task.ref_id}")).to_contain_text(
        "Morning Stack"
    )

    page.goto(f"/app/workspace/core/inbox-tasks/{inbox_task.ref_id}")
    page.wait_for_selector("#leaf-panel")
    expect(page.locator("#leaf-panel")).to_contain_text("Morning Stack")


def test_webui_chore_stack_publish_and_view_public(
    page: Page, create_chore_stack
) -> None:
    stack = create_chore_stack("Published Stack")
    page.goto(f"/app/workspace/apps/chores/stacks/{stack.ref_id}")
    page.wait_for_selector("#leaf-panel")

    open_leaf_publish_panel(page, "ChoreStack-publish")
    page.locator("button[id='ChoreStack-publish-create']").click()
    page.wait_for_url(re.compile(rf"/app/workspace/apps/chores/stacks/{stack.ref_id}"))
    page.wait_for_selector("#leaf-panel")

    open_leaf_publish_panel(page, "ChoreStack-publish")
    expect(page.locator("#ChoreStack-publish")).to_contain_text("draft")

    page.locator("button[id='ChoreStack-publish-toggle-status']").click()
    page.wait_for_url(re.compile(rf"/app/workspace/apps/chores/stacks/{stack.ref_id}"))
    page.wait_for_selector("#leaf-panel")

    open_leaf_publish_panel(page, "ChoreStack-publish")
    expect(page.locator("#ChoreStack-publish")).to_contain_text("active")

    public_url = page.locator('input[name="publicUrl"]').input_value()
    assert "/publish/" in public_url

    page.goto(public_url)
    page.wait_for_url(re.compile(r"/publish/chore-stack/"))
    page.wait_for_selector("#leaf-panel")

    expect(page.locator('input[name="name"]')).to_have_value("Published Stack")


@pytest.fixture()
def grant_chore_stack_access(
    logged_in_client: AuthenticatedClient,
    another_user_with_chores_enabled: AnotherUserAndWorkspace,
):
    def _grant(stack: ChoreStack, access_level: AccessLevel) -> None:
        response = invite_users_to_entity_sync(
            client=logged_in_client,
            body=InviteUsersToEntityArgs(
                entity_type=NamedEntityTag.CHORESTACK,
                entity_ref_id=stack.ref_id,
                user_ref_ids=[
                    another_user_with_chores_enabled.init_result.new_user.ref_id
                ],
                access_level=access_level,
            ),
        )
        assert response.status_code == 200

    return _grant


def _assert_other_user_cannot_access_chore_stack_webui(
    page: Page,
    *,
    stack: ChoreStack,
) -> None:
    page.goto("/app/workspace/apps/chores/stacks")
    expect(page.locator("#trunk-panel")).to_contain_text(
        "There are no chore stacks to show"
    )
    expect(page.locator(f"#chore-stack-{stack.ref_id}")).to_have_count(0)

    page.goto(f"/app/workspace/apps/chores/stacks/{stack.ref_id}")
    expect(page.locator("body")).to_contain_text(_ACCESS_DENIED_LABEL)


def test_webui_chore_stack_acl_reader_can_read_but_not_update(
    page: Page,
    create_chore_stack,
    grant_chore_stack_access,
    another_user_with_chores_enabled: AnotherUserAndWorkspace,
) -> None:
    stack = create_chore_stack("Reader ACL Stack")

    _login_as_other_user(page, another_user_with_chores_enabled)
    _assert_other_user_cannot_access_chore_stack_webui(page, stack=stack)

    grant_chore_stack_access(stack, AccessLevel.READER)

    _login_as_other_user(page, another_user_with_chores_enabled)

    page.goto("/app/workspace/apps/chores/stacks")
    expect(page.locator(f"#chore-stack-{stack.ref_id}")).to_have_count(1)

    page.goto(f"/app/workspace/apps/chores/stacks/{stack.ref_id}")
    page.wait_for_selector("#leaf-panel")

    expect(page.locator('input[name="name"]')).to_have_value("Reader ACL Stack")
    expect(page.locator('input[name="name"]')).to_be_disabled()
    expect(page.locator("button[id='chore-stack-update']")).to_be_disabled()
    expect(page.locator("button[id='leaf-entity-archive']")).to_be_disabled()


def test_webui_chore_stack_acl_writer_can_read_and_update(
    page: Page,
    create_chore_stack,
    grant_chore_stack_access,
    another_user_with_chores_enabled: AnotherUserAndWorkspace,
) -> None:
    stack = create_chore_stack("Writer Update Stack")
    grant_chore_stack_access(stack, AccessLevel.WRITER)

    _login_as_other_user(page, another_user_with_chores_enabled)

    page.goto(f"/app/workspace/apps/chores/stacks/{stack.ref_id}")
    page.wait_for_selector("#leaf-panel")
    expect(page.locator('input[name="name"]')).to_have_value("Writer Update Stack")

    page.locator('input[name="name"]').fill("Writer Updated Stack")
    page.locator("button[id='chore-stack-update']").click()

    page.wait_for_url("/app/workspace/apps/chores/stacks")
    page.goto(f"/app/workspace/apps/chores/stacks/{stack.ref_id}")
    page.wait_for_selector("#leaf-panel")
    expect(page.locator('input[name="name"]')).to_have_value("Writer Updated Stack")


def test_webui_chore_stack_acl_z_denied_without_grant(
    page: Page,
    create_chore_stack,
    another_user_with_chores_enabled: AnotherUserAndWorkspace,
) -> None:
    stack = create_chore_stack("Denied ACL Stack")

    _login_as_other_user(page, another_user_with_chores_enabled)
    _assert_other_user_cannot_access_chore_stack_webui(page, stack=stack)
