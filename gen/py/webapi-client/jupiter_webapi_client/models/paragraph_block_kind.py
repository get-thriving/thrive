from enum import StrEnum


class ParagraphBlockKind(StrEnum):
    PARAGRAPH = "paragraph"

    def __str__(self) -> str:
        return str(self.value)
