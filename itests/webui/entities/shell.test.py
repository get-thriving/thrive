"""Tests about the shell around the pages: the Strata icon rail and command bar."""

import pytest
from jupiter_webapi_client.client import AuthenticatedClient
from jupiter_webapi_client.models.ui_style import UiStyle
from playwright.sync_api import Page, ViewportSize, expect

from itests.helpers import set_ui_style, wait_for_hydration

_RAIL = 'nav[aria-label="Main"]'
# The rail needs room beside the centred panels, so it only shows from here up.
_WIDE: ViewportSize = {"width": 1400, "height": 900}
# Wide enough for the rail with labels, which needs more room again.
_WIDER: ViewportSize = {"width": 1700, "height": 900}
_NARROW: ViewportSize = {"width": 800, "height": 800}
# Wide enough for the icon rail and columns, but too narrow for the labelled one.
_MID: ViewportSize = {"width": 1100, "height": 900}


@pytest.mark.usefixtures("_strata_on")
def test_rail_shows_only_the_enabled_features(page: Page) -> None:
    page.set_viewport_size(_WIDE)
    page.goto("/app/workspace")
    wait_for_hydration(page)

    rail = page.locator(_RAIL)
    expect(rail).to_be_visible()

    # The workspace has todos, habits and docs on, and nothing else optional.
    labels = [link.get_attribute("aria-label") for link in rail.locator("a").all()]
    assert labels == ["Home", "Todos", "Habits", "Docs"]

    expect(rail.get_by_label("Home")).to_have_attribute("aria-current", "page")
    expect(rail.get_by_label("Big Plans")).to_have_count(0)


@pytest.mark.usefixtures("_strata_on")
def test_rail_navigates_and_marks_the_current_entry(page: Page) -> None:
    page.set_viewport_size(_WIDE)
    page.goto("/app/workspace")
    wait_for_hydration(page)

    rail = page.locator(_RAIL)
    rail.get_by_label("Habits").click()

    page.wait_for_url("**/app/workspace/apps/habits**")
    expect(rail.get_by_label("Habits")).to_have_attribute("aria-current", "page")
    expect(rail.get_by_label("Home")).not_to_have_attribute("aria-current", "page")


@pytest.mark.usefixtures("_strata_on")
def test_more_popover_reaches_the_rest(page: Page) -> None:
    page.set_viewport_size(_WIDE)
    page.goto("/app/workspace")
    wait_for_hydration(page)

    page.locator(_RAIL).get_by_label("More").click()

    menu = page.get_by_role("menu")
    expect(menu).to_be_visible()
    expect(menu.get_by_role("menuitem").first).to_be_visible()

    # Inbox Tasks is not on the rail itself; it sits in Core, below Collaboration.
    items = [item.inner_text().strip() for item in menu.get_by_role("menuitem").all()]
    assert items.index("Inbox Tasks") == items.index("Collaboration") + 1


@pytest.mark.usefixtures("_strata_on")
def test_command_key_opens_search(page: Page) -> None:
    page.set_viewport_size(_WIDE)
    page.goto("/app/workspace")
    wait_for_hydration(page)

    page.keyboard.press("Control+k")

    expect(page.get_by_role("dialog")).to_be_visible()
    expect(
        page.get_by_role("dialog").get_by_role("textbox", name="Query")
    ).to_be_visible()


@pytest.mark.usefixtures("_strata_on")
def test_narrow_screen_falls_back_to_the_drawer(page: Page) -> None:
    page.set_viewport_size(_NARROW)
    page.goto("/app/workspace")
    wait_for_hydration(page)

    expect(page.locator(_RAIL)).to_have_count(0)


def test_classic_has_no_rail(page: Page) -> None:
    page.set_viewport_size(_WIDE)
    page.goto("/app/workspace")
    wait_for_hydration(page)

    expect(page.locator(_RAIL)).to_have_count(0)


@pytest.mark.usefixtures("_strata_on")
def test_expanding_the_rail_shows_labels_and_is_remembered(page: Page) -> None:
    page.set_viewport_size(_WIDER)
    page.goto("/app/workspace")
    wait_for_hydration(page)

    rail = page.locator(_RAIL)
    narrow_width = rail.bounding_box()["width"]  # type: ignore[index]
    expect(rail.get_by_text("Docs")).to_have_count(0)

    # The save goes out in the background, so a reload right after the click
    # could beat it.
    with page.expect_response(
        lambda r: "/app/workspace/account" in r.url and r.request.method == "POST"
    ):
        rail.get_by_label("Expand sidebar").click()

    expect(rail.get_by_text("Docs")).to_be_visible()
    expect(rail.get_by_label("Collapse sidebar")).to_be_visible()
    assert rail.bounding_box()["width"] > narrow_width  # type: ignore[index]

    # The choice is a setting of the user, so a fresh load keeps it.
    page.reload()
    wait_for_hydration(page)
    expect(page.locator(_RAIL).get_by_text("Docs")).to_be_visible()

    page.locator(_RAIL).get_by_label("Collapse sidebar").click()
    expect(page.locator(_RAIL).get_by_text("Docs")).to_have_count(0)


def test_expanded_rail_gives_way_when_the_window_is_too_narrow(
    page: Page, logged_in_client: AuthenticatedClient
) -> None:
    set_ui_style(logged_in_client, UiStyle.STRATA, use_expanded_rail=True)
    try:
        page.set_viewport_size(_MID)
        page.goto("/app/workspace")
        wait_for_hydration(page)

        rail = page.locator(_RAIL)
        expect(rail).to_be_visible()
        expect(rail.get_by_text("Docs")).to_have_count(0)
        expect(rail.get_by_label("Expand sidebar")).to_have_count(0)
    finally:
        set_ui_style(logged_in_client, UiStyle.CLASSIC, use_expanded_rail=False)
