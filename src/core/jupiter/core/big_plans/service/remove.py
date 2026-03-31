"""Shared module for removing a big plan."""

from jupiter.core.big_plans.root import BigPlan
from jupiter.core.big_plans.stats import BigPlanStatsRepository
from jupiter.core.big_plans.sub.milestones.root import BigPlanMilestone
from jupiter.core.common.sub.inbox_tasks.collection import (
    InboxTaskCollection,
)
from jupiter.core.common.sub.inbox_tasks.root import (
    InboxTask,
    InboxTaskRepository,
)
from jupiter.core.common.sub.inbox_tasks.source import InboxTaskSource
from jupiter.core.common.sub.notes.namespace import NoteNamespace
from jupiter.core.common.sub.notes.service.remove import (
    NoteRemoveService,
)
from jupiter.core.common.sub.tags.namespace import TagNamespace
from jupiter.core.common.sub.tags.sub.link.service.remove import TagLinkRemoveService
from jupiter.core.time_plans.sub.activity.root import (
    TimePlanActivityRespository,
)
from jupiter.core.time_plans.sub.activity.target import (
    TimePlanActivityTarget,
)
from jupiter.core.workspaces.root import Workspace
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import DomainContext
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork


class BigPlanRemoveService:
    """Shared service for removing a big plan."""

    async def remove(
        self,
        ctx: DomainContext,
        uow: DomainUnitOfWork,
        reporter: ProgressReporter,
        workspace: Workspace,
        ref_id: EntityId,
    ) -> None:
        """Hard remove a big plan."""
        big_plan = await uow.get_for(BigPlan).load_by_id(
            ref_id,
            allow_archived=True,
        )

        milestones = await uow.get_for(BigPlanMilestone).find_all_generic(
            parent_ref_id=big_plan.ref_id,
            allow_archived=True,
        )
        for milestone in milestones:
            await uow.get_for(BigPlanMilestone).remove(milestone.ref_id)

        inbox_task_collection = await uow.get_for(InboxTaskCollection).load_by_parent(
            workspace.ref_id,
        )
        inbox_tasks_to_remove = await uow.get(
            InboxTaskRepository
        ).find_all_for_source_created_desc(
            parent_ref_id=inbox_task_collection.ref_id,
            allow_archived=True,
            source=InboxTaskSource.BIG_PLAN,
            source_entity_ref_id=ref_id,
        )

        if len(inbox_tasks_to_remove) > 0:
            time_plan_activities_for_inbox_tasks = await uow.get(
                TimePlanActivityRespository
            ).find_all_generic(
                target=TimePlanActivityTarget.INBOX_TASK,
                target_ref_id=[it.ref_id for it in inbox_tasks_to_remove],
                allow_archived=True,
            )
            for time_plan_activity in time_plan_activities_for_inbox_tasks:
                await uow.get(TimePlanActivityRespository).remove(
                    time_plan_activity.ref_id
                )

        for inbox_task in inbox_tasks_to_remove:
            await uow.get_for(InboxTask).remove(inbox_task.ref_id)

        note_remove_service = NoteRemoveService()
        await note_remove_service.remove_for_source(
            ctx, uow, NoteNamespace.BIG_PLAN, big_plan.ref_id
        )

        tag_link_remove_service = TagLinkRemoveService()
        await tag_link_remove_service.remove_for_entity(
            ctx, uow, TagNamespace.BIG_PLAN, big_plan.ref_id
        )

        time_plan_activities_for_big_plan = await uow.get(
            TimePlanActivityRespository
        ).find_all_generic(
            target=TimePlanActivityTarget.BIG_PLAN,
            target_ref_id=big_plan.ref_id,
            allow_archived=True,
        )
        for time_plan_activity in time_plan_activities_for_big_plan:
            await uow.get(TimePlanActivityRespository).remove(time_plan_activity.ref_id)

        await uow.get(BigPlanStatsRepository).remove(big_plan.ref_id)

        big_plan = await uow.get_for(BigPlan).remove(ref_id)
        await reporter.mark_removed(big_plan)
