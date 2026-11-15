"""Tests for key bindings."""

import pytest
from jupiter.core.users.sub.web_ui_settings.key_binding import KeyBinding
from jupiter.framework.errors import InputValidationError


@pytest.mark.parametrize(
    "raw",
    [
        "j",
        ".",
        "[",
        "{",
        "+",
        "Enter",
        "Escape",
        "ArrowDown",
        "F5",
        "Space",
        "Shift+k",
        "Ctrl+k",
        "Ctrl+Shift+k",
        "Ctrl+Alt+Meta+Shift+Enter",
        "Shift+Tab",
        "Ctrl++",
    ],
)
def test_parse_well_formed(raw: str) -> None:
    assert str(KeyBinding.parse(raw)) == raw


@pytest.mark.parametrize(
    "raw",
    [
        "",
        "K",
        " ",
        "Shift+",
        "Shift",
        "Ctrl",
        "Shift+Ctrl+k",
        "Shift+1",
        "Shift+.",
        "enter",
        "Ctrl+Shift+Shift",
        "Ctrl+",
        "k+j",
    ],
)
def test_parse_malformed(raw: str) -> None:
    with pytest.raises(InputValidationError):
        KeyBinding.parse(raw)
