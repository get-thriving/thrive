"""A person."""

import abc

from jupiter.core.common.sub.persons.namespace import PersonNamespace
from jupiter.core.common.sub.persons.sub.person.name import PersonName
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


class PersonAlreadyExistsError(EntityAlreadyExistsError):
    """Error raised when a person already exists."""


@entity
class Person(LeafSupportEntity):
    """A person."""

    person_domain: ParentLink
    namespace: PersonNamespace
    name: PersonName

    @staticmethod
    @create_entity_action
    def new_person(
        ctx: MutationContext,
        person_domain_ref_id: EntityId,
        namespace: PersonNamespace,
        name: PersonName,
    ) -> "Person":
        """Create a person."""
        return Person._create(
            ctx,
            person_domain=ParentLink(person_domain_ref_id),
            namespace=namespace,
            name=name,
        )

    @update_entity_action
    def update(
        self,
        ctx: MutationContext,
        name: UpdateAction[PersonName],
    ) -> "Person":
        """Update the person."""
        return self._new_version(
            ctx,
            name=name.or_else(self.name),
        )


class PersonRepository(LeafEntityRepository[Person], abc.ABC):
    """The repository for persons."""

    @abc.abstractmethod
    async def upsert(self, person: Person) -> Person:
        """Upsert a person for a namespace and name."""
