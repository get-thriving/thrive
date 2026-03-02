"""Use case for finding contacts."""

from jupiter.core.common.sub.contacts.root import ContactDomain
from jupiter.core.common.sub.contacts.sub.contact.root import Contact
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.entity import NoFilter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import readonly_use_case
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class ContactFindArgs(UseCaseArgsBase):
    """ContactFind args."""

    allow_archived: bool | None
    filter_ref_ids: list[EntityId] | None


@use_case_result
class ContactFindResult(UseCaseResultBase):
    """ContactFind result."""

    contacts: list[Contact]


@readonly_use_case()
class ContactFindUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[ContactFindArgs, ContactFindResult]
):
    """Use case for finding contacts."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: ContactFindArgs,
    ) -> ContactFindResult:
        """Execute the command's action."""
        allow_archived = args.allow_archived or False

        workspace = context.workspace
        contact_domain = await uow.get_for(ContactDomain).load_by_parent(workspace.ref_id)

        contacts = await uow.get_for(Contact).find_all_generic(
            parent_ref_id=contact_domain.ref_id,
            allow_archived=allow_archived,
            ref_id=args.filter_ref_ids or NoFilter(),
        )

        return ContactFindResult(contacts=contacts)
