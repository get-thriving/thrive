"""The command for finding milestones."""

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
from jupiter.core.life_plan.sub.milestones.root import Milestone
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
class MilestoneFindArgs(UseCaseArgsBase):
    """MilestoneFindArgs."""

    allow_archived: bool
    include_notes: bool
    filter_ref_ids: list[EntityId] | None


@use_case_result
class MilestoneFindResultEntry(UseCaseResultBase):
    """A single milestone result."""

    milestone: Milestone
    note: Note | None


@use_case_result
class MilestoneFindResult(UseCaseResultBase):
    """MilestoneFindResult object."""

    entries: list[MilestoneFindResultEntry]


@readonly_use_case(WorkspaceFeature.LIFE_PLAN)
class MilestoneFindUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[MilestoneFindArgs, MilestoneFindResult]
):
    """The command for finding milestones."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: MilestoneFindArgs,
    ) -> MilestoneFindResult:
        """Execute the command's action."""
        workspace = context.workspace

        life_plan = await uow.get_for(LifePlan).load_by_parent(
            workspace.ref_id,
        )
        milestones = await uow.get_for(Milestone).find_all_generic(
            parent_ref_id=life_plan.ref_id,
            allow_archived=args.allow_archived,
            ref_id=args.filter_ref_ids or NoFilter(),
        )

        notes_by_milestone_ref_id: defaultdict[EntityId, Note] = defaultdict(None)
        if args.include_notes:
            note_collection = await uow.get_for(NoteCollection).load_by_parent(
                workspace.ref_id,
            )
            notes = await uow.get_for(Note).find_all_generic(
                parent_ref_id=note_collection.ref_id,
                domain=NoteDomain.MILESTONE,
                allow_archived=True,
                ref_id=[m.ref_id for m in milestones],
            )
            for note in notes:
                notes_by_milestone_ref_id[note.parent_ref_id] = note

        return MilestoneFindResult(
            entries=[
                MilestoneFindResultEntry(
                    milestone=milestone,
                    note=notes_by_milestone_ref_id.get(milestone.ref_id, None),
                )
                for milestone in milestones
            ]
        )
