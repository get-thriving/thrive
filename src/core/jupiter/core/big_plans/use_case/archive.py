"""The command for archiving a big plan."""

from jupiter.core.big_plans.root import BigPlan
from jupiter.core.big_plans.service.archive import (
    BigPlanArchiveService,
)
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.domain.core.archival_reason import JupiterArchivalReason
from jupiter.core.domain.features import WorkspaceFeature
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class BigPlanArchiveArgs(UseCaseArgsBase):
    """PersonFindArgs."""

    ref_id: EntityId


@mutation_use_case(WorkspaceFeature.BIG_PLANS)
class BigPlanArchiveUseCase(
    JupiterTransactionalLoggedInMutationUseCase[BigPlanArchiveArgs, None]
):
    """The command for archiving a big plan."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: BigPlanArchiveArgs,
    ) -> None:
        """Execute the command's action."""
        big_plan = await uow.get_for(BigPlan).load_by_id(args.ref_id)

        await BigPlanArchiveService().do_it(
            context.domain_context,
            uow,
            progress_reporter,
            big_plan,
            JupiterArchivalReason.USER,
        )
