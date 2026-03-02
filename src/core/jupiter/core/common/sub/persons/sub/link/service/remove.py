"""Shared service for removing a person link."""

from jupiter.core.common.sub.persons.namespace import PersonNamespace
from jupiter.core.common.sub.persons.sub.link.root import PersonLink, PersonLinkRepository
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import MutationContext
from jupiter.framework.storage.repository import DomainUnitOfWork


class PersonLinkRemoveService:
    """A service for removing a person link."""

    async def remove_for_entity(
        self,
        ctx: MutationContext,
        uow: DomainUnitOfWork,
        namespace: PersonNamespace,
        source_entity_ref_id: EntityId,
    ) -> None:
        """Remove a person link."""
        person_link = await uow.get(
            PersonLinkRepository
        ).load_optional_for_namespace_and_source(
            namespace=namespace,
            source_entity_ref_id=source_entity_ref_id,
        )
        if person_link is None:
            return
        await uow.get_for(PersonLink).remove(person_link.ref_id)
