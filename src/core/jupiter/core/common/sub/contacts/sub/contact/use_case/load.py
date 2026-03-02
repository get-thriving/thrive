"""Use case for loading a contact."""

from jupiter.core.common.sub.contacts.sub.contact.root import Contact
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import readonly_use_case
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class ContactLoadArgs(UseCaseArgsBase):
    """ContactLoad args."""

    ref_id: EntityId
    allow_archived: bool | None


@use_case_result
class ContactLoadResult(UseCaseResultBase):
    """ContactLoad result."""

    contact: Contact


@readonly_use_case()
class ContactLoadUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[ContactLoadArgs, ContactLoadResult]
):
    """Use case for loading a contact."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: ContactLoadArgs,
    ) -> ContactLoadResult:
        """Execute the command's action."""
        allow_archived = args.allow_archived or False
        contact = await uow.get_for(Contact).load_by_id(
            args.ref_id, allow_archived=allow_archived
        )
        return ContactLoadResult(contact=contact)
