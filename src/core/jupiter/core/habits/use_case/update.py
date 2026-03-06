"""The command for updating a habit."""

from typing import Sequence, cast

from jupiter.core.common import schedules
from jupiter.core.common.difficulty import Difficulty
from jupiter.core.common.eisen import Eisen
from jupiter.core.common.recurring_task_due_at_day import RecurringTaskDueAtDay
from jupiter.core.common.recurring_task_due_at_month import (
    RecurringTaskDueAtMonth,
)
from jupiter.core.common.recurring_task_gen_params import RecurringTaskGenParams
from jupiter.core.common.recurring_task_period import RecurringTaskPeriod
from jupiter.core.common.recurring_task_skip_rule import RecurringTaskSkipRule
from jupiter.core.common.sub.tasks.domain import TaskDomain
from jupiter.core.common.sub.tasks.namespace import TaskNamespace
from jupiter.core.common.sub.tasks.root import Task, TaskRepository
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.gen.service.gen import GenService
from jupiter.core.habits.name import HabitName
from jupiter.core.habits.repeats_strategy import (
    HabitRepeatsStrategy,
)
from jupiter.core.habits.root import Habit
from jupiter.core.habits.service.streak_recorder import (
    HabitStreakRecorderService,
)
from jupiter.core.life_plan.sub.aspects.root import Project
from jupiter.core.life_plan.sub.chapters.root import Chapter
from jupiter.core.life_plan.sub.goals.root import Goal
from jupiter.core.sync_target import SyncTarget
from jupiter.framework.base.adate import ADate
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.timestamp import Timestamp
from jupiter.framework.errors import InputValidationError
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.update_action import UpdateAction
from jupiter.framework.use_case import (
    UnavailableForContextError,
    mutation_use_case,
)
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class HabitUpdateArgs(UseCaseArgsBase):
    """PersonFindArgs."""

    ref_id: EntityId
    name: UpdateAction[HabitName]
    project_ref_id: UpdateAction[EntityId]
    chapter_ref_id: UpdateAction[EntityId | None]
    goal_ref_id: UpdateAction[EntityId | None]
    is_key: UpdateAction[bool]
    period: UpdateAction[RecurringTaskPeriod]
    eisen: UpdateAction[Eisen]
    difficulty: UpdateAction[Difficulty]
    actionable_from_day: UpdateAction[RecurringTaskDueAtDay | None]
    actionable_from_month: UpdateAction[RecurringTaskDueAtMonth | None]
    due_at_day: UpdateAction[RecurringTaskDueAtDay | None]
    due_at_month: UpdateAction[RecurringTaskDueAtMonth | None]
    skip_rule: UpdateAction[RecurringTaskSkipRule | None]
    repeats_strategy: UpdateAction[HabitRepeatsStrategy | None]
    repeats_in_period_count: UpdateAction[int | None]


@mutation_use_case(WorkspaceFeature.HABITS)
class HabitUpdateUseCase(
    JupiterTransactionalLoggedInMutationUseCase[HabitUpdateArgs, None]
):
    """The command for updating a habit."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: HabitUpdateArgs,
    ) -> None:
        """Execute the command's action."""
        workspace = context.workspace

        habit = await uow.get_for(Habit).load_by_id(args.ref_id)
        initial_period = habit.gen_params.period

        if not workspace.is_feature_available(WorkspaceFeature.LIFE_PLAN):
            if (
                args.project_ref_id.should_change
                and args.project_ref_id.just_the_value is not None
            ):
                raise UnavailableForContextError(WorkspaceFeature.LIFE_PLAN)
            if (
                args.chapter_ref_id.should_change
                and args.chapter_ref_id.just_the_value is not None
            ):
                raise UnavailableForContextError(WorkspaceFeature.LIFE_PLAN)
            if (
                args.goal_ref_id.should_change
                and args.goal_ref_id.just_the_value is not None
            ):
                raise UnavailableForContextError(WorkspaceFeature.LIFE_PLAN)

        need_to_change_tasks = (
            args.name.should_change
            or args.project_ref_id.should_change
            or args.chapter_ref_id.should_change
            or args.goal_ref_id.should_change
            or args.period.should_change
            or args.eisen.should_change
            or args.difficulty.should_change
            or args.actionable_from_day.should_change
            or args.actionable_from_month.should_change
            or args.due_at_day.should_change
            or args.due_at_month.should_change
            or args.repeats_strategy.should_change
            or args.repeats_in_period_count.should_change
        )

        if (
            args.period.should_change
            or args.eisen.should_change
            or args.difficulty.should_change
            or args.actionable_from_day.should_change
            or args.actionable_from_month.should_change
            or args.due_at_day.should_change
            or args.due_at_month.should_change
            or args.skip_rule.should_change
        ):
            need_to_change_tasks = True
            habit_gen_params = UpdateAction.change_to(
                RecurringTaskGenParams(
                    args.period.or_else(habit.gen_params.period),
                    args.eisen.or_else(habit.gen_params.eisen),
                    args.difficulty.or_else(habit.gen_params.difficulty),
                    args.actionable_from_day.or_else(
                        habit.gen_params.actionable_from_day,
                    ),
                    args.actionable_from_month.or_else(
                        habit.gen_params.actionable_from_month,
                    ),
                    args.due_at_day.or_else(habit.gen_params.due_at_day),
                    args.due_at_month.or_else(habit.gen_params.due_at_month),
                    args.skip_rule.or_else(habit.gen_params.skip_rule),
                ),
            )
        else:
            habit_gen_params = UpdateAction.do_nothing()

        if (
            args.project_ref_id.should_change
            or args.chapter_ref_id.should_change
            or args.goal_ref_id.should_change
        ):
            project = await uow.get_for(Project).load_by_id(
                args.project_ref_id.or_else(habit.project_ref_id)
            )
            chapter_ref_id = args.chapter_ref_id.or_else(habit.chapter_ref_id)
            goal_ref_id = args.goal_ref_id.or_else(habit.goal_ref_id)
            if chapter_ref_id and chapter_ref_id != habit.chapter_ref_id:
                chapter = await uow.get_for(Chapter).load_by_id(chapter_ref_id)
                if chapter.project_ref_id != project.ref_id:
                    raise InputValidationError(
                        f"Chapter does not belong to project '{project.name}'"
                    )
            if goal_ref_id and goal_ref_id != habit.goal_ref_id:
                goal = await uow.get_for(Goal).load_by_id(goal_ref_id)
                if goal.project_ref_id != project.ref_id:
                    raise InputValidationError(
                        f"Goal does not belong to project '{project.name}'"
                    )

        habit = habit.update(
            ctx=context.domain_context,
            project_ref_id=args.project_ref_id,
            chapter_ref_id=args.chapter_ref_id,
            goal_ref_id=args.goal_ref_id,
            name=args.name,
            is_key=args.is_key,
            gen_params=habit_gen_params,
            repeats_strategy=args.repeats_strategy,
            repeats_in_period_count=args.repeats_in_period_count,
        )

        await uow.get_for(Habit).save(habit)
        await progress_reporter.mark_updated(habit)

        project = await uow.get_for(Project).load_by_id(habit.project_ref_id)

        if habit.gen_params.period != initial_period:
            habit_streak_recorder_service = HabitStreakRecorderService()
            await habit_streak_recorder_service.remove_all(
                ctx=context.domain_context,
                uow=uow,
                habit=habit,
                today=self._time_provider.get_current_date(),
                alternative_period=initial_period,
            )

        if need_to_change_tasks:
            task_domain = await uow.get_for(TaskDomain).load_by_parent(
                workspace.ref_id,
            )
            all_tasks = await uow.get(
                TaskRepository
            ).find_all_for_source_created_desc(
                parent_ref_id=task_domain.ref_id,
                allow_archived=True,
                namespace=TaskNamespace.HABIT,
                source_entity_ref_id=habit.ref_id,
            )

            for task in all_tasks:
                schedule = schedules.get_schedule(
                    habit.gen_params.period,
                    habit.name,
                    cast(Timestamp, task.recurring_gen_right_now),
                    habit.gen_params.skip_rule,
                    habit.gen_params.actionable_from_day,
                    habit.gen_params.actionable_from_month,
                    habit.gen_params.due_at_day,
                    habit.gen_params.due_at_month,
                )

                task_ranges: Sequence[tuple[ADate | None, ADate]]
                if habit.repeats_in_period_count is not None:
                    if habit.repeats_strategy is None:
                        raise ValueError("Repeats strategy is not set")
                    task_ranges = habit.repeats_strategy.spread_tasks(
                        start_date=schedule.first_day,
                        end_date=schedule.end_day,
                        repeats_in_period=habit.repeats_in_period_count,
                    )
                else:
                    task_ranges = [(schedule.actionable_date, schedule.due_date)]

                recurring_repeat_index = cast(int, task.recurring_repeat_index)
                repeat_index = cast(
                    int, min(len(task_ranges) - 1, recurring_repeat_index)
                )

                task = task.update_link_to_habit(
                    ctx=context.domain_context,
                    name=schedule.full_name,
                    timeline=schedule.timeline,
                    is_key=habit.is_key,
                    repeat_index=recurring_repeat_index,
                    actionable_date=task_ranges[repeat_index][0],
                    repeats_in_period_count=habit.repeats_in_period_count,
                    due_date=task_ranges[repeat_index][1],
                    eisen=habit.gen_params.eisen,
                    difficulty=habit.gen_params.difficulty,
                )

                await uow.get_for(Task).save(task)

    async def _perform_post_transactional_mutation_work(
        self,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: HabitUpdateArgs,
        result: None,
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
            period=None,
            filter_habit_ref_ids=[args.ref_id],
        )
