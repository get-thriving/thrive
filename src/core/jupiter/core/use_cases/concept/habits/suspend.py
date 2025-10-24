"""The command for suspend a habit."""

from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.domain.concept.habits.habit import Habit
from jupiter.core.domain.features import WorkspaceFeature
from jupiter.framework_new.base.entity_id import EntityId
from jupiter.framework_new.progress_reporter.reporter import ProgressReporter
from jupiter.framework_new.repository import DomainUnitOfWork
from jupiter.framework_new.use_case import (
    mutation_use_case,
)
from jupiter.framework_new.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class HabitSuspendArgs(UseCaseArgsBase):
    """PersonFindArgs."""

    ref_id: EntityId


@mutation_use_case(WorkspaceFeature.HABITS)
class HabitSuspendUseCase(
    JupiterTransactionalLoggedInMutationUseCase[HabitSuspendArgs, None]
):
    """The command for suspending a habit."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: HabitSuspendArgs,
    ) -> None:
        """Execute the command's action."""
        habit = await uow.get_for(Habit).load_by_id(args.ref_id)
        habit = habit.suspend(context.domain_context)
        await uow.get_for(Habit).save(habit)
        await progress_reporter.mark_updated(habit)
