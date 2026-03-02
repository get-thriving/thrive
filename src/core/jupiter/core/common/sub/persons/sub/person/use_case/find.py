"""Use case for finding persons."""

from jupiter.core.app import AppCore
from jupiter.core.common.sub.persons.namespace import PersonNamespace
from jupiter.core.common.sub.persons.root import PersonDomain
from jupiter.core.common.sub.persons.sub.person.root import Person
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
class PersonFindArgs(UseCaseArgsBase):
    """PersonFind args."""

    allow_archived: bool | None
    filter_namespace: list[PersonNamespace] | None
    filter_ref_ids: list[EntityId] | None


@use_case_result
class PersonFindResult(UseCaseResultBase):
    """PersonFind result."""

    persons: list[Person]


@readonly_use_case(exclude_component=[AppCore.CLI])
class PersonFindUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[PersonFindArgs, PersonFindResult]
):
    """Use case for finding persons."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: PersonFindArgs,
    ) -> PersonFindResult:
        """Execute the command's action."""
        allow_archived = args.allow_archived or False

        workspace = context.workspace
        person_domain = await uow.get_for(PersonDomain).load_by_parent(
            workspace.ref_id
        )

        persons = await uow.get_for(Person).find_all_generic(
            parent_ref_id=person_domain.ref_id,
            allow_archived=allow_archived,
            ref_id=args.filter_ref_ids or NoFilter(),
            namespace=args.filter_namespace or NoFilter(),
        )

        return PersonFindResult(persons=persons)
