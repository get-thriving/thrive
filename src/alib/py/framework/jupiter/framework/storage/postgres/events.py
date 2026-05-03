"""Common tooling for PostgreSQL repositories."""

import json

from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.mutation_id import MutationId
from jupiter.framework.base.timestamp import Timestamp
from jupiter.framework.base.trace_id import TraceId
from jupiter.framework.context import DomainContext
from jupiter.framework.entity import Entity
from jupiter.framework.event import Event, EventKind
from jupiter.framework.mutation_inovcation.entity_event import MutationEntityEvent
from jupiter.framework.realm.realm import (
    EncoderNotFoundError,
    EventStoreRealm,
    RealmCodecRegistry,
    RealmThing,
)
from sqlalchemy import (
    Column,
    DateTime,
    Integer,
    MetaData,
    String,
    Table,
    delete,
    select,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.dialects.postgresql import insert as pg_insert
from sqlalchemy.ext.asyncio import AsyncConnection


def build_event_table(entity_table: Table, metadata: MetaData) -> Table:
    """Construct a standard events table for a given entity table."""
    return Table(
        "mutation_entity_event",
        metadata,
        Column(
            "entity_type",
            String(48),
            nullable=False,
        ),
        Column(
            "entity_ref_id",
            Integer,
            primary_key=True,
        ),
        Column("entity_version", Integer, nullable=False),
        Column("kind", String(16), nullable=False),
        Column("name", String(32), primary_key=True),
        Column("trace_id", String(64), nullable=False),
        Column("mutation_id", String(64), nullable=False),
        Column(
            "timestamp",
            DateTime(timezone=True),
            primary_key=True,
        ),
        Column("session_index", Integer, primary_key=True),
        Column("source", String(16), nullable=False),
        Column("context_str", String(32), nullable=False),
        Column("data", JSONB, nullable=True),
        keep_existing=True,
    )


async def upsert_events(
    realm_codec_registry: RealmCodecRegistry,
    connection: AsyncConnection,
    event_table: Table,
    aggreggate_root: Entity,
) -> None:
    """Upsert all the events for a given entity in an events table."""
    for event_idx, event in enumerate(aggreggate_root.events):
        await connection.execute(
            pg_insert(event_table)
            .values(
                entity_type=aggreggate_root.__class__.__name__,
                entity_ref_id=realm_codec_registry.db_encode(aggreggate_root.ref_id),
                entity_version=aggreggate_root.version,
                kind=str(event.kind.value),
                name=str(event.name),
                trace_id=realm_codec_registry.db_encode(event.trace_id),
                mutation_id=realm_codec_registry.db_encode(event.mutation_id),
                timestamp=realm_codec_registry.db_encode(event.timestamp),
                session_index=event_idx,
                source=event.source,
                context_str=event.context_str,
                data=_serialize_event(realm_codec_registry, event),
            )
            .on_conflict_do_nothing(
                index_elements=[
                    event_table.c.entity_ref_id,
                    event_table.c.name,
                    event_table.c.timestamp,
                    event_table.c.session_index,
                ],
            ),
        )


def _serialize_event(
    realm_codec_registry: RealmCodecRegistry, event: Event
) -> RealmThing:
    """Transform an event into a serialisation-ready dictionary."""
    serialized_frame_args: dict[str, RealmThing] = {}
    for the_key, (the_value, the_value_type) in event.frame_args.items():
        try:
            encoder = realm_codec_registry.get_encoder(the_value_type, EventStoreRealm)
        except EncoderNotFoundError:
            encoder = realm_codec_registry.get_encoder(
                the_value.__class__, EventStoreRealm
            )
        serialized_frame_args[the_key] = encoder.encode(the_value)
    return serialized_frame_args


async def find_entity_events_by_timestamp_desc(
    realm_codec_registry: RealmCodecRegistry,
    connection: AsyncConnection,
    event_table: Table,
    entity_type: str,
    entity_ref_id: EntityId,
) -> list[MutationEntityEvent]:
    """Find all entity events ordered by timestamp descending."""
    query_stmt = (
        select(event_table)
        .where(
            event_table.c.entity_type == entity_type,
            event_table.c.entity_ref_id == entity_ref_id.as_int(),
        )
        .order_by(event_table.c.timestamp.desc(), event_table.c.session_index.desc())
    )
    results = await connection.execute(query_stmt)

    return [
        MutationEntityEvent(
            entity_type=row.entity_type,
            entity_ref_id=EntityId(str(row.entity_ref_id)),
            entity_version=row.entity_version,
            kind=EventKind(row.kind),
            name=row.name,
            trace_id=realm_codec_registry.db_decode(TraceId, row.trace_id),
            mutation_id=realm_codec_registry.db_decode(MutationId, row.mutation_id),
            timestamp=realm_codec_registry.db_decode(Timestamp, row.timestamp),
            session_index=row.session_index,
            source=row.source,
            context_str=row.context_str,
            data=json.dumps(row.data, indent=2) if row.data else "{}",
        )
        for row in results
    ]


async def find_entity_events_by_mutation_id(
    realm_codec_registry: RealmCodecRegistry,
    connection: AsyncConnection,
    event_table: Table,
    mutation_id: MutationId,
) -> list[MutationEntityEvent]:
    """Find all entity events for a given mutation id, ordered by timestamp descending."""
    query_stmt = (
        select(event_table)
        .where(
            event_table.c.mutation_id == realm_codec_registry.db_encode(mutation_id),
        )
        .order_by(event_table.c.timestamp.desc(), event_table.c.session_index.desc())
    )
    results = await connection.execute(query_stmt)

    return [
        MutationEntityEvent(
            entity_type=row.entity_type,
            entity_ref_id=EntityId(str(row.entity_ref_id)),
            entity_version=row.entity_version,
            kind=EventKind(row.kind),
            name=row.name,
            trace_id=realm_codec_registry.db_decode(TraceId, row.trace_id),
            mutation_id=realm_codec_registry.db_decode(MutationId, row.mutation_id),
            timestamp=realm_codec_registry.db_decode(Timestamp, row.timestamp),
            session_index=row.session_index,
            source=row.source,
            context_str=row.context_str,
            data=json.dumps(row.data, indent=2) if row.data else "{}",
        )
        for row in results
    ]


async def remove_events(
    connection: AsyncConnection,
    event_table: Table,
    entity_type: str,
    entity_ref_id: EntityId,
) -> None:
    """Delete all persisted events for an entity."""
    await connection.execute(
        delete(event_table).where(
            event_table.c.entity_ref_id == entity_ref_id.as_int(),
            event_table.c.entity_type == entity_type,
        ),
    )


async def insert_removed_entity_event(
    realm_codec_registry: RealmCodecRegistry,
    connection: AsyncConnection,
    event_table: Table,
    ctx: DomainContext,
    entity_type: str,
    entity_ref_id: EntityId,
) -> None:
    """Insert a tombstone row marking the entity as removed."""
    await connection.execute(
        pg_insert(event_table).values(
            entity_type=entity_type,
            entity_ref_id=realm_codec_registry.db_encode(entity_ref_id),
            entity_version=-1,
            kind=str(EventKind.REMOVED.value),
            name="remove",
            trace_id=realm_codec_registry.db_encode(ctx.trace_id),
            mutation_id=realm_codec_registry.db_encode(ctx.mutation_id),
            timestamp=realm_codec_registry.db_encode(ctx.action_timestamp),
            session_index=-1,
            source=str(ctx.event_source),
            context_str=ctx.context_str,
            data=None,
        ),
    )
