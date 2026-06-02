"""Email verification attempt associated with a user."""

import abc
from datetime import datetime

from jupiter.core.auth.sub.email_verification.verification_code_hash import (
    VerificationCodeHash,
)
from jupiter.core.auth.sub.email_verification.verification_code_plain import (
    VerificationCodePlain,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import DomainContext
from jupiter.framework.entity import (
    ParentLink,
    StubEntity,
    create_entity_action,
    entity,
    update_entity_action,
)
from jupiter.framework.realm.realm import DatabaseRealm, only_in_realm
from jupiter.framework.secure import secure_class
from jupiter.framework.storage.repository import (
    EntityNotFoundError,
    StubEntityRepository,
)

_MAX_ATTEMPTS = 5


class EmailVerificationAttemptExpiredError(Exception):
    """Raised when a verification attempt has passed its expiry deadline."""


class EmailVerificationAttemptTooManyAttemptsError(Exception):
    """Raised when the maximum number of verification attempts has been exceeded."""


@entity("User")
@secure_class
@only_in_realm(DatabaseRealm)
class EmailVerificationAttempt(StubEntity):
    """A pending email verification attempt for a user."""

    user: ParentLink
    code_hash: VerificationCodeHash
    expiry_duration_secs: int
    attempt_count: int
    solved: bool

    @staticmethod
    def new_email_verification_attempt(
        ctx: DomainContext,
        user_ref_id: EntityId,
        expiry_duration_secs: int,
    ) -> tuple["EmailVerificationAttempt", VerificationCodePlain]:
        """Create a new email verification attempt and return the plain code."""
        code = VerificationCodePlain.new_verification_code()
        code_hash = VerificationCodeHash.from_plain(code)
        return (
            EmailVerificationAttempt._new_email_verification_attempt(
                ctx,
                user_ref_id=user_ref_id,
                code_hash=code_hash,
                expiry_duration_secs=expiry_duration_secs,
            ),
            code,
        )

    @staticmethod
    @create_entity_action
    def _new_email_verification_attempt(
        ctx: DomainContext,
        user_ref_id: EntityId,
        code_hash: VerificationCodeHash,
        expiry_duration_secs: int,
    ) -> "EmailVerificationAttempt":
        """Internal constructor for the entity."""
        return EmailVerificationAttempt._create(
            ctx,
            user=ParentLink(user_ref_id),
            code_hash=code_hash,
            expiry_duration_secs=expiry_duration_secs,
            attempt_count=0,
            solved=False,
        )

    def verify_against_code(
        self,
        ctx: DomainContext,
        code: VerificationCodePlain,
        current_time: datetime,
    ) -> tuple["EmailVerificationAttempt", bool]:
        """Check a plain code against this attempt.

        Returns (updated_entity, was_correct).
        Raises EmailVerificationAttemptExpiredError if the deadline has passed.
        Raises EmailVerificationAttemptTooManyAttemptsError if max retries exceeded.
        """
        elapsed = (current_time - self.created_time.value).total_seconds()
        if elapsed > self.expiry_duration_secs:
            raise EmailVerificationAttemptExpiredError(
                "Email verification attempt has expired"
            )
        if self.attempt_count >= _MAX_ATTEMPTS:
            raise EmailVerificationAttemptTooManyAttemptsError(
                "Maximum number of verification attempts exceeded"
            )

        if self.code_hash.check_against(code):
            return self._mark_solved(ctx), True

        return self._increment_attempt_count(ctx), False

    @update_entity_action
    def _mark_solved(self, ctx: DomainContext) -> "EmailVerificationAttempt":
        """Mark this attempt as successfully solved."""
        return self._new_version(ctx, solved=True)

    @update_entity_action
    def _increment_attempt_count(
        self, ctx: DomainContext
    ) -> "EmailVerificationAttempt":
        """Increment the failed attempt counter."""
        return self._new_version(ctx, attempt_count=self.attempt_count + 1)


class EmailVerificationAttemptNotFoundError(EntityNotFoundError):
    """Raised when no email verification attempt exists for a user."""


class EmailVerificationAttemptRepository(
    StubEntityRepository[EmailVerificationAttempt], abc.ABC
):
    """Abstract repository for email verification attempts."""
