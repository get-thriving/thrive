"""The command for removing a big plan milestone."""

from jupiter.core.config import (
    JupiterLoggedInMutationUseCaseContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.domain.concept.big_plans.big_plan_milestone import BigPlanMilestone
from jupiter.core.domain.features import WorkspaceFeature
from jupiter.core.domain.infra.generic_crown_remover import generic_crown_remover
from jupiter.framework_new.use_case import (
    mutation_use_case,
)
from jupiter.framework_new.base.entity_id import EntityId
from jupiter.framework_new.repository import DomainUnitOfWork
from jupiter.framework_new.use_case import ProgressReporter
from jupiter.framework_new.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class BigPlanMilestoneRemoveArgs(UseCaseArgsBase):
    """Big plan milestone remove args."""

    ref_id: EntityId


@mutation_use_case(WorkspaceFeature.BIG_PLANS)
class BigPlanMilestoneRemoveUseCase(
    JupiterTransactionalLoggedInMutationUseCase[BigPlanMilestoneRemoveArgs, None]
):
    """The command for removing a big plan milestone."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationUseCaseContext,
        args: BigPlanMilestoneRemoveArgs,
    ) -> None:
        """Execute the command's action."""
        await generic_crown_remover(
            context.domain_context,
            uow,
            progress_reporter,
            BigPlanMilestone,
            args.ref_id,
        )
