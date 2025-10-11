"""The command for removing a big plan."""

from jupiter.core.config import (
    JupiterLoggedInMutationUseCaseContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.domain.concept.big_plans.service.remove_service import (
    BigPlanRemoveService,
)
from jupiter.core.domain.features import WorkspaceFeature
from jupiter.framework_new.base.entity_id import EntityId
from jupiter.framework_new.repository import DomainUnitOfWork
from jupiter.framework_new.use_case import (
    ProgressReporter,
    mutation_use_case,
)
from jupiter.framework_new.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class BigPlanRemoveArgs(UseCaseArgsBase):
    """PersonFindArgs."""

    ref_id: EntityId


@mutation_use_case(WorkspaceFeature.BIG_PLANS)
class BigPlanRemoveUseCase(
    JupiterTransactionalLoggedInMutationUseCase[BigPlanRemoveArgs, None]
):
    """The command for removing a big plan."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationUseCaseContext,
        args: BigPlanRemoveArgs,
    ) -> None:
        """Execute the command's action."""
        await BigPlanRemoveService().remove(
            context.domain_context,
            uow,
            progress_reporter,
            context.workspace,
            args.ref_id,
        )
