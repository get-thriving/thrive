from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.habit_find_streaks_result_entry import HabitFindStreaksResultEntry


T = TypeVar("T", bound="HabitFindStreaksResult")


@_attrs_define
class HabitFindStreaksResult:
    """HabitFindStreaksResult.

    Attributes:
        streak_mark_earliest_date (str): A date or possibly a datetime for the application.
        streak_mark_latest_date (str): A date or possibly a datetime for the application.
        entries (list[HabitFindStreaksResultEntry]):
    """

    streak_mark_earliest_date: str
    streak_mark_latest_date: str
    entries: list[HabitFindStreaksResultEntry]
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        streak_mark_earliest_date = self.streak_mark_earliest_date

        streak_mark_latest_date = self.streak_mark_latest_date

        entries = []
        for entries_item_data in self.entries:
            entries_item = entries_item_data.to_dict()
            entries.append(entries_item)

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "streak_mark_earliest_date": streak_mark_earliest_date,
                "streak_mark_latest_date": streak_mark_latest_date,
                "entries": entries,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.habit_find_streaks_result_entry import HabitFindStreaksResultEntry  # noqa: PLC0415

        d = dict(src_dict)
        streak_mark_earliest_date = d.pop("streak_mark_earliest_date")

        streak_mark_latest_date = d.pop("streak_mark_latest_date")

        entries = []
        _entries = d.pop("entries")
        for entries_item_data in _entries:
            entries_item = HabitFindStreaksResultEntry.from_dict(entries_item_data)

            entries.append(entries_item)

        habit_find_streaks_result = cls(
            streak_mark_earliest_date=streak_mark_earliest_date,
            streak_mark_latest_date=streak_mark_latest_date,
            entries=entries,
        )

        habit_find_streaks_result.additional_properties = d
        return habit_find_streaks_result

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
