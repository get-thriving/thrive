"""Common toolin for SQLite repositories."""

from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.entity import Entity
from jupiter.framework.event import Event
from jupiter.framework.realm.realm import (
    EncoderNotFoundError,
    EventStoreRealm,
    RealmCodecRegistry,
    RealmThing,
)
from sqlalchemy import (
    JSON,
    Column,
    DateTime,
    Integer,
    MetaData,
    String,
    Table,
    delete,
    insert,
)
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
        Column("timestamp", DateTime, primary_key=True),
        Column("session_index", Integer, primary_key=True),
        Column("source", String(16), nullable=False),
        Column("context_str", String(32), nullable=False),
        Column("data", JSON, nullable=False),
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
            insert(event_table)
            .prefix_with("OR IGNORE")
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
            ),
            # .on_conflict_do_nothing(
            #    index_elements=["owner_ref_id", "timestamp", "session_index", "name"]
            # )
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


async def remove_events(
    connection: AsyncConnection,
    event_table: Table,
    entity_ref_id: EntityId,
) -> None:
    """Remove all the events for a given entity in an events table."""
    await connection.execute(
        delete(event_table).where(
            event_table.c.entity_ref_id == entity_ref_id.as_int()
        ),
    )
