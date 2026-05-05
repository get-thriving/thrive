"""The PostgreSQL based PRM repositories."""

from sqlalchemy.exc import IntegrityError
from typing import Final, Mapping, cast

from jupiter.core.prm.sub.person_circle_links.root import (
    PersonCircleLink,
    PersonCircleLinkRepository,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.realm.realm import RealmCodecRegistry, RealmThing
from jupiter.framework.storage.repository import (
    RecordAlreadyExistsError,
    RecordNotFoundError,
)
from jupiter.framework.storage.postgres.repository import PostgresRecordRepository
from jupiter.framework.storage.postgres.row import RowType
from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Integer,
    MetaData,
    Table,
    delete,
    insert,
    select,
    update,
)
from sqlalchemy.ext.asyncio import AsyncConnection


class PostgresPersonCircleLinkRepository(
    PostgresRecordRepository[PersonCircleLink, tuple[EntityId, EntityId, EntityId]],
    PersonCircleLinkRepository,
):
    """A PostgreSQL repository for person-circle links."""

    _person_circle_link_table: Final[Table]

    def __init__(
        self,
        realm_codec_registry: RealmCodecRegistry,
        connection: AsyncConnection,
        metadata: MetaData,
    ) -> None:
        """Constructor."""
        super().__init__(realm_codec_registry, connection, metadata)
        self._person_circle_link_table = Table(
            "person_circle_link",
            metadata,
            Column(
                "prm_ref_id",
                Integer,
                ForeignKey("prm.ref_id"),
                nullable=False,
            ),
            Column(
                "person_ref_id",
                Integer,
                ForeignKey("person.ref_id"),
                nullable=False,
            ),
            Column(
                "circle_ref_id",
                Integer,
                ForeignKey("circle.ref_id"),
                nullable=False,
            ),
            Column("created_time", DateTime(timezone=True), nullable=False),
            Column("last_modified_time", DateTime(timezone=True), nullable=False),
            keep_existing=True,
        )

    async def create(self, record: PersonCircleLink) -> PersonCircleLink:
        """Create a new person-circle link."""
        try:
            await self._connection.execute(
                insert(self._person_circle_link_table).values(
                    **(
                        cast(
                            Mapping[str, RealmThing],
                            self._realm_codec_registry.db_encode(record),
                        )
                    )
                )
            )
        except IntegrityError as err:
            raise RecordAlreadyExistsError(
                "Person-circle link already exists",
            ) from err
        return record

    async def save(self, record: PersonCircleLink) -> PersonCircleLink:
        """Save a person-circle link."""
        result = await self._connection.execute(
            update(self._person_circle_link_table)
            .where(self._person_circle_link_table.c.prm_ref_id == record.prm.as_int())
            .where(
                self._person_circle_link_table.c.person_ref_id
                == record.person_ref_id.as_int()
            )
            .where(
                self._person_circle_link_table.c.circle_ref_id
                == record.circle_ref_id.as_int()
            )
            .values(
                **(
                    cast(
                        Mapping[str, RealmThing],
                        self._realm_codec_registry.db_encode(record),
                    )
                )
            )
        )
        if result.rowcount == 0:
            raise RecordNotFoundError("Person-circle link does not exist")
        return record

    async def remove(self, key: tuple[EntityId, EntityId, EntityId]) -> None:
        """Remove a person-circle link."""
        result = await self._connection.execute(
            delete(self._person_circle_link_table)
            .where(self._person_circle_link_table.c.prm_ref_id == key[0].as_int())
            .where(self._person_circle_link_table.c.person_ref_id == key[1].as_int())
            .where(self._person_circle_link_table.c.circle_ref_id == key[2].as_int())
        )
        if result.rowcount == 0:
            raise RecordNotFoundError("Person-circle link does not exist")

    async def load_by_key_optional(
        self, key: tuple[EntityId, EntityId, EntityId]
    ) -> PersonCircleLink | None:
        """Load a person-circle link by key."""
        results = await self._connection.execute(
            select(self._person_circle_link_table)
            .where(self._person_circle_link_table.c.prm_ref_id == key[0].as_int())
            .where(self._person_circle_link_table.c.person_ref_id == key[1].as_int())
            .where(self._person_circle_link_table.c.circle_ref_id == key[2].as_int())
        )
        row = results.fetchone()
        if row is None:
            return None
        return self._row_to_entity(row)

    async def find_all(
        self, parent_ref_id: EntityId | list[EntityId]
    ) -> list[PersonCircleLink]:
        """Find all links for a PRM."""
        if isinstance(parent_ref_id, list):
            query = select(self._person_circle_link_table).where(
                self._person_circle_link_table.c.prm_ref_id.in_(
                    [p.as_int() for p in parent_ref_id]
                )
            )
        else:
            query = select(self._person_circle_link_table).where(
                self._person_circle_link_table.c.prm_ref_id == parent_ref_id.as_int()
            )
        results = await self._connection.execute(query)
        return [self._row_to_entity(row) for row in results]

    def _row_to_entity(self, row: RowType) -> PersonCircleLink:
        return self._realm_codec_registry.db_decode(
            PersonCircleLink, cast(Mapping[str, RealmThing], row._mapping)
        )
