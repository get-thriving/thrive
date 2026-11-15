"""Tests about hint mode: `s` labels what can be pressed, and a label does it."""

import re

from playwright.sync_api import Locator, Page, ViewportSize, expect

from itests.helpers import wait_for_hydration

_WIDE: ViewportSize = {"width": 1400, "height": 900}
_RAIL = 'nav[aria-label="Main"]'
_NEW_HABIT = "/app/workspace/apps/habits/habits/new"
_HINT = "[data-strata-hint]"


def _label_of(element: Locator) -> str:
    """The label hint mode drew on an element, read from where it is drawn."""
    label = element.evaluate(
        """(element) => {
            const rect = element.getBoundingClientRect();
            const left = Math.max(rect.left, 0);
            const top = Math.max(rect.top, 0);
            const hint = [...document.querySelectorAll("[data-strata-hint]")].find(
                (candidate) => {
                    const box = candidate.getBoundingClientRect();
                    return (
                        Math.abs(box.left - left) < 3 && Math.abs(box.top - top) < 3
                    );
                },
            );
            return hint === undefined ? null : hint.dataset.strataHint;
        }""",
    )
    assert isinstance(label, str), "the element has no hint"
    return label


def _open(page: Page) -> None:
    page.set_viewport_size(_WIDE)
    page.goto(_NEW_HABIT)
    wait_for_hydration(page)


def test_g_labels_what_can_be_pressed_and_escape_leaves(page: Page) -> None:
    _open(page)

    page.keyboard.press("s")

    expect(page.locator(_HINT).first).to_be_visible()
    expect(page.locator("[data-strata-hints-status]")).to_contain_text("Go to")
    # The form and the list beside it: more than a letter each can name.
    assert page.locator(_HINT).count() > 5
    expect(page.locator(_HINT).first).to_have_text(re.compile(r"^[a-z]{2}$", re.I))

    # Escape leaves hint mode, and does not close the panel as it does outside it.
    page.keyboard.press("Escape")
    expect(page.locator(_HINT)).to_have_count(0)
    expect(page).to_have_url(re.compile(r"/habits/new"))
    expect(page.locator("#leaf-panel")).to_be_visible()


def test_a_label_takes_a_field_and_types_nothing_into_it(page: Page) -> None:
    _open(page)
    name = page.get_by_label("Name")

    page.keyboard.press("s")
    label = _label_of(name)
    for letter in label:
        page.keyboard.press(letter)

    expect(page.locator(_HINT)).to_have_count(0)
    expect(name).to_be_focused()
    # The letters of the label chose the field, they were not typed into it.
    expect(name).to_have_value("")

    # What is typed next goes in, as hint mode is over.
    page.keyboard.type("walk")
    expect(name).to_have_value("walk")


def test_a_label_presses_a_button(page: Page) -> None:
    _open(page)

    page.keyboard.press("s")
    label = _label_of(page.locator("#open-instant-search"))
    for letter in label:
        page.keyboard.press(letter)

    expect(page.get_by_role("dialog")).to_be_visible()
    expect(page.locator(_HINT)).to_have_count(0)


def test_a_label_follows_a_link(page: Page) -> None:
    _open(page)

    page.keyboard.press("s")
    # The rail is not labelled, so the link is one in the list's column.
    label = _label_of(page.locator("#trunk-panel a[href$='/habits/stacks']"))
    for letter in label:
        page.keyboard.press(letter)

    page.wait_for_url(re.compile(r"/habits/stacks"))
    expect(page.locator(_HINT)).to_have_count(0)


def test_backspace_takes_a_letter_back_and_a_stray_letter_is_ignored(
    page: Page,
) -> None:
    _open(page)

    page.keyboard.press("s")
    total = page.locator(_HINT).count()
    # Every label starts with one of the letters of the alphabet; `q` is not one.
    page.keyboard.press("q")
    expect(page.locator(_HINT)).to_have_count(total)

    first = page.locator(_HINT).first.get_attribute("data-strata-hint")
    assert first is not None
    page.keyboard.press(first[0])
    expect(page.locator("[data-strata-hints-status]")).to_contain_text(first[0])
    assert page.locator(_HINT).count() < total

    page.keyboard.press("Backspace")
    expect(page.locator(_HINT)).to_have_count(total)


def test_s_is_just_a_letter_in_a_field(page: Page) -> None:
    _open(page)
    name = page.get_by_label("Name")

    name.click()
    page.keyboard.press("s")

    expect(name).to_have_value("s")
    expect(page.locator(_HINT)).to_have_count(0)


def test_a_shortcut_leaves_hint_mode_and_goes_on(page: Page) -> None:
    _open(page)

    page.keyboard.press("s")
    expect(page.locator(_HINT).first).to_be_visible()
    page.keyboard.press("Control+k")

    expect(page.get_by_role("dialog")).to_be_visible()
    expect(page.locator(_HINT)).to_have_count(0)


def test_g_labels_only_what_is_in_the_columns(page: Page) -> None:
    _open(page)

    page.keyboard.press("s")

    expect(page.locator(_HINT).first).to_be_visible()
    # Nothing is labelled in the rail or in the top bar: a label there would
    # take a letter from what is in the columns.
    for outside in (_RAIL, "header"):
        inside = page.locator(outside).first.evaluate(
            """(region) => {
                const area = region.getBoundingClientRect();
                return [...document.querySelectorAll("[data-strata-hint]")].filter(
                    (hint) => {
                        const box = hint.getBoundingClientRect();
                        return (
                            box.left >= area.left - 1 &&
                            box.right <= area.right + 1 &&
                            box.top >= area.top - 1 &&
                            box.bottom <= area.bottom + 1
                        );
                    },
                ).length;
            }"""
        )
        assert inside == 0, f"{outside} has {inside} labels"


def test_g_names_the_columns_that_have_labels(page: Page) -> None:
    page.set_viewport_size(_WIDE)
    page.goto("/app/workspace/apps/habits/habits/new")
    wait_for_hydration(page)

    page.keyboard.press("s")

    # The list and the new habit are both open, each with labels in it.
    names = page.locator("[data-strata-hint-column]")
    expect(names).to_have_count(2)
    assert [name.get_attribute("data-strata-hint-column") for name in names.all()] == [
        "Habits",
        "New habit",
    ]
