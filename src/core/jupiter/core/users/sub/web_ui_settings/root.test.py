"""Tests for the web UI settings."""

import pytest
from jupiter.core.users.sub.web_ui_settings.default_key_bindings import (
    default_key_bindings,
)
from jupiter.core.users.sub.web_ui_settings.key_binding import KeyBinding
from jupiter.core.users.sub.web_ui_settings.keyboard_action import KeyboardAction
from jupiter.core.users.sub.web_ui_settings.root import WebUiSettings
from jupiter.framework.errors import InputValidationError


def test_defaults_are_acceptable() -> None:
    WebUiSettings._check_key_bindings(default_key_bindings())


def test_every_action_needs_a_key() -> None:
    key_bindings = default_key_bindings()
    del key_bindings[KeyboardAction.FIND]
    with pytest.raises(InputValidationError, match="find"):
        WebUiSettings._check_key_bindings(key_bindings)


def test_two_actions_cannot_share_a_key() -> None:
    key_bindings = default_key_bindings()
    key_bindings[KeyboardAction.FIND] = KeyBinding.parse("s")
    with pytest.raises(InputValidationError, match="both"):
        WebUiSettings._check_key_bindings(key_bindings)


def test_a_swap_is_acceptable() -> None:
    key_bindings = default_key_bindings()
    key_bindings[KeyboardAction.FIND] = KeyBinding.parse("s")
    key_bindings[KeyboardAction.HINTS] = KeyBinding.parse("f")
    WebUiSettings._check_key_bindings(key_bindings)
