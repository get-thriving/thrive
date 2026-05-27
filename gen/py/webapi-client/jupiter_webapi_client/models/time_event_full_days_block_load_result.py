from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..types import UNSET, Unset

if TYPE_CHECKING:
    from ..models.contact import Contact
    from ..models.occasion import Occasion
    from ..models.person import Person
    from ..models.schedule_event_full_days import ScheduleEventFullDays
    from ..models.time_event_full_days_block import TimeEventFullDaysBlock
    from ..models.vacation import Vacation


T = TypeVar("T", bound="TimeEventFullDaysBlockLoadResult")


@_attrs_define
class TimeEventFullDaysBlockLoadResult:
    """FullDaysBlockLoadResult.

    Attributes:
        full_days_block (TimeEventFullDaysBlock): A full day block of time.
        schedule_event (None | ScheduleEventFullDays | Unset):
        person (None | Person | Unset):
        contact (Contact | None | Unset):
        occasion (None | Occasion | Unset):
        vacation (None | Unset | Vacation):
    """

    full_days_block: TimeEventFullDaysBlock
    schedule_event: None | ScheduleEventFullDays | Unset = UNSET
    person: None | Person | Unset = UNSET
    contact: Contact | None | Unset = UNSET
    occasion: None | Occasion | Unset = UNSET
    vacation: None | Unset | Vacation = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        from ..models.contact import Contact
        from ..models.occasion import Occasion
        from ..models.person import Person
        from ..models.schedule_event_full_days import ScheduleEventFullDays
        from ..models.vacation import Vacation

        full_days_block = self.full_days_block.to_dict()

        schedule_event: dict[str, Any] | None | Unset
        if isinstance(self.schedule_event, Unset):
            schedule_event = UNSET
        elif isinstance(self.schedule_event, ScheduleEventFullDays):
            schedule_event = self.schedule_event.to_dict()
        else:
            schedule_event = self.schedule_event

        person: dict[str, Any] | None | Unset
        if isinstance(self.person, Unset):
            person = UNSET
        elif isinstance(self.person, Person):
            person = self.person.to_dict()
        else:
            person = self.person

        contact: dict[str, Any] | None | Unset
        if isinstance(self.contact, Unset):
            contact = UNSET
        elif isinstance(self.contact, Contact):
            contact = self.contact.to_dict()
        else:
            contact = self.contact

        occasion: dict[str, Any] | None | Unset
        if isinstance(self.occasion, Unset):
            occasion = UNSET
        elif isinstance(self.occasion, Occasion):
            occasion = self.occasion.to_dict()
        else:
            occasion = self.occasion

        vacation: dict[str, Any] | None | Unset
        if isinstance(self.vacation, Unset):
            vacation = UNSET
        elif isinstance(self.vacation, Vacation):
            vacation = self.vacation.to_dict()
        else:
            vacation = self.vacation

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "full_days_block": full_days_block,
            }
        )
        if schedule_event is not UNSET:
            field_dict["schedule_event"] = schedule_event
        if person is not UNSET:
            field_dict["person"] = person
        if contact is not UNSET:
            field_dict["contact"] = contact
        if occasion is not UNSET:
            field_dict["occasion"] = occasion
        if vacation is not UNSET:
            field_dict["vacation"] = vacation

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.contact import Contact
        from ..models.occasion import Occasion
        from ..models.person import Person
        from ..models.schedule_event_full_days import ScheduleEventFullDays
        from ..models.time_event_full_days_block import TimeEventFullDaysBlock
        from ..models.vacation import Vacation

        d = dict(src_dict)
        full_days_block = TimeEventFullDaysBlock.from_dict(d.pop("full_days_block"))

        def _parse_schedule_event(data: object) -> None | ScheduleEventFullDays | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, dict):
                    raise TypeError()
                schedule_event_type_0 = ScheduleEventFullDays.from_dict(data)

                return schedule_event_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(None | ScheduleEventFullDays | Unset, data)

        schedule_event = _parse_schedule_event(d.pop("schedule_event", UNSET))

        def _parse_person(data: object) -> None | Person | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, dict):
                    raise TypeError()
                person_type_0 = Person.from_dict(data)

                return person_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(None | Person | Unset, data)

        person = _parse_person(d.pop("person", UNSET))

        def _parse_contact(data: object) -> Contact | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, dict):
                    raise TypeError()
                contact_type_0 = Contact.from_dict(data)

                return contact_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(Contact | None | Unset, data)

        contact = _parse_contact(d.pop("contact", UNSET))

        def _parse_occasion(data: object) -> None | Occasion | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, dict):
                    raise TypeError()
                occasion_type_0 = Occasion.from_dict(data)

                return occasion_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(None | Occasion | Unset, data)

        occasion = _parse_occasion(d.pop("occasion", UNSET))

        def _parse_vacation(data: object) -> None | Unset | Vacation:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, dict):
                    raise TypeError()
                vacation_type_0 = Vacation.from_dict(data)

                return vacation_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(None | Unset | Vacation, data)

        vacation = _parse_vacation(d.pop("vacation", UNSET))

        time_event_full_days_block_load_result = cls(
            full_days_block=full_days_block,
            schedule_event=schedule_event,
            person=person,
            contact=contact,
            occasion=occasion,
            vacation=vacation,
        )

        time_event_full_days_block_load_result.additional_properties = d
        return time_event_full_days_block_load_result

    @property
    def additional_keys(self) -> list[str]:
        return list(self.additional_properties.keys())

    def __getitem__(self, key: str) -> Any:
        return self.additional_properties[key]

    def __setitem__(self, key: str, value: Any) -> None:
        self.additional_properties[key] = value

    def __delitem__(self, key: str) -> None:
        del self.additional_properties[key]

    def __contains__(self, key: str) -> bool:
        return key in self.additional_properties
