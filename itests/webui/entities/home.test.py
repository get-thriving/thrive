"""Tests about home tabs and widgets."""

import pytest
from jupiter_webapi_client.api.home.home_tab_create import (
    sync_detailed as home_tab_create_sync,
)
from jupiter_webapi_client.api.home.home_widget_create import (
    sync_detailed as home_widget_create_sync,
)
from jupiter_webapi_client.client import AuthenticatedClient
from jupiter_webapi_client.models.home_tab import HomeTab
from jupiter_webapi_client.models.home_tab_create_args import HomeTabCreateArgs
from jupiter_webapi_client.models.home_tab_create_result import HomeTabCreateResult
from jupiter_webapi_client.models.home_tab_target import HomeTabTarget
from jupiter_webapi_client.models.home_widget import HomeWidget
from jupiter_webapi_client.models.home_widget_create_args import HomeWidgetCreateArgs
from jupiter_webapi_client.models.home_widget_create_result import HomeWidgetCreateResult
from jupiter_webapi_client.models.widget_dimension import WidgetDimension
from jupiter_webapi_client.models.widget_type import WidgetType
from playwright.sync_api import Page, expect

from itests.helpers import get_parsed_from_response
from itests.webui.entities.conftest import AnotherUserAndWorkspace


@pytest.fixture()
def create_home_tab(logged_in_client: AuthenticatedClient):
    def _create(name: str = "ACL Tab") -> HomeTab:
        result = home_tab_create_sync(
            client=logged_in_client,
            body=HomeTabCreateArgs(
                target=HomeTabTarget.BIG_SCREEN,
                name=name,
            ),
        )
        return get_parsed_from_response(HomeTabCreateResult, result).new_home_tab

    return _create


@pytest.fixture()
def create_home_widget(logged_in_client: AuthenticatedClient):
    def _create(home_tab_ref_id: str) -> HomeWidget:
        result = home_widget_create_sync(
            client=logged_in_client,
            body=HomeWidgetCreateArgs(
                home_tab_ref_id=home_tab_ref_id,
                the_type=WidgetType.MOTD,
                row=0,
                col=0,
                dimension=WidgetDimension.DIM_1X1,
            ),
        )
        return get_parsed_from_response(HomeWidgetCreateResult, result).new_widget

    return _create


def test_webui_home_tab_acl(
    page: Page,
    create_home_tab,
    another_user_and_workspace: AnotherUserAndWorkspace,
) -> None:
    tab = create_home_tab("ACL Tab")
    other_user = another_user_and_workspace.user

    page.locator("#account-menu").click()
    page.locator("#logout").click()
    page.wait_for_url("/app/lifecycle/login/local/login")

    page.locator('input[name="emailAddress"]').fill(other_user.email)
    page.locator('input[name="password"]').fill(other_user.password)
    page.locator("#login").locator("button", has_text="Login").click()
    page.wait_for_url("/app/workspace")

    page.goto(f"/app/workspace/home/settings/tabs/{tab.ref_id}")
    expect(page.locator("body")).to_contain_text(
        f"There was an error loading tab #{tab.ref_id}! Please try again!"
    )


def test_webui_home_widget_acl(
    page: Page,
    create_home_tab,
    create_home_widget,
    another_user_and_workspace: AnotherUserAndWorkspace,
) -> None:
    tab = create_home_tab("ACL Tab")
    widget = create_home_widget(tab.ref_id)
    other_user = another_user_and_workspace.user

    page.locator("#account-menu").click()
    page.locator("#logout").click()
    page.wait_for_url("/app/lifecycle/login/local/login")

    page.locator('input[name="emailAddress"]').fill(other_user.email)
    page.locator('input[name="password"]').fill(other_user.password)
    page.locator("#login").locator("button", has_text="Login").click()
    page.wait_for_url("/app/workspace")

    page.goto(
        f"/app/workspace/home/settings/tabs/{tab.ref_id}/widgets/{widget.ref_id}"
    )
    expect(page.locator("body")).to_contain_text(
        f"There was an error loading tab #{tab.ref_id}! Please try again!"
    )
