"""The keys the web app starts with."""

from jupiter.core.users.sub.web_ui_settings.key_binding import KeyBinding
from jupiter.core.users.sub.web_ui_settings.keyboard_action import KeyboardAction


def default_key_bindings() -> dict[KeyboardAction, KeyBinding]:
    """The key of every keyboard action, as the web app starts with them.

    The keys of `strata-key-defaults.ts` in the web app's core package are the
    same ones: `default_key_bindings.test.py` checks it.
    """
    return {
        KeyboardAction.COLUMN_PREVIOUS: KeyBinding.parse("h"),
        KeyboardAction.COLUMN_NEXT: KeyBinding.parse("l"),
        KeyboardAction.COLUMN_NARROWER: KeyBinding.parse("u"),
        KeyboardAction.COLUMN_WIDER: KeyBinding.parse("i"),
        KeyboardAction.NEXT: KeyBinding.parse("j"),
        KeyboardAction.PREVIOUS: KeyBinding.parse("k"),
        KeyboardAction.OPEN: KeyBinding.parse("Enter"),
        KeyboardAction.EDIT: KeyBinding.parse("e"),
        KeyboardAction.COLLAPSE: KeyBinding.parse("z"),
        KeyboardAction.SPLIT: KeyBinding.parse("c"),
        KeyboardAction.FOLD_BACK: KeyBinding.parse("Shift+c"),
        KeyboardAction.HINTS: KeyBinding.parse("s"),
        KeyboardAction.MAP: KeyBinding.parse("a"),
        KeyboardAction.APPS: KeyBinding.parse("q"),
        KeyboardAction.COMMANDS: KeyBinding.parse("x"),
        KeyboardAction.NEW: KeyBinding.parse("n"),
        KeyboardAction.FIND: KeyBinding.parse("f"),
        KeyboardAction.POSITION_PREVIOUS: KeyBinding.parse("o"),
        KeyboardAction.POSITION_NEXT: KeyBinding.parse("p"),
        KeyboardAction.SCROLL_TOP: KeyBinding.parse("Shift+k"),
        KeyboardAction.SCROLL_BOTTOM: KeyBinding.parse("Shift+j"),
        KeyboardAction.MENU: KeyBinding.parse("."),
        KeyboardAction.CLOSE: KeyBinding.parse("Escape"),
    }
