from playwright.sync_api import BrowserContext, Page, expect


def test_connections_docs_works(page: Page, docs_url: str) -> None:
    """Test that the docs works."""
    page.goto(docs_url)
    expect(page.locator("body")).to_contain_text("Thrive is a tool for life planning")


def test_connections_docs_button_goes_to_docs(
    context: BrowserContext, page: Page, docs_url: str
) -> None:
    """Test that the docs button goes to the docs."""
    page.goto("/app/workspace")
    # Clicking opens a new tab, so set a snare for the new page
    with context.expect_page() as new_page_info:
        page.locator("a#docs-help").click()

    new_page = new_page_info.value

    # Wait for navigation on the new page
    new_page.wait_for_url(docs_url)

    # Assert content in the new tab
    expect(new_page.locator("body")).to_contain_text(
        "Thrive is a tool for life planning"
    )
