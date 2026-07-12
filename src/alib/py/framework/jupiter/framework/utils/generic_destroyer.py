"""A generic archiver service."""

from typing import cast

from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import DomainContext
from jupiter.framework.entity import (
    ContainsAtMostOne,
    ContainsLink,
    CrownEntity,
    OwnsAtMostOne,
    OwnsLink,
    RefsMany,
    RootEntity,
    StubEntity,
    TrunkEntity,
)
from jupiter.framework.record import ContainsRecordLink, Record
from jupiter.framework.storage.repository import (
    CrownEntityRepository,
    DomainUnitOfWork,
    EntityNotFoundError,
    RecordNotFoundError,
)
from jupiter.framework.utils.nested_dir_removal import remove_nested_dirs_first


async def generic_destroyer(
    ctx: DomainContext,
    uow: DomainUnitOfWork,
    entity_type: type[RootEntity],
    ref_id: EntityId,
) -> None:
    """Removes all entities descending from a given root, no exceptions."""

    async def _remover(
        entity: RootEntity | TrunkEntity | StubEntity | CrownEntity,
    ) -> None:
        async def _recurse_into_child_dir(child: CrownEntity) -> None:
            await _remover(child)

        if isinstance(entity, CrownEntity):
            await remove_nested_dirs_first(uow, entity, _recurse_into_child_dir)

        for field in entity.__class__.__dict__.values():
            if isinstance(field, RefsMany | OwnsLink):
                filters = field.get_for_entity(entity)
                # RefsMany(Tag/Contact, ref_id=IsOneOfRefId(...)) resolves to list filters — peers
                # referenced by id list, not FK-owned rows to cascade-delete.
                if not filters:
                    continue
                if isinstance(field, RefsMany) and any(
                    isinstance(v, list) for v in filters.values()
                ):
                    continue
                if issubclass(field.the_type, StubEntity) or issubclass(
                    field.the_type, TrunkEntity
                ):
                    try:
                        linked_stub_entity = await uow.get_for(
                            field.the_type
                        ).load_by_parent(entity.ref_id)
                    except EntityNotFoundError:
                        if isinstance(field, ContainsAtMostOne | OwnsAtMostOne):
                            continue
                        raise

                    await _remover(linked_stub_entity)
                    continue
                if not issubclass(field.the_type, CrownEntity):
                    raise Exception(
                        f"Unsupported RefsMany/OwnsLink target {field.the_type} for generic_destroyer",
                    )
                crown_repo = cast(
                    CrownEntityRepository[CrownEntity],
                    uow.get_for(field.the_type),
                )
                linked_entities = await crown_repo.find_all_generic(
                    parent_ref_id=None,
                    allow_archived=True,
                    **filters,
                )
                for linked_entity in linked_entities:
                    await _remover(linked_entity)
                continue

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
                    if isinstance(field, ContainsAtMostOne | OwnsAtMostOne):
                        return
                    raise

                await _remover(linked_trunk_entity)
            elif issubclass(field.the_type, StubEntity):
                try:
                    linked_stub_entity = await uow.get_for(
                        field.the_type
                    ).load_by_parent(entity.ref_id)
                except EntityNotFoundError:
                    if isinstance(field, ContainsAtMostOne | OwnsAtMostOne):
                        return
                    raise

                await _remover(linked_stub_entity)
            elif issubclass(field.the_type, CrownEntity):
                linked_entities = await uow.get_for(field.the_type).find_all(
                    parent_ref_id=entity.ref_id, allow_archived=True
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

        try:
            await uow.get_for(entity.__class__).remove(ctx, entity.ref_id)
        except EntityNotFoundError:
            return

    try:
        entity = await uow.get_for(entity_type).load_by_id(ref_id, allow_archived=True)
    except EntityNotFoundError:
        return

    await _remover(entity)
