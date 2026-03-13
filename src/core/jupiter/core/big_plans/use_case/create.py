"""The command for creating a big plan."""

from jupiter.core.big_plans.collection import BigPlanCollection
from jupiter.core.big_plans.name import BigPlanName
from jupiter.core.big_plans.root import BigPlan
from jupiter.core.big_plans.stats import BigPlanStats, BigPlanStatsRepository
from jupiter.core.big_plans.status import BigPlanStatus
from jupiter.core.common.difficulty import Difficulty
from jupiter.core.common.eisen import Eisen
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.features import (
    WorkspaceFeature,
)
from jupiter.core.life_plan.root import LifePlan
from jupiter.core.life_plan.sub.aspects.root import Aspect, AspectRepository
from jupiter.core.life_plan.sub.chapters.root import Chapter
from jupiter.core.life_plan.sub.goals.root import Goal
from jupiter.core.time_plans.root import TimePlan
from jupiter.core.time_plans.sub.activity.feasability import (
    TimePlanActivityFeasability,
)
from jupiter.core.time_plans.sub.activity.kind import (
    TimePlanActivityKind,
)
from jupiter.core.time_plans.sub.activity.root import TimePlanActivity
from jupiter.framework.base.adate import ADate
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.errors import InputValidationError
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    UnavailableForContextError,
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
class BigPlanCreateArgs(UseCaseArgsBase):
    """Big plan create args."""

    name: BigPlanName
    time_plan_ref_id: EntityId | None
    time_plan_activity_kind: TimePlanActivityKind | None
    time_plan_activity_feasability: TimePlanActivityFeasability | None
    is_key: bool
    eisen: Eisen
    difficulty: Difficulty
    aspect_ref_id: EntityId | None
    chapter_ref_id: EntityId | None
    goal_ref_id: EntityId | None
    actionable_date: ADate | None
    due_date: ADate | None


@use_case_result
class BigPlanCreateResult(UseCaseResultBase):
    """Big plan create result."""

    new_big_plan: BigPlan
    new_time_plan_activity: TimePlanActivity | None


@mutation_use_case(WorkspaceFeature.BIG_PLANS)
class BigPlanCreateUseCase(
    JupiterTransactionalLoggedInMutationUseCase[BigPlanCreateArgs, BigPlanCreateResult]
):
    """The command for creating a big plan."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: BigPlanCreateArgs,
    ) -> BigPlanCreateResult:
        """Execute the command's action."""
        workspace = context.workspace

        if not workspace.is_feature_available(WorkspaceFeature.LIFE_PLAN):
            if args.aspect_ref_id is not None:
                raise UnavailableForContextError(WorkspaceFeature.LIFE_PLAN)
            if args.chapter_ref_id is not None:
                raise UnavailableForContextError(WorkspaceFeature.LIFE_PLAN)
            if args.goal_ref_id is not None:
                raise UnavailableForContextError(WorkspaceFeature.LIFE_PLAN)

        time_plan: TimePlan | None = None
        if args.time_plan_ref_id:
            time_plan = await uow.get_for(TimePlan).load_by_id(args.time_plan_ref_id)

        if args.aspect_ref_id is None:
            life_plan = await uow.get_for(LifePlan).load_by_parent(
                workspace.ref_id,
            )
            the_aspect = await uow.get(AspectRepository).load_root_aspect(
                life_plan.ref_id
            )
        else:
            the_aspect = await uow.get_for(Aspect).load_by_id(args.aspect_ref_id)

        if args.chapter_ref_id is not None:
            chapter = await uow.get_for(Chapter).load_by_id(args.chapter_ref_id)
            if chapter.aspect_ref_id != the_aspect.ref_id:
                raise InputValidationError(
                    f"Chapter does not belong to aspect '{the_aspect.name}'"
                )

        if args.goal_ref_id is not None:
            goal = await uow.get_for(Goal).load_by_id(args.goal_ref_id)
            if goal.aspect_ref_id != the_aspect.ref_id:
                raise InputValidationError(
                    f"Goal does not belong to aspect '{the_aspect.name}'"
                )

        big_plan_collection = await uow.get_for(BigPlanCollection).load_by_parent(
            workspace.ref_id,
        )

        new_big_plan = BigPlan.new_big_plan(
            context.domain_context,
            big_plan_collection_ref_id=big_plan_collection.ref_id,
            aspect_ref_id=the_aspect.ref_id,
            chapter_ref_id=args.chapter_ref_id,
            goal_ref_id=args.goal_ref_id,
            name=args.name,
            status=BigPlanStatus.NOT_STARTED,
            is_key=args.is_key,
            eisen=args.eisen,
            difficulty=args.difficulty,
            actionable_date=args.actionable_date,
            due_date=args.due_date,
        )
        new_big_plan = await generic_creator(uow, progress_reporter, new_big_plan)

        new_big_plan_stats = BigPlanStats.new_stats(
            context.domain_context,
            big_plan_ref_id=new_big_plan.ref_id,
        )
        new_big_plan_stats = await uow.get(BigPlanStatsRepository).create(
            new_big_plan_stats
        )

        new_time_plan_activity = None
        if time_plan:
            time_plan_activity_kind = args.time_plan_activity_kind
            time_plan_activity_feasability = args.time_plan_activity_feasability
            if not time_plan_activity_kind:
                raise InputValidationError("An activity kind is required")
            if not time_plan_activity_feasability:
                raise InputValidationError("An activity feasability is required")

            new_time_plan_activity = TimePlanActivity.new_activity_for_big_plan(
                context.domain_context,
                time_plan_ref_id=time_plan.ref_id,
                big_plan_ref_id=new_big_plan.ref_id,
                kind=time_plan_activity_kind,
                feasability=time_plan_activity_feasability,
            )
            new_time_plan_activity = await generic_creator(
                uow, progress_reporter, new_time_plan_activity
            )

        return BigPlanCreateResult(
            new_big_plan=new_big_plan, new_time_plan_activity=new_time_plan_activity
        )
