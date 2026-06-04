"""Email verification lifecycle integration tests.

Requires a dev stack with EMAIL_VERIFICATION_STRATEGY=verify, e.g.:

  mise run run:srv --email-verification-strategy verify
"""

import re

from playwright.sync_api import Page, expect

from itests.conftest import TestUser


def _goto_init_create_user(page: Page) -> None:
    page.goto("/app")
    page.get_by_role("link", name="Go To The Workspace").click()
    page.locator('input[name="emailAddress"]').click()
    page.get_by_role("link", name="New Workspace").click()
    expect(page.locator("body")).to_contain_text("New Account")


def _submit_init_create_user(page: Page, user: TestUser) -> None:
    page.locator('input[name="userEmailAddress"]').fill(user.email)
    page.locator('input[name="userName"]').fill(user.name)
    page.locator('input[name="authPassword"]').fill(user.password)
    page.locator('input[name="authPasswordRepeat"]').fill(user.password)
    page.get_by_role("button", name="Create").click()
    page.wait_for_url("**/app/lifecycle/email-verification/verify?userId=*")
    expect(page.locator("body")).to_contain_text("Enter Verification Code")


def _fill_verification_code(page: Page, code: str) -> None:
    page.locator('input[name="code"]').fill(code)


def _click_verify(page: Page) -> None:
    page.get_by_role("button", name="Verify").click()


def _click_resend(page: Page) -> None:
    page.get_by_role("button", name="Resend Code").click()


def _submit_init_create_workspace(page: Page) -> None:
    expect(page.locator("body")).to_contain_text("New Workspace")
    page.get_by_role("button", name="Create").click()
    page.wait_for_url("**/app/lifecycle/util/local/show-recovery-token*")


def test_webui_lifecycle_email_verification_create_user_verify_and_workspace(
    page: Page, new_user: TestUser
) -> None:
    _goto_init_create_user(page)
    _submit_init_create_user(page, new_user)

    _fill_verification_code(page, "424242")
    _click_verify(page)

    page.wait_for_url("**/app/lifecycle/init/create-workspace?userId=*")
    _submit_init_create_workspace(page)

    page.get_by_role("link", name="To Workspace").click()
    page.wait_for_url("**/app/workspace")

    expect(page.locator("#trunk-panel-content")).to_contain_text(
        re.compile("There are no tabs to show")
    )


def test_webui_lifecycle_email_verification_returns_after_leaving_create_user(
    page: Page, new_user: TestUser
) -> None:
    _goto_init_create_user(page)
    _submit_init_create_user(page, new_user)

    page.context.clear_cookies()

    page.goto("/app")
    expect(page.locator("body")).to_contain_text("Go To The Workspace")

    page.get_by_role("link", name="Go To The Workspace").click()
    page.wait_for_url("**/app/lifecycle/login/local/login")

    page.locator('input[name="emailAddress"]').fill(new_user.email)
    page.locator('input[name="password"]').fill(new_user.password)
    page.get_by_role("button", name="Login").click()

    page.wait_for_url("**/app/lifecycle/email-verification/verify?userId=*")
    expect(page.locator("body")).to_contain_text("Enter Verification Code")


def test_webui_lifecycle_email_verification_invalid_code_shows_error(
    page: Page, new_user: TestUser
) -> None:
    _goto_init_create_user(page)
    _submit_init_create_user(page, new_user)

    _fill_verification_code(page, "000000")
    _click_verify(page)

    expect(page.locator("body")).to_contain_text(
        "The verification code was incorrect."
    )
    expect(page.get_by_role("button", name="Verify")).to_be_enabled()


def test_webui_lifecycle_email_verification_too_many_wrong_codes(
    page: Page, new_user: TestUser
) -> None:
    _goto_init_create_user(page)
    _submit_init_create_user(page, new_user)

    for _ in range(5):
        _fill_verification_code(page, "000000")
        _click_verify(page)

    expect(page.locator("body")).to_contain_text(
        "The verification code was incorrect too many times. Please request a new code."
    )
    expect(page.get_by_role("button", name="Verify")).to_be_disabled()


def test_webui_lifecycle_email_verification_resend_code_success(
    page: Page, new_user: TestUser
) -> None:
    _goto_init_create_user(page)
    _submit_init_create_user(page, new_user)

    _click_resend(page)

    expect(page.locator("body")).to_contain_text(
        "A new verification code has been sent to your email."
    )
    expect(page.get_by_role("button", name="Resend Code")).to_be_enabled()


def test_webui_lifecycle_email_verification_too_many_resend_attempts(
    page: Page, new_user: TestUser
) -> None:
    _goto_init_create_user(page)
    _submit_init_create_user(page, new_user)

    for _ in range(6):
        _click_resend(page)

    expect(page.locator("body")).to_contain_text(
        "Too many email verification attempts were created recently"
    )
    expect(page.get_by_role("button", name="Resend Code")).to_be_disabled()
