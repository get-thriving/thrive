from enum import StrEnum


class UserCategory(StrEnum):
    APP_STORE_TEST = "app-store-test"
    STANDARD = "standard"

    def __str__(self) -> str:
        return str(self.value)
