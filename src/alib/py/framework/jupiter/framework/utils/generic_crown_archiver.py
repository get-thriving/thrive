"""A generic archiver service."""

from typing import TypeVar

from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import DomainContext
from jupiter.framework.entity import (
    ContainsAtMostOne,
    ContainsLink,
    ContainsOne,
    CrownEntity,
    LeafSupportEntity,
    OwnsAtMostOne,
    OwnsLink,
    OwnsOne,
)
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork, EntityNotFoundError
from jupiter.framework.value import EnumValue

_ArchivalReasonT = TypeVar("_ArchivalReasonT", bound=EnumValue)


async def generic_crown_archiver(
    ctx: DomainContext,
    uow: DomainUnitOfWork,
    progress_reporter: ProgressReporter,
    entity_type: type[CrownEntity],
    ref_id: EntityId,
    archival_reason: _ArchivalReasonT,
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
                parent_ref_id=None, allow_archived=True, **field.get_for_entity(entity)
            )

            if isinstance(field, ContainsOne | OwnsOne):
                if len(linked_entities) == 0:
                    raise EntityNotFoundError(
                        f"Could not find {field.the_type.__name__} for {entity.__class__.__name__}"
                    )
            elif isinstance(field, ContainsAtMostOne | OwnsAtMostOne):
                pass

            for linked_entity in linked_entities:
                await _archiver(linked_entity)

    entity = await uow.get_for(entity_type).load_by_id(ref_id, allow_archived=True)

    await _archiver(entity)
