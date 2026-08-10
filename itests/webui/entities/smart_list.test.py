"""Tests about smart lists."""

import re
from collections.abc import Iterator

import pytest
from jupiter_webapi_client.api.application.invite_users_to_entity import (
    sync_detailed as invite_users_to_entity_sync,
)
from jupiter_webapi_client.api.smart_lists.smart_list_create import (
    sync_detailed as smart_list_create_sync,
)
from jupiter_webapi_client.api.smart_lists.smart_list_item_create import (
    sync_detailed as smart_list_item_create_sync,
)
from jupiter_webapi_client.api.test_helper.workspace_set_feature import (
    sync_detailed as workspace_set_feature_sync,
)
from jupiter_webapi_client.client import AuthenticatedClient
from jupiter_webapi_client.models.access_level import AccessLevel
from jupiter_webapi_client.models.invite_users_to_entity_args import (
    InviteUsersToEntityArgs,
)
from jupiter_webapi_client.models.named_entity_tag import NamedEntityTag
from jupiter_webapi_client.models.smart_list import SmartList
from jupiter_webapi_client.models.smart_list_create_args import SmartListCreateArgs
from jupiter_webapi_client.models.smart_list_create_result import SmartListCreateResult
from jupiter_webapi_client.models.smart_list_item import SmartListItem
from jupiter_webapi_client.models.smart_list_item_create_args import (
    SmartListItemCreateArgs,
)
from jupiter_webapi_client.models.smart_list_item_create_result import (
    SmartListItemCreateResult,
)
from jupiter_webapi_client.models.workspace_feature import WorkspaceFeature
from jupiter_webapi_client.models.workspace_set_feature_args import (
    WorkspaceSetFeatureArgs,
)
from playwright.sync_api import Page, expect

from itests.helpers import (
    get_parsed_from_response,
    open_branch_publish_panel,
    open_leaf_publish_panel,
)
from itests.webui.entities.conftest import AnotherUserAndWorkspace

_ACCESS_DENIED_LABEL = "You do not have the right access for this entity"


@pytest.fixture(autouse=True, scope="module")
def _enable_smart_lists_feature(logged_in_client: AuthenticatedClient):
    try:
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.SMART_LISTS, value=True
            ),
        )
        yield
    finally:
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.SMART_LISTS, value=False
            ),
        )


@pytest.fixture(autouse=True, scope="module")
def create_smart_list(logged_in_client: AuthenticatedClient):
    def _create_smart_list(name: str, icon: str | None = None) -> SmartList:
        result = smart_list_create_sync(
            client=logged_in_client,
            body=SmartListCreateArgs(
                name=name,
                icon=icon,
            ),
        )
        return get_parsed_from_response(SmartListCreateResult, result).new_smart_list

    return _create_smart_list


@pytest.fixture(autouse=True, scope="module")
def create_smart_list_item(logged_in_client: AuthenticatedClient):
    def _create_smart_list_item(name: str, smart_list_ref_id: str) -> SmartListItem:
        result = smart_list_item_create_sync(
            client=logged_in_client,
            body=SmartListItemCreateArgs(
                name=name,
                smart_list_ref_id=smart_list_ref_id,
                is_done=False,
                url=None,
            ),
        )
        return get_parsed_from_response(
            SmartListItemCreateResult, result
        ).new_smart_list_item

    return _create_smart_list_item


@pytest.fixture()
def another_user_with_smart_lists_enabled(
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
                feature=WorkspaceFeature.SMART_LISTS, value=True
            ),
        )
        yield another_user_and_workspace
    finally:
        workspace_set_feature_sync(
            client=make_client(),
            body=WorkspaceSetFeatureArgs(
                feature=WorkspaceFeature.SMART_LISTS, value=False
            ),
        )


def test_webui_smart_list_view_nothing(page: Page) -> None:
    page.goto("/app/workspace/smart-lists")

    expect(page.locator("#trunk-panel")).to_contain_text(
        "There are no smart lists to show"
    )


def test_webui_smart_list_view_all(page: Page, create_smart_list) -> None:
    smart_list1 = create_smart_list("Smart List 1")
    smart_list2 = create_smart_list("Smart List 2", "📝")
    smart_list3 = create_smart_list("Smart List 3", "⭐")

    page.goto("/app/workspace/smart-lists")

    expect(page.locator(f"#smart-list-{smart_list1.ref_id}")).to_contain_text(
        "Smart List 1"
    )
    expect(page.locator(f"#smart-list-{smart_list2.ref_id}")).to_contain_text(
        "Smart List 2"
    )
    expect(page.locator(f"#smart-list-{smart_list3.ref_id}")).to_contain_text(
        "Smart List 3"
    )


def test_webui_smart_list_view_one_nothing(page: Page, create_smart_list) -> None:
    smart_list = create_smart_list("Smart List 1")
    page.goto(f"/app/workspace/smart-lists/{smart_list.ref_id}/items")

    expect(page.locator("#branch-panel")).to_contain_text("There are no items to show")


def test_webui_smart_list_view_one_items(
    page: Page, create_smart_list, create_smart_list_item
) -> None:
    smart_list = create_smart_list("Smart List 1")
    smart_list_item1 = create_smart_list_item("Smart List Item 1", smart_list.ref_id)
    smart_list_item2 = create_smart_list_item("Smart List Item 2", smart_list.ref_id)

    page.goto(f"/app/workspace/smart-lists/{smart_list.ref_id}/items")
    page.wait_for_selector("#branch-panel")
    expect(page.locator(f"#smart-list-item-{smart_list_item1.ref_id}")).to_contain_text(
        "Smart List Item 1"
    )
    expect(page.locator(f"#smart-list-item-{smart_list_item2.ref_id}")).to_contain_text(
        "Smart List Item 2"
    )


def test_webui_smart_list_publish_and_view_public(
    page: Page, create_smart_list, create_smart_list_item
) -> None:
    smart_list = create_smart_list("Published Smart List")
    item = create_smart_list_item("Published Smart List Item", smart_list.ref_id)
    page.goto(f"/app/workspace/smart-lists/{smart_list.ref_id}")
    page.wait_for_selector("#branch-panel")

    open_branch_publish_panel(page, "SmartList-publish")
    page.locator("button[id='SmartList-publish-create']").click()
    page.wait_for_url(re.compile(rf"/app/workspace/smart-lists/{smart_list.ref_id}"))
    page.wait_for_selector("#branch-panel")

    open_branch_publish_panel(page, "SmartList-publish")
    expect(page.locator("#SmartList-publish")).to_contain_text("draft")

    page.locator("button[id='SmartList-publish-toggle-status']").click()
    page.wait_for_url(re.compile(rf"/app/workspace/smart-lists/{smart_list.ref_id}"))
    page.wait_for_selector("#branch-panel")

    open_branch_publish_panel(page, "SmartList-publish")
    expect(page.locator("#SmartList-publish")).to_contain_text("active")

    public_url = page.locator('input[name="publicUrl"]').input_value()
    assert "/publish/" in public_url

    page.goto(public_url)
    page.wait_for_url(re.compile(r"/publish/smart-list/"))
    page.wait_for_selector("#leaf-panel")

    expect(page.locator(f"#smart-list-item-{item.ref_id}")).to_contain_text(
        "Published Smart List Item"
    )


def test_webui_smart_list_item_view_public(
    page: Page, create_smart_list, create_smart_list_item
) -> None:
    smart_list = create_smart_list("Published Smart List For Item")
    item = create_smart_list_item("Public Item Detail", smart_list.ref_id)
    page.goto(f"/app/workspace/smart-lists/{smart_list.ref_id}")
    page.wait_for_selector("#branch-panel")

    open_branch_publish_panel(page, "SmartList-publish")
    page.locator("button[id='SmartList-publish-create']").click()
    page.wait_for_url(re.compile(rf"/app/workspace/smart-lists/{smart_list.ref_id}"))
    page.wait_for_selector("#branch-panel")

    open_branch_publish_panel(page, "SmartList-publish")
    page.locator("button[id='SmartList-publish-toggle-status']").click()
    page.wait_for_url(re.compile(rf"/app/workspace/smart-lists/{smart_list.ref_id}"))
    page.wait_for_selector("#branch-panel")

    # Wait until the activation has actually committed (the panel reflects the
    # active status) before navigating to the public URL. Otherwise the guest
    # load can race the activation and 404, since publishEntityLoadByExternalId
    # only serves active entities.
    open_branch_publish_panel(page, "SmartList-publish")
    expect(page.locator("#SmartList-publish")).to_contain_text("active")

    public_url = page.locator('input[name="publicUrl"]').input_value()
    page.goto(public_url)
    page.wait_for_url(re.compile(r"/publish/smart-list/"))

    page.locator(f"#smart-list-item-{item.ref_id}").click()
    page.wait_for_url(re.compile(rf"/publish/smart-list/[^/]+/{item.ref_id}"))
    page.wait_for_selector("#leaf-panel")

    expect(page.locator('input[name="name"]')).to_have_value("Public Item Detail")


def test_webui_smart_list_item_publish_and_view_public(
    page: Page, create_smart_list, create_smart_list_item
) -> None:
    smart_list = create_smart_list("Publish Smart List")
    item = create_smart_list_item("Published Smart List Item", smart_list.ref_id)
    page.goto(f"/app/workspace/smart-lists/{smart_list.ref_id}/{item.ref_id}")
    page.wait_for_selector("#leaf-panel")

    open_leaf_publish_panel(page, "SmartListItem-publish")
    page.locator("button[id='SmartListItem-publish-create']").click()
    page.wait_for_url(
        re.compile(rf"/app/workspace/smart-lists/{smart_list.ref_id}/{item.ref_id}")
    )
    page.wait_for_selector("#leaf-panel")

    open_leaf_publish_panel(page, "SmartListItem-publish")
    expect(page.locator("#SmartListItem-publish")).to_contain_text("draft")

    page.locator("button[id='SmartListItem-publish-toggle-status']").click()
    page.wait_for_url(
        re.compile(rf"/app/workspace/smart-lists/{smart_list.ref_id}/{item.ref_id}")
    )
    page.wait_for_selector("#leaf-panel")

    open_leaf_publish_panel(page, "SmartListItem-publish")
    expect(page.locator("#SmartListItem-publish")).to_contain_text("active")

    public_url = page.locator('input[name="publicUrl"]').input_value()
    assert "/publish/" in public_url

    page.goto(public_url)
    page.wait_for_url(re.compile(r"/publish/smart-list/item/"))
    page.wait_for_selector("#leaf-panel")

    expect(page.locator('input[name="name"]')).to_have_value(
        "Published Smart List Item"
    )


@pytest.fixture()
def grant_smart_list_access(
    logged_in_client: AuthenticatedClient,
    another_user_with_smart_lists_enabled: AnotherUserAndWorkspace,
):
    def _grant(smart_list: SmartList, access_level: AccessLevel) -> None:
        response = invite_users_to_entity_sync(
            client=logged_in_client,
            body=InviteUsersToEntityArgs(
                entity_type=NamedEntityTag.SMARTLIST,
                entity_ref_id=smart_list.ref_id,
                user_ref_ids=[
                    another_user_with_smart_lists_enabled.init_result.new_user.ref_id
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


def _assert_other_user_cannot_access_smart_list_webui(
    page: Page,
    *,
    smart_list: SmartList,
) -> None:
    page.goto("/app/workspace/smart-lists")
    expect(page.locator(f"#smart-list-{smart_list.ref_id}")).to_have_count(0)

    page.goto(f"/app/workspace/smart-lists/{smart_list.ref_id}")
    expect(page.locator("body")).to_contain_text(_ACCESS_DENIED_LABEL)


def test_webui_smart_list_acl_reader_can_read_but_not_update_or_archive(
    page: Page,
    create_smart_list,
    grant_smart_list_access,
    another_user_with_smart_lists_enabled: AnotherUserAndWorkspace,
) -> None:
    smart_list = create_smart_list("Reader ACL List")

    _login_as_other_user(page, another_user_with_smart_lists_enabled)
    _assert_other_user_cannot_access_smart_list_webui(page, smart_list=smart_list)

    grant_smart_list_access(smart_list, AccessLevel.READER)

    _login_as_other_user(page, another_user_with_smart_lists_enabled)

    page.goto("/app/workspace/smart-lists")
    expect(page.locator("#trunk-panel")).to_contain_text("Reader ACL List")

    page.goto(f"/app/workspace/smart-lists/{smart_list.ref_id}/details")
    page.wait_for_selector("#leaf-panel")

    expect(page.locator('input[name="name"]')).to_have_value("Reader ACL List")
    expect(page.locator('input[name="name"]')).to_be_disabled()
    expect(page.locator("button[id='smart-list-update']")).to_be_disabled()
    expect(page.locator("button[id='leaf-entity-archive']")).to_be_disabled()


def test_webui_smart_list_acl_writer_can_read_and_update(
    page: Page,
    create_smart_list,
    grant_smart_list_access,
    another_user_with_smart_lists_enabled: AnotherUserAndWorkspace,
) -> None:
    smart_list = create_smart_list("Writer Update List")
    grant_smart_list_access(smart_list, AccessLevel.WRITER)

    _login_as_other_user(page, another_user_with_smart_lists_enabled)

    page.goto(f"/app/workspace/smart-lists/{smart_list.ref_id}/details")
    page.wait_for_selector("#leaf-panel")
    expect(page.locator('input[name="name"]')).to_have_value("Writer Update List")

    page.locator('input[name="name"]').fill("Updated By Writer")
    page.locator("button[id='smart-list-update']").click()

    page.wait_for_url(f"/app/workspace/smart-lists/{smart_list.ref_id}")

    page.goto(f"/app/workspace/smart-lists/{smart_list.ref_id}/details")
    page.wait_for_selector("#leaf-panel")
    expect(page.locator('input[name="name"]')).to_have_value("Updated By Writer")


def test_webui_smart_list_acl_writer_can_read_and_archive(
    page: Page,
    create_smart_list,
    grant_smart_list_access,
    another_user_with_smart_lists_enabled: AnotherUserAndWorkspace,
) -> None:
    smart_list = create_smart_list("Writer Archive List")
    grant_smart_list_access(smart_list, AccessLevel.WRITER)

    _login_as_other_user(page, another_user_with_smart_lists_enabled)

    page.goto(f"/app/workspace/smart-lists/{smart_list.ref_id}/details")
    page.wait_for_selector("#leaf-panel")
    expect(page.locator('input[name="name"]')).to_have_value("Writer Archive List")

    page.locator("button[id='leaf-entity-archive']").click()
    page.locator("button[id='leaf-entity-archive-confirm']").click()

    page.wait_for_url(f"/app/workspace/smart-lists/{smart_list.ref_id}")

    page.goto(f"/app/workspace/smart-lists/{smart_list.ref_id}/details")
    page.wait_for_selector("#leaf-panel")

    expect(page.locator('input[name="name"]')).to_be_disabled()
    expect(page.locator("button[id='smart-list-update']")).to_be_disabled()


def test_webui_smart_list_acl_z_denied_without_grant(
    page: Page,
    create_smart_list,
    another_user_with_smart_lists_enabled: AnotherUserAndWorkspace,
) -> None:
    smart_list = create_smart_list("ACL List")

    _login_as_other_user(page, another_user_with_smart_lists_enabled)
    _assert_other_user_cannot_access_smart_list_webui(page, smart_list=smart_list)


def test_webui_smart_list_item_acl(
    page: Page,
    create_smart_list,
    create_smart_list_item,
    another_user_with_smart_lists_enabled: AnotherUserAndWorkspace,
) -> None:
    smart_list = create_smart_list("ACL List")
    item = create_smart_list_item("ACL Item", smart_list.ref_id)
    other_user = another_user_with_smart_lists_enabled.user

    page.locator("#account-menu").click()
    page.locator("#logout").click()
    page.wait_for_url("/app/lifecycle/login/local/login")

    page.locator('input[name="emailAddress"]').fill(other_user.email)
    page.locator('input[name="password"]').fill(other_user.password)
    page.locator("#login").locator("button", has_text="Login").click()
    page.wait_for_url("/app/workspace")

    page.goto(f"/app/workspace/smart-lists/{smart_list.ref_id}/{item.ref_id}")
    expect(page.locator("body")).to_contain_text(
        "You do not have the right access for this entity"
    )
