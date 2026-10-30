from enum import StrEnum


class ImagePurpose(StrEnum):
    AVATARS = "avatars"

    def __str__(self) -> str:
        return str(self.value)
