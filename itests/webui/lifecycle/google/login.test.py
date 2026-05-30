"""Tests for logging in via Google OAuth."""

from playwright.sync_api import Page

from itests.webui.lifecycle.google.helpers import (
    login_with_google_from_login_page,
    setup_google_user_with_workspace,
)


def test_webui_lifecycle_google_login(
    page: Page,
    itest_google_user: str,
    itest_google_pass: str,
) -> None:
    setup_google_user_with_workspace(page, itest_google_user, itest_google_pass)

    page.context.clear_cookies()

    login_with_google_from_login_page(page, itest_google_user, itest_google_pass)
