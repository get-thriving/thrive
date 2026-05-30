from enum import Enum


class UserAuthMethod(str, Enum):
    APPLE = "apple"
    GOOGLE = "google"
    LOCAL = "local"

    def __str__(self) -> str:
        return str(self.value)
