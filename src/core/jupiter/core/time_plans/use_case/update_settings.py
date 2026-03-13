"""Update settings around time plans."""

from typing import cast

from jupiter.core.app import AppCore
from jupiter.core.archival_reason import JupiterArchivalReason
from jupiter.core.common import schedules
from jupiter.core.common.difficulty import Difficulty
from jupiter.core.common.eisen import Eisen
from jupiter.core.common.recurring_task_period import RecurringTaskPeriod
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterLoggedInMutationUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.gen.service.gen import GenService
from jupiter.core.inbox_tasks.collection import (
    InboxTaskCollection,
)
from jupiter.core.inbox_tasks.root import InboxTask
from jupiter.core.inbox_tasks.source import InboxTaskSource
from jupiter.core.life_plan.root import LifePlan
from jupiter.core.life_plan.sub.aspects.root import Aspect
from jupiter.core.sync_target import SyncTarget
from jupiter.core.time_plans.domain import TimePlanDomain
from jupiter.core.time_plans.generation_approach import (
    TimePlanGenerationApproach,
)
from jupiter.core.time_plans.root import (
    TimePlan,
    TimePlanRepository,
)
from jupiter.core.time_plans.source import TimePlanSource
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_name import EntityName
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.update_action import UpdateAction
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args
from jupiter.framework.utils.generic_crown_archiver import generic_crown_archiver


@use_case_args
class TimePlanUpdateSettingsArgs(UseCaseArgsBase):
    """Args."""

    periods: UpdateAction[list[RecurringTaskPeriod]]
    generation_approach: UpdateAction[TimePlanGenerationApproach]
    generation_in_advance_days: UpdateAction[dict[RecurringTaskPeriod, int]]
    planning_task_aspect_ref_id: UpdateAction[EntityId | None]
    planning_task_eisen: UpdateAction[Eisen | None]
    planning_task_difficulty: UpdateAction[Difficulty | None]


@mutation_use_case(
    WorkspaceFeature.TIME_PLANS, only_for_component=[AppCore.WEBUI, AppCore.API]
)
class TimePlanUpdateSettingsUseCase(
    JupiterLoggedInMutationUseCase[TimePlanUpdateSettingsArgs, None]
):
    """Command for updating the settings for time plans in general."""

    async def _perform_mutation(
        self,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: TimePlanUpdateSettingsArgs,
    ) -> None:
        """Execute the command's action."""
        async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
            workspace = context.workspace

            time_plan_domain = await uow.get_for(TimePlanDomain).load_by_parent(
                workspace.ref_id
            )
            inbox_task_collection = await uow.get_for(
                InboxTaskCollection
            ).load_by_parent(workspace.ref_id)
            life_plan = await uow.get_for(LifePlan).load_by_parent(workspace.ref_id)

            if workspace.is_feature_available(WorkspaceFeature.LIFE_PLAN):
                if args.planning_task_aspect_ref_id.test(lambda x: x is None):
                    raise Exception("Planning task aspect ref id is required")
                if args.planning_task_aspect_ref_id.should_change:
                    aspect = await uow.get_for(Aspect).load_by_id(
                        cast(EntityId, args.planning_task_aspect_ref_id.just_the_value)
                    )
                    planning_task_aspect_ref_id = UpdateAction.change_to(aspect.ref_id)
                else:
                    planning_task_aspect_ref_id = UpdateAction.do_nothing()
            else:
                root_aspect = await uow.get_for(Aspect).find_all_generic(
                    parent_ref_id=life_plan.ref_id,
                    allow_archived=False,
                    parent_aspect_ref_id=None,
                )
                if len(root_aspect) != 1:
                    raise Exception("Root aspect not found")
                planning_task_aspect_ref_id = UpdateAction.change_to(
                    root_aspect[0].ref_id
                )

            time_plan_domain = time_plan_domain.update(
                context.domain_context,
                periods=args.periods.transform(lambda s: set(s)),
                generation_approach=args.generation_approach,
                generation_in_advance_days=args.generation_in_advance_days,
                planning_task_aspect_ref_id=planning_task_aspect_ref_id,
                planning_task_eisen=args.planning_task_eisen,
                planning_task_difficulty=args.planning_task_difficulty,
            )
            await uow.get_for(TimePlanDomain).save(time_plan_domain)

        gen_service = GenService(
            domain_storage_engine=self._ports.domain_storage_engine,
        )

        await gen_service.do_it(
            ctx=context.domain_context,
            progress_reporter=progress_reporter,
            user=context.user,
            workspace=context.workspace,
            gen_even_if_not_modified=True,
            today=self._time_provider.get_current_date(),
            gen_targets=[SyncTarget.TIME_PLANS],
            period=None,
        )

        async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
            for period in RecurringTaskPeriod:
                schedule = schedules.get_schedule(
                    period=period,
                    name=EntityName("Test"),
                    right_now=self._time_provider.get_current_date().to_timestamp_at_end_of_day(),
                )

                time_plans_for_period = await uow.get(
                    TimePlanRepository
                ).find_all_in_range(
                    parent_ref_id=time_plan_domain.ref_id,
                    allow_archived=False,
                    filter_periods=[period],
                    filter_start_date=schedule.first_day,
                    filter_end_date=schedule.end_day.add_days(
                        365
                    ),  # Look reasonably far in the future
                )

                for time_plan in time_plans_for_period:
                    if time_plan.source == TimePlanSource.USER:
                        continue

                    planning_tasks = await uow.get_for(InboxTask).find_all_generic(
                        parent_ref_id=inbox_task_collection.ref_id,
                        allow_archived=False,
                        source=InboxTaskSource.TIME_PLAN,
                        source_entity_ref_id=time_plan.ref_id,
                    )

                    planning_task: InboxTask | None
                    if len(planning_tasks) == 0:
                        planning_task = None
                    elif len(planning_tasks) == 1:
                        planning_task = planning_tasks[0]
                    else:
                        raise Exception("Found multiple planning tasks for time plan")

                    if (
                        period not in time_plan_domain.periods
                        or time_plan_domain.generation_approach.should_not_generate_a_time_plan
                    ):
                        await generic_crown_archiver(
                            context.domain_context,
                            uow,
                            progress_reporter,
                            TimePlan,
                            time_plan.ref_id,
                            JupiterArchivalReason.USER,
                        )
                    if (
                        planning_task
                        and time_plan_domain.generation_approach.should_not_generate_a_planning_task
                    ):
                        await generic_crown_archiver(
                            context.domain_context,
                            uow,
                            progress_reporter,
                            InboxTask,
                            planning_task.ref_id,
                            JupiterArchivalReason.USER,
                        )
