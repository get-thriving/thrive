"""Shared service for archiving a person link."""

from jupiter.core.archival_reason import JupiterArchivalReason
from jupiter.core.common.sub.persons.namespace import PersonNamespace
from jupiter.core.common.sub.persons.sub.link.root import PersonLink, PersonLinkRepository
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import MutationContext
from jupiter.framework.storage.repository import DomainUnitOfWork


class PersonLinkArchiveService:
    """A service for archiving a person link."""

    async def archive_for_entity(
        self,
        ctx: MutationContext,
        uow: DomainUnitOfWork,
        namespace: PersonNamespace,
        source_entity_ref_id: EntityId,
        archival_reason: JupiterArchivalReason,
    ) -> None:
        """Archive a person link for an entity."""
        person_link = await uow.get(
            PersonLinkRepository
        ).load_optional_for_namespace_and_source(
            namespace=namespace,
            source_entity_ref_id=source_entity_ref_id,
        )
        if person_link is None:
            return
        if person_link.archived:
            return
        person_link = person_link.mark_archived(ctx, archival_reason)
        await uow.get_for(PersonLink).save(person_link)
