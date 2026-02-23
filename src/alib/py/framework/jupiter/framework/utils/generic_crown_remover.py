"""A generic archiver service."""

from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import MutationContext
from jupiter.framework.entity import CrownEntity, LeafSupportEntity, OwnsLink
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.record import ContainsRecordLink, Record
from jupiter.framework.storage.repository import DomainUnitOfWork


async def generic_crown_remover(
    ctx: MutationContext,
    uow: DomainUnitOfWork,
    progress_reporter: ProgressReporter,
    entity_type: type[CrownEntity],
    ref_id: EntityId,
) -> None:
    """Generic remover for entities."""

    async def _remover(entity: CrownEntity) -> None:
        for field in entity.__class__.__dict__.values():
            if isinstance(field, OwnsLink):
                if not issubclass(field.the_type, CrownEntity):
                    raise Exception(
                        f"Entity {entity.__class__} owns an non-crown entity {field.the_type}"
                    )
                linked_entities = await uow.get_for(field.the_type).find_all_generic(
                    parent_ref_id=None,
                    allow_archived=True,
                    **field.get_for_entity(entity),
                )

                for linked_entity in linked_entities:
                    await _remover(linked_entity)
            elif isinstance(field, ContainsRecordLink):
                if not issubclass(field.the_type, Record):
                    raise Exception(
                        f"Entity {entity.__class__} has a record link to non-record {field.the_type}"
                    )
                linked_records = await uow.get_for_record(field.the_type).find_all(
                    entity.ref_id,
                )
                for linked_record in linked_records:
                    await uow.get_for_record(field.the_type).remove(
                        linked_record.raw_key
                    )

        if entity.is_safe_to_archive:
            await uow.get_for(entity.__class__).remove(entity.ref_id)
            if not isinstance(entity, LeafSupportEntity):
                await progress_reporter.mark_removed(entity)

    entity = await uow.get_for(entity_type).load_by_id(ref_id, allow_archived=True)

    await _remover(entity)
