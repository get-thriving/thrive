"""Postgres implementations of locations repositories."""

from jupiter.core.common.sub.locations.sub.link.root import (
    LocationLink,
    LocationLinkRepository,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.storage.postgres.events import upsert_events
from jupiter.framework.storage.postgres.repository import PostgresLeafEntityRepository
from sqlalchemy import select
from sqlalchemy.dialects.postgresql import insert as pg_insert


class PostgresLocationLinkRepository(
    PostgresLeafEntityRepository[LocationLink], LocationLinkRepository
):
    """PostgreSQL implementation of the location link repository."""

    async def upsert(self, location_link: LocationLink) -> LocationLink:
        """Upsert a location link."""
        stmt = (
            pg_insert(self._table)
            .values(
                version=location_link.version,
                archived=location_link.archived,
                archival_reason=location_link.archival_reason,
                created_time=self._realm_codec_registry.db_encode(
                    location_link.created_time
                ),
                last_modified_time=self._realm_codec_registry.db_encode(
                    location_link.last_modified_time
                ),
                archived_time=self._realm_codec_registry.db_encode(
                    location_link.archived_time
                ),
                name=location_link.name.the_name,
                location_domain_ref_id=location_link.location_domain.ref_id.as_int(),
                owner=self._realm_codec_registry.db_encode(location_link.owner),
                location_ref_id=(
                    location_link.location_ref_id.as_int()
                    if location_link.location_ref_id is not None
                    else None
                ),
            )
            .on_conflict_do_update(
                index_elements=["owner"],
                set_={
                    "version": location_link.version,
                    "archived": location_link.archived,
                    "archival_reason": location_link.archival_reason,
                    "location_domain_ref_id": location_link.location_domain.ref_id.as_int(),
                    "last_modified_time": self._realm_codec_registry.db_encode(
                        location_link.last_modified_time
                    ),
                    "archived_time": self._realm_codec_registry.db_encode(
                        location_link.archived_time
                    ),
                    "location_ref_id": (
                        location_link.location_ref_id.as_int()
                        if location_link.location_ref_id is not None
                        else None
                    ),
                },
            )
            .returning(self._table.c.ref_id)
        )

        result = await self._connection.execute(stmt)
        new_id = result.scalar_one()

        location_link = location_link.assign_ref_id(EntityId(new_id))

        await upsert_events(
            self._realm_codec_registry,
            self._connection,
            self._event_table,
            location_link,
        )

        return location_link

    async def load_optional_for_owner(
        self,
        owner: EntityLink,
    ) -> LocationLink | None:
        """Load a location link by its owner link."""
        encoded = self._realm_codec_registry.db_encode(owner)
        query_stmt = select(self._table).where(self._table.c.owner == encoded)
        result = (await self._connection.execute(query_stmt)).first()
        if result is None:
            return None
        return self._row_to_entity(result)
