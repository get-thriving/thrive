"""Load an in day block with associated data."""

from jupiter.core.common.sub.time_events.namespace import (
    TimeEventNamespace,
)
from jupiter.core.common.sub.time_events.sub.in_day_block.root import (
    TimeEventInDayBlock,
)
from jupiter.core.config import (
    JupiterLoggedInReadonlyContext,
    JupiterTransactionalLoggedInReadOnlyUseCase,
)
from jupiter.core.inbox_tasks.root import InboxTask
from jupiter.core.schedule.sub.event_in_day.root import (
    ScheduleEventInDay,
)
from jupiter.framework.base.entity_id import EntityId
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
class TimeEventInDayBlockLoadArgs(UseCaseArgsBase):
    """InDayBlockLoadArgs."""

    ref_id: EntityId
    allow_archived: bool | None


@use_case_result
class TimeEventInDayBlockLoadResult(UseCaseResultBase):
    """InDayBlockLoadResult."""

    in_day_block: TimeEventInDayBlock
    schedule_event: ScheduleEventInDay | None
    inbox_task: InboxTask | None


@readonly_use_case()
class TimeEventInDayBlockLoadUseCase(
    JupiterTransactionalLoggedInReadOnlyUseCase[
        TimeEventInDayBlockLoadArgs, TimeEventInDayBlockLoadResult
    ]
):
    """Load a in day block and associated data."""

    async def _perform_transactional_read(
        self,
        uow: DomainUnitOfWork,
        context: JupiterLoggedInReadonlyContext,
        args: TimeEventInDayBlockLoadArgs,
    ) -> TimeEventInDayBlockLoadResult:
        """Load a in day block and associated data."""
        allow_archived = args.allow_archived or False
        in_day_block = await uow.get_for(TimeEventInDayBlock).load_by_id(
            args.ref_id,
            allow_archived=allow_archived,
        )

        schedule_event = None
        if in_day_block.namespace == TimeEventNamespace.SCHEDULE_EVENT_IN_DAY:
            schedule_event = await uow.get_for(ScheduleEventInDay).load_by_id(
                in_day_block.source_entity_ref_id,
                allow_archived=allow_archived,
            )

        inbox_task = None
        if in_day_block.namespace == TimeEventNamespace.INBOX_TASK:
            inbox_task = await uow.get_for(InboxTask).load_by_id(
                in_day_block.source_entity_ref_id,
                allow_archived=allow_archived,
            )

        return TimeEventInDayBlockLoadResult(
            in_day_block=in_day_block,
            schedule_event=schedule_event,
            inbox_task=inbox_task,
        )
