from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

T = TypeVar("T", bound="HabitFindSuitableForTimePlanArgs")


@_attrs_define
class HabitFindSuitableForTimePlanArgs:
    """Args.

    Attributes:
        time_plan_ref_id (str): A generic entity id.
    """

    time_plan_ref_id: str
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        time_plan_ref_id = self.time_plan_ref_id

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "time_plan_ref_id": time_plan_ref_id,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        time_plan_ref_id = d.pop("time_plan_ref_id")

        habit_find_suitable_for_time_plan_args = cls(
            time_plan_ref_id=time_plan_ref_id,
        )

        habit_find_suitable_for_time_plan_args.additional_properties = d
        return habit_find_suitable_for_time_plan_args

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
