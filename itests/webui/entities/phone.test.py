"""Tests about Strata on a small screen: one panel at a time, with its own bar."""

import re

import pytest
from playwright.sync_api import Page, ViewportSize, expect

from itests.helpers import wait_for_hydration

_PHONE: ViewportSize = {"width": 390, "height": 844}
_NEW_HABIT = "/app/workspace/apps/habits/habits/new"
_STRIP = "#strata-column-strip"


@pytest.mark.usefixtures("_strata_on")
def test_the_phone_has_its_own_top_bar(page: Page) -> None:
    page.set_viewport_size(_PHONE)
    page.goto("/app/workspace")
    wait_for_hydration(page)

    expect(page.locator("#strata-phone-title")).to_have_text("Home")
    expect(page.get_by_label("Search")).to_be_visible()
    # One panel is open, so there is nothing to count.
    expect(page.locator(_STRIP)).to_have_count(0)


@pytest.mark.usefixtures("_strata_on")
def test_the_menu_is_a_drawer_with_the_rail_entries(page: Page) -> None:
    page.set_viewport_size(_PHONE)
    page.goto("/app/workspace")
    wait_for_hydration(page)

    page.get_by_label("Open the menu").click()
    drawer = page.locator("#strata-drawer")
    expect(drawer.get_by_label("Docs")).to_be_visible()
    expect(drawer.get_by_text("Docs")).to_be_visible()

    # Picking a destination goes there and puts the drawer away.
    drawer.get_by_label("Habits").click()
    expect(page).to_have_url(re.compile(r"/habits"))
    expect(drawer).to_have_count(0)


@pytest.mark.usefixtures("_strata_on")
def test_the_account_menu_holds_what_the_bar_has_no_room_for(page: Page) -> None:
    page.set_viewport_size(_PHONE)
    page.goto("/app/workspace")
    wait_for_hydration(page)

    expect(page.locator("#collaboration-link")).to_have_count(0)

    page.locator("#account-menu").click()
    menu = page.get_by_role("menu")
    for name in ["Collaboration", "Community", "Help", "Account"]:
        expect(menu.get_by_role("menuitem", name=name)).to_be_visible()


@pytest.mark.usefixtures("_strata_on")
def test_a_leaf_fills_the_screen_with_a_strip_of_its_list(page: Page) -> None:
    page.set_viewport_size(_PHONE)
    page.goto(_NEW_HABIT)
    wait_for_hydration(page)

    expect(page.locator(_STRIP)).to_contain_text("column 2 of 2")
    trunk = page.locator("#trunk-panel").bounding_box()
    leaf = page.locator("#leaf-panel").bounding_box()
    assert trunk is not None
    assert leaf is not None
    assert trunk["width"] == 10
    assert leaf["x"] == 10
    assert abs(leaf["x"] + leaf["width"] - _PHONE["width"]) <= 1


@pytest.mark.usefixtures("_strata_on")
def test_back_shows_the_list_and_a_sliver_brings_the_leaf_back(page: Page) -> None:
    page.set_viewport_size(_PHONE)
    page.goto(_NEW_HABIT)
    wait_for_hydration(page)

    page.get_by_label("Back to the previous panel").click()

    expect(page.locator(_STRIP)).to_contain_text("column 1 of 2")
    expect(page.locator("#trunk-panel")).to_have_attribute("data-focused", "true")
    # The list is on screen, not hidden because something is open from it.
    expect(page.locator("#trunk-panel-controls")).to_be_visible()
    # What was open from it waits at the edge, with its name.
    sliver = page.get_by_role("button", name="Show detail")
    expect(sliver).to_be_visible()

    sliver.click()

    expect(page.locator(_STRIP)).to_contain_text("column 2 of 2")
    expect(page.locator("#leaf-panel")).to_have_attribute("data-focused", "true")


def test_classic_keeps_its_own_phone_layout(page: Page) -> None:
    page.set_viewport_size(_PHONE)
    page.goto(_NEW_HABIT)
    wait_for_hydration(page)

    expect(page.locator(_STRIP)).to_have_count(0)
    expect(page.locator("#strata-phone-title")).to_have_count(0)
    expect(page.locator("#show-sidebar")).to_be_visible()
