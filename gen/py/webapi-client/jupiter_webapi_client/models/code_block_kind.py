from enum import StrEnum


class CodeBlockKind(StrEnum):
    CODE = "code"

    def __str__(self) -> str:
        return str(self.value)
