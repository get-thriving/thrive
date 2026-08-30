from enum import StrEnum


class AccessLevel(StrEnum):
    COMMENTER = "commenter"
    OWNER = "owner"
    READER = "reader"
    WRITER = "writer"

    def __str__(self) -> str:
        return str(self.value)
