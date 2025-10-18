"""The command for archiving a big plan milestone."""

from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.domain.concept.big_plans.big_plan_milestone import BigPlanMilestone
from jupiter.core.domain.core.archival_reason import JupiterArchivalReason
from jupiter.core.domain.features import WorkspaceFeature
from jupiter.core.domain.infra.generic_crown_archiver import generic_crown_archiver
from jupiter.framework_new.base.entity_id import EntityId
from jupiter.framework_new.progress_reporter import ProgressReporter
from jupiter.framework_new.repository import DomainUnitOfWork
from jupiter.framework_new.use_case import (
    mutation_use_case,
)
from jupiter.framework_new.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class BigPlanMilestoneArchiveArgs(UseCaseArgsBase):
    """Big plan milestone archive args."""

    ref_id: EntityId


@mutation_use_case(WorkspaceFeature.BIG_PLANS)
class BigPlanMilestoneArchiveUseCase(
    JupiterTransactionalLoggedInMutationUseCase[BigPlanMilestoneArchiveArgs, None]
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
        await generic_crown_archiver(
            context.domain_context,
            uow,
            progress_reporter,
            BigPlanMilestone,
            args.ref_id,
            JupiterArchivalReason.USER,
        )
