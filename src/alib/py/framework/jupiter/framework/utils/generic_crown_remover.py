"""A generic archiver service."""

from typing import Any, cast

from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import DomainContext
from jupiter.framework.entity import CrownEntity, LeafSupportEntity, OwnsLink, RefsLink
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.record import ContainsRecordLink, Record
from jupiter.framework.storage.repository import CrownEntityRepository, DomainUnitOfWork
from jupiter.framework.utils.nested_dir_removal import remove_nested_dirs_first


async def generic_crown_remover(
    ctx: DomainContext,
    uow: DomainUnitOfWork,
    progress_reporter: ProgressReporter,
    entity_type: type[CrownEntity],
    ref_id: EntityId,
) -> None:
    """Generic remover for entities."""

    async def _remover(entity: CrownEntity) -> None:
        async def _recurse_into_child_dir(child: CrownEntity) -> None:
            await _remover(child)

        await remove_nested_dirs_first(uow, entity, _recurse_into_child_dir)

        for field in entity.__class__.__dict__.values():
            if isinstance(field, RefsLink | OwnsLink):
                filters = field.get_for_entity(entity)
                # Same rules as generic_destroyer: skip peer id-list refs (tags/contacts on links).
                if not filters:
                    continue
                if isinstance(field, RefsLink) and any(
                    isinstance(v, list) for v in filters.values()
                ):
                    continue
                if not issubclass(field.the_type, CrownEntity):
                    raise Exception(
                        f"Entity {entity.__class__} links to non-crown {field.the_type}"
                    )
                crown_repo = cast(
                    CrownEntityRepository[CrownEntity],
                    uow.get_for(field.the_type),
                )
                linked_entities = await crown_repo.find_all_generic(
                    parent_ref_id=None,
                    allow_archived=True,
                    **cast(Any, filters),
                )

                for linked_entity in linked_entities:
                    await _remover(linked_entity)
                continue

            if isinstance(field, ContainsRecordLink):
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
            await uow.get_for(entity.__class__).remove(ctx, entity.ref_id)
            if not isinstance(entity, LeafSupportEntity):
                await progress_reporter.mark_removed(entity)

    entity = await uow.get_for(entity_type).load_by_id(ref_id, allow_archived=True)

    await _remover(entity)
