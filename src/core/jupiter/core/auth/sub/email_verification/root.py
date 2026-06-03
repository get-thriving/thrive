"""Email verification attempt for a user."""

import abc
from typing import Final

from jupiter.core.auth.sub.email_verification.verification_code_hash import (
    VerificationCodeHash,
)
from jupiter.core.auth.sub.email_verification.verification_code_plain import (
    VerificationCodePlain,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_name import EntityName
from jupiter.framework.base.timestamp import Timestamp
from jupiter.framework.context import DomainContext
from jupiter.framework.entity import (
    LeafEntity,
    ParentLink,
    create_entity_action,
    entity,
    update_entity_action,
)
from jupiter.framework.realm.realm import DatabaseRealm, only_in_realm
from jupiter.framework.secure import secure_class
from jupiter.framework.storage.repository import LeafEntityRepository

EXPIRES_IN_MINS: Final[int] = 15
MAX_RETRIES: Final[int] = 5
ATTEMPT_RATE_LIMIT_WINDOW_MINS: Final[int] = 60
MAX_ATTEMPTS_PER_HOUR: Final[int] = 5
DEFAULT_EMAIL_VERIFICATION_ATTEMPT_NAME: Final[EntityName] = EntityName(
    "Email Verification"
)


class InvalidEmailAttemptVerificationStateError(Exception):
    """Error raised when an email verification attempt is in an invalid state."""


class EmailAttemptVerificationExpiredError(Exception):
    """Error raised when an email verification attempt has expired."""


class ActiveEmailVerificationAttemptAlreadyExistsError(Exception):
    """Error raised when an active email verification attempt already exists."""


class NoActiveEmailVerificationAttemptError(Exception):
    """Error raised when there is no active email verification attempt."""


class TooManyEmailVerificationAttemptsError(Exception):
    """Error raised when too many email verification attempts were created recently."""


@entity("User")
@secure_class
@only_in_realm(DatabaseRealm)
class EmailVerificationAttempt(LeafEntity):
    """An email verification attempt for a user."""

    user: ParentLink
    code: VerificationCodeHash
    expires_in_mins: int
    retries: int
    solved: bool
    email_sent: bool

    @staticmethod
    def new_attempt(
        ctx: DomainContext,
        user_ref_id: EntityId,
        code_plain: VerificationCodePlain,
    ) -> "EmailVerificationAttempt":
        """Create a new email verification attempt."""
        return EmailVerificationAttempt._new_attempt(
            ctx,
            user_ref_id=user_ref_id,
            code=VerificationCodeHash.from_plain(code_plain),
        )

    @staticmethod
    @create_entity_action
    def _new_attempt(
        ctx: DomainContext,
        user_ref_id: EntityId,
        code: VerificationCodeHash,
    ) -> "EmailVerificationAttempt":
        """Create a new email verification attempt."""
        return EmailVerificationAttempt._create(
            ctx,
            name=DEFAULT_EMAIL_VERIFICATION_ATTEMPT_NAME,
            user=ParentLink(user_ref_id),
            code=code,
            expires_in_mins=EXPIRES_IN_MINS,
            retries=0,
            solved=False,
            email_sent=False,
        )

    def active_at(self, right_now: Timestamp) -> bool:
        """Whether this attempt is still active at the given time."""
        if self.retries >= MAX_RETRIES:
            return False
        return right_now < self.created_time.add_minutes(self.expires_in_mins)

    @update_entity_action
    def attempt_verification(
        self,
        ctx: DomainContext,
        code_plain: VerificationCodePlain,
        right_now: Timestamp,
    ) -> "EmailVerificationAttempt":
        """Attempt to verify this attempt with the given code."""
        if self.solved:
            raise InvalidEmailAttemptVerificationStateError(
                "Email verification attempt is already solved"
            )
        if not self.email_sent:
            raise InvalidEmailAttemptVerificationStateError(
                "Verification email has not been sent for this attempt"
            )
        if right_now >= self.created_time.add_minutes(self.expires_in_mins):
            raise EmailAttemptVerificationExpiredError(
                "Email verification attempt has expired"
            )
        if self.retries > MAX_RETRIES:
            raise EmailAttemptVerificationExpiredError(
                "Email verification attempt has exceeded the retry limit"
            )

        if self.code.check_against(code_plain):
            return self._new_version(ctx, solved=True)

        return self._new_version(ctx, retries=self.retries + 1)

    @update_entity_action
    def mark_email_sent(self, ctx: DomainContext) -> "EmailVerificationAttempt":
        """Mark that the verification email was sent for this attempt."""
        if self.solved:
            raise InvalidEmailAttemptVerificationStateError(
                "Email verification attempt is already solved"
            )
        if self.email_sent:
            raise InvalidEmailAttemptVerificationStateError(
                "Verification email was already sent for this attempt"
            )

        return self._new_version(ctx, email_sent=True)


class EmailVerificationAttemptRepository(
    LeafEntityRepository[EmailVerificationAttempt], abc.ABC
):
    """A repository for email verification attempts."""
