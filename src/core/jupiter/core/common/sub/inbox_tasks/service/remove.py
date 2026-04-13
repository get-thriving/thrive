"""Shared service for removing an inbox task."""

from jupiter.core.big_plans.stats import BigPlanStatsRepository
from jupiter.core.common.sub.inbox_tasks.namespace import InboxTaskNamespace
from jupiter.core.common.sub.inbox_tasks.root import InboxTask
from jupiter.core.time_plans.sub.activity.root import (
    TimePlanActivityRespository,
)
from jupiter.core.time_plans.sub.activity.target import (
    TimePlanActivityTarget,
)
from jupiter.framework.context import DomainContext
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork


class InboxTaskRemoveService:
    """Shared service for removing an inbox task."""

    async def do_it(
        self,
        ctx: DomainContext,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        inbox_task: InboxTask,
    ) -> None:
        """Execute the service's action."""
        # Remove time plan activities that are associated with the inbox task.
        # These are entities that just represent the link between a time plan
        # and the inbox task. So they have to go!
        time_plan_activities = await uow.get(
            TimePlanActivityRespository
        ).find_all_generic(
            target=TimePlanActivityTarget.INBOX_TASK,
            target_ref_id=inbox_task.ref_id,
            allow_archived=True,
        )
        for time_plan_activity in time_plan_activities:
            await uow.get(TimePlanActivityRespository).remove(
                ctx,
                time_plan_activity.ref_id,
            )

        await uow.get_for(InboxTask).remove(ctx, inbox_task.ref_id)

        if inbox_task.namespace == InboxTaskNamespace.BIG_PLAN:
            await uow.get(BigPlanStatsRepository).mark_remove_inbox_task(
                inbox_task.source_entity_ref_id,
                inbox_task.is_completed,
            )
