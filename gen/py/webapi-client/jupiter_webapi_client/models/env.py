from enum import StrEnum


class Env(StrEnum):
    LOCAL = "local"
    PRODUCTION = "production"
    STAGING = "staging"

    def __str__(self) -> str:
        return str(self.value)
