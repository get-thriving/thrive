"""Use case for upserting a contact link."""

from jupiter.core.common.sub.contacts.namespace import ContactNamespace
from jupiter.core.common.sub.contacts.root import ContactDomain
from jupiter.core.common.sub.contacts.sub.contact.root import Contact
from jupiter.core.common.sub.contacts.sub.link.root import (
    ContactLink,
    ContactLinkRepository,
)
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.errors import InputValidationError
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import mutation_use_case
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class ContactLinkUpsertArgs(UseCaseArgsBase):
    """ContactLinkUpsert args."""

    namespace: ContactNamespace
    source_entity_ref_id: EntityId
    contacts_ref_ids: list[EntityId]


@use_case_result
class ContactLinkUpsertResult(UseCaseResultBase):
    """ContactLinkUpsert result."""

    contact_link: ContactLink


@mutation_use_case()
class ContactLinkUpsertUseCase(
    JupiterTransactionalLoggedInMutationUseCase[
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
        workspace = context.workspace
        contact_domain = await uow.get_for(ContactDomain).load_by_parent(
            workspace.ref_id
        )

        unique_contact_ref_ids: list[EntityId] = list(
            dict.fromkeys(args.contacts_ref_ids)
        )
        for contact_ref_id in unique_contact_ref_ids:
            contact = await uow.get_for(Contact).load_by_id(contact_ref_id)
            if contact.contact_domain.ref_id != contact_domain.ref_id:
                raise InputValidationError(
                    f"Contact #{contact.ref_id} does not belong to this workspace"
                )

        contact_link = ContactLink.new_contact_link(
            ctx=context.domain_context,
            contact_domain_ref_id=contact_domain.ref_id,
            namespace=args.namespace,
            source_entity_ref_id=args.source_entity_ref_id,
            contacts_ref_ids=unique_contact_ref_ids,
        )
        contact_link = await uow.get(ContactLinkRepository).upsert(contact_link)

        return ContactLinkUpsertResult(contact_link=contact_link)
