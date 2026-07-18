from enum import Enum


class AccessStatusReason(str, Enum):
    GRANT = "grant"
    INHERITED = "inherited"

    def __str__(self) -> str:
        return str(self.value)
