from enum import Enum


class VisionStatus(str, Enum):
    ACTIVE = "active"
    DRAFT = "draft"
    OLD = "old"

    def __str__(self) -> str:
        return str(self.value)
