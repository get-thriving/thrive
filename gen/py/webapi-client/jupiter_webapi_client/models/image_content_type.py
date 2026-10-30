from enum import StrEnum


class ImageContentType(StrEnum):
    IMAGEWEBP = "image/webp"

    def __str__(self) -> str:
        return str(self.value)
