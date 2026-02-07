"""Use case for loading a particular goal."""

from jupiter.core.common.sub.notes.domain import NoteDomain
from jupiter.core.common.sub.notes.root import Note, NoteRepository
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.life_plan.sub.goals.root import Goal
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import readonly_use_case
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class GoalLoadArgs(UseCaseArgsBase):
    """GoalLoadArgs."""

    ref_id: EntityId
    allow_archived: bool


@use_case_result
class GoalLoadResult(UseCaseResultBase):
    """GoalLoadResult."""

    goal: Goal
    note: Note | None


@readonly_use_case(WorkspaceFeature.LIFE_PLAN)
class GoalLoadUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[GoalLoadArgs, GoalLoadResult]
):
    """Use case for loading a particular goal."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: GoalLoadArgs,
    ) -> GoalLoadResult:
        """Execute the command's action."""
        goal = await uow.get_for(Goal).load_by_id(
            args.ref_id, allow_archived=args.allow_archived
        )

        note = await uow.get(NoteRepository).load_optional_for_source(
            NoteDomain.GOAL, goal.ref_id, allow_archived=args.allow_archived
        )

        return GoalLoadResult(goal=goal, note=note)
