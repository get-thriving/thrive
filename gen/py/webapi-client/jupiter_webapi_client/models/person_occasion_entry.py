from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.occasion import Occasion
    from ..models.person import Person
    from ..models.time_event_full_days_block import TimeEventFullDaysBlock


T = TypeVar("T", bound="PersonOccasionEntry")


@_attrs_define
class PersonOccasionEntry:
    """Result entry.

    Attributes:
        person (Person): A person.
        occasion (Occasion): An occasion.
        occasion_time_event (TimeEventFullDaysBlock): A full day block of time.
    """

    person: Person
    occasion: Occasion
    occasion_time_event: TimeEventFullDaysBlock
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        person = self.person.to_dict()

        occasion = self.occasion.to_dict()

        occasion_time_event = self.occasion_time_event.to_dict()

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "person": person,
                "occasion": occasion,
                "occasion_time_event": occasion_time_event,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.occasion import Occasion
        from ..models.person import Person
        from ..models.time_event_full_days_block import TimeEventFullDaysBlock

        d = dict(src_dict)
        person = Person.from_dict(d.pop("person"))

        occasion = Occasion.from_dict(d.pop("occasion"))

        occasion_time_event = TimeEventFullDaysBlock.from_dict(d.pop("occasion_time_event"))

        person_occasion_entry = cls(
            person=person,
            occasion=occasion,
            occasion_time_event=occasion_time_event,
        )

        person_occasion_entry.additional_properties = d
        return person_occasion_entry

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
