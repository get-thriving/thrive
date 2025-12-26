"""Use case for archiving a milestone."""

from jupiter.core.archival_reason import JupiterArchivalReason
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.life_plan.sub.milestones.root import Milestone
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import mutation_use_case
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args
from jupiter.framework.utils.generic_crown_archiver import generic_crown_archiver


@use_case_args
class MilestoneArchiveArgs(UseCaseArgsBase):
    """Milestone archive args."""

    ref_id: EntityId


@mutation_use_case(WorkspaceFeature.LIFE_PLAN)
class MilestoneArchiveUseCase(
    JupiterTransactionalLoggedInMutationUseCase[MilestoneArchiveArgs, None]
):
    """The command for archiving a milestone."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: MilestoneArchiveArgs,
    ) -> None:
        """Execute the command's action."""
        await generic_crown_archiver(
            context.domain_context,
            uow,
            progress_reporter,
            Milestone,
            args.ref_id,
            JupiterArchivalReason.USER,
        )
