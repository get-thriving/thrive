"""The command for archiving a habit."""

from jupiter.core.config import (
    JupiterLoggedInMutationUseCaseContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.domain.concept.habits.habit import Habit
from jupiter.core.domain.concept.habits.service.archive_service import (
    HabitArchiveService,
)
from jupiter.core.domain.core.archival_reason import JupiterArchivalReason
from jupiter.core.domain.features import WorkspaceFeature
from jupiter.framework_new.use_case import (
    mutation_use_case,
)
from jupiter.framework_new.base.entity_id import EntityId
from jupiter.framework_new.repository import DomainUnitOfWork
from jupiter.framework_new.use_case import (
    ProgressReporter,
)
from jupiter.framework_new.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class HabitArchiveArgs(UseCaseArgsBase):
    """PersonFindArgs."""

    ref_id: EntityId


@mutation_use_case(WorkspaceFeature.HABITS)
class HabitArchiveUseCase(
    JupiterTransactionalLoggedInMutationUseCase[HabitArchiveArgs, None]
):
    """The command for archiving a habit."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationUseCaseContext,
        args: HabitArchiveArgs,
    ) -> None:
        """Execute the command's action."""
        habit = await uow.get_for(Habit).load_by_id(args.ref_id)
        await HabitArchiveService().do_it(
            context.domain_context, uow, progress_reporter, habit, JupiterArchivalReason.USER
        )
