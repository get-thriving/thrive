from enum import StrEnum


class JupiterAuthProvider(StrEnum):
    LOCAL = "local"
    LOCAL_GOOGLE_APPLE = "local-google-apple"

    def __str__(self) -> str:
        return str(self.value)
