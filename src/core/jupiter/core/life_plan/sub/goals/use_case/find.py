"""The command for finding goals."""

from collections import defaultdict

from jupiter.core.common.sub.notes.collection import NoteCollection
from jupiter.core.common.sub.notes.domain import NoteDomain
from jupiter.core.common.sub.notes.root import Note
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.life_plan.root import LifePlan
from jupiter.core.life_plan.sub.goals.root import Goal
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.entity import NoFilter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import readonly_use_case
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class GoalFindArgs(UseCaseArgsBase):
    """GoalFindArgs."""

    allow_archived: bool
    include_notes: bool
    filter_ref_ids: list[EntityId] | None


@use_case_result
class GoalFindResultEntry(UseCaseResultBase):
    """A single goal result."""

    goal: Goal
    note: Note | None


@use_case_result
class GoalFindResult(UseCaseResultBase):
    """GoalFindResult object."""

    entries: list[GoalFindResultEntry]


@readonly_use_case(WorkspaceFeature.LIFE_PLAN)
class GoalFindUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[GoalFindArgs, GoalFindResult]
):
    """The command for finding goals."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: GoalFindArgs,
    ) -> GoalFindResult:
        """Execute the command's action."""
        workspace = context.workspace

        life_plan = await uow.get_for(LifePlan).load_by_parent(
            workspace.ref_id,
        )
        goals = await uow.get_for(Goal).find_all_generic(
            parent_ref_id=life_plan.ref_id,
            allow_archived=args.allow_archived,
            ref_id=args.filter_ref_ids or NoFilter(),
        )

        notes_by_goal_ref_id: defaultdict[EntityId, Note] = defaultdict(None)
        if args.include_notes:
            note_collection = await uow.get_for(NoteCollection).load_by_parent(
                workspace.ref_id,
            )
            notes = await uow.get_for(Note).find_all_generic(
                parent_ref_id=note_collection.ref_id,
                domain=NoteDomain.GOAL,
                allow_archived=True,
                ref_id=[g.ref_id for g in goals],
            )
            for note in notes:
                notes_by_goal_ref_id[note.parent_ref_id] = note

        return GoalFindResult(
            entries=[
                GoalFindResultEntry(
                    goal=goal,
                    note=notes_by_goal_ref_id.get(goal.ref_id, None),
                )
                for goal in goals
            ]
        )
