"""Use case for updating a contact."""

from jupiter.core.common.sub.contacts.sub.contact.name import ContactName
from jupiter.core.common.sub.contacts.sub.contact.root import Contact
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.update_action import UpdateAction
from jupiter.framework.use_case import mutation_use_case
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class ContactUpdateArgs(UseCaseArgsBase):
    """ContactUpdate args."""

    ref_id: EntityId
    name: UpdateAction[ContactName]


@mutation_use_case()
class ContactUpdateUseCase(
    JupiterTransactionalLoggedInMutationUseCase[ContactUpdateArgs, None]
):
    """Use case for updating a contact."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: ContactUpdateArgs,
    ) -> None:
        """Execute the command's action."""
        contact = await uow.get_for(Contact).load_by_id(args.ref_id)
        contact = contact.update(
            ctx=context.domain_context,
            name=args.name,
        )
        await uow.get_for(Contact).save(contact)
