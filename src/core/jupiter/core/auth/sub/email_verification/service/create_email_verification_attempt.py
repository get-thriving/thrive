"""Service for creating an email verification attempt."""

from typing import Final

from jupiter.core.auth.sub.email_verification.email_sender import EmailSender
from jupiter.core.auth.sub.email_verification.root import (
    ATTEMPT_RATE_LIMIT_WINDOW_MINS,
    MAX_ATTEMPTS_PER_HOUR,
    EmailVerificationAttempt,
    TooManyEmailVerificationAttemptsError,
)
from jupiter.core.auth.sub.email_verification.verification_code_plain import (
    VerificationCodePlain,
)
from jupiter.core.users.root import User, UserEmailAlreadyVerifiedError
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.timestamp import Timestamp
from jupiter.framework.context import DomainContext
from jupiter.framework.storage.repository import DomainStorageEngine


class CreateEmailVerificationAttemptService:
    """Creates an email verification attempt and sends the verification email."""

    _domain_storage_engine: Final[DomainStorageEngine]
    _email_sender: Final[EmailSender]

    def __init__(
        self,
        domain_storage_engine: DomainStorageEngine,
        email_sender: EmailSender,
    ) -> None:
        """Constructor."""
        self._domain_storage_engine = domain_storage_engine
        self._email_sender = email_sender

    async def do_it(
        self,
        ctx: DomainContext,
        right_now: Timestamp,
        user_id: EntityId,
    ) -> None:
        """Create an attempt and send the verification email."""
        async with self._domain_storage_engine.get_unit_of_work() as uow:
            user = await uow.get_for(User).load_by_id(user_id)
            if user.verified:
                raise UserEmailAlreadyVerifiedError(
                    "The user's email is already verified"
                )

            attempts = await uow.get_for(EmailVerificationAttempt).find_all(
                parent_ref_id=user.ref_id,
            )

            one_hour_ago = right_now.subtract_minutes(ATTEMPT_RATE_LIMIT_WINDOW_MINS)
            attempts_in_last_hour = [
                attempt for attempt in attempts if attempt.created_time >= one_hour_ago
            ]
            if len(attempts_in_last_hour) > MAX_ATTEMPTS_PER_HOUR:
                raise TooManyEmailVerificationAttemptsError(
                    "Too many email verification attempts were created recently"
                )

            code_plain = VerificationCodePlain.generate()
            attempt = EmailVerificationAttempt.new_attempt(
                ctx=ctx,
                user_ref_id=user.ref_id,
                code_plain=code_plain,
            )
            attempt = await uow.get_for(EmailVerificationAttempt).create(attempt)

        await self._email_sender.send_email(
            user.email_address,
            code_plain,
        )

        async with self._domain_storage_engine.get_unit_of_work() as uow:
            attempt = attempt.mark_email_sent(ctx=ctx)
            await uow.get_for(EmailVerificationAttempt).save(attempt)
