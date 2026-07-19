"""Resend email sender for verification codes."""

import logging

import httpx
from jupiter.core.auth.sub.email_verification.email_sender import EmailSender
from jupiter.core.auth.sub.email_verification.verification_code_plain import (
    VerificationCodePlain,
)
from jupiter.core.common.email_address import EmailAddress

_RESEND_API_URL = "https://api.resend.com/emails"

LOGGER = logging.getLogger(__name__)


class EmailSendError(Exception):
    """Error raised when sending an email fails."""


class ResendEmailSender(EmailSender):
    """Email sender backed by the Resend API."""

    def __init__(self, *, api_key: str, from_email: EmailAddress) -> None:
        """Constructor."""
        self._api_key = api_key
        self._from_email = from_email

    async def send_email(
        self,
        email_address: EmailAddress,
        verification_code: VerificationCodePlain,
    ) -> None:
        """Send a verification email through Resend."""
        code = verification_code.code_raw
        payload = {
            "from": str(self._from_email),
            "to": [str(email_address)],
            "subject": "Verify your Thrive email address",
            "html": (
                "<p>Your Thrive email verification code is:</p>"
                f"<p><strong>{code}</strong></p>"
                "<p>This code expires in 15 minutes.</p>"
            ),
        }

        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                _RESEND_API_URL,
                headers={
                    "Authorization": f"Bearer {self._api_key}",
                    "Content-Type": "application/json",
                },
                json=payload,
            )

        if response.status_code >= 400:
            LOGGER.warning(
                "Resend rejected email from %s to %s with status %s: %s",
                self._from_email,
                email_address,
                response.status_code,
                response.text,
            )
            raise EmailSendError(
                f"Resend API returned {response.status_code}: {response.text}"
            )
