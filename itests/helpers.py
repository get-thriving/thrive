"""Helpers for the tests."""

from typing import Type, TypeVar, cast

from jupiter_webapi_client.types import Response
from playwright.sync_api import Locator, Page
from playwright.sync_api import Response as PlaywrightResponse

T = TypeVar("T")
S = TypeVar("S")  # whatever the Response actually contains (may be a union)

DEFAULT_EDITORJS_KEYSTROKE_DELAY_MS = 30
DEFAULT_EDITORJS_SAVE_TIMEOUT_MS = 30_000


def type_editorjs_content_and_wait_for_save(
    page: Page,
    text: str,
    *,
    editor_holder: Locator,
    save_url_substring: str,
    keystroke_delay_ms: int = DEFAULT_EDITORJS_KEYSTROKE_DELAY_MS,
    timeout_ms: int = DEFAULT_EDITORJS_SAVE_TIMEOUT_MS,
) -> None:
    """Drive EditorJS like a user and wait for the Remix save POST.

    Playwright ``fill`` on ``contenteditable`` does not run EditorJS ``onChange``,
    so the app never submits an update.
    """
    editor_holder.wait_for(state="visible", timeout=timeout_ms)
    editable = editor_holder.locator('[contenteditable="true"]').first
    editable.wait_for(state="visible", timeout=timeout_ms)
    editable.click()

    def matches_save(resp: PlaywrightResponse) -> bool:
        return (
            resp.request.method == "POST" and save_url_substring in resp.url and resp.ok
        )

    with page.expect_response(matches_save, timeout=timeout_ms):
        page.keyboard.type(text, delay=keystroke_delay_ms)


def type_entity_note_editor_and_wait_for_save(page: Page, text: str) -> None:
    """``EntityNoteEditor`` submits to ``/app/workspace/core/notes/update``."""
    type_editorjs_content_and_wait_for_save(
        page,
        text,
        editor_holder=page.locator("#entity-block-editor"),
        save_url_substring="core/notes/update",
    )


def get_parsed_from_response(clazz: Type[T], response: Response[S]) -> T:
    """Get the parsed response as a specific type."""
    if response.status_code != 200:
        raise ValueError(f"Unexpected status code: {response.status_code}")
    if response.parsed is None:
        raise ValueError("Response parsed is None")
    # Optional safety: ensure it's the expected type at runtime
    if not isinstance(response.parsed, clazz):
        raise TypeError(
            f"Expected {clazz.__name__}, got {type(response.parsed).__name__}"
        )
    return cast(T, response.parsed)
