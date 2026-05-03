"""An entity repository with a lot of defaults (PostgreSQL)."""

import abc
import dataclasses
import types
import typing
from collections.abc import Iterable
from datetime import date, datetime
from typing import (
    Final,
    Generic,
    Mapping,
    Protocol,
    TypeGuard,
    TypeVar,
    cast,
    get_args,
    get_origin,
)

import inflection
import pendulum
from jupiter.framework.base.entity_id import BAD_REF_ID, EntityId
from jupiter.framework.base.entity_name import EntityName
from jupiter.framework.base.timestamp import Timestamp
from jupiter.framework.context import DomainContext
from jupiter.framework.entity import (
    BranchEntity,
    CrownEntity,
    Entity,
    EntityLinkFilterCompiled,
    LeafEntity,
    ParentLink,
    RootEntity,
    StubEntity,
    TrunkEntity,
)
from jupiter.framework.entity_indexing_summary import EntityIndexingSummary
from jupiter.framework.primitive import Primitive
from jupiter.framework.realm.realm import (
    DatabaseRealm,
    RealmCodecRegistry,
    RealmThing,
)
from jupiter.framework.record import Record
from jupiter.framework.storage.postgres.events import (
    build_event_table,
    insert_removed_entity_event,
    remove_events,
    upsert_events,
)
from jupiter.framework.storage.postgres.filters import compile_query_relative_to
from jupiter.framework.storage.postgres.row import RowType
from jupiter.framework.storage.repository import (
    EntityAlreadyExistsError,
    EntityNotFoundError,
    RecordRepository,
)
from jupiter.framework.value import (
    AtomicValue,
    CompositeValue,
    EnumValue,
    SecretValue,
)
from sqlalchemy import (
    Boolean,
    Column,
    Date,
    DateTime,
    Float,
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
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncConnection

_EntityT = TypeVar("_EntityT", bound=Entity)
_RecordT = TypeVar("_RecordT", bound=Record)
_RecordKeyPrefixT = TypeVar("_RecordKeyPrefixT")
_ArchivalReasonT = TypeVar("_ArchivalReasonT", bound=EnumValue)


class PostgresRepository(abc.ABC):
    """A repository for entities backed by PostgreSQL, meant to be used as a mixin."""

    _realm_codec_registry: Final[RealmCodecRegistry]
    _connection: Final[AsyncConnection]
    _metadata: Final[MetaData]

    def __init__(
        self,
        realm_codec_registry: RealmCodecRegistry,
        connection: AsyncConnection,
        metadata: MetaData,
    ) -> None:
        """Initialize the repository."""
        self._realm_codec_registry = realm_codec_registry
        self._connection = connection
        self._metadata = metadata


class PostgresEntityRepository(PostgresRepository, abc.ABC, Generic[_EntityT]):
    """A repository for entities backed by PostgreSQL, meant to be used as a mixin."""

    _table: Final[Table]
    _event_table: Final[Table]
    _entity_type: type[_EntityT]
    _already_exists_err_cls: Final[type[Exception]]
    _not_found_err_cls: Final[type[Exception]]

    def __init__(
        self,
        realm_codec_registry: RealmCodecRegistry,
        connection: AsyncConnection,
        metadata: MetaData,
        *,
        entity_type: type[_EntityT] | None = None,
        table_name: str | None = None,
        table: Table | None = None,
        already_exists_err_cls: type[Exception] = EntityAlreadyExistsError,
        not_found_err_cls: type[Exception] = EntityNotFoundError,
    ):
        """Initialize the repository."""
        super().__init__(realm_codec_registry, connection, metadata)
        entity_type = self._infer_entity_class() if entity_type is None else entity_type
        the_table_name = table_name or inflection.underscore(entity_type.__name__)
        the_table = table
        if the_table is None:
            the_table = metadata.tables.get(the_table_name)
        if the_table is None:
            the_table = PostgresEntityRepository._build_table_for_entity(
                the_table_name, metadata, entity_type
            )
        self._table = the_table
        self._event_table = build_event_table(self._table, metadata)
        self._entity_type = entity_type
        self._already_exists_err_cls = already_exists_err_cls
        self._not_found_err_cls = not_found_err_cls

    async def create(self, entity: _EntityT) -> _EntityT:
        """Create an entity."""
        if entity.ref_id != BAD_REF_ID:
            raise Exception("Cannot create an entity with a ref_id already set")
        try:
            entity_for_db = self._entity_to_row(entity)
            result = await self._connection.execute(
                insert(self._table).values(
                    **{r: v for r, v in entity_for_db.items() if r != "ref_id"}
                ),
            )
        except IntegrityError as err:
            if isinstance(entity, CrownEntity):
                raise self._already_exists_err_cls(
                    f"Entity of type {self._entity_type.__name__} with name {entity.name} already exists",
                ) from err
            else:
                raise self._already_exists_err_cls(
                    f"Entity of type {self._entity_type.__name__} already exists",
                ) from err
        assert result.inserted_primary_key is not None
        entity = entity.assign_ref_id(EntityId(str(result.inserted_primary_key[0])))
        await upsert_events(
            self._realm_codec_registry,
            self._connection,
            self._event_table,
            entity,
        )
        return entity

    async def save(self, entity: _EntityT) -> _EntityT:
        """Save an entity."""
        try:
            result = await self._connection.execute(
                update(self._table)
                .where(self._table.c.ref_id == entity.ref_id.as_int())
                .values(**self._entity_to_row(entity)),
            )
        except IntegrityError as err:
            if isinstance(entity, CrownEntity):
                raise self._already_exists_err_cls(
                    f"Entity of type {self._entity_type.__name__} with name {entity.name} already exists",
                ) from err
            else:
                raise self._already_exists_err_cls(
                    f"Entity of type {self._entity_type.__name__} already exists",
                ) from err
        if result.rowcount == 0:
            raise self._not_found_err_cls(
                f"Entity of type {entity.__class__} and id {entity.ref_id!s} not found."
            )
        await upsert_events(
            self._realm_codec_registry,
            self._connection,
            self._event_table,
            entity,
        )
        return entity

    async def remove(self, ctx: DomainContext, ref_id: EntityId) -> _EntityT:
        """Hard remove a crown - an irreversible operation."""
        query_stmt = select(self._table).where(
            self._table.c.ref_id == ref_id.as_int(),
        )
        result = (await self._connection.execute(query_stmt)).first()
        if result is None:
            raise self._not_found_err_cls(
                f"Entity of type {self._entity_type.__name__} identified by {ref_id} does not exist"
            )
        await self._connection.execute(
            delete(self._table).where(
                self._table.c.ref_id == ref_id.as_int(),
            ),
        )
        entity_type_name = self._entity_type.__name__
        await remove_events(
            self._connection,
            self._event_table,
            entity_type_name,
            ref_id,
        )
        await insert_removed_entity_event(
            self._realm_codec_registry,
            self._connection,
            self._event_table,
            ctx,
            entity_type_name,
            ref_id,
        )
        return self._row_to_entity(result)

    async def load_by_id(
        self,
        ref_id: EntityId,
        allow_archived: bool | _ArchivalReasonT | list[_ArchivalReasonT] = False,
    ) -> _EntityT:
        """Load an entity by ref id."""
        query_stmt = select(self._table).where(
            self._table.c.ref_id == ref_id.as_int(),
        )
        if isinstance(allow_archived, bool):
            if not allow_archived:
                query_stmt = query_stmt.where(self._table.c.archived.is_(False))
        elif isinstance(allow_archived, EnumValue):
            query_stmt = query_stmt.where(
                (self._table.c.archived.is_(False))
                | (self._table.c.archival_reason == str(allow_archived.value))
            )
        elif isinstance(allow_archived, list):
            query_stmt = query_stmt.where(
                (self._table.c.archived.is_(False))
                | (
                    self._table.c.archival_reason.in_(
                        [str(reason.value) for reason in allow_archived]
                    )
                )
            )
        result = (await self._connection.execute(query_stmt)).first()
        if result is None:
            raise self._not_found_err_cls(
                f"Entity of type {self._entity_type.__name__} identified by {ref_id} does not exist"
            )
        return self._row_to_entity(result)

    def _entity_to_row(self, entity: _EntityT) -> dict[str, RealmThing]:
        encoder = self._realm_codec_registry.get_encoder(
            self._entity_type, DatabaseRealm
        )
        return cast(dict[str, RealmThing], encoder.encode(entity))

    def _row_to_entity(self, row: RowType) -> _EntityT:
        decoder = self._realm_codec_registry.get_decoder(
            self._entity_type, DatabaseRealm
        )
        return decoder.decode(cast(Mapping[str, RealmThing], row._mapping))

    def _infer_entity_class(self) -> type[_EntityT]:
        """Infer the entity class from the table."""
        # We look over all classes we inherit from, and find the one that has a
        # generic parameter.
        if not _is_indirect_generic_subclass(self):
            raise Exception(
                "Could not infer entity class from repository class because inheritance is messed-up"
            )
        for base in self.__class__.__orig_bases__:
            args = get_args(base)
            if len(args) > 0:
                return cast(type[_EntityT], args[0])

        raise Exception(
            "Could not infer entity class from repository class because inheritance is messed-up"
        )

    def _get_parent_field_name(self) -> str:
        all_fields = dataclasses.fields(self._entity_type)
        for field in all_fields:
            if field.type == ParentLink:
                return field.name + "_ref_id"

        raise Exception(
            f"Critical exception, missing parent field for class {self._entity_type.__name__}"
        )

    async def find_summary(
        self,
        parent_ref_id: EntityId | None = None,
        allow_archived: bool | _ArchivalReasonT | list[_ArchivalReasonT] = False,
        filter_ref_ids: Iterable[EntityId] | None = None,
    ) -> list[EntityIndexingSummary]:
        """Load light summaries; see :meth:`EntityRepository.find_summary`."""
        query_stmt = select(
            self._table.c.ref_id,
            self._table.c.last_modified_time,
            self._table.c.archived,
        )
        if not issubclass(self._entity_type, RootEntity):
            if parent_ref_id is None:
                raise ValueError(
                    f"find_summary for {self._entity_type.__name__} requires parent_ref_id",
                )
            query_stmt = query_stmt.where(
                self._table.c[self._get_parent_field_name()] == parent_ref_id.as_int()
            )
        if isinstance(allow_archived, bool):
            if not allow_archived:
                query_stmt = query_stmt.where(self._table.c.archived.is_(False))
        elif isinstance(allow_archived, EnumValue):
            query_stmt = query_stmt.where(
                (self._table.c.archived.is_(False))
                | (self._table.c.archival_reason == str(allow_archived.value))
            )
        elif isinstance(allow_archived, list):
            query_stmt = query_stmt.where(
                (self._table.c.archived.is_(False))
                | (
                    self._table.c.archival_reason.in_(
                        [str(reason.value) for reason in allow_archived]
                    )
                )
            )
        if filter_ref_ids is not None:
            query_stmt = query_stmt.where(
                self._table.c.ref_id.in_([fi.as_int() for fi in filter_ref_ids])
            )
        results = await self._connection.execute(query_stmt)
        dec = self._realm_codec_registry.get_decoder
        summaries: list[EntityIndexingSummary] = []
        for row in results:
            summaries.append(
                EntityIndexingSummary(
                    ref_id=dec(EntityId, DatabaseRealm).decode(
                        cast(RealmThing, row.ref_id)
                    ),
                    last_modified_time=dec(Timestamp, DatabaseRealm).decode(
                        cast(RealmThing, row.last_modified_time)
                    ),
                    archived=dec(bool, DatabaseRealm).decode(
                        cast(RealmThing, row.archived)
                    ),
                )
            )
        return summaries

    @staticmethod
    def _build_table_for_entity(
        entity_table_name: str, metadata: MetaData, entity_type: type[_EntityT]
    ) -> Table:
        """Build the table for an entity."""

        def extract_field_type(
            field: dataclasses.Field[Primitive | object],
        ) -> tuple[type[object] | str, bool]:
            field_type_origin = get_origin(field.type)
            if field_type_origin is None:
                return field.type, False

            if field_type_origin is typing.Union or (
                isinstance(field_type_origin, type)
                and issubclass(field_type_origin, types.UnionType)
            ):
                field_args = get_args(field.type)
                if len(field_args) == 2 and (
                    field_args[0] is type(None) and field_args[1] is not type(None)
                ):
                    return field_args[1], True
                elif len(field_args) == 2 and (
                    field_args[1] is type(None) and field_args[0] is not type(None)
                ):
                    return field_args[0], True
                elif all(f is not type(None) for f in field_args):
                    return field.type, False
                else:
                    raise Exception(f"Not implemented - union {field.type}")
            else:
                return field.type, False

        all_fields = dataclasses.fields(entity_type)

        table = Table(
            entity_table_name,
            metadata,
            Column("ref_id", Integer, primary_key=True, autoincrement=True),
            Column("version", Integer, nullable=False),
            Column("archived", Boolean, nullable=False),
            Column("created_time", DateTime(timezone=True), nullable=False),
            Column("last_modified_time", DateTime(timezone=True), nullable=False),
            Column("archived_time", DateTime(timezone=True), nullable=True),
            keep_existing=True,
        )

        for field in all_fields:
            if field.name in (
                "ref_id",
                "version",
                "archived",
                "created_time",
                "last_modified_time",
                "archived_time",
                "events",
            ):
                continue

            field_type, field_optional = extract_field_type(field)

            if field_type == ParentLink:
                if field_optional:
                    raise Exception("Cannot have optional parent field")
                table.append_column(
                    Column(
                        field.name + "_ref_id",
                        Integer,
                        ForeignKey(
                            field.name + ".ref_id",
                        ),
                        nullable=False,
                    )
                )
            elif field_type == EntityId:
                table.append_column(
                    Column(field.name, Integer, nullable=field_optional)
                )
            elif field_type == Timestamp:
                table.append_column(
                    Column(field.name, DateTime(timezone=True), nullable=field_optional)
                )
            elif (
                isinstance(field_type, type)
                and get_origin(field_type) is None
                and issubclass(field_type, EntityName)
            ):
                table.append_column(
                    Column(field.name, String(100), nullable=field_optional)
                )
            elif field_type is bool:
                table.append_column(
                    Column(field.name, Boolean, nullable=field_optional)
                )
            elif field_type is int:
                table.append_column(
                    Column(field.name, Integer, nullable=field_optional)
                )
            elif field_type is float:
                table.append_column(Column(field.name, Float, nullable=field_optional))
            elif field_type is str:
                table.append_column(Column(field.name, String, nullable=field_optional))
            elif field_type is date:
                table.append_column(Column(field.name, Date, nullable=field_optional))
            elif field_type is datetime:
                table.append_column(
                    Column(field.name, DateTime(timezone=True), nullable=field_optional)
                )
            elif field_type is pendulum.Date:
                table.append_column(Column(field.name, Date, nullable=field_optional))
            elif field_type is pendulum.DateTime:
                table.append_column(
                    Column(field.name, DateTime(timezone=True), nullable=field_optional)
                )
            elif (
                isinstance(field_type, type)
                and get_origin(field_type) is None
                and issubclass(field_type, AtomicValue)
            ):
                basic_field_type = field_type.base_type_hack()
                if basic_field_type is bool:
                    table.append_column(
                        Column(field.name, Boolean, nullable=field_optional)
                    )
                elif basic_field_type is int:
                    table.append_column(
                        Column(field.name, Integer, nullable=field_optional)
                    )
                elif basic_field_type is float:
                    table.append_column(
                        Column(field.name, Float, nullable=field_optional)
                    )
                elif basic_field_type is str:
                    table.append_column(
                        Column(field.name, String, nullable=field_optional)
                    )
                elif basic_field_type is date:
                    table.append_column(
                        Column(field.name, Date, nullable=field_optional)
                    )
                elif basic_field_type is datetime:
                    table.append_column(
                        Column(
                            field.name, DateTime(timezone=True), nullable=field_optional
                        )
                    )
                elif basic_field_type is pendulum.Date:
                    table.append_column(
                        Column(field.name, Date, nullable=field_optional)
                    )
                elif basic_field_type is pendulum.DateTime:
                    table.append_column(
                        Column(
                            field.name, DateTime(timezone=True), nullable=field_optional
                        )
                    )
                else:
                    raise Exception(
                        f"Unsupported field type {field_type}+{basic_field_type} for {entity_type.__name__}:{field.name}"
                    )
            elif (
                isinstance(field_type, type)
                and get_origin(field_type) is None
                and issubclass(field_type, CompositeValue)
            ):
                table.append_column(Column(field.name, JSONB, nullable=field_optional))
            elif (
                isinstance(field_type, type)
                and get_origin(field_type) is None
                and issubclass(field_type, EnumValue)
            ):
                table.append_column(Column(field.name, String, nullable=field_optional))
            elif (
                isinstance(field_type, type)
                and get_origin(field_type) is None
                and issubclass(field_type, SecretValue)
            ):
                table.append_column(Column(field.name, String, nullable=field_optional))
            elif get_origin(field_type) is not None:
                origin_field_type = get_origin(field_type)
                if origin_field_type is typing.Union or (
                    isinstance(origin_field_type, type)
                    and issubclass(origin_field_type, types.UnionType)
                ):
                    field_args = get_args(field.type)
                    if all(
                        isinstance(f, type)
                        and get_origin(f) is None
                        and issubclass(f, CompositeValue)
                        for f in field_args
                    ):
                        table.append_column(
                            Column(field.name, JSONB, nullable=field_optional)
                        )
                    else:
                        raise Exception(
                            f"Unsupported field type {field_type} for {entity_type.__name__}:{field.name}"
                        )
                elif origin_field_type is list:
                    table.append_column(
                        Column(field.name, JSONB, nullable=field_optional)
                    )
                elif origin_field_type is set:
                    table.append_column(
                        Column(field.name, JSONB, nullable=field_optional)
                    )
                elif origin_field_type is dict:
                    table.append_column(
                        Column(field.name, JSONB, nullable=field_optional)
                    )
                else:
                    raise Exception(
                        f"Unsupported field type {field_type} for {entity_type.__name__}:{field.name}"
                    )
            else:
                raise Exception(
                    f"Unsupported field type {field_type} for {entity_type.__name__}:{field.name}"
                )

        return table


class _GenericAlias(Protocol):
    __origin__: type[object]


class _IndirectGenericSubclass(Protocol):
    __orig_bases__: tuple[_GenericAlias]


def _is_indirect_generic_subclass(
    obj: object,
) -> TypeGuard[_IndirectGenericSubclass]:
    if not hasattr(obj, "__orig_bases__"):
        return False
    bases = obj.__orig_bases__  # type: ignore
    return bases is not None and isinstance(bases, tuple)


_RootEntityT = TypeVar("_RootEntityT", bound=RootEntity)


class PostgresRootEntityRepository(
    PostgresEntityRepository[_RootEntityT], abc.ABC, Generic[_RootEntityT]
):
    """A repository for root entities backed by PostgreSQL, meant to be used as a mixin."""

    async def find_all(
        self,
        allow_archived: bool | _ArchivalReasonT | list[_ArchivalReasonT] = False,
        filter_ref_ids: Iterable[EntityId] | None = None,
    ) -> list[_RootEntityT]:
        """Find all entities links matching some criteria."""
        query_stmt = select(self._table)
        if isinstance(allow_archived, bool):
            if not allow_archived:
                query_stmt = query_stmt.where(self._table.c.archived.is_(False))
        elif isinstance(allow_archived, EnumValue):
            query_stmt = query_stmt.where(
                (self._table.c.archived.is_(False))
                | (self._table.c.archival_reason == str(allow_archived.value))
            )
        elif isinstance(allow_archived, list):
            query_stmt = query_stmt.where(
                (self._table.c.archived.is_(False))
                | (
                    self._table.c.archival_reason.in_(
                        [str(reason.value) for reason in allow_archived]
                    )
                )
            )
        if filter_ref_ids is not None:
            query_stmt = query_stmt.where(
                self._table.c.ref_id.in_([ref_id.as_int() for ref_id in filter_ref_ids])
            )

        results = await self._connection.execute(query_stmt)
        return [self._row_to_entity(row) for row in results]


_TrunkEntityT = TypeVar("_TrunkEntityT", bound=TrunkEntity)


class PostgresTrunkEntityRepository(
    PostgresEntityRepository[_TrunkEntityT], abc.ABC, Generic[_TrunkEntityT]
):
    """A repository for trunk entities backed by PostgreSQL, meant to be used as a mixin."""

    async def load_by_parent(self, parent_ref_id: EntityId) -> _TrunkEntityT:
        """Loads the trunk entity."""
        query_stmt = select(self._table).where(
            self._table.c[self._get_parent_field_name()] == parent_ref_id.as_int(),
        )
        result = (await self._connection.execute(query_stmt)).first()
        if result is None:
            raise self._not_found_err_cls(
                f"Entity of type {self._entity_type.__name__} and parent id {parent_ref_id!s} not found."
            )
        return self._row_to_entity(result)

    async def remove_by_parent(
        self, ctx: DomainContext, parent_ref_id: EntityId
    ) -> _TrunkEntityT:
        """Hard remove the entity with the given parent - an irreversible operation."""
        query_stmt = select(self._table).where(
            self._table.c[self._get_parent_field_name()] == parent_ref_id.as_int(),
        )
        result = (await self._connection.execute(query_stmt)).first()
        if result is None:
            raise self._not_found_err_cls(
                f"Entity of type {self._entity_type.__name__} and parent id {parent_ref_id!s} not found."
            )
        entity = self._row_to_entity(result)
        await self._connection.execute(
            delete(self._table).where(
                self._table.c[self._get_parent_field_name()] == parent_ref_id.as_int(),
            ),
        )
        entity_type_name = self._entity_type.__name__
        await remove_events(
            self._connection,
            self._event_table,
            entity_type_name,
            entity.ref_id,
        )
        await insert_removed_entity_event(
            self._realm_codec_registry,
            self._connection,
            self._event_table,
            ctx,
            entity_type_name,
            entity.ref_id,
        )
        return entity


_StubEntityT = TypeVar("_StubEntityT", bound=StubEntity)


class PostgresStubEntityRepository(
    PostgresEntityRepository[_StubEntityT], abc.ABC, Generic[_StubEntityT]
):
    """A repository for stub entities backed by PostgreSQL, meant to be used as a mixin."""

    async def load_by_parent(self, parent_ref_id: EntityId) -> _StubEntityT:
        """Retrieve a stub entity."""
        query_stmt = select(self._table).where(
            self._table.c[self._get_parent_field_name()] == parent_ref_id.as_int()
        )
        result = (await self._connection.execute(query_stmt)).first()
        if result is None:
            raise self._not_found_err_cls(
                f"Entity of type {self._entity_type.__name__} and parent id {parent_ref_id!s} not found."
            )
        return self._row_to_entity(result)

    async def remove_by_parent(
        self, ctx: DomainContext, parent_ref_id: EntityId
    ) -> _StubEntityT:
        """Hard remove the entity with the given parent - an irreversible operation."""
        query_stmt = select(self._table).where(
            self._table.c[self._get_parent_field_name()] == parent_ref_id.as_int(),
        )
        result = (await self._connection.execute(query_stmt)).first()
        if result is None:
            raise self._not_found_err_cls(
                f"Entity of type {self._entity_type.__name__} and parent id {parent_ref_id!s} not found."
            )
        entity = self._row_to_entity(result)
        await self._connection.execute(
            delete(self._table).where(
                self._table.c[self._get_parent_field_name()] == parent_ref_id.as_int(),
            ),
        )
        entity_type_name = self._entity_type.__name__
        await remove_events(
            self._connection,
            self._event_table,
            entity_type_name,
            entity.ref_id,
        )
        await insert_removed_entity_event(
            self._realm_codec_registry,
            self._connection,
            self._event_table,
            ctx,
            entity_type_name,
            entity.ref_id,
        )
        return entity


_CrownEntityT = TypeVar("_CrownEntityT", bound=CrownEntity)


class PostgresCrownEntityRepository(
    PostgresEntityRepository[_CrownEntityT], abc.ABC, Generic[_CrownEntityT]
):
    """A repository for crown entities backed by PostgreSQL, meant to be used as a mixin."""

    async def find_all(
        self,
        parent_ref_id: EntityId,
        allow_archived: bool | _ArchivalReasonT | list[_ArchivalReasonT] = False,
        filter_ref_ids: Iterable[EntityId] | None = None,
    ) -> list[_CrownEntityT]:
        """Find all crowns matching some criteria."""
        query_stmt = select(self._table).where(
            self._table.c[self._get_parent_field_name()] == parent_ref_id.as_int()
        )
        if isinstance(allow_archived, bool):
            if not allow_archived:
                query_stmt = query_stmt.where(self._table.c.archived.is_(False))
        elif isinstance(allow_archived, EnumValue):
            query_stmt = query_stmt.where(
                (self._table.c.archived.is_(False))
                | (self._table.c.archival_reason == str(allow_archived.value))
            )
        elif isinstance(allow_archived, list):
            query_stmt = query_stmt.where(
                (self._table.c.archived.is_(False))
                | (
                    self._table.c.archival_reason.in_(
                        [str(reason.value) for reason in allow_archived]
                    )
                )
            )
        if filter_ref_ids is not None:
            query_stmt = query_stmt.where(
                self._table.c.ref_id.in_([fi.as_int() for fi in filter_ref_ids])
            )
        results = await self._connection.execute(query_stmt)
        return [self._row_to_entity(row) for row in results]

    async def find_all_generic(
        self,
        *,
        parent_ref_id: EntityId | None = None,
        allow_archived: bool | _ArchivalReasonT | list[_ArchivalReasonT] = False,
        **kwargs: EntityLinkFilterCompiled,
    ) -> list[_CrownEntityT]:
        """Find all crowns with generic filters."""
        query_stmt = select(self._table)

        if parent_ref_id is not None:
            query_stmt = query_stmt.where(
                self._table.c[self._get_parent_field_name()] == parent_ref_id.as_int()
            )
        if isinstance(allow_archived, bool):
            if not allow_archived:
                query_stmt = query_stmt.where(self._table.c.archived.is_(False))
        elif isinstance(allow_archived, EnumValue):
            query_stmt = query_stmt.where(
                (self._table.c.archived.is_(False))
                | (self._table.c.archival_reason == str(allow_archived.value))
            )
        elif isinstance(allow_archived, list):
            query_stmt = query_stmt.where(
                (self._table.c.archived.is_(False))
                | (
                    self._table.c.archival_reason.in_(
                        [str(reason.value) for reason in allow_archived]
                    )
                )
            )

        query_stmt = compile_query_relative_to(
            self._realm_codec_registry, query_stmt, self._table, kwargs
        )

        results = await self._connection.execute(query_stmt)
        return [self._row_to_entity(row) for row in results]


_BranchEntityT = TypeVar("_BranchEntityT", bound=BranchEntity)


class PostgresBranchEntityRepository(
    PostgresCrownEntityRepository[_BranchEntityT], abc.ABC, Generic[_BranchEntityT]
):
    """A repository for branch entities backed by PostgreSQL, meant to be used as a mixin."""


_LeafEntityT = TypeVar("_LeafEntityT", bound=LeafEntity)


class PostgresLeafEntityRepository(
    PostgresCrownEntityRepository[_LeafEntityT], abc.ABC, Generic[_LeafEntityT]
):
    """A repository for leaf entities backed by PostgreSQL, meant to be used as a mixin."""


class PostgresRecordRepository(
    PostgresRepository,
    RecordRepository[_RecordT, _RecordKeyPrefixT],
    abc.ABC,
    Generic[_RecordT, _RecordKeyPrefixT],
):
    """A repository for records backed by PostgreSQL, meant to be used as a mixin."""
