"""The command for creating a chore."""

from jupiter.core.apps.chores.collection import ChoreCollection
from jupiter.core.apps.chores.name import ChoreName
from jupiter.core.apps.chores.root import Chore
from jupiter.core.apps.life_plan.root import LifePlan
from jupiter.core.apps.life_plan.sub.aspects.root import Aspect, AspectRepository
from jupiter.core.apps.life_plan.sub.chapters.root import Chapter
from jupiter.core.apps.life_plan.sub.goals.root import Goal
from jupiter.core.apps.time_plans.root import TimePlan
from jupiter.core.apps.time_plans.sub.activity.feasability import (
    TimePlanActivityFeasability,
)
from jupiter.core.apps.time_plans.sub.activity.kind import (
    TimePlanActivityKind,
)
from jupiter.core.apps.time_plans.sub.activity.root import (
    TimePlanActivity,
    TimePlanAlreadyAssociatedWithTargetError,
)
from jupiter.core.apps.time_plans.use_case.associate_with_habits import (
    dates_in_inclusive_range,
    inbox_task_overlaps_time_plan,
)
from jupiter.core.common.difficulty import Difficulty
from jupiter.core.common.eisen import Eisen
from jupiter.core.common.recurring_task_due_at_day import RecurringTaskDueAtDay
from jupiter.core.common.recurring_task_due_at_month import (
    RecurringTaskDueAtMonth,
)
from jupiter.core.common.recurring_task_gen_params import RecurringTaskGenParams
from jupiter.core.common.recurring_task_period import RecurringTaskPeriod
from jupiter.core.common.recurring_task_skip_rule import RecurringTaskSkipRule
from jupiter.core.common.sub.inbox_tasks.root import InboxTask
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
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.core.sync_target import SyncTarget
from jupiter.framework.base.adate import ADate
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
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
class ChoreCreateArgs(JupiterCreateCrownEntityArgs):
    """ChoreCreate args."""

    name: ChoreName
    period: RecurringTaskPeriod
    aspect_ref_id: EntityId | None
    chapter_ref_id: EntityId | None
    goal_ref_id: EntityId | None
    time_plan_ref_id: EntityId | None
    time_plan_activity_kind: TimePlanActivityKind | None
    time_plan_activity_feasability: TimePlanActivityFeasability | None
    is_key: bool
    eisen: Eisen
    difficulty: Difficulty
    actionable_from_day: RecurringTaskDueAtDay | None
    actionable_from_month: RecurringTaskDueAtMonth | None
    due_at_day: RecurringTaskDueAtDay | None
    due_at_month: RecurringTaskDueAtMonth | None
    must_do: bool
    skip_rule: RecurringTaskSkipRule | None
    start_at_date: ADate | None
    end_at_date: ADate | None


@use_case_result
class ChoreCreateResult(UseCaseResultBase):
    """ChoreCreate result."""

    new_chore: Chore
    new_time_plan_activity: TimePlanActivity | None


@mutation_use_case(WorkspaceFeature.CHORES)
class ChoreCreateUseCase(
    JupiterCreateCrownEntityUseCase[ChoreCreateArgs, ChoreCreateResult]
):
    """The command for creating a chore."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: ChoreCreateArgs,
    ) -> ChoreCreateResult:
        """Execute the command's action."""
        workspace = context.workspace

        if not workspace.is_feature_available(WorkspaceFeature.LIFE_PLAN):
            if args.aspect_ref_id is not None:
                raise UnavailableForContextError(WorkspaceFeature.LIFE_PLAN)
            if args.chapter_ref_id is not None:
                raise UnavailableForContextError(WorkspaceFeature.LIFE_PLAN)
            if args.goal_ref_id is not None:
                raise UnavailableForContextError(WorkspaceFeature.LIFE_PLAN)

        chore_collection = await uow.get_for(ChoreCollection).load_by_parent(
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

        time_plan: TimePlan | None = None
        if args.time_plan_ref_id:
            time_plan = await self.load_entity(
                uow, context.user.ref_id, TimePlan, args.time_plan_ref_id
            )
            if not time_plan.allows_inbox_tasks:
                raise InputValidationError(
                    "Chores can only be added to daily or weekly time plans"
                )

        new_chore = Chore.new_chore(
            ctx=context.domain_context,
            chore_collection_ref_id=chore_collection.ref_id,
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
            start_at_date=args.start_at_date,
            end_at_date=args.end_at_date,
            suspended=False,
            must_do=args.must_do,
        )
        new_chore = await self.create_entity(
            context.domain_context,
            uow,
            progress_reporter,
            context.user.ref_id,
            new_chore,
        )

        new_time_plan_activity = None
        if time_plan:
            time_plan_activity_kind = args.time_plan_activity_kind
            time_plan_activity_feasability = args.time_plan_activity_feasability
            if not time_plan_activity_kind:
                raise InputValidationError("An activity kind is required")
            if not time_plan_activity_feasability:
                raise InputValidationError("An activity feasability is required")
            new_time_plan_activity = TimePlanActivity.new_activity_for_chore(
                context.domain_context,
                time_plan_ref_id=time_plan.ref_id,
                chore_ref_id=new_chore.ref_id,
                kind=time_plan_activity_kind,
                feasability=time_plan_activity_feasability,
            )
            new_time_plan_activity = await self.create_entity(
                context.domain_context,
                uow,
                progress_reporter,
                context.user.ref_id,
                new_time_plan_activity,
            )

        return ChoreCreateResult(
            new_chore=new_chore,
            new_time_plan_activity=new_time_plan_activity,
        )

    async def _perform_post_transactional_mutation_work(
        self,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: ChoreCreateArgs,
        result: ChoreCreateResult,
    ) -> None:
        """Execute the command's post-mutation work."""
        gen_service = GenService(
            self._ports.domain_storage_engine,
            self._concept_registry,
        )

        time_plan: TimePlan | None = None
        if args.time_plan_ref_id:
            async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
                time_plan = await uow.get_for(TimePlan).load_by_id(
                    args.time_plan_ref_id
                )

        if time_plan is not None:
            for day in dates_in_inclusive_range(
                time_plan.start_date, time_plan.end_date
            ):
                await gen_service.do_it(
                    context.domain_context,
                    progress_reporter=progress_reporter,
                    user=context.user,
                    workspace=context.workspace,
                    gen_even_if_not_modified=False,
                    today=day,
                    gen_targets=[SyncTarget.CHORES],
                    period=[args.period],
                    filter_chore_ref_ids=[result.new_chore.ref_id],
                )

            kind = args.time_plan_activity_kind
            feasability = args.time_plan_activity_feasability
            if kind is None or feasability is None:
                return

            async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
                inbox_tasks = await uow.get_for(InboxTask).find_all_generic(
                    parent_ref_id=None,
                    allow_archived=False,
                    owner=EntityLink.std(
                        NamedEntityTag.CHORE.value, result.new_chore.ref_id
                    ),
                )
                for inbox_task in inbox_tasks:
                    if not inbox_task_overlaps_time_plan(inbox_task, time_plan):
                        continue
                    try:
                        new_inbox_activity = (
                            TimePlanActivity.new_activity_for_inbox_task(
                                context.domain_context,
                                time_plan_ref_id=time_plan.ref_id,
                                inbox_task_ref_id=inbox_task.ref_id,
                                kind=kind,
                                feasability=feasability,
                            )
                        )
                        await self.create_entity(
                            context.domain_context,
                            uow,
                            progress_reporter,
                            context.user.ref_id,
                            new_inbox_activity,
                        )
                    except TimePlanAlreadyAssociatedWithTargetError:
                        pass
        else:
            await gen_service.do_it(
                context.domain_context,
                progress_reporter=progress_reporter,
                user=context.user,
                workspace=context.workspace,
                gen_even_if_not_modified=False,
                today=self._time_provider.get_current_date(),
                gen_targets=[SyncTarget.CHORES],
                period=[args.period],
                filter_chore_ref_ids=[result.new_chore.ref_id],
            )
