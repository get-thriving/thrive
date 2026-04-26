"""Use case for removing a contact."""

from jupiter.core.common.sub.contacts.root import ContactDomain
from jupiter.core.common.sub.contacts.sub.contact.root import (
    Contact,
    ContactInSignificantUseError,
)
from jupiter.core.common.sub.contacts.sub.link.root import ContactLink
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.update_action import UpdateAction
from jupiter.framework.use_case import mutation_use_case
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class ContactRemoveArgs(UseCaseArgsBase):
    """ContactRemove args."""

    ref_id: EntityId


@mutation_use_case()
class ContactRemoveUseCase(
    JupiterTransactionalLoggedInMutationUseCase[ContactRemoveArgs, None]
):
    """Use case for removing a contact."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: ContactRemoveArgs,
    ) -> None:
        """Execute the command's action."""
        workspace = context.workspace
        contact_domain = await uow.get_for(ContactDomain).load_by_parent(
            workspace.ref_id
        )

        contact = await uow.get_for(Contact).load_by_id(args.ref_id)

        all_contact_links = await uow.get_for(ContactLink).find_all_generic(
            parent_ref_id=contact_domain.ref_id,
            allow_archived=True,
        )

        for contact_link in all_contact_links:
            if contact.ref_id not in contact_link.contacts_ref_ids:
                continue
            if contact_link.owner.the_type == NamedEntityTag.PERSON.value:
                raise ContactInSignificantUseError(
                    "Contact is tied to a person and cannot be removed"
                )
            new_contact_ref_ids = [
                ref_id
                for ref_id in contact_link.contacts_ref_ids
                if ref_id != contact.ref_id
            ]
            contact_link = contact_link.update(
                context.domain_context,
                contacts_ref_ids=UpdateAction.change_to(new_contact_ref_ids),
            )
            await uow.get_for(ContactLink).save(contact_link)

        await uow.get_for(Contact).remove(context.domain_context, args.ref_id)
