"""Tests about the account and access pages being stacks of sections (ADR 0021)."""

import pytest
from playwright.sync_api import Page, ViewportSize, expect

from itests.helpers import wait_for_hydration

_WIDE: ViewportSize = {"width": 1400, "height": 900}


@pytest.mark.parametrize(
    ("path", "panel", "sections"),
    [
        (
            "/app/workspace/account",
            "account",
            [
                "picture-section",
                "account-section",
                "sign-in-methods-section",
                "feature-flags-section",
                "appearance-section",
                "keys-section",
                "dangerous-section",
            ],
        ),
        (
            "/app/workspace/access",
            "access",
            ["connected-apps-section", "mcp-keys-section", "api-keys-section"],
        ),
    ],
)
def test_the_page_is_a_stack_of_sections(
    page: Page, path: str, panel: str, sections: list[str]
) -> None:
    page.set_viewport_size(_WIDE)
    page.goto(path)
    wait_for_hydration(page)

    for section in sections:
        expect(
            page.locator(f"[data-strata-section='{section}']"),
        ).to_have_attribute("data-strata-section-panel", panel)


@pytest.mark.parametrize("path", ["/app/workspace/account", "/app/workspace/access"])
def test_the_page_is_as_wide_as_a_tool_page(page: Page, path: str) -> None:
    page.set_viewport_size(_WIDE)
    page.goto(path)
    wait_for_hydration(page)

    # 3 of the 9 units, as the other tool pages are.
    box = page.locator("#trunk-panel").bounding_box()
    assert box is not None
    tool_width = (_WIDE["width"] - 52) / 9 * 3
    assert abs(box["width"] - tool_width) <= 2
