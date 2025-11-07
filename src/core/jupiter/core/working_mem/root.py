"""An entry in the working_mem.txt system."""

import abc

from jupiter.core.common.notes.domain import NoteDomain
from jupiter.core.common.notes.root import Note
from jupiter.core.inbox_tasks.root import InboxTask
from jupiter.core.inbox_tasks.source import InboxTaskSource
from jupiter.core.recurring_task_period import RecurringTaskPeriod
from jupiter.core.timeline import infer_timeline
from jupiter.framework.base.adate import ADate
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_name import EntityName
from jupiter.framework.base.timestamp import Timestamp
from jupiter.framework.context import MutationContext
from jupiter.framework.entity import (
    IsRefId,
    LeafEntity,
    OwnsOne,
    ParentLink,
    create_entity_action,
    entity,
    update_entity_action,
)
from jupiter.framework.errors import InputValidationError
from jupiter.framework.storage.repository import LeafEntityRepository


@entity
class WorkingMem(LeafEntity):
    """An entry in the working_mem.txt system."""

    working_mem_collection: ParentLink

    right_now: ADate
    period: RecurringTaskPeriod
    timeline: str

    note = OwnsOne(Note, domain=NoteDomain.WORKING_MEM, source_entity_ref_id=IsRefId())
    cleanup_task = OwnsOne(
        InboxTask,
        source=InboxTaskSource.WORKING_MEM_CLEANUP,
        source_entity_ref_id=IsRefId(),
    )

    @staticmethod
    @create_entity_action
    def new_working_mem(
        ctx: MutationContext,
        working_mem_collection_ref_id: EntityId,
        right_now: ADate,
        period: RecurringTaskPeriod,
    ) -> "WorkingMem":
        """Create a working memory entry."""
        if period != RecurringTaskPeriod.DAILY and period != RecurringTaskPeriod.WEEKLY:
            raise InputValidationError(f"Invalid period: {period}")
        return WorkingMem._create(
            ctx,
            name=WorkingMem.build_name(right_now, period),
            working_mem_collection=ParentLink(working_mem_collection_ref_id),
            right_now=right_now,
            period=period,
            timeline=infer_timeline(period, right_now.to_timestamp_at_end_of_day()),
        )

    @update_entity_action
    def change_generation_period(
        self, ctx: MutationContext, period: RecurringTaskPeriod
    ) -> "WorkingMem":
        """Change the generation period."""
        if period != RecurringTaskPeriod.DAILY and period != RecurringTaskPeriod.WEEKLY:
            raise InputValidationError(f"Invalid period: {period}")
        return self._new_version(
            ctx,
            period=period,
            timeline=infer_timeline(
                period, self.right_now.to_timestamp_at_end_of_day()
            ),
        )

    def can_be_archived_at(self, current_time: Timestamp) -> bool:
        """Can this working mem be archived at a given time."""
        return self.right_now <= ADate.from_date(current_time.as_date().add(days=-14))

    @staticmethod
    def build_name(right_now: ADate, period: RecurringTaskPeriod) -> EntityName:
        """Build the name."""
        return EntityName(
            f"{period.value.capitalize()} working_mem.txt for {right_now}"
        )


class WorkingMemRepository(LeafEntityRepository[WorkingMem], abc.ABC):
    """The working memory repository."""

    @abc.abstractmethod
    async def load_latest_working_mem(
        self, working_mem_collection_ref_id: EntityId
    ) -> WorkingMem:
        """Load the latest working memory entry."""
