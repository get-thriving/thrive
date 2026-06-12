from enum import Enum


class PublishEntityStatus(str, Enum):
    ACTIVE = "active"
    DRAFT = "draft"

    def __str__(self) -> str:
        return str(self.value)
