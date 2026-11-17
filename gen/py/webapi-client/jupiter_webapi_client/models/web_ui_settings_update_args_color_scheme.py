from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..models.color_scheme import ColorScheme
from ..types import UNSET, Unset

T = TypeVar("T", bound="WebUiSettingsUpdateArgsColorScheme")


@_attrs_define
class WebUiSettingsUpdateArgsColorScheme:
    """
    Attributes:
        should_change (bool):
        value (ColorScheme | Unset): The color scheme of the web app: light, dark, or the one the device uses.
    """

    should_change: bool
    value: ColorScheme | Unset = UNSET
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
        value: ColorScheme | Unset
        if isinstance(_value, Unset):
            value = UNSET
        else:
            value = ColorScheme(_value)

        web_ui_settings_update_args_color_scheme = cls(
            should_change=should_change,
            value=value,
        )

        web_ui_settings_update_args_color_scheme.additional_properties = d
        return web_ui_settings_update_args_color_scheme

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
