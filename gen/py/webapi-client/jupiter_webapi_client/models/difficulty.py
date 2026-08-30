from enum import StrEnum


class Difficulty(StrEnum):
    EASY = "easy"
    HARD = "hard"
    MEDIUM = "medium"

    def __str__(self) -> str:
        return str(self.value)
