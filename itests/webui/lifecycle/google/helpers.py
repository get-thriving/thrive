"""Shared helpers for Google lifecycle WebUI tests."""

import re

from playwright.sync_api import Page, expect


def goto_init_create_user(page: Page) -> None:
    """Navigate to the new-account page via the front door."""
    page.goto("/app")
    page.get_by_role("link", name="Go To The Workspace").click()
    page.locator('input[name="emailAddress"]').click()
    page.get_by_role("link", name="New Workspace").click()
    expect(page.locator("body")).to_contain_text("New Account")


def _google_login_to_consent_screen(
    page: Page, google_user: str, google_pass: str
) -> None:
    page.wait_for_url(re.compile(r"https://accounts\.google\.com/.*"))

    email_input = page.locator('input[type="email"], input[name="identifier"]').first
    email_input.fill(google_user)
    page.get_by_role("button", name=re.compile(r"^(Next|Continue)$", re.I)).click()

    password_input = page.locator('input[type="password"], input[name="Passwd"]').first
    password_input.wait_for(state="visible")
    password_input.fill(google_pass)
    page.get_by_role("button", name=re.compile(r"^(Next|Continue)$", re.I)).click()

    page.wait_for_url(re.compile(r"https://accounts\.google\.com/.*"))


def complete_google_oauth(page: Page, google_user: str, google_pass: str) -> None:
    """Sign in with Google and grant access on the consent screen."""
    _google_login_to_consent_screen(page, google_user, google_pass)
    page.locator("button", has_text="Continue").click()


def deny_google_oauth_access(page: Page, google_user: str, google_pass: str) -> None:
    """Sign in with Google and deny access on the consent screen."""
    _google_login_to_consent_screen(page, google_user, google_pass)
    page.get_by_role("button", name=re.compile(r"Cancel", re.I)).click()


def sign_in_with_google(page: Page, google_user: str, google_pass: str) -> None:
    """Click the Google link on the current page and complete OAuth."""
    page.get_by_role("link", name="Google").click()
    complete_google_oauth(page, google_user, google_pass)


def deny_google_access_from_google_link(
    page: Page, google_user: str, google_pass: str
) -> None:
    """Click the Google link on the current page and deny OAuth access."""
    page.get_by_role("link", name="Google").click()
    deny_google_oauth_access(page, google_user, google_pass)


def submit_init_create_workspace(page: Page) -> None:
    """Submit the init create-workspace form and wait for the workspace."""
    expect(page.locator("body")).to_contain_text("New Workspace")
    page.get_by_role("button", name="Create").click()
    page.wait_for_url("**/app/workspace")


def setup_google_user_with_workspace(
    page: Page, google_user: str, google_pass: str
) -> None:
    """Create a Google user and workspace through the full init flow."""
    goto_init_create_user(page)
    sign_in_with_google(page, google_user, google_pass)
    page.wait_for_url("**/app/lifecycle/init/create-workspace?userId=*")
    submit_init_create_workspace(page)


def login_with_google_from_login_page(
    page: Page, google_user: str, google_pass: str
) -> None:
    """Sign in with Google from the local login page."""
    page.goto("/app/workspace")

    page.wait_for_load_state("networkidle")

    expect(page.locator("body")).to_contain_text("Login")

    sign_in_with_google(page, google_user, google_pass)

    page.wait_for_url("/app/workspace")


def close_account(page: Page) -> None:
    """Close the current account from the account settings page."""
    page.goto("/app/workspace/account")

    page.locator("#close-account-initialize").click()
    page.locator("#close-account").click()

    page.wait_for_url("/app/lifecycle/init/local/create-user")
