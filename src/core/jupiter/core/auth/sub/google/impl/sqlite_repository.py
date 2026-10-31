"""SQLite implementation of the Google auth repository."""

from jupiter.core.auth.sub.google.root import (
    AuthGoogle,
    AuthGoogleNotFoundError,
    AuthGoogleRepository,
)
from jupiter.core.auth.sub.google.subject_id import GoogleSubjectId
from jupiter.framework.realm.realm import RealmCodecRegistry
from jupiter.framework.storage.sqlite.repository import (
    SqliteStubEntityRepository,
)
from sqlalchemy import MetaData, select
from sqlalchemy.ext.asyncio import AsyncConnection


class SqliteAuthGoogleRepository(
    SqliteStubEntityRepository[AuthGoogle], AuthGoogleRepository
):
    """SQLite implementation of the Google auth repository."""

    def __init__(
        self,
        realm_codec_registry: RealmCodecRegistry,
        connection: AsyncConnection,
        metadata: MetaData,
    ) -> None:
        """Constructor."""
        super().__init__(
            realm_codec_registry,
            connection,
            metadata,
            not_found_err_cls=AuthGoogleNotFoundError,
        )

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

    async def find_all_auth(self) -> list[AuthGoogle]:
        """Find every Google auth record, across users."""
        results = await self._connection.execute(select(self._table))
        return [self._row_to_entity(row) for row in results]
