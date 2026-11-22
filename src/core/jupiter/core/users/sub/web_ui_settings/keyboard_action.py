"""Something the user can do from the keyboard in the web app."""

from jupiter.framework.value import EnumValue, enum_value


@enum_value
class KeyboardAction(EnumValue):
    """Something the user can do from the keyboard in the web app.

    Each one has a key or a combination of keys (a `KeyBinding`) in the web UI
    settings of the user.
    """

    COLUMN_PREVIOUS = "column-previous"
    COLUMN_NEXT = "column-next"
    COLUMN_NARROWER = "column-narrower"
    COLUMN_WIDER = "column-wider"
    NEXT = "next"
    PREVIOUS = "previous"
    OPEN = "open"
    EDIT = "edit"
    COLLAPSE = "collapse"
    SPLIT = "split"
    FOLD_BACK = "fold-back"
    HINTS = "hints"
    MAP = "map"
    APPS = "apps"
    COMMANDS = "commands"
    NEW = "new"
    FIND = "find"
    POSITION_PREVIOUS = "position-previous"
    POSITION_NEXT = "position-next"
    SCROLL_TOP = "scroll-top"
    SCROLL_BOTTOM = "scroll-bottom"
    MENU = "menu"
    CLOSE = "close"
