from enum import StrEnum


class KeyboardAction(StrEnum):
    APPS = "apps"
    CLOSE = "close"
    COLLAPSE = "collapse"
    COLUMN_NARROWER = "column-narrower"
    COLUMN_NEXT = "column-next"
    COLUMN_PREVIOUS = "column-previous"
    COLUMN_WIDER = "column-wider"
    COMMANDS = "commands"
    EDIT = "edit"
    FIND = "find"
    FOLD_BACK = "fold-back"
    HINTS = "hints"
    MAP = "map"
    MENU = "menu"
    NEW = "new"
    NEXT = "next"
    OPEN = "open"
    POSITION_NEXT = "position-next"
    POSITION_PREVIOUS = "position-previous"
    PREVIOUS = "previous"
    SCROLL_BOTTOM = "scroll-bottom"
    SCROLL_TOP = "scroll-top"
    SPLIT = "split"

    def __str__(self) -> str:
        return str(self.value)
