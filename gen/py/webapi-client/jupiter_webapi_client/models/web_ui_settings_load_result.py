from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.web_ui_settings import WebUiSettings


T = TypeVar("T", bound="WebUiSettingsLoadResult")


@_attrs_define
class WebUiSettingsLoadResult:
    """Web UI settings load result.

    Attributes:
        web_ui_settings (WebUiSettings): Web UI settings for a user.
    """

    web_ui_settings: WebUiSettings
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        web_ui_settings = self.web_ui_settings.to_dict()

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "web_ui_settings": web_ui_settings,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.web_ui_settings import WebUiSettings

        d = dict(src_dict)
        web_ui_settings = WebUiSettings.from_dict(d.pop("web_ui_settings"))

        web_ui_settings_load_result = cls(
            web_ui_settings=web_ui_settings,
        )

        web_ui_settings_load_result.additional_properties = d
        return web_ui_settings_load_result

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
