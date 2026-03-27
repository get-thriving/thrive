from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

T = TypeVar("T", bound="TimeEventInDayBlockCreateForTimePlanActivityArgs")


@_attrs_define
class TimeEventInDayBlockCreateForTimePlanActivityArgs:
    """Args.

    Attributes:
        time_plan_activity_ref_id (str): A generic entity id.
        start_date (str): A date or possibly a datetime for the application.
        start_time_in_day (str): The time in hh:mm format.
        duration_mins (int):
    """

    time_plan_activity_ref_id: str
    start_date: str
    start_time_in_day: str
    duration_mins: int
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        time_plan_activity_ref_id = self.time_plan_activity_ref_id

        start_date = self.start_date

        start_time_in_day = self.start_time_in_day

        duration_mins = self.duration_mins

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "time_plan_activity_ref_id": time_plan_activity_ref_id,
                "start_date": start_date,
                "start_time_in_day": start_time_in_day,
                "duration_mins": duration_mins,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        time_plan_activity_ref_id = d.pop("time_plan_activity_ref_id")

        start_date = d.pop("start_date")

        start_time_in_day = d.pop("start_time_in_day")

        duration_mins = d.pop("duration_mins")

        time_event_in_day_block_create_for_time_plan_activity_args = cls(
            time_plan_activity_ref_id=time_plan_activity_ref_id,
            start_date=start_date,
            start_time_in_day=start_time_in_day,
            duration_mins=duration_mins,
        )

        time_event_in_day_block_create_for_time_plan_activity_args.additional_properties = d
        return time_event_in_day_block_create_for_time_plan_activity_args

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
