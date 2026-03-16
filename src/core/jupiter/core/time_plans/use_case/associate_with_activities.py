"""Use case for creating time plan actitivities for already existin activities."""

from jupiter.core.app import AppCore
from jupiter.core.big_plans.root import BigPlan
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.inbox_tasks.root import InboxTask
from jupiter.core.inbox_tasks.source import InboxTaskSource
from jupiter.core.time_plans.root import TimePlan
from jupiter.core.time_plans.sub.activity.feasability import (
    TimePlanActivityFeasability,
)
from jupiter.core.time_plans.sub.activity.kind import (
    TimePlanActivityKind,
)
from jupiter.core.time_plans.sub.activity.root import (
    TimePlanActivity,
    TimePlanAlreadyAssociatedWithTargetError,
)
from jupiter.core.time_plans.sub.activity.target import (
    TimePlanActivityTarget,
)
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.errors import InputValidationError
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)
from jupiter.framework.utils.generic_creator import generic_creator


@use_case_args
class TimePlanAssociateWithActivitiesArgs(UseCaseArgsBase):
    """Args."""

    ref_id: EntityId
    other_time_plan_ref_id: EntityId
    activity_ref_ids: list[EntityId]
    kind: TimePlanActivityKind
    feasability: TimePlanActivityFeasability
    override_existing_dates: bool


@use_case_result
class TimePlanAssociateWithActivitiesResult(UseCaseResultBase):
    """Result."""

    new_time_plan_activities: list[TimePlanActivity]


@mutation_use_case(
    WorkspaceFeature.TIME_PLANS, only_for_component=[AppCore.WEBUI, AppCore.API]
)
class TimePlanAssociateWithActivitiesUseCase(
    JupiterTransactionalLoggedInMutationUseCase[
        TimePlanAssociateWithActivitiesArgs, TimePlanAssociateWithActivitiesResult
    ]
):
    """Use case for creating activities starting from already existin activities."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: TimePlanAssociateWithActivitiesArgs,
    ) -> TimePlanAssociateWithActivitiesResult:
        """Execute the command's actions."""
        if len(args.activity_ref_ids) == 0:
            raise InputValidationError("You must specifiy some activities")

        time_plan = await uow.get_for(TimePlan).load_by_id(args.ref_id)

        activities = await uow.get_for(TimePlanActivity).find_all(
            parent_ref_id=args.other_time_plan_ref_id,
            allow_archived=False,
            filter_ref_ids=args.activity_ref_ids,
        )

        new_time_plan_actitivies = []

        # First we create all the explicitly called out big plan activities.
        for activity in activities:
            if activity.target != TimePlanActivityTarget.BIG_PLAN:
                continue

            big_plan = await uow.get_for(BigPlan).load_by_id(activity.target_ref_id)

            new_time_plan_activity = TimePlanActivity.new_activity_from_existing(
                context.domain_context,
                time_plan_ref_id=args.ref_id,
                existing_activity_name=activity.name,
                existing_activity_target=activity.target,
                existing_activity_target_ref_id=big_plan.ref_id,
                existing_activity_kind=args.kind,
                existing_activity_feasability=args.feasability,
            )
            new_time_plan_activity = await generic_creator(
                uow, progress_reporter, new_time_plan_activity
            )
            new_time_plan_actitivies.append(new_time_plan_activity)

            if (
                big_plan.actionable_date is None or big_plan.due_date is None
            ) or args.override_existing_dates:
                big_plan = big_plan.change_dates_via_time_plan(
                    context.domain_context,
                    actionable_date=time_plan.start_date,
                    due_date=time_plan.end_date,
                )
                await uow.get_for(BigPlan).save(big_plan)
                await progress_reporter.mark_updated(big_plan)

        # Then we create all the inbox tasks, with their owning big plans if not already.
        # Skip inbox task activities if the target time plan does not allow them.
        if not time_plan.allows_inbox_tasks:
            return TimePlanAssociateWithActivitiesResult(
                new_time_plan_activities=new_time_plan_actitivies
            )

        for activity in activities:
            if activity.target != TimePlanActivityTarget.INBOX_TASK:
                continue

            inbox_task = await uow.get_for(InboxTask).load_by_id(activity.target_ref_id)

            new_time_plan_activity = TimePlanActivity.new_activity_from_existing(
                context.domain_context,
                time_plan_ref_id=args.ref_id,
                existing_activity_name=activity.name,
                existing_activity_target=activity.target,
                existing_activity_target_ref_id=inbox_task.ref_id,
                existing_activity_kind=args.kind,
                existing_activity_feasability=args.feasability,
            )
            new_time_plan_activity = await generic_creator(
                uow, progress_reporter, new_time_plan_activity
            )
            new_time_plan_actitivies.append(new_time_plan_activity)

            if inbox_task.allow_user_changes and (
                inbox_task.due_date is None or args.override_existing_dates
            ):
                inbox_task = inbox_task.change_due_date_via_time_plan(
                    context.domain_context, due_date=time_plan.end_date
                )
                await uow.get_for(InboxTask).save(inbox_task)
                await progress_reporter.mark_updated(inbox_task)

            if inbox_task.source == InboxTaskSource.BIG_PLAN:
                big_plan = await uow.get_for(BigPlan).load_by_id(
                    inbox_task.source_entity_ref_id_for_sure
                )

                try:
                    new_big_plan_time_plan_activity = (
                        TimePlanActivity.new_activity_for_big_plan(
                            context.domain_context,
                            time_plan_ref_id=args.ref_id,
                            big_plan_ref_id=big_plan.ref_id,
                            kind=TimePlanActivityKind.MAKE_PROGRESS,
                            feasability=TimePlanActivityFeasability.NICE_TO_HAVE,
                        )
                    )
                    new_big_plan_time_plan_activity = await generic_creator(
                        uow, progress_reporter, new_big_plan_time_plan_activity
                    )
                    new_time_plan_actitivies.append(new_big_plan_time_plan_activity)

                    if big_plan.actionable_date is None or big_plan.due_date is None:
                        big_plan = big_plan.change_dates_via_time_plan(
                            context.domain_context,
                            actionable_date=time_plan.start_date,
                            due_date=time_plan.end_date,
                        )
                        await uow.get_for(BigPlan).save(big_plan)
                        await progress_reporter.mark_updated(big_plan)
                except TimePlanAlreadyAssociatedWithTargetError:
                    # We were already working on this plan, no need to panic
                    pass

        return TimePlanAssociateWithActivitiesResult(
            new_time_plan_activities=new_time_plan_actitivies
        )
