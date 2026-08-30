from enum import StrEnum


class JupiterArchivalReason(StrEnum):
    GC = "gc"
    SYNC = "sync"
    USER = "user"

    def __str__(self) -> str:
        return str(self.value)
