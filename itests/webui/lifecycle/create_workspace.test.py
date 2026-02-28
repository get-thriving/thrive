import re

from jupiter_webapi_client.models.init_result import InitResult
from playwright.sync_api import Page, expect

from itests.conftest import TestUser


def test_webui_create_workspace(page: Page, new_random_user: TestUser) -> None:
    page.goto("/app")

    page.get_by_role("link", name="Go To The Workspace").click()
    page.locator('input[name="emailAddress"]').click()
    page.get_by_role("link", name="New Workspace").click()
    page.locator('input[name="userEmailAddress"]').fill(new_random_user.email)
    page.locator('input[name="userName"]').fill(new_random_user.name)
    page.locator('input[name="authPassword"]').fill(new_random_user.password)
    page.locator('input[name="authPasswordRepeat"]').fill(new_random_user.password)

    page.get_by_role("button", name="Create").click()

    page.get_by_role("link", name="To Workspace").click()

    expect(page.locator("#trunk-panel-content")).to_contain_text(
        re.compile("There are no tabs to show")
    )


def test_webui_create_workspace_already_exists(
    page: Page, new_user_and_workspace: InitResult
) -> None:
    page.goto("/app")

    new_user = new_user_and_workspace.new_user

    page.get_by_role("link", name="Go To The Workspace").click()
    page.locator('input[name="emailAddress"]').click()
    page.get_by_role("link", name="New Workspace").click()
    page.locator('input[name="userEmailAddress"]').fill(new_user.email_address)
    page.locator('input[name="userName"]').fill(new_user.name)
    page.locator('input[name="authPassword"]').fill("Random-Random-Password")
    page.locator('input[name="authPasswordRepeat"]').fill("Random-Random-Password")

    page.get_by_role("button", name="Create").click()

    expect(page.locator("body")).to_contain_text("Entity of type User already exists")
