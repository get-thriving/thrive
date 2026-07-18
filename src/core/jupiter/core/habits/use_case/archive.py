"""The command for archiving a habit."""

from jupiter.core.archival_reason import JupiterArchivalReason
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.crown_entity_support import (
    JupiterArchiveCrownEntityArgs,
    JupiterArchiveCrownEntityUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.habits.root import Habit
from jupiter.core.habits.service.archive import (
    HabitArchiveService,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import use_case_args


@use_case_args
class HabitArchiveArgs(JupiterArchiveCrownEntityArgs):
    """PersonFindArgs."""

    ref_id: EntityId


@mutation_use_case(WorkspaceFeature.HABITS)
class HabitArchiveUseCase(JupiterArchiveCrownEntityUseCase[HabitArchiveArgs, None]):
    """The command for archiving a habit."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: HabitArchiveArgs,
    ) -> None:
        """Execute the command's action."""
        habit = await self.load_entity(uow, context.user.ref_id, Habit, args.ref_id)

        await HabitArchiveService().do_it(
            context.domain_context,
            uow,
            progress_reporter,
            habit,
            JupiterArchivalReason.USER,
        )
