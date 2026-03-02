"""A common person."""

import abc

from jupiter.core.common.sub.persons.namespace import PersonNamespace
from jupiter.core.common.sub.persons.sub.person.name import CommonPersonName
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import MutationContext
from jupiter.framework.entity import (
    LeafSupportEntity,
    ParentLink,
    create_entity_action,
    entity,
    update_entity_action,
)
from jupiter.framework.storage.repository import (
    EntityAlreadyExistsError,
    LeafEntityRepository,
)
from jupiter.framework.update_action import UpdateAction


class CommonPersonAlreadyExistsError(EntityAlreadyExistsError):
    """Error raised when a common person already exists."""


@entity
class CommonPerson(LeafSupportEntity):
    """A common person."""

    person_domain: ParentLink
    namespace: PersonNamespace
    name: CommonPersonName

    @staticmethod
    @create_entity_action
    def new_person(
        ctx: MutationContext,
        person_domain_ref_id: EntityId,
        namespace: PersonNamespace,
        name: CommonPersonName,
    ) -> "CommonPerson":
        """Create a common person."""
        return CommonPerson._create(
            ctx,
            person_domain=ParentLink(person_domain_ref_id),
            namespace=namespace,
            name=name,
        )

    @update_entity_action
    def update(
        self,
        ctx: MutationContext,
        name: UpdateAction[CommonPersonName],
    ) -> "CommonPerson":
        """Update the common person."""
        return self._new_version(
            ctx,
            name=name.or_else(self.name),
        )


class CommonPersonRepository(LeafEntityRepository[CommonPerson], abc.ABC):
    """The repository for common persons."""

    @abc.abstractmethod
    async def upsert(self, person: CommonPerson) -> CommonPerson:
        """Upsert a common person for a namespace and name."""
