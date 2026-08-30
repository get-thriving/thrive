from enum import StrEnum


class ChecklistBlockKind(StrEnum):
    CHECKLIST = "checklist"

    def __str__(self) -> str:
        return str(self.value)
