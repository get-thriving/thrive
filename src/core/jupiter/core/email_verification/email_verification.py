"""Abstract email verification service."""

from abc import ABC, abstractmethod

from jupiter.core.common.email_address import EmailAddress


class EmailVerification(ABC):
    """Abstract service for sending verification emails."""

    @abstractmethod
    async def send_verification_email(
        self,
        email_address: EmailAddress,
        verification_token: str,
    ) -> None:
        """Send a verification email to the given address with the given token."""

    @abstractmethod
    async def close(self) -> None:
        """Release any resources held by the implementation."""
