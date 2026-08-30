from enum import StrEnum


class PublishEntityStatus(StrEnum):
    ACTIVE = "active"
    DRAFT = "draft"

    def __str__(self) -> str:
        return str(self.value)
