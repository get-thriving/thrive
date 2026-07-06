"""Use case for creating time plan actitivities for big plans."""

from jupiter.core.app import AppCore
from jupiter.core.big_plans.root import BigPlan
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.crown_entity_support import (
    JupiterUpdateCrownEntityArgs,
    JupiterUpdateCrownEntityUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.time_plans.root import TimePlan
from jupiter.core.time_plans.sub.activity.feasability import (
    TimePlanActivityFeasability,
)
from jupiter.core.time_plans.sub.activity.kind import (
    TimePlanActivityKind,
)
from jupiter.core.time_plans.sub.activity.root import TimePlanActivity
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
class TimePlanAssociateWithBigPlansArgs(JupiterUpdateCrownEntityArgs):
    """Args."""

    ref_id: EntityId
    big_plan_ref_ids: list[EntityId]
    override_existing_dates: bool
    kind: TimePlanActivityKind
    feasability: TimePlanActivityFeasability


@use_case_result
class TimePlanAssociateWithBigPlansResult(UseCaseResultBase):
    """Result."""

    new_time_plan_activities: list[TimePlanActivity]


@mutation_use_case(
    WorkspaceFeature.TIME_PLANS, only_for_component=[AppCore.WEBUI, AppCore.API]
)
class TimePlanAssociateWithBigPlansUseCase(
    JupiterUpdateCrownEntityUseCase[
        TimePlanAssociateWithBigPlansArgs, TimePlanAssociateWithBigPlansResult
    ]
):
    """Use case for creating activities starting from big plans."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: TimePlanAssociateWithBigPlansArgs,
    ) -> TimePlanAssociateWithBigPlansResult:
        """Execute the command's actions."""
        if len(args.big_plan_ref_ids) == 0:
            raise InputValidationError("You must specifiy some big plans")

        time_plan = await self.load_entity(
            uow, context.user.ref_id, TimePlan, args.ref_id
        )

        big_plans = await self.find_all_entities(
            uow,
            context.user.ref_id,
            BigPlan,
            args.big_plan_ref_ids,
            allow_archived=False,
        )

        new_time_plan_actitivies = []

        for big_plan in big_plans:
            new_time_plan_activity = TimePlanActivity.new_activity_for_big_plan(
                context.domain_context,
                time_plan_ref_id=args.ref_id,
                big_plan_ref_id=big_plan.ref_id,
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

        return TimePlanAssociateWithBigPlansResult(
            new_time_plan_activities=new_time_plan_actitivies
        )
