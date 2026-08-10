"""Use case for creating time plan actitivities for inbox tasks."""

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
    JupiterUpdateCrownEntityArgs,
    JupiterUpdateCrownEntityUseCase,
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
from jupiter.framework.storage.repository import DomainUnitOfWork, EntityNotFoundError
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import (
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class TimePlanAssociateWithInboxTasksArgs(JupiterUpdateCrownEntityArgs):
    """Args."""

    ref_id: EntityId
    inbox_task_ref_ids: list[EntityId]
    override_existing_dates: bool
    kind: TimePlanActivityKind
    feasability: TimePlanActivityFeasability


@use_case_result
class TimePlanAssociateWithInboxTasksResult(UseCaseResultBase):
    """Result."""

    new_time_plan_activities: list[TimePlanActivity]


@mutation_use_case(
    WorkspaceFeature.TIME_PLANS, only_for_component=[AppCore.WEBUI, AppCore.API]
)
class TimePlanAssociateWithInboxTasksUseCase(
    JupiterUpdateCrownEntityUseCase[
        TimePlanAssociateWithInboxTasksArgs, TimePlanAssociateWithInboxTasksResult
    ]
):
    """Use case for creating activities starting from inbox tasks."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: TimePlanAssociateWithInboxTasksArgs,
    ) -> TimePlanAssociateWithInboxTasksResult:
        """Execute the command's actions."""
        if len(args.inbox_task_ref_ids) == 0:
            raise InputValidationError("You must specifiy some inbox tasks")

        workspace = context.workspace

        time_plan = await self.load_entity(
            uow, context.user.ref_id, TimePlan, args.ref_id
        )

        if not time_plan.allows_inbox_tasks:
            raise InputValidationError(
                "This time plan does not allow inbox task activities"
            )

        inbox_tasks = await uow.get_for(InboxTask).find_all_generic(
            parent_ref_id=None,
            allow_archived=False,
            ref_id=args.inbox_task_ref_ids,
        )
        found_ref_ids = {it.ref_id for it in inbox_tasks}
        for ref_id in args.inbox_task_ref_ids:
            if ref_id not in found_ref_ids:
                raise EntityNotFoundError(f"InboxTask {ref_id} does not exist")

        owner_acl = CheckOwnerLinkForAclService(self._concept_registry)
        for inbox_task in inbox_tasks:
            await owner_acl.do_it(
                uow,
                inbox_task.owner,
                context.user.ref_id,
                workspace.ref_id,
                AccessLevel.READER,
                ALLOWED_INBOX_TASK_OWNER_TYPES,
            )

        big_plan_ref_ids = list(
            {
                it.owner.ref_id
                for it in inbox_tasks
                if it.owner.the_type == NamedEntityTag.BIG_PLAN.value
            }
        )
        big_plans = []
        if len(big_plan_ref_ids) > 0:
            await CheckForAclService().do_it_for_many(
                uow,
                BigPlan,
                big_plan_ref_ids,
                context.user.ref_id,
                AccessLevel.READER,
                allow_archived=False,
            )
            big_plans = await uow.get_for(BigPlan).find_all_generic(
                parent_ref_id=None,
                allow_archived=False,
                ref_id=big_plan_ref_ids,
            )

        new_time_plan_actitivies = []

        for inbox_task in inbox_tasks:
            new_time_plan_activity = TimePlanActivity.new_activity_for_inbox_task(
                context.domain_context,
                time_plan_ref_id=args.ref_id,
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
            new_time_plan_actitivies.append(new_time_plan_activity)

            if inbox_task.allow_user_changes and (
                inbox_task.due_date is None or args.override_existing_dates
            ):
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
                        context.domain_context, due_date=time_plan.end_date
                    )
                    await uow.get_for(InboxTask).save(inbox_task)

        for big_plan in big_plans:
            try:
                new_time_plan_activity = TimePlanActivity.new_activity_for_big_plan(
                    context.domain_context,
                    time_plan_ref_id=args.ref_id,
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

                new_time_plan_actitivies.append(new_time_plan_activity)

                if big_plan.actionable_date is None or big_plan.due_date is None:
                    try:
                        await CheckForAclService().do_it(
                            uow,
                            BigPlan,
                            big_plan.ref_id,
                            context.user.ref_id,
                            AccessLevel.WRITER,
                            allow_archived=False,
                        )
                    except UserNotAllowedAccessToEntityError:
                        pass
                    else:
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

        return TimePlanAssociateWithInboxTasksResult(
            new_time_plan_activities=new_time_plan_actitivies
        )
