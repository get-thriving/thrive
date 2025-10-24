"""The command for archiving a chore."""

from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.domain.concept.chores.chore import Chore
from jupiter.core.domain.concept.chores.service.archive_service import (
    ChoreArchiveService,
)
from jupiter.core.domain.core.archival_reason import JupiterArchivalReason
from jupiter.core.domain.features import WorkspaceFeature
from jupiter.framework_new.base.entity_id import EntityId
from jupiter.framework_new.progress_reporter.reporter import ProgressReporter
from jupiter.framework_new.repository import DomainUnitOfWork
from jupiter.framework_new.use_case import (
    mutation_use_case,
)
from jupiter.framework_new.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class ChoreArchiveArgs(UseCaseArgsBase):
    """PersonFindArgs."""

    ref_id: EntityId


@mutation_use_case(WorkspaceFeature.CHORES)
class ChoreArchiveUseCase(
    JupiterTransactionalLoggedInMutationUseCase[ChoreArchiveArgs, None]
):
    """The command for archiving a chore."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: ChoreArchiveArgs,
    ) -> None:
        """Execute the command's action."""
        chore = await uow.get_for(Chore).load_by_id(args.ref_id)
        await ChoreArchiveService().do_it(
            context.domain_context,
            uow,
            progress_reporter,
            chore,
            JupiterArchivalReason.USER,
        )
