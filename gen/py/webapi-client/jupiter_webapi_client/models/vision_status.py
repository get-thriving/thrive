from enum import StrEnum


class VisionStatus(StrEnum):
    ACTIVE = "active"
    DRAFT = "draft"
    OLD = "old"

    def __str__(self) -> str:
        return str(self.value)
