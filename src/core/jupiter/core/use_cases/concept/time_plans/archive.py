"""Use case for archiving a time plan."""

from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.domain.app import AppCore
from jupiter.core.domain.concept.time_plans.time_plan import TimePlan
from jupiter.core.domain.core.archival_reason import JupiterArchivalReason
from jupiter.core.domain.features import WorkspaceFeature
from jupiter.core.domain.infra.generic_crown_archiver import generic_crown_archiver
from jupiter.framework_new.base.entity_id import EntityId
from jupiter.framework_new.progress_reporter.reporter import ProgressReporter
from jupiter.framework_new.repository import DomainUnitOfWork
from jupiter.framework_new.use_case import (
    mutation_use_case,
)
from jupiter.framework_new.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class TimePlanArchiveArgs(UseCaseArgsBase):
    """Args."""

    ref_id: EntityId


@mutation_use_case(WorkspaceFeature.TIME_PLANS, only_for_component=[AppCore.WEBUI])
class TimePlanArchiveUseCase(
    JupiterTransactionalLoggedInMutationUseCase[TimePlanArchiveArgs, None]
):
    """Use case for archiving a time plan."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: TimePlanArchiveArgs,
    ) -> None:
        """Execute the command's action."""
        await generic_crown_archiver(
            context.domain_context,
            uow,
            progress_reporter,
            TimePlan,
            args.ref_id,
            JupiterArchivalReason.USER,
        )
