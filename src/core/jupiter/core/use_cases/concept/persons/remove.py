"""Remove a person."""

from jupiter.core.config import (
    JupiterLoggedInMutationUseCaseContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.domain.concept.persons.person import Person
from jupiter.core.domain.features import WorkspaceFeature
from jupiter.core.domain.infra.generic_crown_remover import generic_crown_remover
from jupiter.framework_new.base.entity_id import EntityId
from jupiter.framework_new.repository import DomainUnitOfWork
from jupiter.framework_new.use_case import (
    ProgressReporter,
    mutation_use_case,
)
from jupiter.framework_new.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class PersonRemoveArgs(UseCaseArgsBase):
    """PersonFindArgs."""

    ref_id: EntityId


@mutation_use_case(WorkspaceFeature.PERSONS)
class PersonRemoveUseCase(
    JupiterTransactionalLoggedInMutationUseCase[PersonRemoveArgs, None]
):
    """The command for removing a person."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationUseCaseContext,
        args: PersonRemoveArgs,
    ) -> None:
        """Execute the command's action."""
        await generic_crown_remover(
            context.domain_context, uow, progress_reporter, Person, args.ref_id
        )
