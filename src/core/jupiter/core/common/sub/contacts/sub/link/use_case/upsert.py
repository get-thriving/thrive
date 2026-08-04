"""Use case for upserting a contact link."""

from jupiter.core.common.sub.access.access_level import AccessLevel
from jupiter.core.common.sub.contacts.root import ContactDomain
from jupiter.core.common.sub.contacts.sub.contact.name import ContactName
from jupiter.core.common.sub.contacts.sub.contact.root import Contact, ContactRepository
from jupiter.core.common.sub.contacts.sub.link.root import (
    ALLOWED_CONTACT_LINK_OWNER_TYPES,
    ContactLink,
    ContactLinkRepository,
)
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.leaf_support_entity_support import (
    JupiterUpsertLeafSupportEntityArgs,
    JupiterUpsertLeafSupportEntityUseCase,
)
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import mutation_use_case
from jupiter.framework.use_case_io import (
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class ContactLinkUpsertArgs(JupiterUpsertLeafSupportEntityArgs):
    """ContactLinkUpsert args."""

    owner: EntityLink
    contact_names: set[ContactName]


@use_case_result
class ContactLinkUpsertResult(UseCaseResultBase):
    """ContactLinkUpsert result."""

    contact_link: ContactLink


@mutation_use_case()
class ContactLinkUpsertUseCase(
    JupiterUpsertLeafSupportEntityUseCase[
        ContactLinkUpsertArgs, ContactLinkUpsertResult
    ]
):
    """Use case for upserting a contact link."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: ContactLinkUpsertArgs,
    ) -> ContactLinkUpsertResult:
        """Execute the command's action."""
        # Contacts are a per-workspace namespace: only the entity owner may
        # assign them, and only to entities in this workspace.
        await self.check_owner_and_find_workspace(
            uow,
            context.user.ref_id,
            context.workspace.ref_id,
            args.owner,
            ALLOWED_CONTACT_LINK_OWNER_TYPES,
            AccessLevel.OWNER,
            require_in_caller_workspace=True,
        )
        contact_domain = await self.load_parent(
            uow, ContactDomain, context.workspace.ref_id
        )

        contact_ref_ids = []
        for contact_name in set(args.contact_names):
            contact = Contact.new_contact(
                ctx=context.domain_context,
                contact_domain_ref_id=contact_domain.ref_id,
                name=contact_name,
            )
            contact = await uow.get(ContactRepository).upsert(contact)
            contact_ref_ids.append(contact.ref_id)

        contact_link = ContactLink.new_contact_link(
            ctx=context.domain_context,
            contact_domain_ref_id=contact_domain.ref_id,
            owner=args.owner,
            contacts_ref_ids=contact_ref_ids,
        )
        contact_link = await uow.get(ContactLinkRepository).upsert(contact_link)

        return ContactLinkUpsertResult(contact_link=contact_link)
