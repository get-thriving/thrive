"""The domain service which constructs a time and effort summary."""

from jupiter.core.common.difficulty import Difficulty
from jupiter.core.common.sub.inbox_tasks.collection import InboxTaskCollection
from jupiter.core.common.sub.inbox_tasks.root import InboxTask
from jupiter.core.time_plans.root import TimePlan
from jupiter.core.time_plans.sub.activity.feasability import (
    TimePlanActivityFeasability,
)
from jupiter.core.time_plans.sub.activity.target import TimePlanActivityTarget
from jupiter.core.time_plans.time_and_effort_summary import (
    PlannedTimeAndEffortSummary,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.utils.generic_loader import generic_loader


class TimeAndEffortSummarizer:
    """The domain service which constructs a time and effort summary."""

    @staticmethod
    async def compute_planned_time_and_effort_summary(
        uow: DomainUnitOfWork,
        workspace_ref_id: EntityId,
        time_plan_ref_id: EntityId,
    ) -> PlannedTimeAndEffortSummary:
        """Compute the planned time and effort summary."""
        # Load activities for the time plan
        _, activities = await generic_loader(
            uow,
            TimePlan,
            time_plan_ref_id,
            TimePlan.activities,
            allow_archived=False,
            allow_subentity_archived=False,
        )
        time_plan_activities = list(activities)

        # Load inbox tasks for activities
        inbox_task_collection = await uow.get_for(InboxTaskCollection).load_by_parent(
            workspace_ref_id
        )

        inbox_task_ref_ids = [
            activity.target_ref_id
            for activity in time_plan_activities
            if activity.target == TimePlanActivityTarget.INBOX_TASK
        ]

        target_inbox_tasks_by_ref_id: dict[EntityId, InboxTask] = {}
        if len(inbox_task_ref_ids) > 0:
            target_inbox_tasks = await uow.get_for(InboxTask).find_all(
                parent_ref_id=inbox_task_collection.ref_id,
                allow_archived=False,
                filter_ref_ids=inbox_task_ref_ids,
            )
            target_inbox_tasks_by_ref_id = {
                inbox_task.ref_id: inbox_task for inbox_task in target_inbox_tasks
            }

        # Compute summary
        total_activities = 0
        activities_by_feasability = {f: 0 for f in TimePlanActivityFeasability}
        total_score = 0
        score_by_feasability = {f: 0 for f in TimePlanActivityFeasability}
        total_hours = 0.0
        hours_by_feasability = {f: 0.0 for f in TimePlanActivityFeasability}

        for activity in time_plan_activities:
            if activity.target != TimePlanActivityTarget.INBOX_TASK:
                continue

            target_inbox_task = target_inbox_tasks_by_ref_id.get(activity.target_ref_id)
            if target_inbox_task is None:
                continue

            total_activities += 1
            activities_by_feasability[activity.feasability] += 1

            task_score = TimeAndEffortSummarizer._estimate_score_for_inbox_task(
                target_inbox_task
            )
            total_score += task_score
            score_by_feasability[activity.feasability] += task_score

            duration_hours = (
                TimeAndEffortSummarizer._infer_duration_mins_from_inbox_task(
                    target_inbox_task
                )
                / 60.0
            )
            total_hours += duration_hours
            hours_by_feasability[activity.feasability] += duration_hours

        return PlannedTimeAndEffortSummary(
            total_activities=total_activities,
            activities_by_feasability=activities_by_feasability,
            total_score=total_score,
            score_by_feasability=score_by_feasability,
            total_hours=total_hours,
            hours_by_feasability=hours_by_feasability,
        )

    @staticmethod
    def _estimate_score_for_inbox_task(inbox_task: InboxTask) -> int:
        """Estimate the score for an inbox task."""
        base_score = 0
        if inbox_task.difficulty == Difficulty.EASY:
            base_score = 1
        elif inbox_task.difficulty == Difficulty.MEDIUM:
            base_score = 2
        elif inbox_task.difficulty == Difficulty.HARD:
            base_score = 5

        key_modifier = 1 if inbox_task.is_key else 0
        return base_score + key_modifier

    @staticmethod
    def _infer_duration_mins_from_inbox_task(inbox_task: InboxTask) -> int:
        """Infer the duration in minutes from an inbox task."""
        if inbox_task.difficulty == Difficulty.EASY:
            return 15
        elif inbox_task.difficulty == Difficulty.MEDIUM:
            return 30
        elif inbox_task.difficulty == Difficulty.HARD:
            return 60
        else:
            raise Exception(f"Unknown difficulty: {inbox_task.difficulty}")
