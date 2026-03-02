"""Use case for loading a person."""

from jupiter.core.app import AppCore
from jupiter.core.common.sub.persons.sub.person.root import Person
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
class PersonLoadArgs(UseCaseArgsBase):
    """PersonLoad args."""

    ref_id: EntityId
    allow_archived: bool | None


@use_case_result
class PersonLoadResult(UseCaseResultBase):
    """PersonLoad result."""

    person: Person


@readonly_use_case(exclude_component=[AppCore.CLI])
class PersonLoadUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[PersonLoadArgs, PersonLoadResult]
):
    """Use case for loading a person."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: PersonLoadArgs,
    ) -> PersonLoadResult:
        """Execute the command's action."""
        allow_archived = args.allow_archived or False
        person = await uow.get_for(Person).load_by_id(
            args.ref_id, allow_archived=allow_archived
        )
        return PersonLoadResult(person=person)
