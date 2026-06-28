"""The command for updating a chore."""

from typing import cast

from jupiter.core.chores.name import ChoreName
from jupiter.core.chores.root import Chore
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
from jupiter.core.common.sub.inbox_tasks.collection import (
    InboxTaskCollection,
)
from jupiter.core.common.sub.inbox_tasks.root import (
    InboxTask,
    InboxTaskRepository,
)
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
)
from jupiter.core.crown_entity_support import (
    JupiterUpdateCrownEntityArgs,
    JupiterUpdateCrownEntityUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.life_plan.sub.aspects.root import Aspect
from jupiter.core.life_plan.sub.chapters.root import Chapter
from jupiter.core.life_plan.sub.goals.root import Goal
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.framework.base.adate import ADate
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.base.timestamp import Timestamp
from jupiter.framework.errors import InputValidationError
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.update_action import UpdateAction
from jupiter.framework.use_case import (
    UnavailableForContextError,
    mutation_use_case,
)
from jupiter.framework.use_case_io import use_case_args


@use_case_args
class ChoreUpdateArgs(JupiterUpdateCrownEntityArgs):
    """PersonFindArgs."""

    ref_id: EntityId
    name: UpdateAction[ChoreName]
    aspect_ref_id: UpdateAction[EntityId]
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
    must_do: UpdateAction[bool]
    skip_rule: UpdateAction[RecurringTaskSkipRule | None]
    start_at_date: UpdateAction[ADate]
    end_at_date: UpdateAction[ADate | None]


@mutation_use_case(WorkspaceFeature.CHORES)
class ChoreUpdateUseCase(JupiterUpdateCrownEntityUseCase[ChoreUpdateArgs, None]):
    """The command for updating a chore."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: ChoreUpdateArgs,
    ) -> None:
        """Execute the command's action."""
        workspace = context.workspace

        chore = await self.load_entity(uow, context.user.ref_id, Chore, args.ref_id)

        if not workspace.is_feature_available(WorkspaceFeature.LIFE_PLAN):
            if (
                args.aspect_ref_id.should_change
                and args.aspect_ref_id.just_the_value is not None
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

        need_to_change_inbox_tasks = (
            args.name.should_change
            or args.period.should_change
            or args.eisen.should_change
            or args.difficulty.should_change
            or args.actionable_from_day.should_change
            or args.actionable_from_month.should_change
            or args.due_at_day.should_change
            or args.due_at_month.should_change
            or args.must_do.should_change
            or args.start_at_date.should_change
            or args.end_at_date.should_change
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
            need_to_change_inbox_tasks = True
            chore_gen_params = UpdateAction.change_to(
                RecurringTaskGenParams(
                    args.period.or_else(chore.gen_params.period),
                    args.eisen.or_else(chore.gen_params.eisen),
                    args.difficulty.or_else(chore.gen_params.difficulty),
                    args.actionable_from_day.or_else(
                        chore.gen_params.actionable_from_day,
                    ),
                    args.actionable_from_month.or_else(
                        chore.gen_params.actionable_from_month,
                    ),
                    args.due_at_day.or_else(chore.gen_params.due_at_day),
                    args.due_at_month.or_else(chore.gen_params.due_at_month),
                    args.skip_rule.or_else(chore.gen_params.skip_rule),
                ),
            )
        else:
            chore_gen_params = UpdateAction.do_nothing()

        if workspace.is_feature_available(WorkspaceFeature.LIFE_PLAN) and (
            args.aspect_ref_id.should_change
            or args.chapter_ref_id.should_change
            or args.goal_ref_id.should_change
        ):
            aspect = await self.load_entity(
                uow,
                context.user.ref_id,
                Aspect,
                args.aspect_ref_id.or_else(chore.aspect_ref_id),
            )
            chapter_ref_id = args.chapter_ref_id.or_else(chore.chapter_ref_id)
            goal_ref_id = args.goal_ref_id.or_else(chore.goal_ref_id)
            if chapter_ref_id and chapter_ref_id != chore.chapter_ref_id:
                chapter = await self.load_entity(
                    uow, context.user.ref_id, Chapter, chapter_ref_id
                )
                if chapter.aspect_ref_id != aspect.ref_id:
                    raise InputValidationError(
                        f"Chapter does not belong to aspect '{aspect.name}'"
                    )
            if goal_ref_id and goal_ref_id != chore.goal_ref_id:
                goal = await self.load_entity(
                    uow, context.user.ref_id, Goal, goal_ref_id
                )
                if goal.aspect_ref_id != aspect.ref_id:
                    raise InputValidationError(
                        f"Goal does not belong to aspect '{aspect.name}'"
                    )

        chore = chore.update(
            ctx=context.domain_context,
            aspect_ref_id=args.aspect_ref_id,
            chapter_ref_id=args.chapter_ref_id,
            goal_ref_id=args.goal_ref_id,
            name=args.name,
            is_key=args.is_key,
            gen_params=chore_gen_params,
            must_do=args.must_do,
            start_at_date=args.start_at_date,
            end_at_date=args.end_at_date,
        )

        await uow.get_for(Chore).save(chore)
        await progress_reporter.mark_updated(chore)

        if need_to_change_inbox_tasks:
            inbox_task_collection = await uow.get_for(
                InboxTaskCollection
            ).load_by_parent(
                workspace.ref_id,
            )
            all_inbox_tasks = await uow.get(
                InboxTaskRepository
            ).find_all_for_owner_created_desc(
                parent_ref_id=inbox_task_collection.ref_id,
                allow_archived=True,
                owner=EntityLink.std(NamedEntityTag.CHORE.value, chore.ref_id),
            )

            for inbox_task in all_inbox_tasks:
                schedule = schedules.get_schedule(
                    chore.gen_params.period,
                    chore.name,
                    cast(Timestamp, inbox_task.recurring_gen_right_now),
                    chore.gen_params.skip_rule,
                    chore.gen_params.actionable_from_day,
                    chore.gen_params.actionable_from_month,
                    chore.gen_params.due_at_day,
                    chore.gen_params.due_at_month,
                )

                inbox_task = inbox_task.update_link_to_chore(
                    ctx=context.domain_context,
                    name=schedule.full_name,
                    timeline=schedule.timeline,
                    is_key=chore.is_key,
                    actionable_date=schedule.actionable_date,
                    due_date=schedule.due_date,
                    eisen=chore.gen_params.eisen,
                    difficulty=chore.gen_params.difficulty,
                )

                await uow.get_for(InboxTask).save(inbox_task)
