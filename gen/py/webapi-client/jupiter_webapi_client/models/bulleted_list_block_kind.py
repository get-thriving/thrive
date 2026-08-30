from enum import StrEnum


class BulletedListBlockKind(StrEnum):
    BULLETED_LIST = "bulleted-list"

    def __str__(self) -> str:
        return str(self.value)
