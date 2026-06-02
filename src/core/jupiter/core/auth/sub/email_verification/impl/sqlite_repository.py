"""SQLite implementation of the email verification attempt repository."""

from jupiter.core.auth.sub.email_verification.root import (
    EmailVerificationAttempt,
    EmailVerificationAttemptRepository,
)
from jupiter.framework.storage.sqlite.repository import SqliteStubEntityRepository


class SqliteEmailVerificationAttemptRepository(
    SqliteStubEntityRepository[EmailVerificationAttempt],
    EmailVerificationAttemptRepository,
):
    """SQLite implementation of the email verification attempt repository."""
