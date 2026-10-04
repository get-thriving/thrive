"""SQLite implementation of the Apple auth repository."""

from jupiter.core.auth.sub.apple.root import (
    AuthApple,
    AuthAppleNotFoundError,
    AuthAppleRepository,
)
from jupiter.core.auth.sub.apple.subject_id import AppleSubjectId
from jupiter.framework.storage.sqlite.repository import (
    SqliteStubEntityRepository,
)
from sqlalchemy import select


class SqliteAuthAppleRepository(
    SqliteStubEntityRepository[AuthApple], AuthAppleRepository
):
    """SQLite implementation of the Apple auth repository."""

    async def load_by_apple_subject_id(
        self, apple_subject_id: AppleSubjectId
    ) -> AuthApple:
        """Load an Apple auth record by Apple subject ID."""
        query_stmt = select(self._table).where(
            self._table.c.apple_subject_id == apple_subject_id.the_value
        )
        result = (await self._connection.execute(query_stmt)).first()
        if result is None:
            raise AuthAppleNotFoundError(
                f"Apple auth record for subject {apple_subject_id} does not exist"
            )
        return self._row_to_entity(result)
