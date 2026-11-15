"""Tests about the keys of the keyboard actions, which the user can change in the
account page (ADR 0021).
"""

from collections.abc import Iterator

import pytest
from jupiter_webapi_client.client import AuthenticatedClient
from playwright.sync_api import Locator, Page, ViewportSize, expect

from itests.helpers import reset_key_bindings, wait_for_hydration

_WIDE: ViewportSize = {"width": 1400, "height": 900}
_ACCOUNT_PAGE = "/app/workspace/account"
_FOOTER = "#strata-footer"
_HINTS = "[data-strata-hints]"


@pytest.fixture(autouse=True)
def _end_with_the_default_keys(logged_in_client: AuthenticatedClient) -> Iterator[None]:
    reset_key_bindings(logged_in_client)
    try:
        yield
    finally:
        reset_key_bindings(logged_in_client)


def _open(page: Page) -> None:
    page.set_viewport_size(_WIDE)
    page.goto(_ACCOUNT_PAGE)
    wait_for_hydration(page)
    expect(page.locator("#key-bindings")).to_be_visible()


def _binding(page: Page, action: str) -> Locator:
    """The button with the key of an action, such as `hints` or `fold-back`."""
    return page.locator(f"#key-binding-{action}")


def _change(page: Page, action: str, key: str) -> None:
    _binding(page, action).click()
    expect(_binding(page, action)).to_have_text("press a key…")
    page.keyboard.press(key)


def test_every_action_shows_its_default_key(page: Page) -> None:
    _open(page)

    expected = {
        "column-previous": "h",
        "column-next": "l",
        "next": "j",
        "previous": "k",
        "open": "↵",
        "edit": "e",
        "collapse": "z",
        "split": "c",
        "fold-back": "⇧c",
        "hints": "s",
        "map": "a",
        "apps": "q",
        "commands": "x",
        "new": "n",
        "find": "f",
        "position-previous": "o",
        "position-next": "p",
        "scroll-top": "⇧k",
        "scroll-bottom": "⇧j",
        "menu": ".",
        "close": "esc",
    }
    for action, label in expected.items():
        expect(_binding(page, action)).to_have_text(label)
    expect(page.locator("#key-bindings-reset")).to_be_disabled()


def test_clicking_a_key_waits_for_the_next_one_and_saves_it(page: Page) -> None:
    _open(page)

    _change(page, "hints", "g")

    expect(_binding(page, "hints")).to_have_text("g")
    expect(page.locator("#key-binding-hints-reset")).to_be_visible()
    # It is kept, not just shown.
    page.reload()
    wait_for_hydration(page)
    expect(_binding(page, "hints")).to_have_text("g")


def test_a_combination_of_keys_can_be_chosen(page: Page) -> None:
    _open(page)

    _change(page, "find", "Control+Shift+F")

    expect(_binding(page, "find")).to_have_text("⌃⇧f")


def test_escape_leaves_the_key_as_it_was(page: Page) -> None:
    _open(page)

    _binding(page, "hints").click()
    expect(_binding(page, "hints")).to_have_text("press a key…")
    page.keyboard.press("Escape")

    expect(_binding(page, "hints")).to_have_text("s")
    expect(page.locator("#key-binding-hints-reset")).to_have_count(0)


def test_a_key_of_another_action_is_refused_with_a_word_on_which(
    page: Page,
) -> None:
    _open(page)

    _change(page, "find", "s")

    warning = page.locator("#key-bindings-warning")
    expect(warning).to_be_visible()
    expect(warning).to_contain_text("Hints")
    # The key was for the choice, not for the action it already has.
    expect(page.locator(_HINTS)).to_have_count(0)
    # Still waiting for a key that is free, and nothing changed.
    expect(_binding(page, "find")).to_have_text("press a key…")
    page.keyboard.press("/")
    expect(_binding(page, "find")).to_have_text("/")
    expect(warning).to_have_count(0)
    expect(_binding(page, "hints")).to_have_text("s")


def test_the_footer_draws_the_keys_the_user_chose(page: Page) -> None:
    _open(page)

    _change(page, "hints", "g")
    expect(_binding(page, "hints")).to_have_text("g")

    entry = page.locator(f"{_FOOTER} [data-strata-footer-key='hints']")
    expect(entry.locator("kbd")).to_have_text(["g"])


def test_the_chosen_key_does_the_action_and_the_default_no_longer_does(
    page: Page,
) -> None:
    _open(page)
    _change(page, "hints", "g")
    expect(_binding(page, "hints")).to_have_text("g")
    # Leave the button, so the keys are the page's.
    page.locator("body").click(position={"x": 5, "y": 5})

    page.keyboard.press("s")
    expect(page.locator(_HINTS)).to_have_count(0)

    page.keyboard.press("g")
    expect(page.locator(_HINTS)).to_be_visible()


def test_one_key_goes_back_to_its_default(page: Page) -> None:
    _open(page)
    _change(page, "hints", "g")
    expect(_binding(page, "hints")).to_have_text("g")

    page.locator("#key-binding-hints-reset").click()

    expect(_binding(page, "hints")).to_have_text("s")
    expect(page.locator("#key-binding-hints-reset")).to_have_count(0)


def test_reset_to_defaults_puts_every_key_back(page: Page) -> None:
    _open(page)
    _change(page, "hints", "g")
    expect(_binding(page, "hints")).to_have_text("g")
    _change(page, "find", "/")
    expect(_binding(page, "find")).to_have_text("/")

    page.locator("#key-bindings-reset").click()

    expect(_binding(page, "hints")).to_have_text("s")
    expect(_binding(page, "find")).to_have_text("f")
    expect(page.locator("#key-bindings-reset")).to_be_disabled()


def test_keys_typed_in_a_field_do_not_do_the_actions(page: Page) -> None:
    _open(page)
    _change(page, "hints", "g")
    expect(_binding(page, "hints")).to_have_text("g")

    page.locator("input[name='name']").click()
    page.keyboard.type("g")

    expect(page.locator(_HINTS)).to_have_count(0)
