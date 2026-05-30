"""PostgreSQL variant — see `sqlite_repository.py` for SQLite."""

from jupiter.core.auth.sub.google.root import (
    AuthGoogle,
    AuthGoogleNotFoundError,
    AuthGoogleRepository,
)
from jupiter.core.auth.sub.google.subject_id import GoogleSubjectId
from jupiter.framework.storage.postgres.repository import (
    PostgresStubEntityRepository,
)
from sqlalchemy import select


class PostgresAuthGoogleRepository(
    PostgresStubEntityRepository[AuthGoogle], AuthGoogleRepository
):
    """Postgres implementation of the Google auth repository."""

    async def load_by_google_subject_id(
        self, google_subject_id: GoogleSubjectId
    ) -> AuthGoogle:
        """Load a Google auth record by Google subject ID."""
        query_stmt = select(self._table).where(
            self._table.c.google_subject_id == google_subject_id.the_value
        )
        result = (await self._connection.execute(query_stmt)).first()
        if result is None:
            raise AuthGoogleNotFoundError(
                f"Google auth record for subject {google_subject_id} does not exist"
            )
        return self._row_to_entity(result)
