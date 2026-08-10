"""Use case for creating time plan activities for inbox tasks."""

from jupiter.core.app import AppCore
from jupiter.core.big_plans.root import BigPlan
from jupiter.core.common.sub.access.access_level import AccessLevel
from jupiter.core.common.sub.access.sub.status.root import (
    UserNotAllowedAccessToEntityError,
)
from jupiter.core.common.sub.access.sub.status.service.check_for_acl import (
    CheckForAclService,
)
from jupiter.core.common.sub.access.sub.status.service.check_owner_link_for_acl import (
    CheckOwnerLinkForAclService,
)
from jupiter.core.common.sub.inbox_tasks.root import (
    ALLOWED_INBOX_TASK_OWNER_TYPES,
    InboxTask,
)
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.crown_entity_support import (
    JupiterCreateCrownEntityArgs,
    JupiterCreateCrownEntityUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.named_entity_tag import NamedEntityTag
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
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.errors import InputValidationError
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import (
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class TimePlanAssociateInboxTaskWithPlanArgs(JupiterCreateCrownEntityArgs):
    """Args."""

    inbox_task_ref_id: EntityId
    time_plan_ref_ids: list[EntityId]
    kind: TimePlanActivityKind
    feasability: TimePlanActivityFeasability


@use_case_result
class TimePlanAssociateInboxTaskWithPlanResult(UseCaseResultBase):
    """Result."""

    new_time_plan_activities: list[TimePlanActivity]


@mutation_use_case(
    WorkspaceFeature.TIME_PLANS, only_for_component=[AppCore.WEBUI, AppCore.API]
)
class TimePlanAssociateInboxTaskWithPlanUseCase(
    JupiterCreateCrownEntityUseCase[
        TimePlanAssociateInboxTaskWithPlanArgs, TimePlanAssociateInboxTaskWithPlanResult
    ]
):
    """Use case for creating activities starting from an inbox task."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: TimePlanAssociateInboxTaskWithPlanArgs,
    ) -> TimePlanAssociateInboxTaskWithPlanResult:
        """Execute the command's actions."""
        if len(args.time_plan_ref_ids) == 0:
            raise InputValidationError("You must specify some time plans")

        workspace = context.workspace

        inbox_task = await uow.get_for(InboxTask).load_by_id(
            args.inbox_task_ref_id, allow_archived=False
        )
        owner_acl = CheckOwnerLinkForAclService(self._concept_registry)
        await owner_acl.do_it(
            uow,
            inbox_task.owner,
            context.user.ref_id,
            workspace.ref_id,
            AccessLevel.READER,
            ALLOWED_INBOX_TASK_OWNER_TYPES,
        )

        big_plan = None
        if inbox_task.owner.the_type == NamedEntityTag.BIG_PLAN.value:
            await CheckForAclService().do_it(
                uow,
                BigPlan,
                inbox_task.owner.ref_id,
                context.user.ref_id,
                AccessLevel.READER,
            )
            big_plan = await uow.get_for(BigPlan).load_by_id(
                inbox_task.owner.ref_id, allow_archived=False
            )

        time_plans = await self.find_all_entities(
            uow,
            context.user.ref_id,
            TimePlan,
            args.time_plan_ref_ids,
            allow_archived=False,
        )

        for time_plan in time_plans:
            if not time_plan.allows_inbox_tasks:
                raise InputValidationError(
                    f"Time plan {time_plan.name} does not allow inbox task activities"
                )

        latest_time_plan = max(time_plans, key=lambda x: x.end_date)

        new_time_plan_activities = []

        for time_plan in time_plans:
            try:
                new_time_plan_activity = TimePlanActivity.new_activity_for_inbox_task(
                    context.domain_context,
                    time_plan_ref_id=time_plan.ref_id,
                    inbox_task_ref_id=inbox_task.ref_id,
                    kind=args.kind,
                    feasability=args.feasability,
                )
                new_time_plan_activity = await self.create_entity(
                    context.domain_context,
                    uow,
                    progress_reporter,
                    context.user.ref_id,
                    new_time_plan_activity,
                )
                new_time_plan_activities.append(new_time_plan_activity)
            except TimePlanAlreadyAssociatedWithTargetError:
                # We were already working on this plan, no need to panic
                pass

            if inbox_task.allow_user_changes and inbox_task.due_date is None:
                try:
                    await owner_acl.do_it(
                        uow,
                        inbox_task.owner,
                        context.user.ref_id,
                        workspace.ref_id,
                        AccessLevel.WRITER,
                        ALLOWED_INBOX_TASK_OWNER_TYPES,
                    )
                except UserNotAllowedAccessToEntityError:
                    pass
                else:
                    inbox_task = inbox_task.change_due_date_via_time_plan(
                        context.domain_context, due_date=latest_time_plan.end_date
                    )
                    await uow.get_for(InboxTask).save(inbox_task)

            if big_plan is not None:
                try:
                    new_time_plan_activity = TimePlanActivity.new_activity_for_big_plan(
                        context.domain_context,
                        time_plan_ref_id=time_plan.ref_id,
                        big_plan_ref_id=big_plan.ref_id,
                        kind=TimePlanActivityKind.MAKE_PROGRESS,
                        feasability=TimePlanActivityFeasability.NICE_TO_HAVE,
                    )
                    new_time_plan_activity = await self.create_entity(
                        context.domain_context,
                        uow,
                        progress_reporter,
                        context.user.ref_id,
                        new_time_plan_activity,
                    )
                    new_time_plan_activities.append(new_time_plan_activity)
                except TimePlanAlreadyAssociatedWithTargetError:
                    # We were already working on this plan, no need to panic
                    pass

                if big_plan.actionable_date is None or big_plan.due_date is None:
                    try:
                        await CheckForAclService().do_it(
                            uow,
                            BigPlan,
                            big_plan.ref_id,
                            context.user.ref_id,
                            AccessLevel.WRITER,
                        )
                    except UserNotAllowedAccessToEntityError:
                        pass
                    else:
                        big_plan = big_plan.change_dates_via_time_plan(
                            context.domain_context,
                            actionable_date=latest_time_plan.start_date,
                            due_date=latest_time_plan.end_date,
                        )
                        await uow.get_for(BigPlan).save(big_plan)
                        await progress_reporter.mark_updated(big_plan)

        return TimePlanAssociateInboxTaskWithPlanResult(
            new_time_plan_activities=new_time_plan_activities
        )
