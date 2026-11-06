from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..models.key_habits_streaks_home_widget_properties_kind import KeyHabitsStreaksHomeWidgetPropertiesKind

T = TypeVar("T", bound="KeyHabitsStreaksHomeWidgetProperties")


@_attrs_define
class KeyHabitsStreaksHomeWidgetProperties:
    """The properties of a key habits streaks home widget.

    The widget shows the streaks of exactly these habits, in this order.

        Attributes:
            kind (KeyHabitsStreaksHomeWidgetPropertiesKind):
            habit_ref_ids (list[str]):
    """

    kind: KeyHabitsStreaksHomeWidgetPropertiesKind
    habit_ref_ids: list[str]
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        kind = self.kind.value

        habit_ref_ids = self.habit_ref_ids

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "kind": kind,
                "habit_ref_ids": habit_ref_ids,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        kind = KeyHabitsStreaksHomeWidgetPropertiesKind(d.pop("kind"))

        habit_ref_ids = cast(list[str], d.pop("habit_ref_ids"))

        key_habits_streaks_home_widget_properties = cls(
            kind=kind,
            habit_ref_ids=habit_ref_ids,
        )

        key_habits_streaks_home_widget_properties.additional_properties = d
        return key_habits_streaks_home_widget_properties

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
