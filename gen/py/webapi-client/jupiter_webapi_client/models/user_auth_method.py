from enum import StrEnum


class UserAuthMethod(StrEnum):
    APPLE = "apple"
    GOOGLE = "google"
    LOCAL = "local"

    def __str__(self) -> str:
        return str(self.value)
