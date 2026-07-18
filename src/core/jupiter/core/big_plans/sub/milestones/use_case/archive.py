"""The command for archiving a big plan milestone."""

from jupiter.core.archival_reason import JupiterArchivalReason
from jupiter.core.big_plans.root import BigPlan
from jupiter.core.big_plans.sub.milestones.root import BigPlanMilestone
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.crown_entity_support import (
    JupiterArchiveCrownEntityArgs,
    JupiterArchiveCrownEntityUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import use_case_args
from jupiter.framework.utils.generic_crown_archiver import generic_crown_archiver


@use_case_args
class BigPlanMilestoneArchiveArgs(JupiterArchiveCrownEntityArgs):
    """Big plan milestone archive args."""

    ref_id: EntityId


@mutation_use_case(WorkspaceFeature.BIG_PLANS)
class BigPlanMilestoneArchiveUseCase(
    JupiterArchiveCrownEntityUseCase[BigPlanMilestoneArchiveArgs, None]
):
    """The command for archiving a big plan milestone."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: BigPlanMilestoneArchiveArgs,
    ) -> None:
        """Execute the command's action."""
        milestone = await uow.get_for(BigPlanMilestone).load_by_id(
            args.ref_id, allow_archived=True
        )
        await self.check_entity(
            uow, context.user.ref_id, BigPlan, milestone.big_plan.ref_id
        )

        await generic_crown_archiver(
            context.domain_context,
            uow,
            progress_reporter,
            BigPlanMilestone,
            args.ref_id,
            JupiterArchivalReason.USER,
        )
