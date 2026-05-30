"""Tests for logging out after Google OAuth login."""

from playwright.sync_api import Page, expect

from itests.webui.lifecycle.google.helpers import setup_google_user_with_workspace


def test_webui_lifecycle_google_logout(
    page: Page,
    itest_google_user: str,
    itest_google_pass: str,
) -> None:
    setup_google_user_with_workspace(page, itest_google_user, itest_google_pass)

    page.locator("#account-menu").click()
    page.locator("#logout").click()

    page.wait_for_url("/app/lifecycle/login/local/login")

    expect(page.locator("body")).to_contain_text("Login")
