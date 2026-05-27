"""Use case for loading a time plan activity activity."""

from jupiter.core.app import AppCore
from jupiter.core.big_plans.root import BigPlan
from jupiter.core.common.sub.inbox_tasks.root import InboxTask
from jupiter.core.common.sub.notes.root import Note, NoteRepository
from jupiter.core.common.sub.time_events.domain import TimeEventDomain
from jupiter.core.common.sub.time_events.sub.in_day_block.root import (
    TimeEventInDayBlock,
)
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.features import WorkspaceFeature
from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.core.time_plans.sub.activity.root import TimePlanActivity
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_link import EntityLink
from jupiter.framework.storage.repository import DomainUnitOfWork
from jupiter.framework.use_case import (
    readonly_use_case,
)
from jupiter.framework.use_case_io import (
    UseCaseArgsBase,
    UseCaseResultBase,
    use_case_args,
    use_case_result,
)


@use_case_args
class TimePlanActivityLoadArgs(UseCaseArgsBase):
    """TimePlanActivityLoadArgs."""

    ref_id: EntityId
    allow_archived: bool | None


@use_case_result
class TimePlanActivityLoadResult(UseCaseResultBase):
    """TimePlanActivityLoadResult."""

    time_plan_activity: TimePlanActivity
    target_inbox_task: InboxTask | None
    target_big_plan: BigPlan | None
    note: Note | None
    time_event_blocks: list[TimeEventInDayBlock]


@readonly_use_case(
    WorkspaceFeature.TIME_PLANS, only_for_component=[AppCore.WEBUI, AppCore.API]
)
class TimePlanActivityLoadUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[
        TimePlanActivityLoadArgs, TimePlanActivityLoadResult
    ]
):
    """Use case for loading a time plan activity activity."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: TimePlanActivityLoadArgs,
    ) -> TimePlanActivityLoadResult:
        """Execute the command's action."""
        allow_archived = args.allow_archived or False
        workspace = context.workspace

        time_plan_activity = await uow.get_for(TimePlanActivity).load_by_id(
            args.ref_id,
            allow_archived=allow_archived,
        )

        target_inbox_task = None
        target_big_plan = None
        if time_plan_activity.is_target_inbox_task:
            target_inbox_task = await uow.get_for(InboxTask).load_by_id(
                time_plan_activity.target.ref_id,
                allow_archived=allow_archived,
            )
        elif time_plan_activity.is_target_big_plan:
            target_big_plan = await uow.get_for(BigPlan).load_by_id(
                time_plan_activity.target.ref_id,
                allow_archived=allow_archived,
            )

        note = await uow.get(NoteRepository).load_optional_for_owner(
            EntityLink.std(
                NamedEntityTag.TIME_PLAN_ACTIVITY.value,
                time_plan_activity.ref_id,
            ),
            allow_archived=allow_archived,
        )

        if not workspace.is_feature_available(WorkspaceFeature.BIG_PLANS):
            target_big_plan = None

        time_event_domain = await uow.get_for(TimeEventDomain).load_by_parent(
            workspace.ref_id
        )
        time_event_blocks = await uow.get_for(TimeEventInDayBlock).find_all_generic(
            parent_ref_id=time_event_domain.ref_id,
            allow_archived=False,
            owner=EntityLink.std(
                NamedEntityTag.TIME_PLAN_ACTIVITY.value, time_plan_activity.ref_id
            ),
        )

        return TimePlanActivityLoadResult(
            time_plan_activity=time_plan_activity,
            target_inbox_task=target_inbox_task,
            target_big_plan=target_big_plan,
            note=note,
            time_event_blocks=time_event_blocks,
        )
