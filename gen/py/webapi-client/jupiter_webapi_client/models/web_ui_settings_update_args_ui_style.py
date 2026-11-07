from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..models.ui_style import UiStyle
from ..types import UNSET, Unset

T = TypeVar("T", bound="WebUiSettingsUpdateArgsUiStyle")


@_attrs_define
class WebUiSettingsUpdateArgsUiStyle:
    """
    Attributes:
        should_change (bool):
        value (UiStyle | Unset): The UI style of the web app: the original look, or Strata.
    """

    should_change: bool
    value: UiStyle | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        should_change = self.should_change

        value: str | Unset = UNSET
        if not isinstance(self.value, Unset):
            value = self.value.value

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "should_change": should_change,
            }
        )
        if value is not UNSET:
            field_dict["value"] = value

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        should_change = d.pop("should_change")

        _value = d.pop("value", UNSET)
        value: UiStyle | Unset
        if isinstance(_value, Unset):
            value = UNSET
        else:
            value = UiStyle(_value)

        web_ui_settings_update_args_ui_style = cls(
            should_change=should_change,
            value=value,
        )

        web_ui_settings_update_args_ui_style.additional_properties = d
        return web_ui_settings_update_args_ui_style

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
