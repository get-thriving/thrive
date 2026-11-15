"""Tests about the menu of apps and pages that `q` opens (ADR 0021): every place
the left rail and the right of the app bar lead to, each with a letter to type.
"""

from collections.abc import Iterator

import pytest
from jupiter_webapi_client.api.test_helper.workspace_set_feature import (
    sync_detailed as workspace_set_feature_sync,
)
from jupiter_webapi_client.client import AuthenticatedClient
from jupiter_webapi_client.models.workspace_feature import WorkspaceFeature
from jupiter_webapi_client.models.workspace_set_feature_args import (
    WorkspaceSetFeatureArgs,
)
from playwright.sync_api import Locator, Page, ViewportSize, expect

from itests.helpers import wait_for_hydration

_WIDE: ViewportSize = {"width": 1400, "height": 900}
_HOME = "/app/workspace"
_MENU = "[data-strata-app-menu]"
_FOOTER = "#strata-footer"


@pytest.fixture(autouse=True, scope="module")
def _habits_off_and_chores_on(logged_in_client: AuthenticatedClient) -> Iterator[None]:
    """One app that is enabled and one that is not, to tell them apart."""
    workspace_set_feature_sync(
        client=logged_in_client,
        body=WorkspaceSetFeatureArgs(feature=WorkspaceFeature.CHORES, value=True),
    )
    workspace_set_feature_sync(
        client=logged_in_client,
        body=WorkspaceSetFeatureArgs(feature=WorkspaceFeature.HABITS, value=False),
    )
    try:
        yield
    finally:
        workspace_set_feature_sync(
            client=logged_in_client,
            body=WorkspaceSetFeatureArgs(feature=WorkspaceFeature.CHORES, value=False),
        )


def _open(page: Page, path: str = _HOME) -> None:
    page.set_viewport_size(_WIDE)
    page.goto(path)
    wait_for_hydration(page)
    page.locator("body").click(position={"x": 5, "y": 5})


def _entry(page: Page, label: str) -> Locator:
    return page.locator(f"{_MENU} [data-strata-app-menu-entry='{label}']")


def _type_label_of(page: Page, label: str) -> None:
    """Type the letters the menu shows next to an entry."""
    letters = _entry(page, label).locator("[data-strata-app-menu-label]")
    page.keyboard.type(letters.get_attribute("data-strata-app-menu-label") or "")


def test_q_opens_the_menu_and_escape_closes_it(page: Page) -> None:
    _open(page)

    page.keyboard.press("q")
    expect(page.locator(_MENU)).to_be_visible()

    page.keyboard.press("Escape")
    expect(page.locator(_MENU)).to_have_count(0)


def test_it_lists_the_enabled_apps_and_not_the_others(page: Page) -> None:
    _open(page)

    page.keyboard.press("q")

    apps = page.locator(f"{_MENU} [data-strata-app-menu-section='apps']")
    expect(apps.locator("[data-strata-app-menu-entry='Home']")).to_be_visible()
    expect(apps.locator("[data-strata-app-menu-entry='Chores']")).to_be_visible()
    expect(apps.locator("[data-strata-app-menu-entry='Habits']")).to_have_count(0)


def test_it_lists_the_support_pages_and_the_account_after_the_apps(
    page: Page,
) -> None:
    _open(page)

    page.keyboard.press("q")

    pages = page.locator(f"{_MENU} [data-strata-app-menu-section='pages']")
    for label in ("Report", "Inbox Tasks", "Tags", "Generate Tasks"):
        expect(pages.locator(f"[data-strata-app-menu-entry='{label}']")).to_be_visible()
    account = page.locator(f"{_MENU} [data-strata-app-menu-section='account']")
    for label in ("Account", "Access", "Settings", "Community", "Help"):
        expect(
            account.locator(f"[data-strata-app-menu-entry='{label}']")
        ).to_be_visible()
    # The three sections, in this order, with a rule between each.
    sections = page.locator(f"{_MENU} [data-strata-app-menu-section]")
    expect(sections).to_have_count(3)
    expect(page.locator(f"{_MENU} hr")).to_have_count(2)


def test_typing_the_letters_of_an_app_goes_there(page: Page) -> None:
    _open(page)
    page.keyboard.press("q")

    _type_label_of(page, "Chores")

    page.wait_for_url("**/app/workspace/apps/chores**")
    expect(page.locator(_MENU)).to_have_count(0)


def test_typing_the_letters_of_a_page_goes_there(page: Page) -> None:
    _open(page)
    page.keyboard.press("q")

    _type_label_of(page, "Account")

    page.wait_for_url("**/app/workspace/account")
    expect(page.locator(_MENU)).to_have_count(0)


def test_clicking_an_entry_goes_there(page: Page) -> None:
    _open(page)
    page.keyboard.press("q")

    _entry(page, "Access").click()

    page.wait_for_url("**/app/workspace/access")


def test_a_key_that_is_no_label_is_held_back(page: Page) -> None:
    _open(page)
    url = page.url
    page.keyboard.press("q")
    typed = page.locator("[data-strata-app-menu-typed]")
    expect(typed).to_have_text("type a label")

    page.keyboard.press("1")
    page.keyboard.press("Backspace")

    expect(page.locator(_MENU)).to_be_visible()
    expect(typed).to_have_text("type a label")
    assert page.url == url


def test_the_footer_says_how_to_use_it(page: Page) -> None:
    _open(page)
    expect(page.locator(f"{_FOOTER} [data-strata-footer-key='apps'] kbd")).to_have_text(
        ["q"]
    )

    page.keyboard.press("q")

    expect(page.locator(f"{_FOOTER} [data-strata-footer-key]").first).to_have_text(
        "type a label to go there"
    )


def test_q_in_a_field_does_not_open_it(page: Page) -> None:
    _open(page, "/app/workspace/account")

    page.locator("input[name='name']").click()
    page.keyboard.type("q")

    expect(page.locator(_MENU)).to_have_count(0)


def test_a_key_of_the_menu_does_not_start_hints(page: Page) -> None:
    _open(page)
    page.keyboard.press("q")

    # `s` is the key of hint mode, and a letter of the menu: the menu has it.
    page.keyboard.press("s")

    expect(page.locator("[data-strata-hints]")).to_have_count(0)
