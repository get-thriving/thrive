from enum import StrEnum


class PrincipalType(StrEnum):
    USER = "user"

    def __str__(self) -> str:
        return str(self.value)
