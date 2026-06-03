from enum import Enum


class JupiterWebApiEmailSender(str, Enum):
    NOOP = "noop"
    RESEND = "resend"

    def __str__(self) -> str:
        return str(self.value)
