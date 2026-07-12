"""A generic archiver service."""

from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import DomainContext
from jupiter.framework.entity import (
    ContainsAtMostOne,
    ContainsLink,
    CrownEntity,
    Entity,
    RootEntity,
    StubEntity,
    TrunkEntity,
)
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.record import ContainsRecordLink, Record
from jupiter.framework.storage.repository import (
    DomainUnitOfWork,
    EntityNotFoundError,
    RecordNotFoundError,
)
from jupiter.framework.utils.generic_crown_remover import generic_crown_remover


async def generic_root_remover(
    ctx: DomainContext,
    uow: DomainUnitOfWork,
    progress_reporter: ProgressReporter,
    entity_type: type[RootEntity],
    ref_id: EntityId,
) -> None:
    """Removes all crown entities starting from a root, but leaves trunks and stubs alone.

    Crown entities are deleted via :func:`generic_crown_remover` so ``OwnsLink`` children
    (notes, tag links, nested owned crowns, ``ContainsRecordLink`` records under them, …)
    are removed first.
    """

    async def _remover(entity: Entity) -> None:
        link_fields = [
            field
            for field in entity.__class__.__dict__.values()
            if isinstance(field, ContainsLink) or isinstance(field, ContainsRecordLink)
        ]

        async def _process_link_field(field: ContainsLink | ContainsRecordLink) -> None:
            if issubclass(field.the_type, TrunkEntity):
                try:
                    linked_trunk_entity = await uow.get_for(
                        field.the_type
                    ).load_by_parent(entity.ref_id)
                except EntityNotFoundError:
                    if isinstance(field, ContainsAtMostOne):
                        return
                    raise

                await _remover(linked_trunk_entity)
            elif issubclass(field.the_type, StubEntity):
                try:
                    linked_stub_entity = await uow.get_for(
                        field.the_type
                    ).load_by_parent(entity.ref_id)
                except EntityNotFoundError:
                    if isinstance(field, ContainsAtMostOne):
                        return
                    raise

                await _remover(linked_stub_entity)
            elif issubclass(field.the_type, CrownEntity):
                linked_entities = await uow.get_for(field.the_type).find_all(
                    parent_ref_id=entity.ref_id,
                    allow_archived=True,
                )

                for linked_entity in linked_entities:
                    await _remover(linked_entity)
            elif issubclass(field.the_type, Record):
                linked_records = await uow.get_for_record(field.the_type).find_all(
                    entity.ref_id,
                )

                for linked_record in linked_records:
                    try:
                        await uow.get_for_record(field.the_type).remove(
                            linked_record.raw_key
                        )
                    except RecordNotFoundError:
                        continue
            else:
                raise Exception(f"Unsupported field type {field.the_type}")

        # Materialized records (e.g. access_status) may FK crown children of the same
        # parent (e.g. access_grant); delete those rows before removing the crowns.
        for field in link_fields:
            if issubclass(field.the_type, TrunkEntity) or issubclass(
                field.the_type, StubEntity
            ):
                await _process_link_field(field)
        for field in link_fields:
            if issubclass(field.the_type, Record):
                await _process_link_field(field)
        for field in link_fields:
            if issubclass(field.the_type, CrownEntity):
                await _process_link_field(field)

        if isinstance(entity, CrownEntity) and entity.is_safe_to_archive:
            await generic_crown_remover(
                ctx,
                uow,
                progress_reporter,
                entity.__class__,
                entity.ref_id,
            )

    try:
        entity = await uow.get_for(entity_type).load_by_id(ref_id)
    except EntityNotFoundError:
        return

    await _remover(entity)
