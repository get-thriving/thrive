"""A vacation."""

import typing

from jupiter.core.domain.concept.vacations.vacation_name import VacationName
from jupiter.framework_new.base.adateimport ADate
from jupiter.core.domain.core.notes.note import Note
from jupiter.core.domain.core.notes.note_domain import NoteDomain
from jupiter.core.domain.core.time_events.time_event_full_days_block import (
    TimeEventFullDaysBlock,
)
from jupiter.core.domain.core.time_events.time_event_namespace import TimeEventNamespace
from jupiter.framework_new.base.entity_id import EntityId
from jupiter.framework_new.context import DomainContext
from jupiter.framework_new.entity import (
    IsRefId,
    LeafEntity,
    OwnsAtMostOne,
    OwnsOne,
    ParentLink,
    create_entity_action,
    entity,
    update_entity_action,
)
from jupiter.framework_new.update_action import UpdateAction
from jupiter.framework_new.errors import InputValidationError


@entity
class Vacation(LeafEntity):
    """A vacation."""

    vacation_collection: ParentLink
    name: VacationName
    start_date: ADate
    end_date: ADate

    note = OwnsAtMostOne(
        Note, domain=NoteDomain.VACATION, source_entity_ref_id=IsRefId()
    )
    time_event_block = OwnsOne(
        TimeEventFullDaysBlock,
        namespace=TimeEventNamespace.VACATION,
        source_entity_ref_id=IsRefId(),
    )

    @staticmethod
    @create_entity_action
    def new_vacation(
        ctx: DomainContext,
        vacation_collection_ref_id: EntityId,
        name: VacationName,
        start_date: ADate,
        end_date: ADate,
    ) -> "Vacation":
        """Create a vacation."""
        if start_date >= end_date:
            raise InputValidationError("Cannot set a start date after the end date")

        return Vacation._create(
            ctx,
            name=name,
            vacation_collection=ParentLink(vacation_collection_ref_id),
            start_date=start_date,
            end_date=end_date,
        )

    @update_entity_action
    def update(
        self,
        ctx: DomainContext,
        name: UpdateAction[VacationName],
        start_date: UpdateAction[ADate],
        end_date: UpdateAction[ADate],
    ) -> "Vacation":
        """Update a vacation's properties."""
        new_start_date = start_date.or_else(self.start_date)
        new_end_date = end_date.or_else(self.end_date)

        if new_start_date >= new_end_date:
            raise InputValidationError("Cannot set a start date after the end date")

        return self._new_version(
            ctx,
            name=name.or_else(self.name),
            start_date=new_start_date,
            end_date=new_end_date,
        )

    def is_in_vacation(self, start_date: ADate, end_date: ADate) -> bool:
        """Checks whether a particular date range is in this vacation."""
        vacation_start_date = self.start_date
        vacation_end_date = self.end_date
        return typing.cast(bool, vacation_start_date <= start_date) and typing.cast(
            bool,
            end_date <= vacation_end_date,
        )
