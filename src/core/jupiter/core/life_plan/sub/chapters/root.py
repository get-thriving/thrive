"""A chapter in a life plan."""

from jupiter.core.common.sub.notes.domain import NoteDomain
from jupiter.core.common.sub.notes.root import Note
from jupiter.core.life_plan.partial_date import PartialDate
from jupiter.core.life_plan.sub.chapters.name import ChapterName
from jupiter.framework.base.adate import ADate
from jupiter.framework.base.entity_id import EntityId
from jupiter.framework.context import MutationContext
from jupiter.framework.entity import (
    IsRefId,
    LeafEntity,
    OwnsAtMostOne,
    ParentLink,
    create_entity_action,
    entity,
    update_entity_action,
)
from jupiter.framework.errors import InputValidationError
from jupiter.framework.update_action import UpdateAction


@entity
class Chapter(LeafEntity):
    """A chapter in a life plan."""

    life_plan: ParentLink
    name: ChapterName
    start_date: PartialDate
    end_date: PartialDate

    note = OwnsAtMostOne(
        Note, domain=NoteDomain.CHAPTER, source_entity_ref_id=IsRefId()
    )

    @staticmethod
    @create_entity_action
    def new_chapter(
        ctx: MutationContext,
        life_plan_ref_id: EntityId,
        birthday: ADate,
        name: ChapterName,
        start_date: PartialDate,
        end_date: PartialDate,
    ) -> "Chapter":
        """Create a chapter."""
        earliest_start_date = start_date.earliest_relative_to(birthday)
        latest_end_date = end_date.latest_relative_to(birthday)

        if earliest_start_date >= latest_end_date:
            raise InputValidationError(
                f"Start date {earliest_start_date} is after end date {latest_end_date}"
            )

        return Chapter._create(
            ctx,
            life_plan=ParentLink(life_plan_ref_id),
            name=name,
            start_date=start_date,
            end_date=end_date,
        )

    @update_entity_action
    def update(
        self,
        ctx: MutationContext,
        birthday: ADate,
        name: UpdateAction[ChapterName],
        start_date: UpdateAction[PartialDate],
        end_date: UpdateAction[PartialDate],
    ) -> "Chapter":
        """Update a chapter."""
        earliest_start_date = start_date.or_else(self.start_date).earliest_relative_to(
            birthday
        )
        latest_end_date = end_date.or_else(self.end_date).latest_relative_to(birthday)

        if earliest_start_date >= latest_end_date:
            raise InputValidationError(
                f"Start date {earliest_start_date} is after end date {latest_end_date}"
            )

        return self._new_version(
            ctx,
            name=name.or_else(self.name),
            start_date=start_date.or_else(self.start_date),
            end_date=end_date.or_else(self.end_date),
        )
