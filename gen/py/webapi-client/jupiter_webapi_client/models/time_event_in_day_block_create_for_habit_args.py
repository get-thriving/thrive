from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..types import UNSET, Unset

T = TypeVar("T", bound="TimeEventInDayBlockCreateForHabitArgs")


@_attrs_define
class TimeEventInDayBlockCreateForHabitArgs:
    """Args.

    Attributes:
        habit_ref_id (str): A generic entity id.
        start_date (str): A date or possibly a datetime for the application.
        start_time_in_day (str): The time in hh:mm format.
        duration_mins (int):
        buffer_before_mins (int | None | Unset):
        buffer_after_mins (int | None | Unset):
    """

    habit_ref_id: str
    start_date: str
    start_time_in_day: str
    duration_mins: int
    buffer_before_mins: int | None | Unset = UNSET
    buffer_after_mins: int | None | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        habit_ref_id = self.habit_ref_id

        start_date = self.start_date

        start_time_in_day = self.start_time_in_day

        duration_mins = self.duration_mins

        buffer_before_mins: int | None | Unset
        if isinstance(self.buffer_before_mins, Unset):
            buffer_before_mins = UNSET
        else:
            buffer_before_mins = self.buffer_before_mins

        buffer_after_mins: int | None | Unset
        if isinstance(self.buffer_after_mins, Unset):
            buffer_after_mins = UNSET
        else:
            buffer_after_mins = self.buffer_after_mins

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "habit_ref_id": habit_ref_id,
                "start_date": start_date,
                "start_time_in_day": start_time_in_day,
                "duration_mins": duration_mins,
            }
        )
        if buffer_before_mins is not UNSET:
            field_dict["buffer_before_mins"] = buffer_before_mins
        if buffer_after_mins is not UNSET:
            field_dict["buffer_after_mins"] = buffer_after_mins

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        habit_ref_id = d.pop("habit_ref_id")

        start_date = d.pop("start_date")

        start_time_in_day = d.pop("start_time_in_day")

        duration_mins = d.pop("duration_mins")

        def _parse_buffer_before_mins(data: object) -> int | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(int | None | Unset, data)

        buffer_before_mins = _parse_buffer_before_mins(d.pop("buffer_before_mins", UNSET))

        def _parse_buffer_after_mins(data: object) -> int | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(int | None | Unset, data)

        buffer_after_mins = _parse_buffer_after_mins(d.pop("buffer_after_mins", UNSET))

        time_event_in_day_block_create_for_habit_args = cls(
            habit_ref_id=habit_ref_id,
            start_date=start_date,
            start_time_in_day=start_time_in_day,
            duration_mins=duration_mins,
            buffer_before_mins=buffer_before_mins,
            buffer_after_mins=buffer_after_mins,
        )

        time_event_in_day_block_create_for_habit_args.additional_properties = d
        return time_event_in_day_block_create_for_habit_args

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
