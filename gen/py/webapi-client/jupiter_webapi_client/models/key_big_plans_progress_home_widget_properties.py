from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..models.key_big_plans_progress_home_widget_properties_kind import KeyBigPlansProgressHomeWidgetPropertiesKind

T = TypeVar("T", bound="KeyBigPlansProgressHomeWidgetProperties")


@_attrs_define
class KeyBigPlansProgressHomeWidgetProperties:
    """The properties of a key big plans progress home widget.

    The widget shows the progress of exactly these big plans. It lays them out
    by how pressing they are, the same as it always has, so unlike the habits
    of a key habits streaks widget their order here carries no meaning.

        Attributes:
            kind (KeyBigPlansProgressHomeWidgetPropertiesKind):
            big_plan_ref_ids (list[str]):
    """

    kind: KeyBigPlansProgressHomeWidgetPropertiesKind
    big_plan_ref_ids: list[str]
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        kind = self.kind.value

        big_plan_ref_ids = self.big_plan_ref_ids

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "kind": kind,
                "big_plan_ref_ids": big_plan_ref_ids,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        kind = KeyBigPlansProgressHomeWidgetPropertiesKind(d.pop("kind"))

        big_plan_ref_ids = cast(list[str], d.pop("big_plan_ref_ids"))

        key_big_plans_progress_home_widget_properties = cls(
            kind=kind,
            big_plan_ref_ids=big_plan_ref_ids,
        )

        key_big_plans_progress_home_widget_properties.additional_properties = d
        return key_big_plans_progress_home_widget_properties

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
