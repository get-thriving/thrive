"""PostgreSQL repository for access statuses."""

from typing import Final, Mapping, cast

from jupiter.core.common.access.sub.status.root import (
    AccessStatus,
    AccessStatusKey,
    AccessStatusRepository,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.realm.realm import RealmCodecRegistry, RealmThing
from jupiter.framework.storage.postgres.repository import PostgresRecordRepository
from jupiter.framework.storage.postgres.row import RowType
from jupiter.framework.storage.repository import (
    RecordAlreadyExistsError,
    RecordNotFoundError,
)
from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Integer,
    MetaData,
    String,
    Table,
    delete,
    insert,
    select,
    update,
)
from sqlalchemy.dialects.postgresql import insert as pg_insert
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncConnection


class PostgresAccessStatusRepository(
    PostgresRecordRepository[AccessStatus, AccessStatusKey],
    AccessStatusRepository,
):
    """PostgreSQL implementation of the access status repository."""

    _table: Final[Table]

    def __init__(
        self,
        realm_codec_registry: RealmCodecRegistry,
        connection: AsyncConnection,
        metadata: MetaData,
    ) -> None:
        """Constructor."""
        super().__init__(realm_codec_registry, connection, metadata)
        self._table = Table(
            "access_status",
            metadata,
            Column(
                "access_domain_ref_id",
                Integer,
                ForeignKey("access_domain.ref_id"),
                nullable=False,
            ),
            Column("entity", String, nullable=False),
            Column("user_ref_id", Integer, nullable=False),
            Column("access_level", String, nullable=False),
            Column("reason", String, nullable=False),
            Column(
                "access_grant_ref_id",
                Integer,
                ForeignKey("access_grant.ref_id"),
                nullable=False,
            ),
            Column("created_time", DateTime(timezone=True), nullable=False),
            Column("last_modified_time", DateTime(timezone=True), nullable=False),
            keep_existing=True,
        )

    def _row_to_record(self, row: RowType) -> AccessStatus:
        return self._realm_codec_registry.db_decode(
            AccessStatus, cast(Mapping[str, RealmThing], row._mapping)
        )

    async def create(self, record: AccessStatus) -> AccessStatus:
        """Create a new access status."""
        try:
            await self._connection.execute(
                insert(self._table).values(
                    **(
                        cast(
                            Mapping[str, RealmThing],
                            self._realm_codec_registry.db_encode(record),
                        )
                    ),
                ),
            )
        except IntegrityError as err:
            raise RecordAlreadyExistsError(
                f"Access status for {record.entity} and user {record.user_ref_id} already exists",
            ) from err
        return record

    async def save(self, record: AccessStatus) -> AccessStatus:
        """Save an access status."""
        result = await self._connection.execute(
            update(self._table)
            .where(
                self._table.c.access_domain_ref_id
                == record.access_domain.ref_id.as_int()
            )
            .where(self._table.c.entity == str(record.entity))
            .where(self._table.c.user_ref_id == record.user_ref_id.as_int())
            .values(
                **(
                    cast(
                        Mapping[str, RealmThing],
                        self._realm_codec_registry.db_encode(record),
                    )
                )
            ),
        )
        if result.rowcount == 0:
            raise RecordNotFoundError(
                f"Access status for {record.entity} and user {record.user_ref_id} does not exist"
            )
        return record

    async def remove(self, key: AccessStatusKey) -> None:
        """Remove an access status."""
        result = await self._connection.execute(
            delete(self._table)
            .where(self._table.c.access_domain_ref_id == key[0].as_int())
            .where(self._table.c.entity == str(key[1]))
            .where(self._table.c.user_ref_id == key[2].as_int()),
        )
        if result.rowcount == 0:
            raise RecordNotFoundError(
                f"Access status for {key[1]} and user {key[2]} does not exist"
            )

    async def load_by_key_optional(self, key: AccessStatusKey) -> AccessStatus | None:
        """Load an access status by composite key."""
        result = await self._connection.execute(
            select(self._table)
            .where(self._table.c.access_domain_ref_id == key[0].as_int())
            .where(self._table.c.entity == str(key[1]))
            .where(self._table.c.user_ref_id == key[2].as_int()),
        )
        row = result.first()
        if row is None:
            return None
        return self._row_to_record(row)

    async def find_all(
        self, parent_ref_id: EntityId | list[EntityId]
    ) -> list[AccessStatus]:
        """Find all access statuses for one or more access domains."""
        if isinstance(parent_ref_id, list):
            stmt = select(self._table).where(
                self._table.c.access_domain_ref_id.in_(
                    [ref_id.as_int() for ref_id in parent_ref_id]
                )
            )
        else:
            stmt = select(self._table).where(
                self._table.c.access_domain_ref_id == parent_ref_id.as_int()
            )
        results = await self._connection.execute(stmt)
        return [self._row_to_record(row) for row in results]

    async def find_all_for_user(
        self,
        entity_type: str,
        user_id: EntityId,
    ) -> list[AccessStatus]:
        """Find all access statuses for a user over resources of a given type."""
        query_stmt = select(self._table).where(
            self._table.c.user_ref_id == user_id.as_int(),
            self._table.c.entity.like(f"{entity_type}:%"),
        )
        results = await self._connection.execute(query_stmt)
        return [self._row_to_record(row) for row in results]

    async def find_all_for_entity(
        self,
        entity: EntityLink,
    ) -> list[AccessStatus]:
        """Find all access statuses for a resource."""
        query_stmt = select(self._table).where(self._table.c.entity == str(entity))
        results = await self._connection.execute(query_stmt)
        return [self._row_to_record(row) for row in results]

    async def find_all_for_grant(
        self,
        access_grant_ref_id: EntityId,
    ) -> list[AccessStatus]:
        """Find all access statuses derived from a particular grant."""
        query_stmt = select(self._table).where(
            self._table.c.access_grant_ref_id == access_grant_ref_id.as_int(),
        )
        results = await self._connection.execute(query_stmt)
        return [self._row_to_record(row) for row in results]

    async def load_optional_for_entity_and_user(
        self,
        entity: EntityLink,
        user_ref_id: EntityId,
    ) -> AccessStatus | None:
        """Load the access status for a specific entity and user, if any."""
        query_stmt = select(self._table).where(
            self._table.c.entity == str(entity),
            self._table.c.user_ref_id == user_ref_id.as_int(),
        )
        result = (await self._connection.execute(query_stmt)).first()
        if result is None:
            return None
        return self._row_to_record(result)

    async def load_all_for_entities_and_user(
        self,
        entities: list[EntityLink],
        user_ref_id: EntityId,
    ) -> list[AccessStatus]:
        """Load access statuses for the given entities and user."""
        if not entities:
            return []
        query_stmt = select(self._table).where(
            self._table.c.entity.in_([str(entity) for entity in entities]),
            self._table.c.user_ref_id == user_ref_id.as_int(),
        )
        results = await self._connection.execute(query_stmt)
        return [self._row_to_record(row) for row in results]

    async def upsert(self, status: AccessStatus) -> AccessStatus:
        """Insert a status, or update the level and reason of the matching existing one."""
        values = cast(
            Mapping[str, RealmThing],
            self._realm_codec_registry.db_encode(status),
        )
        insert_stmt = pg_insert(self._table).values(**values)
        upsert_stmt = insert_stmt.on_conflict_do_update(
            index_elements=["access_domain_ref_id", "entity", "user_ref_id"],
            set_={
                "last_modified_time": insert_stmt.excluded.last_modified_time,
                "access_level": insert_stmt.excluded.access_level,
                "reason": insert_stmt.excluded.reason,
                "access_grant_ref_id": insert_stmt.excluded.access_grant_ref_id,
            },
        )
        await self._connection.execute(upsert_stmt)
        return status
