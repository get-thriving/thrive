"""Tests for the default key bindings."""

import re
from pathlib import Path

from jupiter.core.users.sub.web_ui_settings.default_key_bindings import (
    default_key_bindings,
)
from jupiter.core.users.sub.web_ui_settings.keyboard_action import KeyboardAction

_TS_DEFAULTS = Path(__file__).parents[3] / "infra" / "strata" / "strata-key-defaults.ts"


def test_every_action_has_a_default() -> None:
    assert set(default_key_bindings()) == set(KeyboardAction)


def test_no_two_actions_share_a_default() -> None:
    bindings = list(default_key_bindings().values())
    assert len(bindings) == len(set(bindings))


def test_web_app_defaults_are_the_same() -> None:
    """The web app falls back on its own copy before the settings load."""
    ts_defaults = {
        KeyboardAction[match.group(1)]: match.group(2)
        for match in re.finditer(
            r'\[KeyboardAction\.(\w+)\]:\s*"([^"]+)"', _TS_DEFAULTS.read_text()
        )
    }
    assert ts_defaults == {
        action: str(binding) for action, binding in default_key_bindings().items()
    }
