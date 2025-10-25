"""Use case for removing a time_plan."""

from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.domain.app import AppCore
from jupiter.core.domain.concept.time_plans.time_plan import TimePlan
from jupiter.core.domain.features import WorkspaceFeature
from jupiter.core.domain.infra.generic_crown_remover import generic_crown_remover
from jupiter.framework_new.base.entity_id import EntityId
from jupiter.framework_new.progress_reporter.reporter import ProgressReporter
from jupiter.framework_new.storage.repository import DomainUnitOfWork
from jupiter.framework_new.use_case import (
    mutation_use_case,
)
from jupiter.framework_new.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class TimePlanRemoveArgs(UseCaseArgsBase):
    """Args."""

    ref_id: EntityId


@mutation_use_case(WorkspaceFeature.TIME_PLANS, only_for_component=[AppCore.WEBUI])
class TimePlanRemoveUseCase(
    JupiterTransactionalLoggedInMutationUseCase[TimePlanRemoveArgs, None]
):
    """Use case for removing a time_plan."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: TimePlanRemoveArgs,
    ) -> None:
        """Execute the command's action."""
        await generic_crown_remover(
            context.domain_context, uow, progress_reporter, TimePlan, args.ref_id
        )
