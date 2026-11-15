"""Tests about the menu of new items that `n` opens (ADR 0021): every kind of
item the workspace can create, each with a letter to type that goes to the page
that creates it.
"""

import re

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
_PHONE: ViewportSize = {"width": 390, "height": 844}
_HOME = "/app/workspace"
_MENU = "[data-strata-new-menu]"
_FOOTER = "#strata-footer"


@pytest.fixture(autouse=True, scope="module")
def _habits_on_and_chores_off(logged_in_client: AuthenticatedClient) -> None:
    """One app that is enabled and one that is not, to tell them apart."""
    workspace_set_feature_sync(
        client=logged_in_client,
        body=WorkspaceSetFeatureArgs(feature=WorkspaceFeature.HABITS, value=True),
    )
    workspace_set_feature_sync(
        client=logged_in_client,
        body=WorkspaceSetFeatureArgs(feature=WorkspaceFeature.CHORES, value=False),
    )
    return


def _open(page: Page, path: str = _HOME) -> None:
    page.set_viewport_size(_WIDE)
    page.goto(path)
    wait_for_hydration(page)
    page.locator("body").click(position={"x": 5, "y": 5})


def _entry(page: Page, label: str) -> Locator:
    return page.locator(f"{_MENU} [data-strata-new-menu-entry='{label}']")


def _type_label_of(page: Page, label: str) -> None:
    """Type the letters the menu shows next to an entry."""
    letters = _entry(page, label).locator("[data-strata-new-menu-label]")
    page.keyboard.type(letters.get_attribute("data-strata-new-menu-label") or "")


def test_n_opens_the_menu_and_escape_closes_it(page: Page) -> None:
    _open(page)

    page.keyboard.press("n")
    expect(page.locator(_MENU)).to_be_visible()

    page.keyboard.press("Escape")
    expect(page.locator(_MENU)).to_have_count(0)


def test_it_lists_the_kinds_of_enabled_apps_and_not_the_others(page: Page) -> None:
    _open(page)

    page.keyboard.press("n")

    expect(_entry(page, "Habit")).to_be_visible()
    expect(_entry(page, "Habit stack")).to_be_visible()
    expect(_entry(page, "Chore")).to_have_count(0)
    # What belongs to no app is always there.
    expect(_entry(page, "Tag")).to_be_visible()


def test_the_kinds_are_under_the_name_of_their_app(page: Page) -> None:
    _open(page)

    page.keyboard.press("n")

    habits = page.locator(f"{_MENU} [data-strata-new-menu-group='Habits']")
    expect(habits.locator("[data-strata-new-menu-entry]")).to_have_text(
        ["Habit", "Habit stack"]
    )


def test_typing_the_letters_goes_to_the_page_that_creates_it(page: Page) -> None:
    _open(page)
    page.keyboard.press("n")

    _type_label_of(page, "Habit")

    expect(page.locator(_MENU)).to_have_count(0)
    expect(page).to_have_url(re.compile(r"/apps/habits/habits/new$"))


def test_a_label_of_two_letters_waits_for_the_second(page: Page) -> None:
    _open(page)
    page.keyboard.press("n")
    letters = (
        _entry(page, "Contact")
        .locator("[data-strata-new-menu-label]")
        .get_attribute("data-strata-new-menu-label")
        or ""
    )
    assert len(letters) == 2

    page.keyboard.press(letters[0])
    expect(page.locator(_MENU)).to_be_visible()
    page.keyboard.press(letters[1])

    expect(page).to_have_url(re.compile(r"/core/contacts/new$"))


def test_clicking_a_kind_goes_to_its_page(page: Page) -> None:
    _open(page)
    page.keyboard.press("n")

    _entry(page, "Tag").click()

    expect(page).to_have_url(re.compile(r"/core/tags/new$"))


def test_a_key_that_is_no_label_is_held_back(page: Page) -> None:
    _open(page)
    page.keyboard.press("n")

    page.keyboard.press("1")

    expect(page.locator(_MENU)).to_be_visible()


def test_the_footer_says_how_to_use_it(page: Page) -> None:
    _open(page)
    page.keyboard.press("n")

    expect(page.locator(_FOOTER)).to_contain_text("type a label to start it")


def test_the_footer_lists_the_key_when_it_is_closed(page: Page) -> None:
    _open(page)

    expect(page.locator(f"{_FOOTER} [data-strata-footer-key='new'] kbd")).to_have_text(
        ["n"]
    )


def test_n_in_a_field_does_not_open_it(page: Page) -> None:
    _open(page, "/app/workspace/core/tags/new")
    page.locator("input[name='name']").click()

    page.keyboard.type("n")

    expect(page.locator(_MENU)).to_have_count(0)


def test_it_is_off_on_a_phone(page: Page) -> None:
    _open(page)
    page.set_viewport_size(_PHONE)

    page.keyboard.press("n")

    expect(page.locator(_MENU)).to_have_count(0)
