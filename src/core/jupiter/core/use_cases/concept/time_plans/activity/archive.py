"""Use case for archiving a time plan activity."""

from jupiter.core.config import (
    JupiterLoggedInMutationContext,
    JupiterTransactionalLoggedInMutationUseCase,
)
from jupiter.core.domain.app import AppCore
from jupiter.core.domain.concept.inbox_tasks.inbox_task import InboxTaskRepository
from jupiter.core.domain.concept.inbox_tasks.inbox_task_collection import (
    InboxTaskCollection,
)
from jupiter.core.domain.concept.inbox_tasks.inbox_task_source import InboxTaskSource
from jupiter.core.domain.concept.time_plans.time_plan_activity import TimePlanActivity
from jupiter.core.domain.concept.time_plans.time_plan_activity_target import (
    TimePlanActivityTarget,
)
from jupiter.core.domain.core.archival_reason import JupiterArchivalReason
from jupiter.core.domain.features import WorkspaceFeature
from jupiter.core.domain.infra.generic_crown_archiver import generic_crown_archiver
from jupiter.framework_new.base.entity_id import EntityId
from jupiter.framework_new.progress_reporter import ProgressReporter
from jupiter.framework_new.repository import DomainUnitOfWork
from jupiter.framework_new.use_case import (
    mutation_use_case,
)
from jupiter.framework_new.use_case_io import UseCaseArgsBase, use_case_args


@use_case_args
class TimePlanActivityArchiveArgs(UseCaseArgsBase):
    """Args."""

    ref_id: EntityId


@mutation_use_case(WorkspaceFeature.TIME_PLANS, only_for_component=[AppCore.WEBUI])
class TimePlanActivityArchiveUseCase(
    JupiterTransactionalLoggedInMutationUseCase[TimePlanActivityArchiveArgs, None]
):
    """Use case for archiving a time plan activity."""

    async def _perform_transactional_mutation(
        self,
        uow: DomainUnitOfWork,
        progress_reporter: ProgressReporter,
        context: JupiterLoggedInMutationContext,
        args: TimePlanActivityArchiveArgs,
    ) -> None:
        """Execute the command's action."""
        workspace = context.workspace
        activity = await uow.get_for(TimePlanActivity).load_by_id(args.ref_id)

        if activity.target == TimePlanActivityTarget.BIG_PLAN:
            inbox_task_collection = await uow.get_for(
                InboxTaskCollection
            ).load_by_parent(workspace.ref_id)
            inbox_tasks = await uow.get(
                InboxTaskRepository
            ).find_all_for_source_created_desc(
                parent_ref_id=inbox_task_collection.ref_id,
                allow_archived=True,
                source=InboxTaskSource.BIG_PLAN,
                source_entity_ref_id=activity.target_ref_id,
            )
            if len(inbox_tasks) > 0:
                inbox_task_activities = await uow.get_for(
                    TimePlanActivity
                ).find_all_generic(
                    parent_ref_id=activity.parent_ref_id,
                    allow_archived=False,
                    target=TimePlanActivityTarget.INBOX_TASK,
                    target_ref_id=[it.ref_id for it in inbox_tasks],
                )
                for inbox_task_activity in inbox_task_activities:
                    await generic_crown_archiver(
                        context.domain_context,
                        uow,
                        progress_reporter,
                        TimePlanActivity,
                        inbox_task_activity.ref_id,
                        JupiterArchivalReason.USER,
                    )

        await generic_crown_archiver(
            context.domain_context,
            uow,
            progress_reporter,
            TimePlanActivity,
            args.ref_id,
            JupiterArchivalReason.USER,
        )
