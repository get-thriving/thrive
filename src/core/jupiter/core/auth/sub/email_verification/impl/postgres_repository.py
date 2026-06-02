"""PostgreSQL implementation of the email verification attempt repository."""

from jupiter.core.auth.sub.email_verification.root import (
    EmailVerificationAttempt,
    EmailVerificationAttemptRepository,
)
from jupiter.framework.storage.postgres.repository import (
    PostgresStubEntityRepository,
)


class PostgresEmailVerificationAttemptRepository(
    PostgresStubEntityRepository[EmailVerificationAttempt],
    EmailVerificationAttemptRepository,
):
    """PostgreSQL implementation of the email verification attempt repository."""
