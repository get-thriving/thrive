"""Use case for finding time plans."""

from jupiter.core.app import AppCore
from jupiter.core.common.sub.notes.collection import NoteCollection
from jupiter.core.common.sub.notes.namespace import NoteNamespace
from jupiter.core.common.sub.notes.root import Note
from jupiter.core.common.sub.tags.namespace import TagNamespace
from jupiter.core.common.sub.tags.root import TagDomain
from jupiter.core.common.sub.tags.sub.link.root import TagLinkRepository
from jupiter.core.common.sub.tags.sub.tag.root import Tag
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.inbox_tasks.collection import (
    InboxTaskCollection,
)
from jupiter.core.inbox_tasks.root import InboxTask
from jupiter.core.inbox_tasks.source import InboxTaskSource
from jupiter.core.time_plans.domain import TimePlanDomain
from jupiter.core.time_plans.life_plan_links import (
    TimePlanAspectLink,
    TimePlanChapterLink,
    TimePlanGoalLink,
)
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

    allow_archived: bool | None
    include_notes: bool | None
    include_planning_tasks: bool | None
    include_life_plan_ref_ids: bool | None
    include_tags: bool | None
    filter_ref_ids: list[EntityId] | None = None


@use_case_result_part
class TimePlanFindResultEntry(UseCaseResultBase):
    """Result part."""

    time_plan: TimePlan
    tags: list[Tag]
    note: Note | None
    planning_task: InboxTask | None
    chapter_ref_ids: list[EntityId] | None
    aspect_ref_ids: list[EntityId] | None
    goal_ref_ids: list[EntityId] | None


@use_case_result
class TimePlanFindResult(UseCaseResultBase):
    """Result."""

    entries: list[TimePlanFindResultEntry]


@readonly_use_case(
    WorkspaceFeature.TIME_PLANS, only_for_component=[AppCore.WEBUI, AppCore.API]
)
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
        allow_archived = args.allow_archived or False
        include_notes = args.include_notes or False
        include_planning_tasks = args.include_planning_tasks or False
        include_life_plan_ref_ids = args.include_life_plan_ref_ids or False
        include_tags = args.include_tags or False

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
            allow_archived=allow_archived,
            filter_ref_ids=args.filter_ref_ids,
        )

        chapter_ref_ids_by_time_plan_ref_id: dict[EntityId, list[EntityId]] = {}
        aspect_ref_ids_by_time_plan_ref_id: dict[EntityId, list[EntityId]] = {}
        goal_ref_ids_by_time_plan_ref_id: dict[EntityId, list[EntityId]] = {}
        if (
            include_life_plan_ref_ids
            and workspace.is_feature_available(WorkspaceFeature.LIFE_PLAN)
            and time_plans
        ):
            time_plan_ref_ids = [tp.ref_id for tp in time_plans]
            chapter_links = await uow.get_for_record(TimePlanChapterLink).find_all(
                time_plan_ref_ids
            )
            aspect_links = await uow.get_for_record(TimePlanAspectLink).find_all(
                time_plan_ref_ids
            )
            goal_links = await uow.get_for_record(TimePlanGoalLink).find_all(
                time_plan_ref_ids
            )

            for chapter_link in chapter_links:
                chapter_ref_ids_by_time_plan_ref_id.setdefault(
                    chapter_link.time_plan.ref_id, []
                ).append(chapter_link.chapter_ref_id)
            for aspect_link in aspect_links:
                aspect_ref_ids_by_time_plan_ref_id.setdefault(
                    aspect_link.time_plan.ref_id, []
                ).append(aspect_link.aspect_ref_id)
            for goal_link in goal_links:
                goal_ref_ids_by_time_plan_ref_id.setdefault(
                    goal_link.time_plan.ref_id, []
                ).append(goal_link.goal_ref_id)

        notes_by_time_plan_ref_id = {}
        if include_notes:
            notes = await uow.get_for(Note).find_all_generic(
                parent_ref_id=note_collection.ref_id,
                namespace=NoteNamespace.JOURNAL,
                allow_archived=True,
                source_entity_ref_id=[time_plan.ref_id for time_plan in time_plans],
            )
            for note in notes:
                notes_by_time_plan_ref_id[note.source_entity_ref_id] = note

        planning_tasks_by_time_plan_ref_id = {}
        if include_planning_tasks:
            planning_tasks = await uow.get_for(InboxTask).find_all_generic(
                parent_ref_id=inbox_task_collection.ref_id,
                source=[InboxTaskSource.TIME_PLAN],
                allow_archived=allow_archived,
                source_entity_ref_id=[time_plan.ref_id for time_plan in time_plans],
            )
            for planning_task in planning_tasks:
                planning_tasks_by_time_plan_ref_id[
                    planning_task.source_entity_ref_id
                ] = planning_task

        if include_tags:
            tags_domain = await uow.get_for(TagDomain).load_by_parent(workspace.ref_id)
            all_tags = await uow.get_for(Tag).find_all_generic(
                parent_ref_id=tags_domain.ref_id,
                allow_archived=False,
                namespace=TagNamespace.TIME_PLAN,
            )
            all_tags_by_ref_id = {t.ref_id: t for t in all_tags}
            tag_links = await uow.get(TagLinkRepository).find_all_generic(
                namespace=TagNamespace.TIME_PLAN,
                source_entity_ref_id=[tp.ref_id for tp in time_plans],
            )
            tag_links_by_time_plan_ref_id = {
                t.source_entity_ref_id: t for t in tag_links
            }
        else:
            all_tags_by_ref_id = {}
            tag_links_by_time_plan_ref_id = {}

        return TimePlanFindResult(
            entries=[
                TimePlanFindResultEntry(
                    time_plan=time_plan,
                    tags=(
                        [
                            all_tags_by_ref_id[rid]
                            for rid in tag_links_by_time_plan_ref_id[
                                time_plan.ref_id
                            ].ref_ids
                            if rid in all_tags_by_ref_id
                        ]
                        if time_plan.ref_id in tag_links_by_time_plan_ref_id
                        else []
                    ),
                    note=notes_by_time_plan_ref_id.get(time_plan.ref_id, None),
                    planning_task=planning_tasks_by_time_plan_ref_id.get(
                        time_plan.ref_id, None
                    ),
                    chapter_ref_ids=(
                        chapter_ref_ids_by_time_plan_ref_id.get(time_plan.ref_id, [])
                        if include_life_plan_ref_ids
                        else None
                    ),
                    aspect_ref_ids=(
                        aspect_ref_ids_by_time_plan_ref_id.get(time_plan.ref_id, [])
                        if include_life_plan_ref_ids
                        else None
                    ),
                    goal_ref_ids=(
                        goal_ref_ids_by_time_plan_ref_id.get(time_plan.ref_id, [])
                        if include_life_plan_ref_ids
                        else None
                    ),
                )
                for time_plan in time_plans
            ]
        )
