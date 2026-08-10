"""Find shareable entities that own a child via OwnsLink/ContainsLink filters."""

import dataclasses
from typing import Final

from jupiter.core.common.sub.access.shareable import (
    ALLOWED_SHARED_ACCESS_OWNER_TYPES,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.concepts.registry import ConceptNotFoundError, ConceptRegistry
from jupiter.framework.entity import (
    ContainsLink,
    CrownEntity,
    IsParentLink,
    IsRefId,
    OwnsLink,
    ParentLink,
)
from jupiter.framework.entity import (
    EntityLink as EntityLinkDesc,
)


class FindShareableOwnsParentsService:
    """Resolve shareable OwnsLink/ContainsLink parents for a crown child.

    Metric entries and smart list items ParentLink directly to their share
    root, so :class:`ReplicateParentRightsForEntityService` finds them via the
    parent walk. Schedule events instead hang off ``ScheduleDomain`` and are
    owned by a stream through ``OwnsMany(..., schedule_stream_ref_id=IsRefId())``.
    This service recovers those logical parents from the link descriptors so
    inheritance stays generic.
    """

    _concept_registry: Final[ConceptRegistry]

    def __init__(self, concept_registry: ConceptRegistry) -> None:
        """Constructor."""
        self._concept_registry = concept_registry

    def find_for_entity(self, entity: CrownEntity) -> list[EntityLink]:
        """Return shareable owners that point at ``entity`` via owns/contains links."""
        child_type = entity.__class__
        parents: list[EntityLink] = []
        seen: set[EntityLink] = set()

        for type_name in ALLOWED_SHARED_ACCESS_OWNER_TYPES:
            try:
                owner_cls = self._concept_registry.get_entity_by_name(type_name)
            except ConceptNotFoundError:
                continue
            if not issubclass(owner_cls, CrownEntity):
                continue

            for field in owner_cls.__dict__.values():
                if not isinstance(field, (ContainsLink, OwnsLink)):
                    continue
                if field.the_type is not child_type:
                    continue

                owner_ref_id = self._owner_ref_id_from_child(entity, field)
                if owner_ref_id is None:
                    continue

                parent_link = EntityLink.std(type_name, owner_ref_id)
                if parent_link in seen:
                    continue
                seen.add(parent_link)
                parents.append(parent_link)

        return parents

    def _owner_ref_id_from_child(
        self,
        child: CrownEntity,
        link: EntityLinkDesc[CrownEntity],
    ) -> EntityId | None:
        """Invert an owns/contains filter that identifies the owner by ref id.

        Filters that target the child's ``ParentLink`` (metric entry, smart list
        item, …) are skipped — those already inherit through the normal parent
        walk.
        """
        owner_ref_id: EntityId | None = None
        for filter_name, filter_rule in link.filters.items():
            if isinstance(filter_rule, IsParentLink):
                return None
            if self._filter_targets_parent_link(child, filter_name):
                return None
            if isinstance(filter_rule, IsRefId):
                value = getattr(child, filter_name, None)
                if not isinstance(value, EntityId):
                    return None
                if owner_ref_id is not None and owner_ref_id != value:
                    return None
                owner_ref_id = value
        return owner_ref_id

    def _filter_targets_parent_link(
        self,
        child: CrownEntity,
        filter_name: str,
    ) -> bool:
        """Whether ``filter_name`` is the synthetic ``{parent_field}_ref_id``."""
        if not filter_name.endswith("_ref_id"):
            return False
        parent_field_name = filter_name[: -len("_ref_id")]
        for field in dataclasses.fields(child.__class__):
            if field.name == parent_field_name and field.type is ParentLink:
                return True
        return False
