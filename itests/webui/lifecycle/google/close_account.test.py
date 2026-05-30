"""Tests for closing an account after Google OAuth login."""

from playwright.sync_api import Page

from itests.webui.lifecycle.google.helpers import (
    close_account,
    setup_google_user_with_workspace,
)


def test_webui_lifecycle_google_close_account(
    page: Page,
    itest_google_user: str,
    itest_google_pass: str,
) -> None:
    setup_google_user_with_workspace(page, itest_google_user, itest_google_pass)

    close_account(page)
