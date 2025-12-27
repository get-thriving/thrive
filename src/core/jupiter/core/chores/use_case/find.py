"""The command for finding a chore."""

from collections import defaultdict

from jupiter.core.chores.collection import ChoreCollection
from jupiter.core.chores.root import Chore
from jupiter.core.common.sub.notes.collection import NoteCollection
from jupiter.core.common.sub.notes.domain import NoteDomain
from jupiter.core.common.sub.notes.root import Note
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.features import (
    WorkspaceFeature,
)
from jupiter.core.inbox_tasks.collection import (
    InboxTaskCollection,
)
from jupiter.core.inbox_tasks.root import InboxTask
from jupiter.core.inbox_tasks.source import InboxTaskSource
from jupiter.core.life_plan.root import LifePlan
from jupiter.core.life_plan.sub.aspects.root import Project
from jupiter.core.life_plan.sub.chapters.root import Chapter
from jupiter.core.life_plan.sub.goals.root import Goal
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.entity import NoFilter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    UnavailableForContextError,
    readonly_use_case,
)
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
    use_case_result_part,
)


@use_case_args
class ChoreFindArgs(UseCaseArgsBase):
    """PersonFindArgs."""

    allow_archived: bool
    include_life_plan: bool
    include_inbox_tasks: bool
    include_notes: bool
    filter_ref_ids: list[EntityId] | None
    filter_project_ref_ids: list[EntityId] | None


@use_case_result_part
class ChoreFindResultEntry(UseCaseResultBase):
    """A single entry in the load all chores response."""

    chore: Chore
    note: Note | None
    project: Project | None
    chapter: Chapter | None
    goal: Goal | None
    inbox_tasks: list[InboxTask] | None


@use_case_result
class ChoreFindResult(UseCaseResultBase):
    """The result."""

    entries: list[ChoreFindResultEntry]


@readonly_use_case(WorkspaceFeature.CHORES)
class ChoreFindUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[ChoreFindArgs, ChoreFindResult]
):
    """The command for finding a chore."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: ChoreFindArgs,
    ) -> ChoreFindResult:
        """Execute the command's action."""
        workspace = context.workspace

        if (
            not workspace.is_feature_available(WorkspaceFeature.LIFE_PLAN)
            and args.filter_project_ref_ids is not None
        ):
            raise UnavailableForContextError(WorkspaceFeature.LIFE_PLAN)

        life_plan = await uow.get_for(LifePlan).load_by_parent(
            workspace.ref_id,
        )

        if args.include_life_plan:
            projects = await uow.get_for(Project).find_all_generic(
                parent_ref_id=life_plan.ref_id,
                allow_archived=args.allow_archived,
                ref_id=args.filter_project_ref_ids or NoFilter(),
            )
            project_by_ref_id = {p.ref_id: p for p in projects}
            chapters = await uow.get_for(Chapter).find_all_generic(
                parent_ref_id=life_plan.ref_id,
                allow_archived=args.allow_archived,
                ref_id=NoFilter(),
            )
            chapter_by_ref_id = {c.ref_id: c for c in chapters}
            goals = await uow.get_for(Goal).find_all_generic(
                parent_ref_id=life_plan.ref_id,
                allow_archived=args.allow_archived,
                ref_id=NoFilter(),
            )
            goal_by_ref_id = {g.ref_id: g for g in goals}
        else:
            project_by_ref_id = None
            chapter_by_ref_id = None
            goal_by_ref_id = None

        inbox_task_collection = await uow.get_for(InboxTaskCollection).load_by_parent(
            workspace.ref_id,
        )
        chore_collection = await uow.get_for(ChoreCollection).load_by_parent(
            workspace.ref_id,
        )

        chores = await uow.get_for(Chore).find_all_generic(
            parent_ref_id=chore_collection.ref_id,
            allow_archived=args.allow_archived,
            ref_id=args.filter_ref_ids or NoFilter(),
            project_ref_id=args.filter_project_ref_ids or NoFilter(),
        )

        if args.include_inbox_tasks:
            inbox_tasks = await uow.get_for(InboxTask).find_all_generic(
                parent_ref_id=inbox_task_collection.ref_id,
                allow_archived=True,
                soure=InboxTaskSource.CHORE,
                source_entity_ref_id=[bp.ref_id for bp in chores],
            )
        else:
            inbox_tasks = None

        notes_by_chore_ref_id: defaultdict[EntityId, Note] = defaultdict(None)
        if args.include_notes:
            note_collection = await uow.get_for(NoteCollection).load_by_parent(
                workspace.ref_id
            )
            notes = await uow.get_for(Note).find_all_generic(
                parent_ref_id=note_collection.ref_id,
                source=NoteDomain.CHORE,
                allow_archived=True,
                source_entity_ref_id=[chore.ref_id for chore in chores],
            )
            for note in notes:
                notes_by_chore_ref_id[note.source_entity_ref_id] = note

        return ChoreFindResult(
            entries=[
                ChoreFindResultEntry(
                    chore=rt,
                    chapter=(
                        chapter_by_ref_id[rt.chapter_ref_id]
                        if rt.chapter_ref_id and chapter_by_ref_id is not None
                        else None
                    ),
                    goal=(
                        goal_by_ref_id[rt.goal_ref_id]
                        if rt.goal_ref_id and goal_by_ref_id is not None
                        else None
                    ),
                    project=(
                        project_by_ref_id[rt.project_ref_id]
                        if project_by_ref_id is not None
                        else None
                    ),
                    inbox_tasks=(
                        [
                            it
                            for it in inbox_tasks
                            if it.source_entity_ref_id_for_sure == rt.ref_id
                        ]
                        if inbox_tasks is not None
                        else None
                    ),
                    note=notes_by_chore_ref_id.get(rt.ref_id, None),
                )
                for rt in chores
            ],
        )
