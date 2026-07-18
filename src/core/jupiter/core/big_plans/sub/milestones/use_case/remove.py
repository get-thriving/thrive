"""The command for removing a big plan milestone."""

from jupiter.core.big_plans.root import BigPlan
from jupiter.core.big_plans.sub.milestones.root import BigPlanMilestone
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.crown_entity_support import (
    JupiterRemoveCrownEntityArgs,
    JupiterRemoveCrownEntityUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import use_case_args
from jupiter.framework.utils.generic_crown_remover import generic_crown_remover


@use_case_args
class BigPlanMilestoneRemoveArgs(JupiterRemoveCrownEntityArgs):
    """Big plan milestone remove args."""

    ref_id: EntityId


@mutation_use_case(WorkspaceFeature.BIG_PLANS)
class BigPlanMilestoneRemoveUseCase(
    JupiterRemoveCrownEntityUseCase[BigPlanMilestoneRemoveArgs, None]
):
    """The command for removing a big plan milestone."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: BigPlanMilestoneRemoveArgs,
    ) -> None:
        """Execute the command's action."""
        milestone = await uow.get_for(BigPlanMilestone).load_by_id(
            args.ref_id, allow_archived=True
        )
        await self.check_entity(
            uow,
            context.user.ref_id,
            BigPlan,
            milestone.big_plan.ref_id,
        )

        await generic_crown_remover(
            context.domain_context,
            uow,
            progress_reporter,
            BigPlanMilestone,
            args.ref_id,
        )
