"""An entry in the working_mem.txt system."""

import abc

from jupiter.core.common.recurring_task_period import RecurringTaskPeriod
from jupiter.core.common.sub.notes.domain import NoteDomain
from jupiter.core.common.sub.notes.root import Note
from jupiter.framework.base.adate import ADate
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_name import EntityName
from jupiter.framework.context import MutationContext
from jupiter.framework.entity import (
    IsRefId,
    OwnsOne,
    ParentLink,
    StubEntity,
    create_entity_action,
    entity,
)
from jupiter.framework.errors import InputValidationError
from jupiter.framework.storage.repository import StubEntityRepository


@entity
class WorkingMem(StubEntity):
    """An entry in the working_mem.txt system."""

    working_mem_collection: ParentLink

    note = OwnsOne(Note, domain=NoteDomain.WORKING_MEM, source_entity_ref_id=IsRefId())

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
        )

    @staticmethod
    def build_name(right_now: ADate, period: RecurringTaskPeriod) -> EntityName:
        """Build the name."""
        return EntityName(
            f"{period.value.capitalize()} working_mem.txt for {right_now}"
        )


class WorkingMemRepository(StubEntityRepository[WorkingMem], abc.ABC):
    """The working memory repository."""

    @abc.abstractmethod
    async def load_the_working_mem(
        self, working_mem_collection_ref_id: EntityId
    ) -> WorkingMem:
        """Load the working memory entry."""
