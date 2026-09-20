from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..models.schedulability import Schedulability
from ..types import UNSET, Unset

T = TypeVar("T", bound="SchedulingParams")


@_attrs_define
class SchedulingParams:
    """Parameters for scheduling the work an entity generates.

    Attributes:
        schedulability (Schedulability): Whether the work an entity generates can be placed in the calendar.
        event_duration_mins (int | None | Unset):
        event_count (int | None | Unset):
    """

    schedulability: Schedulability
    event_duration_mins: int | None | Unset = UNSET
    event_count: int | None | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        schedulability = self.schedulability.value

        event_duration_mins: int | None | Unset
        if isinstance(self.event_duration_mins, Unset):
            event_duration_mins = UNSET
        else:
            event_duration_mins = self.event_duration_mins

        event_count: int | None | Unset
        if isinstance(self.event_count, Unset):
            event_count = UNSET
        else:
            event_count = self.event_count

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "schedulability": schedulability,
            }
        )
        if event_duration_mins is not UNSET:
            field_dict["event_duration_mins"] = event_duration_mins
        if event_count is not UNSET:
            field_dict["event_count"] = event_count

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        schedulability = Schedulability(d.pop("schedulability"))

        def _parse_event_duration_mins(data: object) -> int | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(int | None | Unset, data)

        event_duration_mins = _parse_event_duration_mins(d.pop("event_duration_mins", UNSET))

        def _parse_event_count(data: object) -> int | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(int | None | Unset, data)

        event_count = _parse_event_count(d.pop("event_count", UNSET))

        scheduling_params = cls(
            schedulability=schedulability,
            event_duration_mins=event_duration_mins,
            event_count=event_count,
        )

        scheduling_params.additional_properties = d
        return scheduling_params

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
