from enum import Enum


class JupiterAuthProvider(str, Enum):
    LOCAL = "local"
    LOCAL_GOOGLE_APPLE = "local-google-apple"

    def __str__(self) -> str:
        return str(self.value)
