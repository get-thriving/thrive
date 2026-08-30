from enum import StrEnum


class QuoteBlockKind(StrEnum):
    QUOTE = "quote"

    def __str__(self) -> str:
        return str(self.value)
