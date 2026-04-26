"""The working memory log."""

from jupiter.core.common.recurring_task_period import RecurringTaskPeriod
from jupiter.core.common.sub.inbox_tasks.root import InboxTask
from jupiter.core.working_mem.root import WorkingMem
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import DomainContext
from jupiter.framework.entity import (
    ContainsMany,
    ContainsOne,
    IsEntityLinkStd,
    IsRefId,
    ParentLink,
    TrunkEntity,
    create_entity_action,
    entity,
    update_entity_action,
)
from jupiter.framework.errors import InputValidationError
from jupiter.framework.update_action import UpdateAction


@entity("Workspace")
class WorkingMemCollection(TrunkEntity):
    """The working memory log."""

    workspace: ParentLink

    generation_period: RecurringTaskPeriod

    working_mem = ContainsOne(WorkingMem, working_mem_collection_ref_id=IsRefId())
    cleanup_tasks = ContainsMany(
        InboxTask,
        owner=IsEntityLinkStd("WorkingMemCollection"),
    )

    @staticmethod
    @create_entity_action
    def new_working_mem_collection(
        ctx: DomainContext,
        workspace_ref_id: EntityId,
        generation_period: RecurringTaskPeriod,
    ) -> "WorkingMemCollection":
        """Create a new working memory log."""
        if (
            generation_period != RecurringTaskPeriod.DAILY
            and generation_period != RecurringTaskPeriod.WEEKLY
        ):
            raise InputValidationError(f"Invalid period: {generation_period}")
        return WorkingMemCollection._create(
            ctx,
            workspace=ParentLink(workspace_ref_id),
            generation_period=generation_period,
        )

    @update_entity_action
    def update(
        self,
        ctx: DomainContext,
        generation_period: UpdateAction[RecurringTaskPeriod],
    ) -> "WorkingMemCollection":
        """Change the generation period."""
        if (
            generation_period.should_change
            and generation_period.just_the_value != RecurringTaskPeriod.DAILY
            and generation_period.just_the_value != RecurringTaskPeriod.WEEKLY
        ):
            raise InputValidationError(
                f"Invalid period: {generation_period.just_the_value}"
            )
        return self._new_version(
            ctx,
            generation_period=generation_period.or_else(self.generation_period),
        )
