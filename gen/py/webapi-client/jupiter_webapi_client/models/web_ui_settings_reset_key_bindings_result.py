from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.web_ui_settings import WebUiSettings


T = TypeVar("T", bound="WebUiSettingsResetKeyBindingsResult")


@_attrs_define
class WebUiSettingsResetKeyBindingsResult:
    """Web UI settings reset key bindings result.

    Attributes:
        updated_web_ui_settings (WebUiSettings): Web UI settings for a user.
    """

    updated_web_ui_settings: WebUiSettings
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        updated_web_ui_settings = self.updated_web_ui_settings.to_dict()

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "updated_web_ui_settings": updated_web_ui_settings,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.web_ui_settings import WebUiSettings  # noqa: PLC0415

        d = dict(src_dict)
        updated_web_ui_settings = WebUiSettings.from_dict(d.pop("updated_web_ui_settings"))

        web_ui_settings_reset_key_bindings_result = cls(
            updated_web_ui_settings=updated_web_ui_settings,
        )

        web_ui_settings_reset_key_bindings_result.additional_properties = d
        return web_ui_settings_reset_key_bindings_result

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
