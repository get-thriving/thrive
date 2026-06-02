"""The Resend implementation of email verification."""

import logging

import httpx

from jupiter.core.auth.sub.email_verification.email_verification import (
    EmailVerification,
)
from jupiter.core.common.email_address import EmailAddress

LOGGER = logging.getLogger(__name__)

_RESEND_SEND_URL = "https://api.resend.com/emails"


class ResendEmailVerification(EmailVerification):
    """Email verification implementation that sends emails via the Resend API."""

    def __init__(self, api_key: str, from_address: str) -> None:
        """Initialise with Resend API credentials."""
        self._api_key = api_key
        self._from_address = from_address
        self._client = httpx.AsyncClient()

    async def send_verification_email(
        self,
        email_address: EmailAddress,
        verification_token: str,
    ) -> None:
        """Send a verification email via Resend."""
        payload = {
            "from": self._from_address,
            "to": [email_address.the_address],
            "subject": "Verify your email address",
            "html": (
                f"<p>Please verify your email address by entering the code below:</p>"
                f"<p><strong>{verification_token}</strong></p>"
            ),
        }
        response = await self._client.post(
            _RESEND_SEND_URL,
            json=payload,
            headers={"Authorization": f"Bearer {self._api_key}"},
        )
        if response.status_code not in (200, 201):
            LOGGER.error(
                "Resend email verification failed: status=%s body=%s",
                response.status_code,
                response.text,
            )
            raise RuntimeError(
                f"Failed to send verification email via Resend: {response.status_code}"
            )
        LOGGER.info("Sent verification email to %s via Resend", email_address)

    async def close(self) -> None:
        """Close the underlying HTTP client."""
        await self._client.aclose()
