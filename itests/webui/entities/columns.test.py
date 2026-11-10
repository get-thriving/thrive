"""Tests about the Strata unit layout: panels side by side, not over each other."""

import re

from playwright.sync_api import FloatRect, Page, ViewportSize, expect

from itests.helpers import wait_for_hydration

_WIDE: ViewportSize = {"width": 1920, "height": 1000}
# Narrow enough that the life plan, an aspect and a new one cannot all fit,
# and wide enough (5 units) that the life plan still shows part of itself.
_NARROW: ViewportSize = {"width": 1000, "height": 900}
_RAIL_WIDTH = 52
_UNITS_AT_WIDE = 10
_UNIT_AT_WIDE = (_WIDE["width"] - _RAIL_WIDTH) / _UNITS_AT_WIDE
_NEW_HABIT = "/app/workspace/apps/habits/habits/new"
_NEW_ASPECT = "/app/workspace/apps/life-plan/aspects/new"


def _box(page: Page, selector: str) -> FloatRect:
    box = page.locator(selector).bounding_box()
    assert box is not None, f"{selector} is not on the page"
    return box


def test_leaf_opens_beside_the_list(page: Page) -> None:
    page.set_viewport_size(_WIDE)
    page.goto(_NEW_HABIT)
    wait_for_hydration(page)

    expect(page.locator("#trunk-panel")).to_be_visible()
    expect(page.locator("#leaf-panel")).to_be_visible()

    trunk = _box(page, "#trunk-panel")
    leaf = _box(page, "#leaf-panel")

    # The row is 9 of the 10 units, centred, so half a unit is left on each side
    # of it. The leaf starts where the list ends, and the two do not overlap.
    assert abs(trunk["x"] - (_RAIL_WIDTH + _UNIT_AT_WIDE / 2)) <= 1
    assert abs(leaf["x"] - (trunk["x"] + trunk["width"])) <= 1
    # Both reach down to the bottom of the window, below the same top bar.
    assert trunk["y"] == leaf["y"]
    # The habits list is large and grows one step to 7 units, the new habit is
    # small, which is 2.
    assert abs(trunk["width"] - 7 * _UNIT_AT_WIDE) <= 1
    assert abs(leaf["width"] - 2 * _UNIT_AT_WIDE) <= 1


def test_the_room_nothing_took_is_split_to_both_sides(page: Page) -> None:
    page.set_viewport_size(_WIDE)
    page.goto(_NEW_HABIT)
    wait_for_hydration(page)

    trunk = _box(page, "#trunk-panel")
    leaf = _box(page, "#leaf-panel")
    left = _box(page, "#strata-empty-slot-left")
    right = _box(page, "#strata-empty-slot-right")

    assert left["x"] == _RAIL_WIDTH
    assert abs(left["x"] + left["width"] - trunk["x"]) <= 1
    assert abs(right["x"] - (leaf["x"] + leaf["width"])) <= 1
    assert abs(right["x"] + right["width"] - _WIDE["width"]) <= 1
    assert abs(left["width"] - right["width"]) <= 1


def test_the_debug_overlay_describes_the_layout(page: Page) -> None:
    page.set_viewport_size(_WIDE)
    page.goto(f"{_NEW_HABIT}?strata-debug=1")
    wait_for_hydration(page)

    expect(page.locator("#strata-debug-layout")).to_have_text(
        f"X={_UNITS_AT_WIDE} · " "apps/habits/habits:5+2 apps/habits/habits/new:2 _:1"
    )


def test_a_panel_that_does_not_fit_is_a_peek_that_a_click_brings_in(
    page: Page,
) -> None:
    page.set_viewport_size(_NARROW)
    page.goto(_NEW_ASPECT)
    wait_for_hydration(page)

    # The newest panel is whole, and the life plan only partly fits.
    expect(page.locator("#trunk-panel")).to_have_attribute("data-peek", "true")
    expect(page.locator("#leaflet-panel")).not_to_have_attribute("data-peek", "true")

    page.get_by_role("button", name="Show list").click()

    expect(page.locator("#trunk-panel")).not_to_have_attribute("data-peek", "true")
    expect(page.locator("#leaflet-panel")).to_have_attribute("data-folded", "true")


def test_a_spine_brings_its_panel_back(page: Page) -> None:
    page.set_viewport_size(_NARROW)
    page.goto(_NEW_ASPECT)
    wait_for_hydration(page)

    page.get_by_role("button", name="Show list").click()
    expect(page.locator("#leaflet-panel")).to_have_attribute("data-folded", "true")

    page.get_by_role("button", name="Show side detail").click()

    expect(page.locator("#leaflet-panel")).not_to_have_attribute("data-folded", "true")
    assert _box(page, "#leaflet-panel")["width"] > 100


def test_h_and_l_move_the_focus_along_the_panels(page: Page) -> None:
    page.set_viewport_size(_NARROW)
    page.goto(_NEW_ASPECT)
    wait_for_hydration(page)

    # The newest panel starts focused.
    expect(page.locator("#leaflet-panel")).to_have_attribute("data-focused", "true")

    page.keyboard.press("h")
    expect(page.locator("#leaf-panel")).to_have_attribute("data-focused", "true")
    page.keyboard.press("h")
    expect(page.locator("#trunk-panel")).to_have_attribute("data-focused", "true")
    # The focused list is whole now, and the newest panel folded away.
    expect(page.locator("#trunk-panel")).not_to_have_attribute("data-peek", "true")
    expect(page.locator("#leaflet-panel")).to_have_attribute("data-folded", "true")
    expect(page.locator("#trunk-panel")).to_be_focused()

    # There is nothing further left.
    page.keyboard.press("h")
    expect(page.locator("#trunk-panel")).to_have_attribute("data-focused", "true")

    page.keyboard.press("l")
    page.keyboard.press("l")
    expect(page.locator("#leaflet-panel")).to_have_attribute("data-focused", "true")
    expect(page.locator("#leaflet-panel")).not_to_have_attribute("data-folded", "true")


def test_h_and_l_are_just_letters_in_a_field(page: Page) -> None:
    page.set_viewport_size(_NARROW)
    page.goto(_NEW_ASPECT)
    wait_for_hydration(page)

    name = page.get_by_label("Name")
    name.click()
    page.keyboard.type("hall")

    expect(name).to_have_value("hall")
    expect(page.locator("#leaflet-panel")).to_have_attribute("data-focused", "true")


def test_escape_closes_the_focused_panel(page: Page) -> None:
    page.set_viewport_size(_WIDE)
    page.goto(_NEW_HABIT)
    wait_for_hydration(page)
    expect(page.locator("#leaf-panel")).to_be_visible()

    page.keyboard.press("Escape")

    expect(page).to_have_url(re.compile(r"/app/workspace/apps/habits/habits(\?.*)?$"))
    expect(page.locator("#leaf-panel")).to_have_count(0)
    expect(page.locator("#trunk-panel")).to_be_visible()


def test_escape_closes_the_panel_that_has_the_focus(page: Page) -> None:
    page.set_viewport_size(_NARROW)
    page.goto(_NEW_ASPECT)
    wait_for_hydration(page)

    # The list is focused, so Escape closes the list and what is open from it.
    page.keyboard.press("h")
    page.keyboard.press("h")
    expect(page.locator("#trunk-panel")).to_have_attribute("data-focused", "true")
    page.keyboard.press("Escape")

    expect(page).not_to_have_url(re.compile(r"/aspects/new"))
    expect(page.locator("#leaflet-panel")).to_have_count(0)


def test_escape_in_a_field_does_not_close_the_panel(page: Page) -> None:
    page.set_viewport_size(_WIDE)
    page.goto(_NEW_HABIT)
    wait_for_hydration(page)

    page.get_by_label("Name").click()
    page.keyboard.press("Escape")

    expect(page).to_have_url(re.compile(r"/habits/new"))
    expect(page.locator("#leaf-panel")).to_be_visible()


def test_a_leaf_has_no_expansion_controls(page: Page) -> None:
    page.set_viewport_size(_WIDE)
    page.goto(_NEW_HABIT)
    wait_for_hydration(page)

    # Scroll to top, scroll to bottom, return and back. No expand, no shrink.
    expect(page.locator("#leaf-panel-controls button")).to_have_count(4)


def test_the_home_page_takes_the_whole_window(page: Page) -> None:
    page.set_viewport_size(_WIDE)
    page.goto("/app/workspace")
    wait_for_hydration(page)

    trunk = _box(page, "#trunk-panel")

    assert trunk["x"] == _RAIL_WIDTH
    assert abs(trunk["x"] + trunk["width"] - _WIDE["width"]) <= 1
    expect(page.locator("[id^='strata-empty-slot']")).to_have_count(0)


def test_a_tool_page_is_centred_in_the_room_after_the_rail(page: Page) -> None:
    page.set_viewport_size(_WIDE)
    page.goto("/app/workspace/account")
    wait_for_hydration(page)

    # It is 3 of the 10 units, so 3.5 are left on each side.
    tool = _box(page, "#tool-panel")
    assert abs(tool["x"] - (_RAIL_WIDTH + 3.5 * _UNIT_AT_WIDE)) <= 1
    assert abs(tool["width"] - 3 * _UNIT_AT_WIDE) <= 1
