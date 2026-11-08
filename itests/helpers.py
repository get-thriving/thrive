"""Helpers for the tests."""

from typing import Type, TypeVar, cast

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
from jupiter_webapi_client.models.web_ui_settings_update_args_use_expanded_rail import (
    WebUiSettingsUpdateArgsUseExpandedRail,
)
from jupiter_webapi_client.models.web_ui_settings_update_args_use_night_mode import (
    WebUiSettingsUpdateArgsUseNightMode,
)
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
    handle = editor_holder.element_handle()
    if handle is not None:
        # ``data-editor-ready`` is set by ``BlockEditor`` once EditorJS finished
        # initializing, which is when the editable blocks exist.
        editor_holder.page.wait_for_function(
            """(el) =>
                el.dataset.editorReady === "true" ||
                !!el.querySelector("[data-editor-ready='true']")
            """,
            arg=handle,
            timeout=timeout_ms,
        )
    editable = editor_holder.locator('[contenteditable="true"]').first
    editable.wait_for(state="visible", timeout=timeout_ms)
    editable.scroll_into_view_if_needed()
    editable.click()

    def matches_save(resp: PlaywrightResponse) -> bool:
        return (
            resp.request.method == "POST" and save_url_substring in resp.url and resp.ok
        )

    with page.expect_response(matches_save, timeout=timeout_ms):
        page.keyboard.type(text, delay=keystroke_delay_ms)


DEFAULT_FILL_SETTLE_TIMEOUT_MS = 10_000
_FILL_SETTLE_POLL_MS = 100
_FILL_SETTLE_STABLE_POLLS = 3


def wait_for_hydration(
    page: Page, *, timeout_ms: int = DEFAULT_FILL_SETTLE_TIMEOUT_MS
) -> None:
    """Wait until the server-rendered page has hydrated.

    Panels are server-rendered before Remix hydrates, and a click or fill that
    lands before hydration finishes can be lost. The webui root marks
    ``<html data-hydrated>`` from an effect, which only runs once hydration has
    committed; React merely having attached to the document is too early.
    """
    page.wait_for_function(
        "() => document.documentElement.dataset.hydrated === 'true'",
        timeout=timeout_ms,
    )


def fill_after_hydration(
    locator: Locator,
    value: str,
    *,
    timeout_ms: int = DEFAULT_FILL_SETTLE_TIMEOUT_MS,
) -> None:
    """Fill a form field, re-filling it if React hydration wipes the value.

    Panels are server-rendered before Remix hydrates. A fill that lands in that
    window is undone when React attaches and restores the field's
    ``defaultValue``, so the form silently submits the stale value.
    """
    page = locator.page
    wait_for_hydration(page, timeout_ms=timeout_ms)

    locator.fill(value)

    stable_polls = 0
    for _ in range(max(1, timeout_ms // _FILL_SETTLE_POLL_MS)):
        page.wait_for_timeout(_FILL_SETTLE_POLL_MS)
        if locator.input_value() == value:
            stable_polls += 1
            if stable_polls >= _FILL_SETTLE_STABLE_POLLS:
                return
            continue
        locator.fill(value)
        stable_polls = 0

    raise AssertionError(f"Field never kept the value {value!r} after hydration")


def type_entity_note_editor_and_wait_for_save(page: Page, text: str) -> None:
    """``EntityNoteEditor`` submits to ``/app/workspace/core/notes/update``."""
    type_editorjs_content_and_wait_for_save(
        page,
        text,
        editor_holder=page.locator("#entity-block-editor"),
        save_url_substring="core/notes/update",
    )


def open_leaf_publish_panel(page: Page, publish_section_id: str) -> None:
    """Open the publish panel in a leaf entity view."""
    open_entity_publish_panel(page, publish_section_id, "leaf-entity-publish")


def open_branch_publish_panel(page: Page, publish_section_id: str) -> None:
    """Open the publish panel in a branch entity view."""
    open_entity_publish_panel(page, publish_section_id, "branch-entity-publish")


def open_trunk_publish_panel(page: Page, publish_section_id: str) -> None:
    """Open the publish panel in a trunk entity view."""
    open_entity_publish_panel(page, publish_section_id, "trunk-entity-publish")


def open_entity_publish_panel(
    page: Page, publish_section_id: str, publish_button_id: str
) -> None:
    """Open the publish panel in a leaf or branch entity view."""
    publish_panel = page.locator(f"#{publish_section_id}")
    if publish_panel.is_visible():
        return

    page.locator(f"button[id='{publish_button_id}']").click()
    publish_panel.wait_for(state="visible")


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


def set_ui_style(
    client: AuthenticatedClient,
    ui_style: UiStyle,
    use_expanded_rail: bool | None = None,
) -> None:
    """Set the user's UI style, and the rail width unless left as it is."""
    response = web_ui_settings_update_sync(
        client=client,
        body=WebUiSettingsUpdateArgs(
            use_night_mode=WebUiSettingsUpdateArgsUseNightMode(should_change=False),
            ui_style=WebUiSettingsUpdateArgsUiStyle(should_change=True, value=ui_style),
            use_expanded_rail=(
                WebUiSettingsUpdateArgsUseExpandedRail(should_change=False)
                if use_expanded_rail is None
                else WebUiSettingsUpdateArgsUseExpandedRail(
                    should_change=True, value=use_expanded_rail
                )
            ),
        ),
    )
    assert response.status_code == 200, response.content
