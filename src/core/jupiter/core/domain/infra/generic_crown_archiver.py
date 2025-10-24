"""A generic archiver service."""

from jupiter.core.domain.core.archival_reason import JupiterArchivalReason
from jupiter.framework_new.base.entity_id import EntityId
from jupiter.framework_new.context import MutationContext
from jupiter.framework_new.entity import (
    ContainsLink,
    CrownEntity,
    LeafSupportEntity,
    OwnsLink,
)
from jupiter.framework_new.progress_reporter.reporter import ProgressReporter
from jupiter.framework_new.repository import DomainUnitOfWork


async def generic_crown_archiver(
    ctx: MutationContext,
    uow: DomainUnitOfWork,
    progress_reporter: ProgressReporter,
    entity_type: type[CrownEntity],
    ref_id: EntityId,
    archival_reason: JupiterArchivalReason,
) -> None:
    """Generic archiver for entities."""

    async def _archiver(entity: CrownEntity) -> None:
        if entity.archived:
            return
        if entity.is_safe_to_archive:
            entity = entity.mark_archived(ctx, archival_reason)
            await uow.get_for(entity.__class__).save(entity)
            if not isinstance(entity, LeafSupportEntity):
                await progress_reporter.mark_updated(entity)

        for field in entity.__class__.__dict__.values():
            if not (isinstance(field, OwnsLink) or isinstance(field, ContainsLink)):
                continue
            if not issubclass(field.the_type, CrownEntity):
                raise Exception(
                    f"Entity {entity.__class__} owns an non-crown entity {field.the_type}"
                )
            linked_entities = await uow.get_for(field.the_type).find_all_generic(
                parent_ref_id=None, allow_archived=False, **field.get_for_entity(entity)
            )

            for linked_entity in linked_entities:
                await _archiver(linked_entity)

    entity = await uow.get_for(entity_type).load_by_id(ref_id, allow_archived=True)

    await _archiver(entity)
