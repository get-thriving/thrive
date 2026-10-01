from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

T = TypeVar("T", bound="HabitStreakInactivePeriodCreateArgs")


@_attrs_define
class HabitStreakInactivePeriodCreateArgs:
    """Habit streak inactive period create args.

    Attributes:
        habit_ref_id (str): A generic entity id.
        name (str): The name for an entity which acts as both name and unique identifier.
        start_date (str): A date or possibly a datetime for the application.
        end_date (str): A date or possibly a datetime for the application.
    """

    habit_ref_id: str
    name: str
    start_date: str
    end_date: str
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        habit_ref_id = self.habit_ref_id

        name = self.name

        start_date = self.start_date

        end_date = self.end_date

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "habit_ref_id": habit_ref_id,
                "name": name,
                "start_date": start_date,
                "end_date": end_date,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        habit_ref_id = d.pop("habit_ref_id")

        name = d.pop("name")

        start_date = d.pop("start_date")

        end_date = d.pop("end_date")

        habit_streak_inactive_period_create_args = cls(
            habit_ref_id=habit_ref_id,
            name=name,
            start_date=start_date,
            end_date=end_date,
        )

        habit_streak_inactive_period_create_args.additional_properties = d
        return habit_streak_inactive_period_create_args

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
