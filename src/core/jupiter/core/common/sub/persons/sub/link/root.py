"""A link between an entity and its persons."""

import abc

from jupiter.core.common.sub.persons.namespace import PersonNamespace
from jupiter.core.common.sub.persons.sub.person.root import Person
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_name import NOT_USED_NAME
from jupiter.framework.context import MutationContext
from jupiter.framework.entity import (
    IsOneOfRefId,
    LeafSupportEntity,
    ParentLink,
    RefsMany,
    create_entity_action,
    entity,
    update_entity_action,
)
from jupiter.framework.storage.repository import LeafEntityRepository
from jupiter.framework.update_action import UpdateAction


@entity
class PersonLink(LeafSupportEntity):
    """A link between an entity and its persons."""

    person_domain: ParentLink

    namespace: PersonNamespace
    source_entity_ref_id: EntityId
    ref_ids: list[EntityId]

    persons = RefsMany(Person, ref_id=IsOneOfRefId("ref_ids"))

    @staticmethod
    @create_entity_action
    def new_person_link(
        ctx: MutationContext,
        person_domain_ref_id: EntityId,
        namespace: PersonNamespace,
        source_entity_ref_id: EntityId,
        ref_ids: list[EntityId],
    ) -> "PersonLink":
        """Create a new person link."""
        return PersonLink._create(
            ctx,
            name=NOT_USED_NAME,
            person_domain=ParentLink(person_domain_ref_id),
            namespace=namespace,
            source_entity_ref_id=source_entity_ref_id,
            ref_ids=ref_ids,
        )

    @update_entity_action
    def update(
        self,
        ctx: MutationContext,
        ref_ids: UpdateAction[list[EntityId]],
    ) -> "PersonLink":
        """Update the person link."""
        return self._new_version(
            ctx,
            name=NOT_USED_NAME,
            ref_ids=ref_ids.or_else(self.ref_ids),
        )


class PersonLinkRepository(LeafEntityRepository[PersonLink], abc.ABC):
    """The repository for person links."""

    @abc.abstractmethod
    async def upsert(self, person_link: PersonLink) -> PersonLink:
        """Upsert a person link."""

    @abc.abstractmethod
    async def load_optional_for_namespace_and_source(
        self,
        namespace: PersonNamespace,
        source_entity_ref_id: EntityId,
    ) -> PersonLink | None:
        """Load a person link by its namespace and source entity reference ID."""
