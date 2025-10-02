"""The command for unsuspending a habit."""

from jupiter.core.domain.concept.habits.habit import Habit
from jupiter.core.domain.features import WorkspaceFeature
from jupiter.core.domain.storage_engine import DomainUnitOfWork
from jupiter.core.use_cases.infra.use_cases import (
    AppLoggedInMutationUseCaseContext,
    AppTransactionalLoggedInMutationUseCase,
    mutation_use_case,
)
from jupiter.framework_new.base.entity_id import EntityId
from jupiter.framework_new.use_case import (
    ProgressReporter,
)
from jupiter.framework_new.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class HabitUnsuspendArgs(UseCaseArgsBase):
    """PersonFindArgs."""

    ref_id: EntityId


@mutation_use_case(WorkspaceFeature.HABITS)
class HabitUnsuspendUseCase(
    AppTransactionalLoggedInMutationUseCase[HabitUnsuspendArgs, None]
):
    """The command for unsuspending a habit."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: AppLoggedInMutationUseCaseContext,
        args: HabitUnsuspendArgs,
    ) -> None:
        """Execute the command's action."""
        habit = await uow.get_for(Habit).load_by_id(args.ref_id)
        habit = habit.unsuspend(context.domain_context)
        await uow.get_for(Habit).save(habit)
        await progress_reporter.mark_updated(habit)
