"""A generic explorer for linked support entities."""

from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.entity import (
    ContainsLink,
    CrownEntity,
    LeafSupportEntity,
    OwnsLink,
)
from jupiter.framework.storage.repository import DomainUnitOfWork


async def generic_support_entity_explorer(
    uow: DomainUnitOfWork,
    entity: CrownEntity,
) -> list[tuple[str, EntityId]]:
    """Return all linked LeafSupportEntity class names and ref ids owned or contained by an entity."""
    result: list[tuple[str, EntityId]] = []

    for field in entity.__class__.__dict__.values():
        if not (isinstance(field, OwnsLink) or isinstance(field, ContainsLink)):
            continue
        if not issubclass(field.the_type, CrownEntity):
            continue

        linked_entities = await uow.get_for(field.the_type).find_all_generic(
            parent_ref_id=None,
            allow_archived=True,
            **field.get_for_entity(entity),
        )

        for linked_entity in linked_entities:
            if isinstance(linked_entity, LeafSupportEntity):
                result.append((linked_entity.__class__.__name__, linked_entity.ref_id))
            else:
                result.extend(await generic_support_entity_explorer(uow, linked_entity))

    return result
