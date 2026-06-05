from enum import Enum


class JupiterEmailVerificationStrategy(str, Enum):
    NONE = "none"
    VERIFY = "verify"

    def __str__(self) -> str:
        return str(self.value)
