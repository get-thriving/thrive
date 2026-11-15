"""Tests about the color scheme: light or dark, picked by the user or the device's."""

from collections.abc import Iterator

import pytest
from jupiter_webapi_client.client import AuthenticatedClient
from jupiter_webapi_client.models.color_scheme import ColorScheme
from playwright.sync_api import Page, expect

from itests.helpers import set_color_scheme, wait_for_hydration

_WORKSPACE = "/app/workspace"
_ACCOUNT_PAGE = "/app/workspace/account"
_LIGHT_GROUND = "rgb(241, 239, 235)"
_DARK_GROUND = "rgb(14, 16, 18)"


@pytest.fixture(autouse=True)
def _end_following_the_device(logged_in_client: AuthenticatedClient) -> Iterator[None]:
    set_color_scheme(logged_in_client, ColorScheme.SYSTEM)
    try:
        yield
    finally:
        set_color_scheme(logged_in_client, ColorScheme.SYSTEM)


@pytest.mark.parametrize("device", ["light", "dark"])
def test_it_follows_the_device_by_default(page: Page, device: str) -> None:
    page.emulate_media(color_scheme="light" if device == "light" else "dark")
    page.goto(_WORKSPACE)
    wait_for_hydration(page)

    expect(page.locator("html")).to_have_attribute("data-color-scheme", device)
    expect(page.locator("body")).to_have_css(
        "background-color", _LIGHT_GROUND if device == "light" else _DARK_GROUND
    )


def test_a_scheme_the_user_picked_wins_over_the_device(
    page: Page, logged_in_client: AuthenticatedClient
) -> None:
    set_color_scheme(logged_in_client, ColorScheme.DARK)
    page.emulate_media(color_scheme="light")
    page.goto(_WORKSPACE)
    wait_for_hydration(page)

    expect(page.locator("html")).to_have_attribute("data-color-scheme", "dark")
    expect(page.locator("body")).to_have_css("background-color", _DARK_GROUND)


def test_the_account_page_picks_the_scheme(page: Page) -> None:
    page.emulate_media(color_scheme="light")
    page.goto(_ACCOUNT_PAGE)
    wait_for_hydration(page)

    appearance = page.locator("#appearance-section")
    appearance.get_by_role("combobox", name="Color scheme").click()
    page.get_by_role("option", name="Dark").click()
    appearance.get_by_role("button", name="Save").click()

    expect(page.locator("html")).to_have_attribute("data-color-scheme", "dark")
    expect(page.locator("body")).to_have_css("background-color", _DARK_GROUND)
