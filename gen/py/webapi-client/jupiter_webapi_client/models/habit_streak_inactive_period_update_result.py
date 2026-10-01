from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.habit_streak_inactive_period import HabitStreakInactivePeriod


T = TypeVar("T", bound="HabitStreakInactivePeriodUpdateResult")


@_attrs_define
class HabitStreakInactivePeriodUpdateResult:
    """Habit streak inactive period update result.

    Attributes:
        updated_period (HabitStreakInactivePeriod): A date range whose streak days should render as inactive.
    """

    updated_period: HabitStreakInactivePeriod
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        updated_period = self.updated_period.to_dict()

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "updated_period": updated_period,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.habit_streak_inactive_period import HabitStreakInactivePeriod  # noqa: PLC0415

        d = dict(src_dict)
        updated_period = HabitStreakInactivePeriod.from_dict(d.pop("updated_period"))

        habit_streak_inactive_period_update_result = cls(
            updated_period=updated_period,
        )

        habit_streak_inactive_period_update_result.additional_properties = d
        return habit_streak_inactive_period_update_result

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
