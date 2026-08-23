"""A standard question used when writing journals."""

from jupiter.core.common.recurring_task_period import RecurringTaskPeriod
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.base.entity_name import EntityName
from jupiter.framework.context import DomainContext
from jupiter.framework.entity import (
    LeafSupportEntity,
    ParentLink,
    create_entity_action,
    entity,
    update_entity_action,
)
from jupiter.framework.update_action import UpdateAction


@entity("JournalCollection")
class JournalQuestion(LeafSupportEntity):
    """A standard question attached to the journal collection."""

    journal_collection: ParentLink
    name: EntityName
    period: RecurringTaskPeriod

    @staticmethod
    @create_entity_action
    def new_journal_question(
        ctx: DomainContext,
        journal_collection_ref_id: EntityId,
        name: EntityName,
        period: RecurringTaskPeriod,
    ) -> "JournalQuestion":
        """Create a journal question."""
        return JournalQuestion._create(
            ctx,
            journal_collection=ParentLink(journal_collection_ref_id),
            name=name,
            period=period,
        )

    @update_entity_action
    def update(
        self,
        ctx: DomainContext,
        name: UpdateAction[EntityName],
    ) -> "JournalQuestion":
        """Update the journal question."""
        return self._new_version(
            ctx,
            name=name.or_else(self.name),
        )
