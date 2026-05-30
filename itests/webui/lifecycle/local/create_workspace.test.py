import re

from jupiter_webapi_client.models.init_result import InitResult
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
    page.wait_for_url("**/app/lifecycle/init/create-workspace?userId=*")


def _submit_init_create_workspace(page: Page) -> None:
    expect(page.locator("body")).to_contain_text("New Workspace")
    page.get_by_role("button", name="Create").click()
    page.wait_for_url("**/app/lifecycle/util/local/show-recovery-token*")


def _login(page: Page, user: TestUser) -> None:
    page.goto("/app/workspace")

    expect(page.locator("body")).to_contain_text("Login")

    page.locator('input[name="emailAddress"]').fill(user.email)
    page.locator('input[name="password"]').fill(user.password)

    page.get_by_role("button", name="Login").click()

    # There's some bizzaro interaction that happens between playwright and its
    # messing about with the browser, and Remix and its taking over of the
    # application communication, and especialy the redirects. If there's no wait
    # here then the redirect from "post /login" with cookies will not work!
    page.wait_for_url("/app/workspace")


def _close_account(page: Page) -> None:
    page.goto("/app/workspace/account")

    page.locator("#close-account-initialize").click()
    page.locator("#close-account").click()

    page.wait_for_url("/app/lifecycle/init/local/create-user")


def test_webui_lifecycle_local_create_workspace(
    page: Page, new_random_user: TestUser
) -> None:
    _goto_init_create_user(page)
    _submit_init_create_user(page, new_random_user)
    _submit_init_create_workspace(page)

    page.get_by_role("link", name="To Workspace").click()
    page.wait_for_url("**/app/workspace")

    expect(page.locator("#trunk-panel-content")).to_contain_text(
        re.compile("There are no tabs to show")
    )


def test_webui_lifecycle_local_login_after_user_without_workspace_goes_to_create_workspace(
    page: Page, new_random_user: TestUser
) -> None:
    _goto_init_create_user(page)
    _submit_init_create_user(page, new_random_user)

    page.context.clear_cookies()

    page.goto("/app")
    expect(page.locator("body")).to_contain_text("Go To The Workspace")

    page.get_by_role("link", name="Go To The Workspace").click()
    page.wait_for_url("**/app/lifecycle/login/local/login")

    page.locator('input[name="emailAddress"]').fill(new_random_user.email)
    page.locator('input[name="password"]').fill(new_random_user.password)
    page.get_by_role("button", name="Login").click()

    page.wait_for_url("**/app/lifecycle/init/create-workspace?userId=*")
    expect(page.locator("body")).to_contain_text("New Workspace")


def test_webui_lifecycle_local_create_workspace_already_exists(
    page: Page, new_user_and_workspace: InitResult
) -> None:
    _goto_init_create_user(page)

    new_user = new_user_and_workspace.new_user

    page.locator('input[name="userEmailAddress"]').fill(new_user.email_address)
    page.locator('input[name="userName"]').fill(new_user.name)
    page.locator('input[name="authPassword"]').fill("Random-Random-Password")
    page.locator('input[name="authPasswordRepeat"]').fill("Random-Random-Password")

    page.get_by_role("button", name="Create").click()

    expect(page.locator("body")).to_contain_text("Entity of type User already exists")


def test_webui_lifecycle_local_create_user_archived_account_redirect(
    page: Page,
    new_user: TestUser,
) -> None:
    _login(page, new_user)
    _close_account(page)

    page.locator('input[name="userEmailAddress"]').fill(new_user.email)
    page.locator('input[name="userName"]').fill(new_user.name)
    page.locator('input[name="authPassword"]').fill(new_user.password)
    page.locator('input[name="authPasswordRepeat"]').fill(new_user.password)

    page.get_by_role("button", name="Create").click()

    page.wait_for_url("/app/lifecycle/util/user-already-exists")

    expect(page.locator("body")).to_contain_text("Account Unavailable")
    expect(page.locator("body")).to_contain_text(
        "The user exists but has been archived"
    )
