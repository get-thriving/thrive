from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.habit import Habit
    from ..models.habit_streak_inactive_period import HabitStreakInactivePeriod
    from ..models.habit_streak_mark import HabitStreakMark


T = TypeVar("T", bound="HabitFindStreaksResultEntry")


@_attrs_define
class HabitFindStreaksResultEntry:
    """The streak of a single habit.

    Attributes:
        habit (Habit): A habit.
        streak_marks (list[HabitStreakMark]):
        streak_inactive_periods (list[HabitStreakInactivePeriod]):
    """

    habit: Habit
    streak_marks: list[HabitStreakMark]
    streak_inactive_periods: list[HabitStreakInactivePeriod]
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        habit = self.habit.to_dict()

        streak_marks = []
        for streak_marks_item_data in self.streak_marks:
            streak_marks_item = streak_marks_item_data.to_dict()
            streak_marks.append(streak_marks_item)

        streak_inactive_periods = []
        for streak_inactive_periods_item_data in self.streak_inactive_periods:
            streak_inactive_periods_item = streak_inactive_periods_item_data.to_dict()
            streak_inactive_periods.append(streak_inactive_periods_item)

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "habit": habit,
                "streak_marks": streak_marks,
                "streak_inactive_periods": streak_inactive_periods,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.habit import Habit  # noqa: PLC0415
        from ..models.habit_streak_inactive_period import HabitStreakInactivePeriod  # noqa: PLC0415
        from ..models.habit_streak_mark import HabitStreakMark  # noqa: PLC0415

        d = dict(src_dict)
        habit = Habit.from_dict(d.pop("habit"))

        streak_marks = []
        _streak_marks = d.pop("streak_marks")
        for streak_marks_item_data in _streak_marks:
            streak_marks_item = HabitStreakMark.from_dict(streak_marks_item_data)

            streak_marks.append(streak_marks_item)

        streak_inactive_periods = []
        _streak_inactive_periods = d.pop("streak_inactive_periods")
        for streak_inactive_periods_item_data in _streak_inactive_periods:
            streak_inactive_periods_item = HabitStreakInactivePeriod.from_dict(streak_inactive_periods_item_data)

            streak_inactive_periods.append(streak_inactive_periods_item)

        habit_find_streaks_result_entry = cls(
            habit=habit,
            streak_marks=streak_marks,
            streak_inactive_periods=streak_inactive_periods,
        )

        habit_find_streaks_result_entry.additional_properties = d
        return habit_find_streaks_result_entry

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
