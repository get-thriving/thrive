from enum import StrEnum


class ImageSource(StrEnum):
    GOOGLE = "google"
    UPLOADED = "uploaded"

    def __str__(self) -> str:
        return str(self.value)
