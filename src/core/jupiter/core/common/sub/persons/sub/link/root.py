"""A link between an entity and its common persons."""

import abc

from jupiter.core.common.sub.persons.namespace import PersonNamespace
from jupiter.core.common.sub.persons.sub.person.root import CommonPerson
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
class CommonPersonLink(LeafSupportEntity):
    """A link between an entity and its common persons."""

    person_domain: ParentLink

    namespace: PersonNamespace
    source_entity_ref_id: EntityId
    ref_ids: list[EntityId]

    persons = RefsMany(CommonPerson, ref_id=IsOneOfRefId("ref_ids"))

    @staticmethod
    @create_entity_action
    def new_person_link(
        ctx: MutationContext,
        person_domain_ref_id: EntityId,
        namespace: PersonNamespace,
        source_entity_ref_id: EntityId,
        ref_ids: list[EntityId],
    ) -> "CommonPersonLink":
        """Create a new common person link."""
        return CommonPersonLink._create(
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
    ) -> "CommonPersonLink":
        """Update the common person link."""
        return self._new_version(
            ctx,
            name=NOT_USED_NAME,
            ref_ids=ref_ids.or_else(self.ref_ids),
        )


class CommonPersonLinkRepository(LeafEntityRepository[CommonPersonLink], abc.ABC):
    """The repository for common person links."""

    @abc.abstractmethod
    async def upsert(self, person_link: CommonPersonLink) -> CommonPersonLink:
        """Upsert a common person link."""

    @abc.abstractmethod
    async def load_optional_for_namespace_and_source(
        self,
        namespace: PersonNamespace,
        source_entity_ref_id: EntityId,
    ) -> CommonPersonLink | None:
        """Load a common person link by its namespace and source entity reference ID."""
