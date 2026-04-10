"""Sqlite implementation of the notes repository."""

from jupiter.core.archival_reason import JupiterArchivalReason
from jupiter.core.common.sub.notes.root import (
    Note,
    NoteRepository,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.storage.repository import EntityNotFoundError
from jupiter.framework.storage.sqlite.repository import (
    SqliteLeafEntityRepository,
)
from jupiter.framework.value import EnumValue
from sqlalchemy import or_, select


class SqliteNoteRepository(SqliteLeafEntityRepository[Note], NoteRepository):
    """A repository of notes."""

    def _archived_clause(self, allow_archived: bool | EnumValue | list[JupiterArchivalReason]):  # type: ignore
        """Return a WHERE fragment for archived handling (reused by queries)."""
        if isinstance(allow_archived, bool):
            if not allow_archived:
                return self._table.c.archived.is_(False)
            return None
        if isinstance(allow_archived, EnumValue):
            return (self._table.c.archived.is_(False)) | (
                self._table.c.archival_reason == str(allow_archived.value)
            )
        if isinstance(allow_archived, list):
            return (self._table.c.archived.is_(False)) | (
                self._table.c.archival_reason.in_(
                    [str(reason.value) for reason in allow_archived]
                )
            )

    async def load_for_owner(
        self,
        owner: EntityLink,
        allow_archived: (
            bool | JupiterArchivalReason | list[JupiterArchivalReason]
        ) = False,
    ) -> Note:
        """Retrieve a note via its owner link."""
        encoded = self._realm_codec_registry.db_encode(owner)
        query_stmt = select(self._table).where(self._table.c.owner == encoded)
        clause = self._archived_clause(allow_archived)
        if clause is not None:
            query_stmt = query_stmt.where(clause)
        result = (await self._connection.execute(query_stmt)).first()
        if result is None:
            raise EntityNotFoundError(
                f"Note with owner {encoded!s} does not exist",
            )
        return self._row_to_entity(result)

    async def load_optional_for_owner(
        self,
        owner: EntityLink,
        allow_archived: (
            bool | JupiterArchivalReason | list[JupiterArchivalReason]
        ) = False,
    ) -> Note | None:
        """Retrieve a note via its owner link."""
        encoded = self._realm_codec_registry.db_encode(owner)
        query_stmt = select(self._table).where(self._table.c.owner == encoded)
        clause = self._archived_clause(allow_archived)
        if clause is not None:
            query_stmt = query_stmt.where(clause)
        result = (await self._connection.execute(query_stmt)).first()
        if result is None:
            return None
        return self._row_to_entity(result)

    async def find_all_for_note_collection(
        self,
        *,
        note_collection_ref_id: EntityId,
        allow_archived: (
            bool | JupiterArchivalReason | list[JupiterArchivalReason]
        ) = False,
        filter_ref_ids: list[EntityId] | None = None,
        filter_owner_types: list[str] | None = None,
        filter_owners: list[EntityLink] | None = None,
    ) -> list[Note]:
        """Find notes in a collection."""
        query_stmt = select(self._table).where(
            self._table.c.note_collection_ref_id == note_collection_ref_id.as_int(),
        )
        clause = self._archived_clause(allow_archived)
        if clause is not None:
            query_stmt = query_stmt.where(clause)
        if filter_ref_ids:
            query_stmt = query_stmt.where(
                self._table.c.ref_id.in_([r.as_int() for r in filter_ref_ids]),
            )
        if filter_owner_types:
            query_stmt = query_stmt.where(
                or_(
                    *[
                        self._table.c.owner.like(f"{the_type}:%")
                        for the_type in filter_owner_types
                    ],
                ),
            )
        if filter_owners:
            encoded_owners = [
                self._realm_codec_registry.db_encode(link) for link in filter_owners
            ]
            query_stmt = query_stmt.where(self._table.c.owner.in_(encoded_owners))
        results = await self._connection.execute(query_stmt)
        return [self._row_to_entity(row) for row in results]
