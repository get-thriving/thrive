"""The command for creating a habit."""

from jupiter.core.common.difficulty import Difficulty
from jupiter.core.common.eisen import Eisen
from jupiter.core.common.recurring_task_due_at_day import RecurringTaskDueAtDay
from jupiter.core.common.recurring_task_due_at_month import (
    RecurringTaskDueAtMonth,
)
from jupiter.core.common.recurring_task_gen_params import RecurringTaskGenParams
from jupiter.core.common.recurring_task_period import RecurringTaskPeriod
from jupiter.core.common.recurring_task_skip_rule import RecurringTaskSkipRule
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.crown_entity_support import (
    JupiterCreateCrownEntityArgs,
    JupiterCreateCrownEntityUseCase,
)
from jupiter.core.features import (
    WorkspaceFeature,
)
from jupiter.core.gen.service.gen import GenService
from jupiter.core.habits.collection import HabitCollection
from jupiter.core.habits.name import HabitName
from jupiter.core.habits.repeats_strategy import (
    HabitRepeatsStrategy,
)
from jupiter.core.habits.root import Habit
from jupiter.core.life_plan.root import LifePlan
from jupiter.core.life_plan.sub.aspects.root import Aspect, AspectRepository
from jupiter.core.life_plan.sub.chapters.root import Chapter
from jupiter.core.life_plan.sub.goals.root import Goal
from jupiter.core.sync_target import SyncTarget
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.errors import InputValidationError
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    UnavailableForContextError,
    mutation_use_case,
)
from jupiter.framework.use_case_io import (
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class HabitCreateArgs(JupiterCreateCrownEntityArgs):
    """HabitCreate args.."""

    name: HabitName
    period: RecurringTaskPeriod
    aspect_ref_id: EntityId | None
    chapter_ref_id: EntityId | None
    goal_ref_id: EntityId | None
    is_key: bool
    eisen: Eisen
    difficulty: Difficulty
    actionable_from_day: RecurringTaskDueAtDay | None
    actionable_from_month: RecurringTaskDueAtMonth | None
    due_at_day: RecurringTaskDueAtDay | None
    due_at_month: RecurringTaskDueAtMonth | None
    skip_rule: RecurringTaskSkipRule | None
    repeats_strategy: HabitRepeatsStrategy | None
    repeats_in_period_count: int | None


@use_case_result
class HabitCreateResult(UseCaseResultBase):
    """HabitCreate result."""

    new_habit: Habit


@mutation_use_case(WorkspaceFeature.HABITS)
class HabitCreateUseCase(
    JupiterCreateCrownEntityUseCase[HabitCreateArgs, HabitCreateResult]
):
    """The command for creating a habit."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: HabitCreateArgs,
    ) -> HabitCreateResult:
        """Execute the command's action."""
        workspace = context.workspace

        if not workspace.is_feature_available(WorkspaceFeature.LIFE_PLAN):
            if args.aspect_ref_id is not None:
                raise UnavailableForContextError(WorkspaceFeature.LIFE_PLAN)
            if args.chapter_ref_id is not None:
                raise UnavailableForContextError(WorkspaceFeature.LIFE_PLAN)
            if args.goal_ref_id is not None:
                raise UnavailableForContextError(WorkspaceFeature.LIFE_PLAN)

        habit_collection = await uow.get_for(HabitCollection).load_by_parent(
            workspace.ref_id,
        )

        if args.aspect_ref_id is None:
            life_plan = await uow.get_for(LifePlan).load_by_parent(
                workspace.ref_id,
            )
            the_aspect = await uow.get(AspectRepository).load_root_aspect(
                life_plan.ref_id
            )
        else:
            the_aspect = await self.load_entity(
                uow, context.user.ref_id, Aspect, args.aspect_ref_id
            )

        if args.chapter_ref_id is not None:
            chapter = await self.load_entity(
                uow, context.user.ref_id, Chapter, args.chapter_ref_id
            )
            if chapter.aspect_ref_id != the_aspect.ref_id:
                raise InputValidationError(
                    f"Chapter does not belong to aspect '{the_aspect.name}'"
                )

        if args.goal_ref_id is not None:
            goal = await self.load_entity(
                uow, context.user.ref_id, Goal, args.goal_ref_id
            )
            if goal.aspect_ref_id != the_aspect.ref_id:
                raise InputValidationError(
                    f"Goal does not belong to aspect '{the_aspect.name}'"
                )

        new_habit = Habit.new_habit(
            ctx=context.domain_context,
            habit_collection_ref_id=habit_collection.ref_id,
            aspect_ref_id=the_aspect.ref_id,
            chapter_ref_id=args.chapter_ref_id,
            goal_ref_id=args.goal_ref_id,
            name=args.name,
            is_key=args.is_key,
            gen_params=RecurringTaskGenParams(
                period=args.period,
                eisen=args.eisen,
                difficulty=args.difficulty,
                actionable_from_day=args.actionable_from_day,
                actionable_from_month=args.actionable_from_month,
                due_at_day=args.due_at_day,
                due_at_month=args.due_at_month,
                skip_rule=args.skip_rule,
            ),
            suspended=False,
            repeats_strategy=args.repeats_strategy,
            repeats_in_period_count=args.repeats_in_period_count,
        )
        new_habit = await self.create_entity(
            context.domain_context,
            uow,
            progress_reporter,
            context.user.ref_id,
            new_habit,
        )

        return HabitCreateResult(new_habit=new_habit)

    async def _perform_post_transactional_mutation_work(
        self,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: HabitCreateArgs,
        result: HabitCreateResult,
    ) -> None:
        """Execute the command's post-mutation work."""
        await GenService(self._ports.domain_storage_engine).do_it(
            context.domain_context,
            progress_reporter=progress_reporter,
            user=context.user,
            workspace=context.workspace,
            gen_even_if_not_modified=False,
            today=self._time_provider.get_current_date(),
            gen_targets=[SyncTarget.HABITS],
            period=[args.period],
            filter_habit_ref_ids=[result.new_habit.ref_id],
        )
