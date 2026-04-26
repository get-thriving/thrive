"""Use case for upserting a contact link."""

from jupiter.core.common.sub.contacts.root import ContactDomain
from jupiter.core.common.sub.contacts.sub.contact.name import ContactName
from jupiter.core.common.sub.contacts.sub.contact.root import (
    Contact,
    ContactAlreadyExistsError,
    ContactRepository,
)
from jupiter.core.common.sub.contacts.sub.link.root import (
    ContactLink,
    ContactLinkRepository,
)
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
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

    owner: EntityLink
    contact_names: set[ContactName]


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

        unique_contact_names = set(args.contact_names)
        contact_ref_ids: list[EntityId] = []
        contact_repository = uow.get(ContactRepository)
        for contact_name in unique_contact_names:
            new_contact = Contact.new_contact(
                ctx=context.domain_context,
                contact_domain_ref_id=contact_domain.ref_id,
                name=contact_name,
            )
            try:
                contact = await contact_repository.create(new_contact)
            except ContactAlreadyExistsError:
                contact = await contact_repository.get_by_name(
                    contact_domain.ref_id,
                    contact_name,
                )

            if contact.contact_domain.ref_id != contact_domain.ref_id:
                raise InputValidationError(
                    f"Contact #{contact.ref_id} does not belong to this workspace"
                )
            contact_ref_ids.append(contact.ref_id)

        contact_link = ContactLink.new_contact_link(
            ctx=context.domain_context,
            contact_domain_ref_id=contact_domain.ref_id,
            owner=args.owner,
            contacts_ref_ids=contact_ref_ids,
        )
        contact_link = await uow.get(ContactLinkRepository).upsert(contact_link)

        return ContactLinkUpsertResult(contact_link=contact_link)
