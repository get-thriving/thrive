from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

T = TypeVar("T", bound="HabitStreakInactivePeriodResetArgs")


@_attrs_define
class HabitStreakInactivePeriodResetArgs:
    """Habit streak inactive period reset args.

    Attributes:
        habit_ref_id (str): A generic entity id.
        name (str): The name for an entity which acts as both name and unique identifier.
    """

    habit_ref_id: str
    name: str
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        habit_ref_id = self.habit_ref_id

        name = self.name

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "habit_ref_id": habit_ref_id,
                "name": name,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        habit_ref_id = d.pop("habit_ref_id")

        name = d.pop("name")

        habit_streak_inactive_period_reset_args = cls(
            habit_ref_id=habit_ref_id,
            name=name,
        )

        habit_streak_inactive_period_reset_args.additional_properties = d
        return habit_streak_inactive_period_reset_args

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
