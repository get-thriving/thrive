"""Postgres implementations of locations repositories."""

from jupiter.core.common.sub.locations.sub.link.root import (
    LocationLink,
    LocationLinkRepository,
)
from jupiter.core.common.sub.locations.sub.location.root import (
    Location,
    LocationRepository,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.storage.postgres.events import upsert_events
from jupiter.framework.storage.postgres.repository import PostgresLeafEntityRepository
from sqlalchemy import String, cast, func, or_, select
from sqlalchemy.dialects.postgresql import insert as pg_insert


class PostgresLocationRepository(
    PostgresLeafEntityRepository[Location], LocationRepository
):
    """PostgreSQL implementation of the location repository."""

    async def search(
        self,
        parent_ref_id: EntityId,
        query: str,
        limit: int,
        *,
        allow_archived: bool = False,
    ) -> list[Location]:
        """Find locations whose name, address, country, or GPS text contains ``query``."""
        pattern = f"%{PostgresLocationRepository._like_escape(query.strip().lower())}%"
        wheres = [
            self._table.c.location_domain_ref_id == parent_ref_id.as_int(),
            or_(
                func.lower(self._table.c.name).like(pattern, escape="\\"),
                func.lower(func.coalesce(self._table.c.address_line, "")).like(
                    pattern, escape="\\"
                ),
                func.lower(func.coalesce(self._table.c.country, "")).like(
                    pattern, escape="\\"
                ),
                func.lower(func.coalesce(cast(self._table.c.lat, String), "")).like(
                    pattern, escape="\\"
                ),
                func.lower(func.coalesce(cast(self._table.c.lng, String), "")).like(
                    pattern, escape="\\"
                ),
            ),
        ]
        if not allow_archived:
            wheres.append(self._table.c.archived.is_(False))

        query_stmt = (
            select(self._table)
            .where(*wheres)
            .order_by(self._table.c.is_key.desc(), self._table.c.name)
            .limit(limit)
        )
        results = await self._connection.execute(query_stmt)
        return [self._row_to_entity(row) for row in results]

    async def find_in_gps_box(
        self,
        parent_ref_id: EntityId,
        lat_min: float,
        lat_max: float,
        lng_min: float,
        lng_max: float,
        *,
        allow_archived: bool = False,
    ) -> list[Location]:
        """Find locations whose lat/lng fall inside an axis-aligned bounding box."""
        wheres = [
            self._table.c.location_domain_ref_id == parent_ref_id.as_int(),
            self._table.c.lat.is_not(None),
            self._table.c.lng.is_not(None),
            self._table.c.lat.between(lat_min, lat_max),
            self._table.c.lng.between(lng_min, lng_max),
        ]
        if not allow_archived:
            wheres.append(self._table.c.archived.is_(False))

        query_stmt = select(self._table).where(*wheres)
        results = await self._connection.execute(query_stmt)
        return [self._row_to_entity(row) for row in results]

    @staticmethod
    def _like_escape(value: str) -> str:
        return value.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_")


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
                locations_ref_ids=[
                    rid.as_int() for rid in location_link.locations_ref_ids
                ],
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
                    "locations_ref_ids": [
                        rid.as_int() for rid in location_link.locations_ref_ids
                    ],
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

    async def find_all_containing_location(
        self,
        parent_ref_id: EntityId,
        location_ref_id: EntityId,
        *,
        allow_archived: bool = False,
    ) -> list[LocationLink]:
        """Find location links whose ``locations_ref_ids`` include ``location_ref_id``."""
        wheres = [
            self._table.c.location_domain_ref_id == parent_ref_id.as_int(),
            self._table.c.locations_ref_ids.contains([location_ref_id.as_int()]),
        ]
        if not allow_archived:
            wheres.append(self._table.c.archived.is_(False))

        query_stmt = select(self._table).where(*wheres)
        results = await self._connection.execute(query_stmt)
        return [self._row_to_entity(row) for row in results]
