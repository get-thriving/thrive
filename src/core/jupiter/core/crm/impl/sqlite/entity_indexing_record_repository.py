"""SQLite persistence for :class:`CRMEntityIndexingRecordRepository`."""

from sqlite3 import IntegrityError
from typing import Final, cast

from jupiter.core.crm.entity_indexing_record import (
    CRMEntityIndexingRecord,
    CRMEntityIndexingRecordRepository,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.timestamp import Timestamp
from jupiter.framework.entity import ParentLink
from jupiter.framework.realm.realm import DatabaseRealm, RealmCodecRegistry, RealmThing
from jupiter.framework.storage.repository import (
    RecordAlreadyExistsError,
    RecordNotFoundError,
)
from jupiter.framework.storage.sqlite.repository import SqliteRecordRepository
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
from sqlalchemy.dialects.sqlite import insert as sqlite_insert
from sqlalchemy.ext.asyncio import AsyncConnection


class SqliteCRMEntityIndexingRecordRepository(
    SqliteRecordRepository[CRMEntityIndexingRecord, tuple[EntityId, str, EntityId]],
    CRMEntityIndexingRecordRepository,
):
    """SQLite table ``crm_entity_indexing_map``."""

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
            "crm_entity_indexing_map",
            metadata,
            Column(
                "crm_domain_ref_id",
                Integer,
                ForeignKey("crm_domain.ref_id"),
                nullable=False,
            ),
            Column("entity_type", String, nullable=False),
            Column("entity_ref_id", Integer, nullable=False),
            Column("created_time", DateTime, nullable=False),
            Column("last_modified_time", DateTime, nullable=False),
            Column("object_id", String, nullable=False),
            Column("revision", Integer, nullable=False),
            Column("index_method_version", Integer, nullable=False),
            keep_existing=True,
        )

    def _row_to_record(self, row: dict[str, object]) -> CRMEntityIndexingRecord:
        dec = self._realm_codec_registry.get_decoder
        crm_domain_ref_id = dec(EntityId, DatabaseRealm).decode(
            cast(RealmThing, row["crm_domain_ref_id"])
        )
        return CRMEntityIndexingRecord(
            created_time=dec(Timestamp, DatabaseRealm).decode(
                cast(RealmThing, row["created_time"])
            ),
            last_modified_time=dec(Timestamp, DatabaseRealm).decode(
                cast(RealmThing, row["last_modified_time"])
            ),
            crm_domain=ParentLink(crm_domain_ref_id),
            entity_type=str(row["entity_type"]),
            entity_ref_id=dec(EntityId, DatabaseRealm).decode(
                cast(RealmThing, row["entity_ref_id"])
            ),
            object_id=str(row["object_id"]),
            revision=cast(int, row["revision"]),
            index_method_version=cast(int, row["index_method_version"]),
        )

    async def create(self, record: CRMEntityIndexingRecord) -> CRMEntityIndexingRecord:
        """Insert a new map row."""
        enc = self._realm_codec_registry.get_encoder
        try:
            await self._connection.execute(
                insert(self._table).values(
                    crm_domain_ref_id=enc(EntityId, DatabaseRealm).encode(
                        record.crm_domain.ref_id
                    ),
                    entity_type=record.entity_type,
                    entity_ref_id=enc(EntityId, DatabaseRealm).encode(
                        record.entity_ref_id
                    ),
                    created_time=enc(Timestamp, DatabaseRealm).encode(
                        record.created_time
                    ),
                    last_modified_time=enc(Timestamp, DatabaseRealm).encode(
                        record.last_modified_time
                    ),
                    object_id=record.object_id,
                    revision=record.revision,
                    index_method_version=record.index_method_version,
                ),
            )
        except IntegrityError as err:
            raise RecordAlreadyExistsError(
                "CRM entity indexing map row already exists",
            ) from err
        return record

    async def save(self, record: CRMEntityIndexingRecord) -> CRMEntityIndexingRecord:
        """Update an existing map row."""
        enc = self._realm_codec_registry.get_encoder
        result = await self._connection.execute(
            update(self._table)
            .where(
                self._table.c.crm_domain_ref_id
                == enc(EntityId, DatabaseRealm).encode(record.crm_domain.ref_id)
            )
            .where(self._table.c.entity_type == record.entity_type)
            .where(
                self._table.c.entity_ref_id
                == enc(EntityId, DatabaseRealm).encode(record.entity_ref_id)
            )
            .values(
                last_modified_time=enc(Timestamp, DatabaseRealm).encode(
                    record.last_modified_time
                ),
                object_id=record.object_id,
                revision=record.revision,
                index_method_version=record.index_method_version,
            ),
        )
        if result.rowcount == 0:
            raise RecordNotFoundError("CRM entity indexing map row does not exist")
        return record

    async def remove(self, key: tuple[EntityId, str, EntityId]) -> None:
        """Delete one row by composite key."""
        enc = self._realm_codec_registry.get_encoder
        result = await self._connection.execute(
            delete(self._table)
            .where(
                self._table.c.crm_domain_ref_id
                == enc(EntityId, DatabaseRealm).encode(key[0])
            )
            .where(self._table.c.entity_type == key[1])
            .where(
                self._table.c.entity_ref_id
                == enc(EntityId, DatabaseRealm).encode(key[2])
            ),
        )
        if result.rowcount == 0:
            raise RecordNotFoundError("CRM entity indexing map row does not exist")

    async def load_by_key_optional(
        self, key: tuple[EntityId, str, EntityId]
    ) -> CRMEntityIndexingRecord | None:
        """Return one row by composite key."""
        return await self.load_optional(key[0], key[1], key[2])

    async def find_all(
        self, parent_ref_id: EntityId | list[EntityId]
    ) -> list[CRMEntityIndexingRecord]:
        """Find all map rows for one or more CRM domains."""
        enc = self._realm_codec_registry.get_encoder
        if isinstance(parent_ref_id, list):
            stmt = select(self._table).where(
                self._table.c.crm_domain_ref_id.in_(
                    [
                        enc(EntityId, DatabaseRealm).encode(ref_id)
                        for ref_id in parent_ref_id
                    ]
                )
            )
        else:
            stmt = select(self._table).where(
                self._table.c.crm_domain_ref_id
                == enc(EntityId, DatabaseRealm).encode(parent_ref_id)
            )
        result = await self._connection.execute(stmt)
        rows = result.mappings().all()
        return [self._row_to_record(dict(row)) for row in rows]

    async def find_all_for_crm_domain_entity_type(
        self, crm_domain_ref_id: EntityId, entity_type: str
    ) -> list[CRMEntityIndexingRecord]:
        """Load all rows for CRM domain and type."""
        enc = self._realm_codec_registry.get_encoder
        stmt = (
            select(self._table)
            .where(
                self._table.c.crm_domain_ref_id
                == enc(EntityId, DatabaseRealm).encode(crm_domain_ref_id)
            )
            .where(self._table.c.entity_type == entity_type)
        )
        result = await self._connection.execute(stmt)
        rows = result.mappings().all()
        return [self._row_to_record(dict(row)) for row in rows]

    async def load_optional(
        self,
        crm_domain_ref_id: EntityId,
        entity_type: str,
        entity_ref_id: EntityId,
    ) -> CRMEntityIndexingRecord | None:
        """Return one row by CRM domain, type, and entity id."""
        enc = self._realm_codec_registry.get_encoder
        stmt = (
            select(self._table)
            .where(
                self._table.c.crm_domain_ref_id
                == enc(EntityId, DatabaseRealm).encode(crm_domain_ref_id)
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

    async def upsert(self, record: CRMEntityIndexingRecord) -> None:
        """Insert or update."""
        enc = self._realm_codec_registry.get_encoder
        values = {
            "crm_domain_ref_id": enc(EntityId, DatabaseRealm).encode(
                record.crm_domain.ref_id
            ),
            "entity_type": record.entity_type,
            "entity_ref_id": enc(EntityId, DatabaseRealm).encode(record.entity_ref_id),
            "created_time": enc(Timestamp, DatabaseRealm).encode(record.created_time),
            "last_modified_time": enc(Timestamp, DatabaseRealm).encode(
                record.last_modified_time
            ),
            "object_id": record.object_id,
            "revision": record.revision,
            "index_method_version": record.index_method_version,
        }
        insert_stmt = sqlite_insert(self._table).values(**values)
        upsert_stmt = insert_stmt.on_conflict_do_update(
            index_elements=["crm_domain_ref_id", "entity_type", "entity_ref_id"],
            set_={
                "last_modified_time": insert_stmt.excluded.last_modified_time,
                "object_id": insert_stmt.excluded.object_id,
                "revision": insert_stmt.excluded.revision,
                "index_method_version": insert_stmt.excluded.index_method_version,
            },
        )
        await self._connection.execute(upsert_stmt)

    async def remove_all_for_crm_domain(self, crm_domain_ref_id: EntityId) -> None:
        """Delete all rows for one CRM domain."""
        enc = self._realm_codec_registry.get_encoder
        await self._connection.execute(
            delete(self._table).where(
                self._table.c.crm_domain_ref_id
                == enc(EntityId, DatabaseRealm).encode(crm_domain_ref_id)
            ),
        )
