"""No-op email sender for environments without outbound email."""

from jupiter.core.auth.sub.email_verification.email_sender import EmailSender
from jupiter.core.auth.sub.email_verification.verification_code_plain import (
    VerificationCodePlain,
)
from jupiter.core.common.email_address import EmailAddress
from jupiter.core.env import Env

_BOX_WIDTH = 52


class NoOpEmailSender(EmailSender):
    """Email sender that prints verification codes in local development."""

    def __init__(self, env: Env) -> None:
        """Constructor."""
        self._env = env

    async def send_email(
        self,
        email_address: EmailAddress,
        verification_code: VerificationCodePlain,
    ) -> None:
        """Print the verification email in local development."""
        if self._env != Env.LOCAL:
            return

        code = verification_code.code_raw
        recipient = str(email_address)
        top = "╔" + "═" * _BOX_WIDTH + "╗"
        bottom = "╚" + "═" * _BOX_WIDTH + "╝"
        divider = "╠" + "═" * _BOX_WIDTH + "╣"

        print()
        print(top)
        print(_box_line("Email Verification (local dev only)"))
        print(divider)
        print(_box_line(f"To:   {recipient}"))
        print(_box_line(""))
        print(_box_line("      ╭──────╮"))
        print(_box_line(f"      │ {code} │"))
        print(_box_line("      ╰──────╯"))
        print(divider)
        print(_box_line("No email was sent."))
        print(bottom)
        print(flush=True)


def _box_line(content: str) -> str:
    """Format a line inside the dev email verification box."""
    inner_width = _BOX_WIDTH - 2
    if len(content) > inner_width:
        content = content[: inner_width - 3] + "..."
    return f"║ {content:<{inner_width}} ║"
