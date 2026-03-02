"""Use case for creating a contact."""

from jupiter.core.common.sub.contacts.root import ContactDomain
from jupiter.core.common.sub.contacts.sub.contact.name import ContactName
from jupiter.core.common.sub.contacts.sub.contact.root import Contact
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
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
class ContactCreateArgs(UseCaseArgsBase):
    """ContactCreate args."""

    name: ContactName


@use_case_result
class ContactCreateResult(UseCaseResultBase):
    """ContactCreate result."""

    new_contact: Contact


@mutation_use_case()
class ContactCreateUseCase(
    JupiterTransactionalLoggedInMutationUseCase[ContactCreateArgs, ContactCreateResult]
):
    """Use case for creating a contact."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: ContactCreateArgs,
    ) -> ContactCreateResult:
        """Execute the command's action."""
        workspace = context.workspace
        contact_domain = await uow.get_for(ContactDomain).load_by_parent(workspace.ref_id)

        new_contact = Contact.new_contact(
            ctx=context.domain_context,
            contact_domain_ref_id=contact_domain.ref_id,
            name=args.name,
        )
        new_contact = await uow.get_for(Contact).create(new_contact)
        return ContactCreateResult(new_contact=new_contact)
