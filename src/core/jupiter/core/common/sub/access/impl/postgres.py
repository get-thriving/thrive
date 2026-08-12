"""PostgreSQL repositories for the access control domain."""

from typing import Final, Mapping, cast

from jupiter.core.common.sub.access.access_level import AccessLevel
from jupiter.core.common.sub.access.root import (
    THE_ACCESS_DOMAIN_REF_ID,
    AccessDomain,
    AccessDomainNotFoundError,
    AccessDomainRepository,
)
from jupiter.core.common.sub.access.sub.grant.root import (
    AccessGrant,
    AccessGrantRepository,
)
from jupiter.core.common.sub.access.sub.invite.root import (
    AccessInvite,
    AccessInviteRepository,
)
from jupiter.core.common.sub.access.sub.request.root import (
    AccessRequest,
    AccessRequestRepository,
)
from jupiter.core.common.sub.access.sub.status.root import (
    AccessStatus,
    AccessStatusKey,
    AccessStatusRepository,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.realm.realm import RealmCodecRegistry, RealmThing
from jupiter.framework.storage.postgres.events import upsert_events
from jupiter.framework.storage.postgres.repository import (
    PostgresLeafEntityRepository,
    PostgresRecordRepository,
    PostgresRootEntityRepository,
)
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
    column,
    delete,
    insert,
    select,
    update,
)
from sqlalchemy import table as sql_table
from sqlalchemy.dialects.postgresql import insert as pg_insert
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncConnection

# asyncpg rejects queries with more than 32767 bind parameters. Keep ``IN``
# lookups comfortably under that for accounts with large owner-grant backfills.
_IN_QUERY_BATCH_SIZE: Final = 500


class PostgresAccessDomainRepository(
    PostgresRootEntityRepository[AccessDomain], AccessDomainRepository
):
    """PostgreSQL implementation of the access domain repository."""

    async def load_the_access_domain(self) -> AccessDomain:
        """Load the singleton access domain."""
        query_stmt = select(self._table).where(
            self._table.c.ref_id == THE_ACCESS_DOMAIN_REF_ID.as_int(),
            self._table.c.archived.is_(False),
        )
        result = (await self._connection.execute(query_stmt)).first()
        if result is None:
            raise AccessDomainNotFoundError("Access domain does not exist")
        return self._row_to_entity(result)


class PostgresAccessGrantRepository(
    PostgresLeafEntityRepository[AccessGrant], AccessGrantRepository
):
    """PostgreSQL implementation of the access grant repository."""

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

    async def find_all_for_entities(
        self,
        entities: list[EntityLink],
        allow_archived: bool = False,
    ) -> list[AccessGrant]:
        """Find all grants for the given resources."""
        if not entities:
            return []
        encoded = [self._realm_codec_registry.db_encode(entity) for entity in entities]
        grants: list[AccessGrant] = []
        for idx in range(0, len(encoded), _IN_QUERY_BATCH_SIZE):
            batch = encoded[idx : idx + _IN_QUERY_BATCH_SIZE]
            query_stmt = select(self._table).where(self._table.c.entity.in_(batch))
            if not allow_archived:
                query_stmt = query_stmt.where(self._table.c.archived.is_(False))
            results = await self._connection.execute(query_stmt)
            grants.extend(self._row_to_entity(row) for row in results)
        return grants

    async def find_all_for_user(
        self,
        user_ref_id: EntityId,
        allow_archived: bool = False,
    ) -> list[AccessGrant]:
        """Find all grants where the given user is the grantee."""
        query_stmt = select(self._table).where(
            self._table.c.user_ref_id == user_ref_id.as_int(),
        )
        if not allow_archived:
            query_stmt = query_stmt.where(self._table.c.archived.is_(False))
        results = await self._connection.execute(query_stmt)
        return [self._row_to_entity(row) for row in results]

    async def find_all_shared_with_user(
        self,
        user_ref_id: EntityId,
        allow_archived: bool = False,
    ) -> list[AccessGrant]:
        """Find non-owner grants where the given user is the grantee."""
        query_stmt = select(self._table).where(
            self._table.c.user_ref_id == user_ref_id.as_int(),
            self._table.c.access_level != AccessLevel.OWNER.value,
        )
        if not allow_archived:
            query_stmt = query_stmt.where(self._table.c.archived.is_(False))
        results = await self._connection.execute(query_stmt)
        return [self._row_to_entity(row) for row in results]

    async def find_all_shared_on_entities_owned_by(
        self,
        owner_user_ref_id: EntityId,
        allow_archived: bool = False,
    ) -> list[AccessGrant]:
        """Find non-owner grants on entities the given user owns."""
        owned_table = self._table.alias("owned_access_grant")
        query_stmt = (
            select(self._table)
            .select_from(
                owned_table.join(
                    self._table,
                    self._table.c.entity == owned_table.c.entity,
                )
            )
            .where(
                owned_table.c.user_ref_id == owner_user_ref_id.as_int(),
                owned_table.c.access_level == AccessLevel.OWNER.value,
                self._table.c.access_level != AccessLevel.OWNER.value,
                self._table.c.user_ref_id != owner_user_ref_id.as_int(),
            )
        )
        if not allow_archived:
            query_stmt = query_stmt.where(
                owned_table.c.archived.is_(False),
                self._table.c.archived.is_(False),
            )
        results = await self._connection.execute(query_stmt)
        return [self._row_to_entity(row) for row in results]

    async def upsert(self, grant: AccessGrant) -> AccessGrant:
        """Insert a grant, or update the access level of the matching existing grant."""
        row = self._entity_to_row(grant)
        stmt = (
            pg_insert(self._table)
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


class PostgresAccessRequestRepository(
    PostgresLeafEntityRepository[AccessRequest], AccessRequestRepository
):
    """PostgreSQL implementation of the access request repository."""

    async def find_all_for_entity(
        self,
        entity: EntityLink,
        allow_archived: bool = False,
    ) -> list[AccessRequest]:
        """Find all requests for a resource, across all principals."""
        query_stmt = select(self._table).where(
            self._table.c.entity == self._realm_codec_registry.db_encode(entity),
        )
        if not allow_archived:
            query_stmt = query_stmt.where(self._table.c.archived.is_(False))
        results = await self._connection.execute(query_stmt)
        return [self._row_to_entity(row) for row in results]

    async def find_all_for_entities(
        self,
        entities: list[EntityLink],
        allow_archived: bool = False,
    ) -> list[AccessRequest]:
        """Find all requests for the given resources."""
        if not entities:
            return []
        encoded = [self._realm_codec_registry.db_encode(entity) for entity in entities]
        requests: list[AccessRequest] = []
        for idx in range(0, len(encoded), _IN_QUERY_BATCH_SIZE):
            batch = encoded[idx : idx + _IN_QUERY_BATCH_SIZE]
            query_stmt = select(self._table).where(self._table.c.entity.in_(batch))
            if not allow_archived:
                query_stmt = query_stmt.where(self._table.c.archived.is_(False))
            results = await self._connection.execute(query_stmt)
            requests.extend(self._row_to_entity(row) for row in results)
        return requests

    async def find_all_for_user(
        self,
        user_ref_id: EntityId,
        allow_archived: bool = False,
    ) -> list[AccessRequest]:
        """Find all requests where the given user is the requester."""
        query_stmt = select(self._table).where(
            self._table.c.user_ref_id == user_ref_id.as_int(),
        )
        if not allow_archived:
            query_stmt = query_stmt.where(self._table.c.archived.is_(False))
        results = await self._connection.execute(query_stmt)
        return [self._row_to_entity(row) for row in results]

    async def find_all_for_entities_owned_by(
        self,
        owner_user_ref_id: EntityId,
        allow_archived: bool = False,
    ) -> list[AccessRequest]:
        """Find requests on entities the given user owns."""
        # Lightweight construct so this repo does not depend on AccessGrant's
        # mapped table / metadata registration.
        grant_table = sql_table(
            "access_grant",
            column("entity"),
            column("user_ref_id"),
            column("access_level"),
            column("archived"),
        )
        query_stmt = (
            select(self._table)
            .select_from(
                grant_table.join(
                    self._table,
                    self._table.c.entity == grant_table.c.entity,
                )
            )
            .where(
                grant_table.c.user_ref_id == owner_user_ref_id.as_int(),
                grant_table.c.access_level == AccessLevel.OWNER.value,
            )
        )
        if not allow_archived:
            query_stmt = query_stmt.where(
                grant_table.c.archived.is_(False),
                self._table.c.archived.is_(False),
            )
        results = await self._connection.execute(query_stmt)
        return [self._row_to_entity(row) for row in results]

    async def upsert(self, request: AccessRequest) -> AccessRequest:
        """Insert a request, or update the matching existing one."""
        row = self._entity_to_row(request)
        stmt = (
            pg_insert(self._table)
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
                    "status": row["status"],
                },
            )
            .returning(self._table.c.ref_id)
        )
        result = await self._connection.execute(stmt)
        new_id = result.scalar_one()
        request = request.assign_ref_id(EntityId(str(new_id)))
        await upsert_events(
            self._realm_codec_registry,
            self._connection,
            self._event_table,
            request,
        )
        return request


class PostgresAccessInviteRepository(
    PostgresLeafEntityRepository[AccessInvite], AccessInviteRepository
):
    """PostgreSQL implementation of the access invite repository."""

    async def find_all_for_grant(
        self,
        access_grant_ref_id: EntityId,
        allow_archived: bool = False,
    ) -> list[AccessInvite]:
        """Find all invites linked to a grant."""
        query_stmt = select(self._table).where(
            self._table.c.access_grant_ref_id == access_grant_ref_id.as_int(),
        )
        if not allow_archived:
            query_stmt = query_stmt.where(self._table.c.archived.is_(False))
        results = await self._connection.execute(query_stmt)
        return [self._row_to_entity(row) for row in results]

    async def find_all_for_grants(
        self,
        access_grant_ref_ids: list[EntityId],
        allow_archived: bool = False,
    ) -> list[AccessInvite]:
        """Find all invites linked to the given grants."""
        if not access_grant_ref_ids:
            return []
        encoded = [ref_id.as_int() for ref_id in access_grant_ref_ids]
        invites: list[AccessInvite] = []
        for idx in range(0, len(encoded), _IN_QUERY_BATCH_SIZE):
            batch = encoded[idx : idx + _IN_QUERY_BATCH_SIZE]
            query_stmt = select(self._table).where(
                self._table.c.access_grant_ref_id.in_(batch),
            )
            if not allow_archived:
                query_stmt = query_stmt.where(self._table.c.archived.is_(False))
            results = await self._connection.execute(query_stmt)
            invites.extend(self._row_to_entity(row) for row in results)
        return invites

    async def upsert(self, invite: AccessInvite) -> AccessInvite:
        """Insert an invite, or unarchive/refresh the matching one for the grant."""
        row = self._entity_to_row(invite)
        stmt = (
            pg_insert(self._table)
            .values(**{col: val for col, val in row.items() if col != "ref_id"})
            .on_conflict_do_update(
                index_elements=[
                    self._table.c.access_domain_ref_id,
                    self._table.c.access_grant_ref_id,
                ],
                set_={
                    "version": row["version"],
                    "archived": row["archived"],
                    "archival_reason": row["archival_reason"],
                    "last_modified_time": row["last_modified_time"],
                    "archived_time": row["archived_time"],
                },
            )
            .returning(self._table.c.ref_id)
        )
        result = await self._connection.execute(stmt)
        new_id = result.scalar_one()
        invite = invite.assign_ref_id(EntityId(str(new_id)))
        await upsert_events(
            self._realm_codec_registry,
            self._connection,
            self._event_table,
            invite,
        )
        return invite


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

    async def find_all_for_entities(
        self,
        entities: list[EntityLink],
    ) -> list[AccessStatus]:
        """Find all access statuses for the given resources."""
        if not entities:
            return []
        encoded = [str(entity) for entity in entities]
        statuses: list[AccessStatus] = []
        for idx in range(0, len(encoded), _IN_QUERY_BATCH_SIZE):
            batch = encoded[idx : idx + _IN_QUERY_BATCH_SIZE]
            query_stmt = select(self._table).where(self._table.c.entity.in_(batch))
            results = await self._connection.execute(query_stmt)
            statuses.extend(self._row_to_record(row) for row in results)
        return statuses

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
