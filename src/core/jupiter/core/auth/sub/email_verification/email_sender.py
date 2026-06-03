"""Email sender for verification codes."""

from abc import ABC, abstractmethod

from jupiter.core.auth.sub.email_verification.verification_code_plain import (
    VerificationCodePlain,
)
from jupiter.core.common.email_address import EmailAddress


class EmailSender(ABC):
    """Sends email verification messages."""

    @abstractmethod
    async def send_email(
        self,
        email_address: EmailAddress,
        verification_code: VerificationCodePlain,
    ) -> None:
        """Send a verification email to the given address."""
