"""SQLite persistence for :class:`SearchEntityIndexingMapRepository`."""

from typing import Final, cast

from jupiter.core.search.entity_indexing_record import SearchEntityIndexingRecord
from jupiter.core.search.indexing_map_repository import (
    SearchEntityIndexingMapRepository,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.timestamp import Timestamp
from jupiter.framework.realm.realm import DatabaseRealm, RealmCodecRegistry, RealmThing
from jupiter.framework.storage.sqlite.repository import SqliteRepository
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
from sqlalchemy.dialects.sqlite import insert as sqlite_insert
from sqlalchemy.ext.asyncio import AsyncConnection


class SqliteSearchEntityIndexingMapRepository(
    SqliteRepository, SearchEntityIndexingMapRepository
):
    """SQLite table ``search_entity_indexing_map``."""

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
            Column("last_indexed_time", DateTime, nullable=False),
            Column("object_id", String, nullable=False),
            keep_existing=True,
        )

    async def find_all_for_workspace_entity_type(
        self, workspace_ref_id: EntityId, entity_type: str
    ) -> list[SearchEntityIndexingRecord]:
        """Load all rows for workspace and type."""
        dec = self._realm_codec_registry.get_decoder
        stmt = (
            select(self._table)
            .where(self._table.c.workspace_ref_id == workspace_ref_id.as_int())
            .where(self._table.c.entity_type == entity_type)
        )
        result = await self._connection.execute(stmt)
        rows = result.mappings().all()
        out: list[SearchEntityIndexingRecord] = []
        for row in rows:
            out.append(
                SearchEntityIndexingRecord(
                    workspace_ref_id=dec(EntityId, DatabaseRealm).decode(
                        cast(RealmThing, row["workspace_ref_id"])
                    ),
                    entity_type=str(row["entity_type"]),
                    entity_ref_id=dec(EntityId, DatabaseRealm).decode(
                        cast(RealmThing, row["entity_ref_id"])
                    ),
                    last_indexed_time=dec(Timestamp, DatabaseRealm).decode(
                        cast(RealmThing, row["last_indexed_time"])
                    ),
                    object_id=str(row["object_id"]),
                )
            )
        return out

    async def load_optional(
        self,
        workspace_ref_id: EntityId,
        entity_type: str,
        entity_ref_id: EntityId,
    ) -> SearchEntityIndexingRecord | None:
        """Return one row by workspace, type, and entity id."""
        dec = self._realm_codec_registry.get_decoder
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
        return SearchEntityIndexingRecord(
            workspace_ref_id=dec(EntityId, DatabaseRealm).decode(
                cast(RealmThing, row["workspace_ref_id"])
            ),
            entity_type=str(row["entity_type"]),
            entity_ref_id=dec(EntityId, DatabaseRealm).decode(
                cast(RealmThing, row["entity_ref_id"])
            ),
            last_indexed_time=dec(Timestamp, DatabaseRealm).decode(
                cast(RealmThing, row["last_indexed_time"])
            ),
            object_id=str(row["object_id"]),
        )

    async def upsert(self, record: SearchEntityIndexingRecord) -> None:
        """Insert or update."""
        enc = self._realm_codec_registry.get_encoder
        values = {
            "workspace_ref_id": enc(EntityId, DatabaseRealm).encode(
                record.workspace_ref_id
            ),
            "entity_type": record.entity_type,
            "entity_ref_id": enc(EntityId, DatabaseRealm).encode(record.entity_ref_id),
            "last_indexed_time": enc(Timestamp, DatabaseRealm).encode(
                record.last_indexed_time
            ),
            "object_id": record.object_id,
        }
        insert_stmt = sqlite_insert(self._table).values(**values)
        upsert_stmt = insert_stmt.on_conflict_do_update(
            constraint="uq_search_entity_indexing_map_workspace_entity",
            set_={
                "last_indexed_time": insert_stmt.excluded.last_indexed_time,
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
