from enum import StrEnum


class JupiterEmailVerificationStrategy(StrEnum):
    NONE = "none"
    VERIFY = "verify"

    def __str__(self) -> str:
        return str(self.value)
