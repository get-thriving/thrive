from enum import StrEnum


class AccessStatusReason(StrEnum):
    GRANT = "grant"
    INHERITED = "inherited"

    def __str__(self) -> str:
        return str(self.value)
