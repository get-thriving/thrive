"""PostgreSQL persistence for :class:`SearchEntityIndexingMapRepository`."""

from typing import Final, cast

from jupiter.core.search.entity_indexing_record import SearchEntityIndexingRecord
from jupiter.core.search.indexing_map_repository import (
    SearchEntityIndexingMapRepository,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.timestamp import Timestamp
from jupiter.framework.entity import ParentLink
from jupiter.framework.realm.realm import DatabaseRealm, RealmCodecRegistry, RealmThing
from jupiter.framework.storage.postgres.repository import PostgresRepository
from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Integer,
    MetaData,
    String,
    Table,
    delete,
    select,
)
from sqlalchemy.dialects.postgresql import insert as pg_insert
from sqlalchemy.ext.asyncio import AsyncConnection


class PostgresSearchEntityIndexingMapRepository(
    PostgresRepository, SearchEntityIndexingMapRepository
):
    """PostgreSQL table ``search_entity_indexing_map``."""

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
            "search_entity_indexing_map",
            metadata,
            Column(
                "workspace_ref_id",
                Integer,
                ForeignKey("workspace.ref_id"),
                nullable=False,
            ),
            Column("entity_type", String, nullable=False),
            Column("entity_ref_id", Integer, nullable=False),
            Column("created_time", DateTime(timezone=True), nullable=False),
            Column("last_modified_time", DateTime(timezone=True), nullable=False),
            Column("object_id", String, nullable=False),
            keep_existing=True,
        )

    def _row_to_record(self, row: dict[str, object]) -> SearchEntityIndexingRecord:
        dec = self._realm_codec_registry.get_decoder
        workspace_ref_id = dec(EntityId, DatabaseRealm).decode(
            cast(RealmThing, row["workspace_ref_id"])
        )
        return SearchEntityIndexingRecord(
            created_time=dec(Timestamp, DatabaseRealm).decode(
                cast(RealmThing, row["created_time"])
            ),
            last_modified_time=dec(Timestamp, DatabaseRealm).decode(
                cast(RealmThing, row["last_modified_time"])
            ),
            workspace=ParentLink(workspace_ref_id),
            entity_type=str(row["entity_type"]),
            entity_ref_id=dec(EntityId, DatabaseRealm).decode(
                cast(RealmThing, row["entity_ref_id"])
            ),
            object_id=str(row["object_id"]),
        )

    async def find_all_for_workspace_entity_type(
        self, workspace_ref_id: EntityId, entity_type: str
    ) -> list[SearchEntityIndexingRecord]:
        """Load all rows for workspace and type."""
        stmt = (
            select(self._table)
            .where(self._table.c.workspace_ref_id == workspace_ref_id.as_int())
            .where(self._table.c.entity_type == entity_type)
        )
        result = await self._connection.execute(stmt)
        rows = result.mappings().all()
        return [self._row_to_record(dict(row)) for row in rows]

    async def load_optional(
        self,
        workspace_ref_id: EntityId,
        entity_type: str,
        entity_ref_id: EntityId,
    ) -> SearchEntityIndexingRecord | None:
        """Return one row by workspace, type, and entity id."""
        enc = self._realm_codec_registry.get_encoder
        stmt = (
            select(self._table)
            .where(
                self._table.c.workspace_ref_id
                == enc(EntityId, DatabaseRealm).encode(workspace_ref_id)
            )
            .where(self._table.c.entity_type == entity_type)
            .where(
                self._table.c.entity_ref_id
                == enc(EntityId, DatabaseRealm).encode(entity_ref_id)
            )
        )
        result = await self._connection.execute(stmt)
        row = result.mappings().first()
        if row is None:
            return None
        return self._row_to_record(dict(row))

    async def upsert(self, record: SearchEntityIndexingRecord) -> None:
        """Insert or update."""
        enc = self._realm_codec_registry.get_encoder
        values = {
            "workspace_ref_id": enc(EntityId, DatabaseRealm).encode(
                record.workspace.ref_id
            ),
            "entity_type": record.entity_type,
            "entity_ref_id": enc(EntityId, DatabaseRealm).encode(record.entity_ref_id),
            "created_time": enc(Timestamp, DatabaseRealm).encode(record.created_time),
            "last_modified_time": enc(Timestamp, DatabaseRealm).encode(
                record.last_modified_time
            ),
            "object_id": record.object_id,
        }
        insert_stmt = pg_insert(self._table).values(**values)
        upsert_stmt = insert_stmt.on_conflict_do_update(
            index_elements=["workspace_ref_id", "entity_type", "entity_ref_id"],
            set_={
                "last_modified_time": insert_stmt.excluded.last_modified_time,
                "object_id": insert_stmt.excluded.object_id,
            },
        )
        await self._connection.execute(upsert_stmt)

    async def remove(
        self, workspace_ref_id: EntityId, entity_type: str, entity_ref_id: EntityId
    ) -> None:
        """Delete one row."""
        enc = self._realm_codec_registry.get_encoder
        await self._connection.execute(
            delete(self._table)
            .where(
                self._table.c.workspace_ref_id
                == enc(EntityId, DatabaseRealm).encode(workspace_ref_id)
            )
            .where(self._table.c.entity_type == entity_type)
            .where(
                self._table.c.entity_ref_id
                == enc(EntityId, DatabaseRealm).encode(entity_ref_id)
            ),
        )

    async def remove_all_for_workspace(self, workspace_ref_id: EntityId) -> None:
        """Delete all rows for one workspace."""
        enc = self._realm_codec_registry.get_encoder
        await self._connection.execute(
            delete(self._table).where(
                self._table.c.workspace_ref_id
                == enc(EntityId, DatabaseRealm).encode(workspace_ref_id)
            ),
        )
