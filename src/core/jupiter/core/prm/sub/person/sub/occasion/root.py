"""An occasion."""

import abc

from jupiter.core.common.birthday import Birthday
from jupiter.core.common.sub.inbox_tasks.root import InboxTask
from jupiter.core.common.sub.inbox_tasks.source import InboxTaskSource
from jupiter.core.common.sub.notes.namespace import NoteNamespace
from jupiter.core.common.sub.notes.root import Note
from jupiter.core.common.sub.tags.namespace import TagNamespace
from jupiter.core.common.sub.tags.sub.link.root import TagLink
from jupiter.core.common.sub.time_events.namespace import TimeEventNamespace
from jupiter.core.common.sub.time_events.sub.full_days_block.root import (
    TimeEventFullDaysBlock,
)
from jupiter.core.prm.sub.person.sub.occasion.kind import OccasionKind
from jupiter.core.prm.sub.person.sub.occasion.name import OccasionName
from jupiter.framework.base.adate import ADate
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import MutationContext
from jupiter.framework.entity import (
    IsRefId,
    LeafEntity,
    OwnsAtMostOne,
    OwnsMany,
    ParentLink,
    create_entity_action,
    entity,
    update_entity_action,
)
from jupiter.framework.storage.repository import LeafEntityRepository
from jupiter.framework.update_action import UpdateAction


@entity
class Occasion(LeafEntity):
    """An occasion."""

    person: ParentLink
    kind: OccasionKind
    name: OccasionName
    date: Birthday

    tag_link = OwnsAtMostOne(
        TagLink, namespace=TagNamespace.OCCASION, source_entity_ref_id=IsRefId()
    )
    note = OwnsAtMostOne(
        Note, namespace=NoteNamespace.OCCASION, source_entity_ref_id=IsRefId()
    )

    birthday_time_event_blocks = OwnsMany(
        TimeEventFullDaysBlock,
        namespace=TimeEventNamespace.PERSON_OCCASION,
        source_entity_ref_id=IsRefId(),
    )
    birthday_inbox_tasks = OwnsMany(
        InboxTask,
        source=InboxTaskSource.PERSON_OCCASION,
        source_entity_ref_id=IsRefId(),
    )

    @staticmethod
    @create_entity_action
    def new_occasion(
        ctx: MutationContext,
        person_ref_id: EntityId,
        kind: OccasionKind,
        name: OccasionName,
        date: Birthday,
    ) -> "Occasion":
        """Create an occasion."""
        return Occasion._create(
            ctx,
            person=ParentLink(person_ref_id),
            kind=kind,
            name=name,
            date=date,
        )

    @update_entity_action
    def update(
        self,
        ctx: MutationContext,
        kind: UpdateAction[OccasionKind],
        name: UpdateAction[OccasionName],
        date: UpdateAction[Birthday],
    ) -> "Occasion":
        """Update the occasion."""
        return self._new_version(
            ctx,
            kind=kind.or_else(self.kind),
            name=name.or_else(self.name),
            date=date.or_else(self.date),
        )

    def date_in_year(self, a_date: ADate) -> ADate:
        """Get the date of the occasion in the given year."""
        return self.date.birthday_in_year(a_date)


class OccasionRepository(LeafEntityRepository[Occasion], abc.ABC):
    """The repository for occasions."""
