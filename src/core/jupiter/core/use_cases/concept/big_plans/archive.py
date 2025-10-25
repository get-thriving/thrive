"""The command for archiving a big plan."""

from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.domain.concept.big_plans.big_plan import BigPlan
from jupiter.core.domain.concept.big_plans.service.archive_service import (
    BigPlanArchiveService,
)
from jupiter.core.domain.core.archival_reason import JupiterArchivalReason
from jupiter.core.domain.features import WorkspaceFeature
from jupiter.framework_new.base.entity_id import EntityId
from jupiter.framework_new.progress_reporter.reporter import ProgressReporter
from jupiter.framework_new.storage.repository import DomainUnitOfWork
from jupiter.framework_new.use_case import (
    mutation_use_case,
)
from jupiter.framework_new.use_case_io import UseCaseArgsBase, use_case_args


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
