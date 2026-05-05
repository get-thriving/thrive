"""Postgres implementations of contacts repositories."""

from jupiter.core.common.sub.contacts.sub.contact.name import ContactName
from jupiter.core.common.sub.contacts.sub.contact.root import (
    Contact,
    ContactAlreadyExistsError,
    ContactRepository,
)
from jupiter.core.common.sub.contacts.sub.link.root import (
    ContactLink,
    ContactLinkRepository,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.realm.realm import RealmCodecRegistry
from jupiter.framework.storage.postgres.events import upsert_events
from jupiter.framework.storage.postgres.repository import PostgresLeafEntityRepository
from sqlalchemy import MetaData, select
from sqlalchemy.dialects.postgresql import insert as pg_insert
from sqlalchemy.ext.asyncio import AsyncConnection


class PostgresContactRepository(PostgresLeafEntityRepository[Contact], ContactRepository):
    """PostgreSQL implementation of the contact repository."""

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
            already_exists_err_cls=ContactAlreadyExistsError,
        )

    async def get_by_name(
        self,
        contact_domain_ref_id: EntityId,
        name: ContactName,
    ) -> Contact:
        """Load a contact by its domain and name."""
        query_stmt = (
            select(self._table)
            .where(
                self._table.c.contact_domain_ref_id == contact_domain_ref_id.as_int()
            )
            .where(self._table.c.name == name.the_name)
            .limit(1)
        )
        result = (await self._connection.execute(query_stmt)).first()
        if result is None:
            raise ValueError(
                f"Could not find contact '{name}' in domain #{contact_domain_ref_id}"
            )
        return self._row_to_entity(result)


class PostgresContactLinkRepository(
    PostgresLeafEntityRepository[ContactLink], ContactLinkRepository
):
    """PostgreSQL implementation of the contact link repository."""

    async def upsert(self, contact_link: ContactLink) -> ContactLink:
        """Upsert a contact link."""
        stmt = (
            pg_insert(self._table)
            .values(
                version=contact_link.version,
                archived=contact_link.archived,
                archival_reason=contact_link.archival_reason,
                created_time=self._realm_codec_registry.db_encode(
                    contact_link.created_time
                ),
                last_modified_time=self._realm_codec_registry.db_encode(
                    contact_link.last_modified_time
                ),
                archived_time=self._realm_codec_registry.db_encode(
                    contact_link.archived_time
                ),
                name=contact_link.name.the_name,
                contact_domain_ref_id=contact_link.contact_domain.ref_id.as_int(),
                owner=self._realm_codec_registry.db_encode(contact_link.owner),
                contacts_ref_ids=[
                    rid.as_int() for rid in contact_link.contacts_ref_ids
                ],
            )
            .on_conflict_do_update(
                index_elements=["owner"],
                set_={
                    "version": contact_link.version,
                    "archived": contact_link.archived,
                    "archival_reason": contact_link.archival_reason,
                    "contact_domain_ref_id": contact_link.contact_domain.ref_id.as_int(),
                    "last_modified_time": self._realm_codec_registry.db_encode(
                        contact_link.last_modified_time
                    ),
                    "archived_time": self._realm_codec_registry.db_encode(
                        contact_link.archived_time
                    ),
                    "contacts_ref_ids": [
                        rid.as_int() for rid in contact_link.contacts_ref_ids
                    ],
                },
            )
            .returning(self._table.c.ref_id)
        )

        result = await self._connection.execute(stmt)
        new_id = result.scalar_one()

        contact_link = contact_link.assign_ref_id(EntityId(new_id))

        await upsert_events(
            self._realm_codec_registry,
            self._connection,
            self._event_table,
            contact_link,
        )

        return contact_link

    async def load_optional_for_owner(
        self,
        owner: EntityLink,
    ) -> ContactLink | None:
        """Load a contact link by its owner link."""
        encoded = self._realm_codec_registry.db_encode(owner)
        query_stmt = select(self._table).where(self._table.c.owner == encoded)
        result = (await self._connection.execute(query_stmt)).first()
        if result is None:
            return None
        return self._row_to_entity(result)
