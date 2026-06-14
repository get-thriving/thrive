"""SQLite repository for access statuses."""

from jupiter.core.common.access.sub.status.root import (
    AccessStatus,
    AccessStatusRepository,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.storage.sqlite.events import upsert_events
from jupiter.framework.storage.sqlite.repository import SqliteLeafEntityRepository
from sqlalchemy import select
from sqlalchemy.dialects.sqlite import insert as sqlite_insert


class SqliteAccessStatusRepository(
    SqliteLeafEntityRepository[AccessStatus], AccessStatusRepository
):
    """SQLite implementation of the access status repository."""

    async def find_all_for_user(
        self,
        entity_type: str,
        user_id: EntityId,
        allow_archived: bool = False,
    ) -> list[AccessStatus]:
        """Find all access statuses for a user over resources of a given type."""
        query_stmt = select(self._table).where(
            self._table.c.user_ref_id == user_id.as_int(),
            self._table.c.entity.like(f"{entity_type}:%"),
        )
        if not allow_archived:
            query_stmt = query_stmt.where(self._table.c.archived.is_(False))
        results = await self._connection.execute(query_stmt)
        return [self._row_to_entity(row) for row in results]

    async def load_optional_for_entity_and_user(
        self,
        entity: EntityLink,
        user_ref_id: EntityId,
        allow_archived: bool = False,
    ) -> AccessStatus | None:
        """Load the access status for a specific entity and user, if any."""
        query_stmt = select(self._table).where(
            self._table.c.entity == str(entity),
            self._table.c.user_ref_id == user_ref_id.as_int(),
        )
        if not allow_archived:
            query_stmt = query_stmt.where(self._table.c.archived.is_(False))
        result = (await self._connection.execute(query_stmt)).first()
        if result is None:
            return None
        return self._row_to_entity(result)

    async def upsert(self, status: AccessStatus) -> AccessStatus:
        """Insert a status, or update the level and reason of the matching existing one."""
        row = self._entity_to_row(status)
        stmt = (
            sqlite_insert(self._table)
            .values(**{col: val for col, val in row.items() if col != "ref_id"})
            .on_conflict_do_update(
                index_elements=[
                    self._table.c.access_domain_ref_id,
                    self._table.c.entity,
                    self._table.c.user_ref_id,
                ],
                set_={
                    "version": row["version"],
                    "archived": row["archived"],
                    "archival_reason": row["archival_reason"],
                    "last_modified_time": row["last_modified_time"],
                    "archived_time": row["archived_time"],
                    "access_level": row["access_level"],
                    "reason": row["reason"],
                },
            )
            .returning(self._table.c.ref_id)
        )
        result = await self._connection.execute(stmt)
        new_id = result.scalar_one()
        status = status.assign_ref_id(EntityId(str(new_id)))
        await upsert_events(
            self._realm_codec_registry,
            self._connection,
            self._event_table,
            status,
        )
        return status
