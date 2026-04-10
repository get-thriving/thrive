"""A chore."""

from jupiter.core.named_entity_tag import NamedEntityTag
from jupiter.core.chores.name import ChoreName
from jupiter.core.common.recurring_task_gen_params import RecurringTaskGenParams
from jupiter.core.common.sub.inbox_tasks.namespace import InboxTaskNamespace
from jupiter.core.common.sub.inbox_tasks.root import InboxTask
from jupiter.core.common.sub.notes.root import Note
from jupiter.core.common.sub.tags.namespace import TagNamespace
from jupiter.core.common.sub.tags.sub.link.root import TagLink
from jupiter.core.common.sub.time_events.namespace import TimeEventNamespace
from jupiter.core.common.sub.time_events.sub.in_day_block.root import (
    TimeEventInDayBlock,
)
from jupiter.framework.base.adate import ADate
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import DomainContext
from jupiter.framework.entity import (
    IsEntityLinkStd,
    IsRefId,
    LeafEntity,
    OwnsAtMostOne,
    OwnsMany,
    ParentLink,
    create_entity_action,
    entity,
    update_entity_action,
)
from jupiter.framework.errors import InputValidationError
from jupiter.framework.update_action import UpdateAction


@entity("ChoreCollection")
class Chore(LeafEntity):
    """A chore."""

    chore_collection: ParentLink
    aspect_ref_id: EntityId
    chapter_ref_id: EntityId | None
    goal_ref_id: EntityId | None
    name: ChoreName
    is_key: bool
    gen_params: RecurringTaskGenParams
    suspended: bool
    must_do: bool
    start_at_date: ADate
    end_at_date: ADate | None

    inbox_tasks = OwnsMany(
        InboxTask, namespace=InboxTaskNamespace.CHORE, source_entity_ref_id=IsRefId()
    )
    time_event_in_day_blocks = OwnsMany(
        TimeEventInDayBlock,
        namespace=TimeEventNamespace.CHORE,
        source_entity_ref_id=IsRefId(),
    )
    tag_link = OwnsAtMostOne(
        TagLink, namespace=TagNamespace.CHORE, source_entity_ref_id=IsRefId()
    )
    note = OwnsAtMostOne(
        Note, owner=IsEntityLinkStd(NamedEntityTag.CHORE.value)
    )

    @staticmethod
    @create_entity_action
    def new_chore(
        ctx: DomainContext,
        chore_collection_ref_id: EntityId,
        aspect_ref_id: EntityId,
        chapter_ref_id: EntityId | None,
        goal_ref_id: EntityId | None,
        name: ChoreName,
        is_key: bool,
        gen_params: RecurringTaskGenParams,
        start_at_date: ADate | None,
        end_at_date: ADate | None,
        suspended: bool,
        must_do: bool,
    ) -> "Chore":
        """Create a chore."""
        today = ADate.from_date(ctx.action_timestamp.as_date())

        if (
            start_at_date is not None
            and end_at_date is not None
            and start_at_date >= end_at_date
        ):
            raise InputValidationError(
                f"Start date {start_at_date} is after {end_at_date}",
            )
        if start_at_date is None and end_at_date is not None and end_at_date < today:
            raise InputValidationError(f"End date {end_at_date} is before {today}")

        return Chore._create(
            ctx,
            chore_collection=ParentLink(chore_collection_ref_id),
            aspect_ref_id=aspect_ref_id,
            chapter_ref_id=chapter_ref_id,
            goal_ref_id=goal_ref_id,
            name=name,
            is_key=is_key,
            gen_params=gen_params,
            suspended=suspended,
            must_do=must_do,
            start_at_date=start_at_date if start_at_date else today,
            end_at_date=end_at_date,
        )

    @update_entity_action
    def update(
        self,
        ctx: DomainContext,
        name: UpdateAction[ChoreName],
        aspect_ref_id: UpdateAction[EntityId],
        chapter_ref_id: UpdateAction[EntityId | None],
        goal_ref_id: UpdateAction[EntityId | None],
        is_key: UpdateAction[bool],
        gen_params: UpdateAction[RecurringTaskGenParams],
        must_do: UpdateAction[bool],
        start_at_date: UpdateAction[ADate],
        end_at_date: UpdateAction[ADate | None],
    ) -> "Chore":
        """Update the chore."""
        if gen_params.should_change:
            the_gen_params = gen_params.just_the_value
        else:
            the_gen_params = self.gen_params

        if start_at_date.should_change or end_at_date.should_change:
            the_start_at_date = start_at_date.or_else(self.start_at_date)
            the_end_at_date = end_at_date.or_else(self.end_at_date)
            if the_end_at_date is not None and the_start_at_date >= the_end_at_date:
                raise InputValidationError(
                    f"Start date {the_start_at_date} is after end date {the_end_at_date}",
                )
        else:
            the_start_at_date = self.start_at_date
            the_end_at_date = self.end_at_date

        return self._new_version(
            ctx,
            name=name.or_else(self.name),
            aspect_ref_id=aspect_ref_id.or_else(self.aspect_ref_id),
            chapter_ref_id=chapter_ref_id.or_else(self.chapter_ref_id),
            goal_ref_id=goal_ref_id.or_else(self.goal_ref_id),
            is_key=is_key.or_else(self.is_key),
            gen_params=the_gen_params,
            must_do=must_do.or_else(self.must_do),
            start_at_date=the_start_at_date,
            end_at_date=the_end_at_date,
        )

    @update_entity_action
    def suspend(self, ctx: DomainContext) -> "Chore":
        """Suspend the chore."""
        if self.suspended:
            return self
        return self._new_version(
            ctx,
            suspended=True,
        )

    @update_entity_action
    def unsuspend(self, ctx: DomainContext) -> "Chore":
        """Unsuspend the chore."""
        if not self.suspended:
            return self
        return self._new_version(
            ctx,
            suspended=False,
        )

    def is_in_active_interval(self, start_date: ADate, end_date: ADate) -> bool:
        """Checks whether a particular date range is in this active interval."""
        chore_start_date = self.start_at_date
        chore_end_date = self.end_at_date if self.end_at_date else None

        if chore_end_date is None:
            # Just a start date interval, so at least the end date should be in it
            return end_date >= chore_start_date
        else:
            # Both a start date and an end date are present. At least one of the start date or end date of
            # the interval we're comparing against should be in this interval.
            return (
                chore_start_date <= start_date <= chore_end_date
                or chore_start_date <= end_date <= chore_end_date
            )
