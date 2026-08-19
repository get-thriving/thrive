from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..types import UNSET, Unset

if TYPE_CHECKING:
    from ..models.aspect import Aspect
    from ..models.habit import Habit


T = TypeVar("T", bound="HabitFindSuitableForTimePlanResultEntry")


@_attrs_define
class HabitFindSuitableForTimePlanResultEntry:
    """A habit with suitability for adding to a time plan.

    Attributes:
        habit (Habit): A habit.
        has_uncompleted_historical_inbox_tasks (bool):
        would_generate_in_time_plan (bool):
        aspect (Aspect | None | Unset):
    """

    habit: Habit
    has_uncompleted_historical_inbox_tasks: bool
    would_generate_in_time_plan: bool
    aspect: Aspect | None | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        from ..models.aspect import Aspect

        habit = self.habit.to_dict()

        has_uncompleted_historical_inbox_tasks = self.has_uncompleted_historical_inbox_tasks

        would_generate_in_time_plan = self.would_generate_in_time_plan

        aspect: dict[str, Any] | None | Unset
        if isinstance(self.aspect, Unset):
            aspect = UNSET
        elif isinstance(self.aspect, Aspect):
            aspect = self.aspect.to_dict()
        else:
            aspect = self.aspect

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "habit": habit,
                "has_uncompleted_historical_inbox_tasks": has_uncompleted_historical_inbox_tasks,
                "would_generate_in_time_plan": would_generate_in_time_plan,
            }
        )
        if aspect is not UNSET:
            field_dict["aspect"] = aspect

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.aspect import Aspect
        from ..models.habit import Habit

        d = dict(src_dict)
        habit = Habit.from_dict(d.pop("habit"))

        has_uncompleted_historical_inbox_tasks = d.pop("has_uncompleted_historical_inbox_tasks")

        would_generate_in_time_plan = d.pop("would_generate_in_time_plan")

        def _parse_aspect(data: object) -> Aspect | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, dict):
                    raise TypeError()
                aspect_type_0 = Aspect.from_dict(data)

                return aspect_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(Aspect | None | Unset, data)

        aspect = _parse_aspect(d.pop("aspect", UNSET))

        habit_find_suitable_for_time_plan_result_entry = cls(
            habit=habit,
            has_uncompleted_historical_inbox_tasks=has_uncompleted_historical_inbox_tasks,
            would_generate_in_time_plan=would_generate_in_time_plan,
            aspect=aspect,
        )

        habit_find_suitable_for_time_plan_result_entry.additional_properties = d
        return habit_find_suitable_for_time_plan_result_entry

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
