from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.chore import Chore
    from ..models.time_event_in_day_block import TimeEventInDayBlock


T = TypeVar("T", bound="ChoreEntry")


@_attrs_define
class ChoreEntry:
    """Result entry.

    Attributes:
        chore (Chore): A chore.
        time_events (list[TimeEventInDayBlock]):
    """

    chore: Chore
    time_events: list[TimeEventInDayBlock]
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        chore = self.chore.to_dict()

        time_events = []
        for time_events_item_data in self.time_events:
            time_events_item = time_events_item_data.to_dict()
            time_events.append(time_events_item)

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "chore": chore,
                "time_events": time_events,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.chore import Chore
        from ..models.time_event_in_day_block import TimeEventInDayBlock

        d = dict(src_dict)
        chore = Chore.from_dict(d.pop("chore"))

        time_events = []
        _time_events = d.pop("time_events")
        for time_events_item_data in _time_events:
            time_events_item = TimeEventInDayBlock.from_dict(time_events_item_data)

            time_events.append(time_events_item)

        chore_entry = cls(
            chore=chore,
            time_events=time_events,
        )

        chore_entry.additional_properties = d
        return chore_entry

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
