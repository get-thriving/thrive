"""Use case for finding time plans."""

from jupiter.core.app import AppCore
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.domainx.core.notes.note import Note
from jupiter.core.domainx.core.notes.note_collection import NoteCollection
from jupiter.core.domainx.core.notes.note_domain import NoteDomain
from jupiter.core.features import WorkspaceFeature
from jupiter.core.inbox_tasks.collection import (
    InboxTaskCollection,
)
from jupiter.core.inbox_tasks.root import InboxTask
from jupiter.core.inbox_tasks.source import InboxTaskSource
from jupiter.core.time_plans.domain import TimePlanDomain
from jupiter.core.time_plans.root import TimePlan
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
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
class TimePlanFindArgs(UseCaseArgsBase):
    """Args."""

    allow_archived: bool
    include_notes: bool
    include_planning_tasks: bool
    filter_ref_ids: list[EntityId] | None


@use_case_result_part
class TimePlanFindResultEntry(UseCaseResultBase):
    """Result part."""

    time_plan: TimePlan
    note: Note | None
    planning_task: InboxTask | None


@use_case_result
class TimePlanFindResult(UseCaseResultBase):
    """Result."""

    entries: list[TimePlanFindResultEntry]


@readonly_use_case(WorkspaceFeature.TIME_PLANS, only_for_component=[AppCore.WEBUI])
class TimePlanFindUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[TimePlanFindArgs, TimePlanFindResult]
):
    """The command for finding time plans."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: TimePlanFindArgs,
    ) -> TimePlanFindResult:
        """Execute the command's action."""
        workspace = context.workspace

        time_plan_domain = await uow.get_for(TimePlanDomain).load_by_parent(
            workspace.ref_id,
        )
        inbox_task_collection = await uow.get_for(InboxTaskCollection).load_by_parent(
            workspace.ref_id,
        )
        note_collection = await uow.get_for(NoteCollection).load_by_parent(
            workspace.ref_id,
        )
        time_plans = await uow.get_for(TimePlan).find_all(
            parent_ref_id=time_plan_domain.ref_id,
            allow_archived=args.allow_archived,
            filter_ref_ids=args.filter_ref_ids,
        )

        notes_by_time_plan_ref_id = {}
        if args.include_notes:
            notes = await uow.get_for(Note).find_all_generic(
                parent_ref_id=note_collection.ref_id,
                domain=NoteDomain.JOURNAL,
                allow_archived=True,
                source_entity_ref_id=[time_plan.ref_id for time_plan in time_plans],
            )
            for note in notes:
                notes_by_time_plan_ref_id[note.source_entity_ref_id] = note

        planning_tasks_by_time_plan_ref_id = {}
        if args.include_planning_tasks:
            planning_tasks = await uow.get_for(InboxTask).find_all_generic(
                parent_ref_id=inbox_task_collection.ref_id,
                source=[InboxTaskSource.TIME_PLAN],
                allow_archived=args.allow_archived,
                source_entity_ref_id=[time_plan.ref_id for time_plan in time_plans],
            )
            for planning_task in planning_tasks:
                planning_tasks_by_time_plan_ref_id[
                    planning_task.source_entity_ref_id
                ] = planning_task
        return TimePlanFindResult(
            entries=[
                TimePlanFindResultEntry(
                    time_plan=time_plan,
                    note=notes_by_time_plan_ref_id.get(time_plan.ref_id, None),
                    planning_task=planning_tasks_by_time_plan_ref_id.get(
                        time_plan.ref_id, None
                    ),
                )
                for time_plan in time_plans
            ]
        )
