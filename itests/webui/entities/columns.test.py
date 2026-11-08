"""Tests about the Strata column layout: panels side by side, not over each other."""

import pytest
from playwright.sync_api import FloatRect, Page, ViewportSize, expect

from itests.helpers import wait_for_hydration

_WIDE: ViewportSize = {"width": 1440, "height": 900}
_RAIL_WIDTH = 52
# The small leaf width from the Strata column tokens.
_LEAF_WIDTH = 380
_NEW_HABIT = "/app/workspace/apps/habits/habits/new"


def _box(page: Page, selector: str) -> FloatRect:
    box = page.locator(selector).bounding_box()
    assert box is not None, f"{selector} is not on the page"
    return box


@pytest.mark.usefixtures("_strata_on")
def test_leaf_opens_beside_the_list(page: Page) -> None:
    page.set_viewport_size(_WIDE)
    page.goto(_NEW_HABIT)
    wait_for_hydration(page)

    expect(page.locator("#trunk-panel")).to_be_visible()
    expect(page.locator("#leaf-panel")).to_be_visible()

    trunk = _box(page, "#trunk-panel")
    leaf = _box(page, "#leaf-panel")

    # The list starts at the rail, the leaf starts where the list ends, and the
    # two do not overlap.
    assert trunk["x"] == _RAIL_WIDTH
    assert abs(leaf["x"] - (trunk["x"] + trunk["width"])) <= 1
    # Both reach down to the bottom of the window, below the same top bar.
    assert trunk["y"] == leaf["y"]
    # The leaf keeps its width and the list takes the rest, so no empty strip
    # is left on the right.
    assert leaf["width"] == _LEAF_WIDTH
    assert abs(leaf["x"] + leaf["width"] - _WIDE["width"]) <= 1


@pytest.mark.usefixtures("_strata_on")
def test_a_full_leaf_folds_the_list_to_a_spine_that_brings_it_back(
    page: Page,
) -> None:
    page.set_viewport_size(_WIDE)
    page.goto(_NEW_HABIT)
    wait_for_hydration(page)

    # Small, medium, large, full.
    expand = page.locator("#leaf-panel-controls button").first
    for _ in range(3):
        expand.click()

    expect(page.locator("#trunk-panel")).to_have_attribute("data-folded", "true")
    spine = page.get_by_role("button", name="Show list")
    expect(spine).to_be_visible()

    spine.click()

    expect(page.locator("#trunk-panel")).not_to_have_attribute("data-folded", "true")
    assert _box(page, "#trunk-panel")["width"] > 100


@pytest.mark.usefixtures("_strata_on")
def test_a_tool_page_starts_after_the_rail(page: Page) -> None:
    page.set_viewport_size(_WIDE)
    page.goto("/app/workspace/account")
    wait_for_hydration(page)

    assert _box(page, "#tool-panel")["x"] == _RAIL_WIDTH


def test_classic_keeps_the_leaf_over_the_list(page: Page) -> None:
    page.set_viewport_size(_WIDE)
    page.goto(_NEW_HABIT)
    wait_for_hydration(page)

    trunk = _box(page, "#trunk-panel")
    leaf = _box(page, "#leaf-panel")

    # The list runs the full width behind the leaf, as it always did.
    assert trunk["x"] == 0
    assert trunk["width"] >= leaf["x"] + leaf["width"] - 1
