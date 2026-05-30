"""Tests for creating a workspace via Google OAuth."""

import re

from playwright.sync_api import Page, expect

from itests.webui.lifecycle.google.helpers import (
    close_account,
    deny_google_access_from_google_link,
    goto_init_create_user,
    setup_google_user_with_workspace,
    sign_in_with_google,
    submit_init_create_workspace,
)


def test_webui_lifecycle_google_create_workspace(
    page: Page,
    itest_google_user: str,
    itest_google_pass: str,
) -> None:
    goto_init_create_user(page)
    sign_in_with_google(page, itest_google_user, itest_google_pass)

    page.wait_for_url("**/app/lifecycle/init/create-workspace?userId=*")
    expect(page.locator("body")).to_contain_text("New Workspace")

    submit_init_create_workspace(page)

    expect(page.locator("#trunk-panel-content")).to_contain_text(
        re.compile("There are no tabs to show")
    )


def test_webui_lifecycle_google_login_after_user_without_workspace_goes_to_create_workspace(
    page: Page,
    itest_google_user: str,
    itest_google_pass: str,
) -> None:
    goto_init_create_user(page)
    sign_in_with_google(page, itest_google_user, itest_google_pass)

    page.wait_for_url("**/app/lifecycle/init/create-workspace?userId=*")
    expect(page.locator("body")).to_contain_text("New Workspace")

    page.context.clear_cookies()

    page.goto("/app")
    expect(page.locator("body")).to_contain_text("Go To The Workspace")

    page.get_by_role("link", name="Go To The Workspace").click()
    page.wait_for_url("**/app/lifecycle/login/local/login")

    sign_in_with_google(page, itest_google_user, itest_google_pass)

    page.wait_for_url("**/app/lifecycle/init/create-workspace?userId=*")
    expect(page.locator("body")).to_contain_text("New Workspace")


def test_webui_lifecycle_google_create_workspace_already_exists_does_a_login(
    page: Page,
    itest_google_user: str,
    itest_google_pass: str,
) -> None:
    setup_google_user_with_workspace(page, itest_google_user, itest_google_pass)

    page.context.clear_cookies()

    goto_init_create_user(page)
    sign_in_with_google(page, itest_google_user, itest_google_pass)

    page.wait_for_url("**/app/workspace")


def test_webui_lifecycle_google_create_user_archived_account_redirect(
    page: Page,
    itest_google_user: str,
    itest_google_pass: str,
) -> None:
    setup_google_user_with_workspace(page, itest_google_user, itest_google_pass)

    close_account(page)

    page.context.clear_cookies()

    sign_in_with_google(page, itest_google_user, itest_google_pass)

    page.wait_for_url("/app/lifecycle/util/user-already-exists")

    expect(page.locator("body")).to_contain_text("Account Unavailable")
    expect(page.locator("body")).to_contain_text(
        "The user exists but has been archived"
    )


def test_webui_lifecycle_google_oauth_rejection_redirects_to_login(
    page: Page,
    itest_google_user: str,
    itest_google_pass: str,
) -> None:
    goto_init_create_user(page)
    deny_google_access_from_google_link(page, itest_google_user, itest_google_pass)

    page.wait_for_url("**/app/lifecycle/login/local/login")
    expect(page.locator("body")).to_contain_text("Login")
