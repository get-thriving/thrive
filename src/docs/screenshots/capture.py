"""Takes the screenshots of the config with Playwright."""

import contextlib
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Any

from playwright.sync_api import Browser, BrowserContext, Page, sync_playwright
from playwright.sync_api import Error as PlaywrightError
from templating import Context


@dataclass(frozen=True)
class Profile:
    """A kind of screen to take pictures on."""

    width: int
    height: int
    scale: float = 2.0
    mobile: bool = False
    # The dev builds show a banner along the bottom of the page, cut it away.
    trim_bottom: int = 26

    @staticmethod
    def from_config(config: dict[str, Any]) -> "Profile":
        """Build a profile from its table in the config."""
        return Profile(
            width=config["width"],
            height=config["height"],
            scale=config.get("scale", 2.0),
            mobile=config.get("mobile", False),
            trim_bottom=config.get("trim_bottom", 26),
        )


class CaptureError(Exception):
    """A screenshot could not be taken."""


class Capturer:
    """Drives one browser through all the screenshots."""

    def __init__(
        self,
        webui_url: str,
        user: dict[str, Any],
        profiles: dict[str, Profile],
        out_dir: Path,
        context: Context,
        headed: bool = False,
    ) -> None:
        """Set up the capturer for one web UI."""
        self._webui_url = webui_url.rstrip("/")
        self._user = user
        self._profiles = profiles
        self._out_dir = out_dir
        self._context = context
        self._headed = headed
        self._pages: dict[tuple[str, bool], Page] = {}
        self._last_key: tuple[str, bool] | None = None

    def capture_all(self, shots: list[dict[str, Any]]) -> dict[str, str | None]:
        """Take all the shots. Returns an error message (or None) for each shot name."""
        self._out_dir.mkdir(parents=True, exist_ok=True)
        results: dict[str, str | None] = {}
        with sync_playwright() as playwright:
            browser = playwright.chromium.launch(headless=not self._headed)
            try:
                for index, shot in enumerate(shots):
                    name = shot["name"]
                    print(f"  shot {index + 1}/{len(shots)}: {name}", file=sys.stderr)
                    results[name] = self._capture_with_retries(browser, shot)
            finally:
                browser.close()
        return results

    def _capture_with_retries(
        self, browser: Browser, shot: dict[str, Any]
    ) -> str | None:
        attempts = shot.get("retries", 2)
        error = ""
        for attempt in range(attempts):
            try:
                self._capture(browser, shot)
                return None
            # One bad shot must not stop the rest.
            except Exception as exc:  # noqa: BLE001
                error = f"{type(exc).__name__}: {str(exc).splitlines()[0] if str(exc) else ''}"
                print(f"    attempt {attempt + 1} failed: {error}", file=sys.stderr)
                # A page in an odd state is not worth reusing.
                key = (shot.get("profile", "desktop"), shot.get("login", True))
                page = self._pages.pop(key, None)
                if page is not None:
                    page.context.close()
                self._last_key = None
        return error

    def _page_for(self, browser: Browser, profile_name: str, login: bool) -> Page:
        key = (profile_name, login)
        if key in self._pages:
            return self._pages[key]
        profile = self._profiles[profile_name]
        context: BrowserContext = browser.new_context(
            viewport={"width": profile.width, "height": profile.height},
            device_scale_factor=profile.scale,
            color_scheme="light",
            timezone_id=self._user["timezone"],
            is_mobile=profile.mobile,
            has_touch=profile.mobile,
        )
        page = context.new_page()
        # The dev web UI compiles pages on the first visit, which can take a while.
        page.set_default_timeout(60000)
        if login:
            self._login(page)
        self._pages[key] = page
        return page

    def _login(self, page: Page) -> None:
        page.goto(f"{self._webui_url}/app/lifecycle/login/local/login")
        page.locator('input[name="emailAddress"]').fill(self._user["email"])
        page.locator('input[name="password"]').fill(self._user["password"])
        page.locator("#login").locator("button", has_text="Login").click()
        page.wait_for_url("**/app/workspace")

    def _capture(self, browser: Browser, shot: dict[str, Any]) -> None:
        profile_name = shot.get("profile", "desktop")
        login = shot.get("login", True)
        profile = self._profiles[profile_name]
        page = self._page_for(browser, profile_name, login)
        key = (profile_name, login)

        if shot.get("continue_from_previous"):
            if self._last_key != key:
                raise CaptureError(
                    "continue_from_previous needs the previous shot on the same screen"
                )
        else:
            self._goto(
                page, self._context.render(shot["path"]), shot.get("settle_ms", 1200)
            )
        self._last_key = key

        for step in shot.get("steps", []):
            self._run_step(page, self._context.render(step))

        clip = shot.get("clip") or {
            "x": 0,
            "y": 0,
            "width": profile.width,
            "height": profile.height - profile.trim_bottom,
        }
        page.screenshot(path=str(self._out_dir / f"{shot['name']}.png"), clip=clip)

    def _goto(self, page: Page, path: str, settle_ms: int) -> None:
        page.goto(f"{self._webui_url}{path}")
        # Logged out pages may not set the flag, so a timeout is fine.
        with contextlib.suppress(PlaywrightError):
            page.wait_for_function(
                "() => document.documentElement.dataset.hydrated === 'true'",
                timeout=15000,
            )
        page.wait_for_timeout(settle_ms)

    def _run_step(self, page: Page, step: dict[str, Any]) -> None:
        pause = step.get("wait", 500)
        if "press" in step:
            keys = step["press"] if isinstance(step["press"], list) else [step["press"]]
            for key in keys:
                page.keyboard.press(key)
                page.wait_for_timeout(pause)
            return
        if "type" in step:
            page.keyboard.type(step["type"], delay=step.get("delay", 60))
        elif "type_lines" in step:
            for line in step["type_lines"]:
                page.keyboard.type(line)
                page.keyboard.press("Enter")
        elif "click_text" in step:
            locator = page.get_by_text(
                step["click_text"], exact=step.get("exact", False)
            )
            locator.nth(step.get("nth", 0)).click()
        elif "click_role" in step:
            page.get_by_role(
                step["click_role"],
                name=step.get("name"),
                exact=step.get("exact", False),
            ).nth(step.get("nth", 0)).click()
        elif "click" in step:
            page.locator(step["click"]).nth(step.get("nth", 0)).click()
        elif "fill" in step:
            page.locator(step["fill"]).first.fill(step["value"])
        elif "scroll_to_text" in step:
            page.get_by_text(step["scroll_to_text"], exact=step.get("exact", True)).nth(
                step.get("nth", 0)
            ).scroll_into_view_if_needed()
        elif "goto" in step:
            self._goto(page, step["goto"], step.get("settle_ms", 1200))
        elif "wheel" in step:
            if "at" in step:
                page.mouse.move(*step["at"])
            page.mouse.wheel(0, step["wheel"])
        elif "focus_editor" in step:
            page.locator("[contenteditable=true]").first.click()
        elif "wait_until_button_enabled" in step:
            name = step["wait_until_button_enabled"]
            page.wait_for_function(
                "(name) => [...document.querySelectorAll('button')]"
                ".some(b => b.textContent.trim() === name && !b.disabled)",
                arg=name,
                timeout=step.get("timeout", 60000),
            )
        elif "wait" in step and len(step) == 1:
            pass
        else:
            raise CaptureError(f"Unknown step {step!r}")
        page.wait_for_timeout(pause)
