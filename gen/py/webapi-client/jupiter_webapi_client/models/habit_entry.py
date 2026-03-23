from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.habit import Habit
    from ..models.time_event_in_day_block import TimeEventInDayBlock


T = TypeVar("T", bound="HabitEntry")


@_attrs_define
class HabitEntry:
    """Result entry.

    Attributes:
        habit (Habit): A habit.
        time_events (list[TimeEventInDayBlock]):
    """

    habit: Habit
    time_events: list[TimeEventInDayBlock]
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        habit = self.habit.to_dict()

        time_events = []
        for time_events_item_data in self.time_events:
            time_events_item = time_events_item_data.to_dict()
            time_events.append(time_events_item)

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "habit": habit,
                "time_events": time_events,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.habit import Habit
        from ..models.time_event_in_day_block import TimeEventInDayBlock

        d = dict(src_dict)
        habit = Habit.from_dict(d.pop("habit"))

        time_events = []
        _time_events = d.pop("time_events")
        for time_events_item_data in _time_events:
            time_events_item = TimeEventInDayBlock.from_dict(time_events_item_data)

            time_events.append(time_events_item)

        habit_entry = cls(
            habit=habit,
            time_events=time_events,
        )

        habit_entry.additional_properties = d
        return habit_entry

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
