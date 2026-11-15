"""A key, or a combination of keys, on the keyboard."""

import re
from typing import Final

from jupiter.framework.errors import InputValidationError
from jupiter.framework.realm.standard import (
    PrimitiveAtomicValueDatabaseDecoder,
    PrimitiveAtomicValueDatabaseEncoder,
)
from jupiter.framework.value import AtomicValue, hashable_value

# The order the modifiers are written in, so a combination has one spelling.
_MODIFIERS: Final[tuple[str, ...]] = ("Ctrl", "Alt", "Meta", "Shift")

# A named key, as the browser calls it: `Enter`, `Escape`, `ArrowDown`, `F5`.
_NAMED_KEY: Final[re.Pattern[str]] = re.compile(r"^[A-Z][A-Za-z0-9]+$")


@hashable_value
class KeyBinding(AtomicValue[str]):
    """A key, or a combination of keys, on the keyboard.

    Written as the web app reads it off a key press: zero or more modifiers in
    the order `Ctrl+`, `Alt+`, `Meta+`, `Shift+`, and then the key itself. A key
    that types a character is that character (`j`, `.`, `[`), a letter in
    lowercase and with `Shift+` in front when shifted (`Shift+k`), as other
    characters already say it in the character (`{`). Any other key is named
    (`Enter`, `Escape`, `ArrowDown`, `Space`).
    """

    the_binding: str

    @staticmethod
    def parse(raw: str) -> "KeyBinding":
        """Construct a key binding, checking that it is well formed."""
        rest = raw
        seen: list[str] = []
        for modifier in _MODIFIERS:
            if rest.startswith(f"{modifier}+") and len(rest) > len(modifier) + 1:
                seen.append(modifier)
                rest = rest[len(modifier) + 1 :]
        key = rest
        if len(key) == 0:
            raise InputValidationError(f"The key binding '{raw}' has no key")
        if len(key) == 1:
            if key.isspace():
                raise InputValidationError(
                    f"The key binding '{raw}' must call the space key 'Space'"
                )
            if key != key.lower():
                raise InputValidationError(
                    f"The key binding '{raw}' must write a letter in lowercase "
                    + "and with 'Shift+' if it is shifted"
                )
            if key.lower() == key.upper() and "Shift" in seen:
                raise InputValidationError(
                    f"The key binding '{raw}' is shifted, which '{key}' says "
                    + "already"
                )
        elif _NAMED_KEY.match(key) is None or key in _MODIFIERS:
            raise InputValidationError(f"The key binding '{raw}' has an unknown key")
        return KeyBinding(raw)

    def __str__(self) -> str:
        """Transform this to a string version."""
        return self.the_binding


class KeyBindingDatabaseEncoder(PrimitiveAtomicValueDatabaseEncoder[KeyBinding]):
    """Encode to a database primitive."""

    def to_primitive(self, value: KeyBinding) -> str:
        """Encode to a database primitive."""
        return value.the_binding


class KeyBindingDatabaseDecoder(PrimitiveAtomicValueDatabaseDecoder[KeyBinding]):
    """Decode from a database primitive."""

    def from_raw_str(self, primitive: str) -> KeyBinding:
        """Decode from a raw string."""
        return KeyBinding.parse(primitive)
