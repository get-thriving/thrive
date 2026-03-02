"""SQLite implementations of common persons repositories."""

from jupiter.core.common.sub.persons.namespace import PersonNamespace
from jupiter.core.common.sub.persons.sub.link.root import (
    CommonPersonLink,
    CommonPersonLinkRepository,
)
from jupiter.core.common.sub.persons.sub.person.root import (
    CommonPerson,
    CommonPersonAlreadyExistsError,
    CommonPersonRepository,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.realm.realm import RealmCodecRegistry
from jupiter.framework.storage.sqlite.repository import SqliteLeafEntityRepository
from sqlalchemy import MetaData, select
from sqlalchemy.dialects.sqlite import insert as sqlite_insert
from sqlalchemy.ext.asyncio import AsyncConnection


class SqliteCommonPersonRepository(
    SqliteLeafEntityRepository[CommonPerson], CommonPersonRepository
):
    """SQLite implementation of the common person repository."""

    def __init__(
        self,
        realm_codec_registry: RealmCodecRegistry,
        connection: AsyncConnection,
        metadata: MetaData,
    ) -> None:
        """Constructor."""
        super().__init__(
            realm_codec_registry,
            connection,
            metadata,
            already_exists_err_cls=CommonPersonAlreadyExistsError,
        )

    async def upsert(self, person: CommonPerson) -> CommonPerson:
        """Upsert a common person for a namespace and name."""
        stmt = (
            sqlite_insert(self._table)
            .values(
                version=person.version,
                archived=person.archived,
                archival_reason=person.archival_reason,
                created_time=self._realm_codec_registry.db_encode(person.created_time),
                last_modified_time=self._realm_codec_registry.db_encode(
                    person.last_modified_time
                ),
                archived_time=self._realm_codec_registry.db_encode(
                    person.archived_time
                ),
                person_domain_ref_id=person.person_domain.ref_id.as_int(),
                namespace=person.namespace.value,
                name=person.name.the_name,
            )
            .on_conflict_do_update(
                index_elements=["person_domain_ref_id", "namespace", "name"],
                set_={
                    "version": person.version,
                    "archived": person.archived,
                    "archival_reason": person.archival_reason,
                    "last_modified_time": self._realm_codec_registry.db_encode(
                        person.last_modified_time
                    ),
                    "archived_time": self._realm_codec_registry.db_encode(
                        person.archived_time
                    ),
                },
            )
            .returning(self._table.c.ref_id)
        )

        result = await self._connection.execute(stmt)
        new_id = result.scalar_one()

        return person.assign_ref_id(EntityId(new_id))


class SqliteCommonPersonLinkRepository(
    SqliteLeafEntityRepository[CommonPersonLink], CommonPersonLinkRepository
):
    """SQLite implementation of the common person link repository."""

    async def upsert(self, person_link: CommonPersonLink) -> CommonPersonLink:
        """Upsert a common person link."""
        stmt = (
            sqlite_insert(self._table)
            .values(
                version=person_link.version,
                archived=person_link.archived,
                archival_reason=person_link.archival_reason,
                created_time=self._realm_codec_registry.db_encode(
                    person_link.created_time
                ),
                last_modified_time=self._realm_codec_registry.db_encode(
                    person_link.last_modified_time
                ),
                archived_time=self._realm_codec_registry.db_encode(
                    person_link.archived_time
                ),
                name=person_link.name.the_name,
                person_domain_ref_id=person_link.person_domain.ref_id.as_int(),
                namespace=person_link.namespace.value,
                source_entity_ref_id=person_link.source_entity_ref_id.as_int(),
                ref_ids=[rid.as_int() for rid in person_link.ref_ids],
            )
            .on_conflict_do_update(
                index_elements=[
                    "person_domain_ref_id",
                    "namespace",
                    "source_entity_ref_id",
                ],
                set_={
                    "version": person_link.version,
                    "archived": person_link.archived,
                    "archival_reason": person_link.archival_reason,
                    "last_modified_time": self._realm_codec_registry.db_encode(
                        person_link.last_modified_time
                    ),
                    "archived_time": self._realm_codec_registry.db_encode(
                        person_link.archived_time
                    ),
                    "ref_ids": [rid.as_int() for rid in person_link.ref_ids],
                },
            )
            .returning(self._table.c.ref_id)
        )

        result = await self._connection.execute(stmt)
        new_id = result.scalar_one()

        return person_link.assign_ref_id(EntityId(new_id))

    async def load_optional_for_namespace_and_source(
        self,
        namespace: PersonNamespace,
        source_entity_ref_id: EntityId,
    ) -> CommonPersonLink | None:
        """Load a common person link by its namespace and source entity reference ID."""
        query_stmt = (
            select(self._table)
            .where(self._table.c.namespace == namespace.value)
            .where(
                self._table.c.source_entity_ref_id == source_entity_ref_id.as_int()
            )
        )
        result = (await self._connection.execute(query_stmt)).first()
        if result is None:
            return None
        return self._row_to_entity(result)
