"""The NoOp implementation of email verification."""

import logging

from jupiter.core.common.email_address import EmailAddress
from jupiter.core.email_verification.email_verification import EmailVerification

LOGGER = logging.getLogger(__name__)


class NoOpEmailVerification(EmailVerification):
    """The NoOp implementation of email verification — logs and does nothing."""

    async def send_verification_email(
        self,
        email_address: EmailAddress,
        verification_token: str,
    ) -> None:
        """Log the verification email instead of sending it."""
        LOGGER.info(
            "NoOp email verification: would send to %s with token %s",
            email_address,
            verification_token,
        )

    async def close(self) -> None:
        """Nothing to release."""
        LOGGER.info("Closing NoOp email verification")
