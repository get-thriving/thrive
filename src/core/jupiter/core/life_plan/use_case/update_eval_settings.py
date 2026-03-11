"""Update eval settings for a life plan."""

from typing import cast

from jupiter.core.app import AppCore
from jupiter.core.archival_reason import JupiterArchivalReason
from jupiter.core.common.difficulty import Difficulty
from jupiter.core.common.eisen import Eisen
from jupiter.core.common.recurring_task_period import RecurringTaskPeriod
from jupiter.core.common.timeline import infer_period_from_timeline
from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterLoggedInMutationUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.gen.service.gen import GenService
from jupiter.core.inbox_tasks.collection import InboxTaskCollection
from jupiter.core.inbox_tasks.root import InboxTask
from jupiter.core.inbox_tasks.source import InboxTaskSource
from jupiter.core.life_plan.eval_approach import LifePlanEvalApproach
from jupiter.core.life_plan.root import LifePlan
from jupiter.core.life_plan.sub.aspects.root import Project
from jupiter.core.sync_target import SyncTarget
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.progress_reporter.reporter import ProgressReporter
from jupiter.framework.update_action import UpdateAction
from jupiter.framework.use_case import (
    mutation_use_case,
)
from jupiter.framework.use_case_io import UseCaseArgsBase, use_case_args
from jupiter.framework.utils.generic_crown_archiver import generic_crown_archiver


@use_case_args
class LifePlanUpdateEvalSettingsArgs(UseCaseArgsBase):
    """Args."""

    eval_periods: UpdateAction[list[RecurringTaskPeriod]]
    eval_approach: UpdateAction[LifePlanEvalApproach]
    eval_task_project_ref_id: UpdateAction[EntityId | None]
    eval_task_eisen: UpdateAction[Eisen | None]
    eval_task_difficulty: UpdateAction[Difficulty | None]
    eval_task_generation_in_advance_days: UpdateAction[dict[RecurringTaskPeriod, int]]


@mutation_use_case(
    WorkspaceFeature.LIFE_PLAN, only_for_component=[AppCore.WEBUI, AppCore.API]
)
class LifePlanUpdateEvalSettingsUseCase(
    JupiterLoggedInMutationUseCase[LifePlanUpdateEvalSettingsArgs, None]
):
    """Command for updating the eval settings for a life plan."""

    async def _perform_mutation(
        self,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: LifePlanUpdateEvalSettingsArgs,
    ) -> None:
        """Execute the command's action."""
        async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
            workspace = context.workspace

            life_plan = await uow.get_for(LifePlan).load_by_parent(workspace.ref_id)
            inbox_task_collection = await uow.get_for(
                InboxTaskCollection
            ).load_by_parent(workspace.ref_id)

            eval_task_project_ref_id: UpdateAction[EntityId | None] = (
                UpdateAction.do_nothing()
            )
            if args.eval_task_project_ref_id.should_change:
                project_ref_id_value = args.eval_task_project_ref_id.just_the_value
                if project_ref_id_value is not None:
                    project = await uow.get_for(Project).load_by_id(
                        cast(EntityId, project_ref_id_value)
                    )
                    eval_task_project_ref_id = UpdateAction.change_to(project.ref_id)
                else:
                    eval_task_project_ref_id = UpdateAction.change_to(None)
            else:
                eval_task_project_ref_id = UpdateAction.do_nothing()

            life_plan = life_plan.update_eval_settings(
                context.domain_context,
                eval_periods=args.eval_periods.transform(lambda s: set(s)),
                eval_approach=args.eval_approach,
                eval_task_project_ref_id=eval_task_project_ref_id,
                eval_task_eisen=args.eval_task_eisen,
                eval_task_difficulty=args.eval_task_difficulty,
                eval_task_generation_in_advance_days=args.eval_task_generation_in_advance_days,
            )
            await uow.get_for(LifePlan).save(life_plan)

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
            gen_targets=[SyncTarget.LIFE_PLAN_EVAL],
            period=None,
        )

        async with self._ports.domain_storage_engine.get_unit_of_work() as uow:
            eval_tasks_for_period = await uow.get_for(InboxTask).find_all_generic(
                parent_ref_id=inbox_task_collection.ref_id,
                allow_archived=False,
                source=InboxTaskSource.LIFE_PLAN_EVAL,
            )

            for eval_task in eval_tasks_for_period:
                if eval_task.recurring_timeline is None:
                    continue

                if (
                    infer_period_from_timeline(eval_task.recurring_timeline)
                    not in life_plan.eval_periods
                    or life_plan.eval_approach.should_not_generate_an_eval_task
                ):
                    await generic_crown_archiver(
                        context.domain_context,
                        uow,
                        progress_reporter,
                        InboxTask,
                        eval_task.ref_id,
                        JupiterArchivalReason.USER,
                    )
