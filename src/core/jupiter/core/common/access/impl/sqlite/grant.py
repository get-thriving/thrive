"""SQLite repository for access grants."""

from jupiter.core.common.access.sub.grant.root import (
    AccessGrant,
    AccessGrantRepository,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.storage.sqlite.events import upsert_events
from jupiter.framework.storage.sqlite.repository import SqliteLeafEntityRepository
from sqlalchemy import select
from sqlalchemy.dialects.sqlite import insert as sqlite_insert


class SqliteAccessGrantRepository(
    SqliteLeafEntityRepository[AccessGrant], AccessGrantRepository
):
    """SQLite implementation of the access grant repository."""

    async def find_all_for_entity(
        self,
        entity: EntityLink,
        allow_archived: bool = False,
    ) -> list[AccessGrant]:
        """Find all grants for a resource, across all principals."""
        query_stmt = select(self._table).where(
            self._table.c.entity == self._realm_codec_registry.db_encode(entity),
        )
        if not allow_archived:
            query_stmt = query_stmt.where(self._table.c.archived.is_(False))
        results = await self._connection.execute(query_stmt)
        return [self._row_to_entity(row) for row in results]

    async def upsert(self, grant: AccessGrant) -> AccessGrant:
        """Insert a grant, or update the access level of the matching existing grant."""
        row = self._entity_to_row(grant)
        stmt = (
            sqlite_insert(self._table)
            .values(**{col: val for col, val in row.items() if col != "ref_id"})
            .on_conflict_do_update(
                index_elements=[
                    self._table.c.access_domain_ref_id,
                    self._table.c.entity,
                    self._table.c.principal,
                    self._table.c.user_ref_id,
                ],
                set_={
                    "version": row["version"],
                    "archived": row["archived"],
                    "archival_reason": row["archival_reason"],
                    "last_modified_time": row["last_modified_time"],
                    "archived_time": row["archived_time"],
                    "access_level": row["access_level"],
                },
            )
            .returning(self._table.c.ref_id)
        )
        result = await self._connection.execute(stmt)
        new_id = result.scalar_one()
        grant = grant.assign_ref_id(EntityId(str(new_id)))
        await upsert_events(
            self._realm_codec_registry,
            self._connection,
            self._event_table,
            grant,
        )
        return grant
