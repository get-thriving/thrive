"""Tests about the shell around the pages: the Strata icon rail and command bar."""

from collections.abc import Iterator

import pytest
from jupiter_webapi_client.api.users.web_ui_settings_update import (
    sync_detailed as web_ui_settings_update_sync,
)
from jupiter_webapi_client.client import AuthenticatedClient
from jupiter_webapi_client.models.ui_style import UiStyle
from jupiter_webapi_client.models.web_ui_settings_update_args import (
    WebUiSettingsUpdateArgs,
)
from jupiter_webapi_client.models.web_ui_settings_update_args_ui_style import (
    WebUiSettingsUpdateArgsUiStyle,
)
from jupiter_webapi_client.models.web_ui_settings_update_args_use_night_mode import (
    WebUiSettingsUpdateArgsUseNightMode,
)
from playwright.sync_api import Page, ViewportSize, expect

from itests.helpers import wait_for_hydration

_RAIL = 'nav[aria-label="Main"]'
# The rail needs room beside the centred panels, so it only shows from here up.
_WIDE: ViewportSize = {"width": 1400, "height": 900}
_NARROW: ViewportSize = {"width": 1024, "height": 800}


def _set_ui_style(client: AuthenticatedClient, ui_style: UiStyle) -> None:
    response = web_ui_settings_update_sync(
        client=client,
        body=WebUiSettingsUpdateArgs(
            use_night_mode=WebUiSettingsUpdateArgsUseNightMode(should_change=False),
            ui_style=WebUiSettingsUpdateArgsUiStyle(should_change=True, value=ui_style),
        ),
    )
    assert response.status_code == 200, response.content


@pytest.fixture()
def _strata_on(logged_in_client: AuthenticatedClient) -> Iterator[None]:
    """Turn Strata on for the user, and back off afterwards."""
    _set_ui_style(logged_in_client, UiStyle.STRATA)
    try:
        yield
    finally:
        _set_ui_style(logged_in_client, UiStyle.CLASSIC)


@pytest.mark.usefixtures("_strata_on")
def test_rail_shows_only_the_enabled_features(page: Page) -> None:
    page.set_viewport_size(_WIDE)
    page.goto("/app/workspace")
    wait_for_hydration(page)

    rail = page.locator(_RAIL)
    expect(rail).to_be_visible()

    # The workspace has todos, habits and docs on, and nothing else optional.
    labels = [link.get_attribute("aria-label") for link in rail.locator("a").all()]
    assert labels == ["Home", "Inbox Tasks", "Todos", "Habits", "Docs"]

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
