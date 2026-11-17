from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.web_ui_settings_update_args_color_scheme import WebUiSettingsUpdateArgsColorScheme
    from ..models.web_ui_settings_update_args_key_bindings import WebUiSettingsUpdateArgsKeyBindings
    from ..models.web_ui_settings_update_args_use_expanded_rail import WebUiSettingsUpdateArgsUseExpandedRail


T = TypeVar("T", bound="WebUiSettingsUpdateArgs")


@_attrs_define
class WebUiSettingsUpdateArgs:
    """Web UI settings update args.

    Attributes:
        color_scheme (WebUiSettingsUpdateArgsColorScheme):
        use_expanded_rail (WebUiSettingsUpdateArgsUseExpandedRail):
        key_bindings (WebUiSettingsUpdateArgsKeyBindings):
    """

    color_scheme: WebUiSettingsUpdateArgsColorScheme
    use_expanded_rail: WebUiSettingsUpdateArgsUseExpandedRail
    key_bindings: WebUiSettingsUpdateArgsKeyBindings
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        color_scheme = self.color_scheme.to_dict()

        use_expanded_rail = self.use_expanded_rail.to_dict()

        key_bindings = self.key_bindings.to_dict()

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "color_scheme": color_scheme,
                "use_expanded_rail": use_expanded_rail,
                "key_bindings": key_bindings,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.web_ui_settings_update_args_color_scheme import WebUiSettingsUpdateArgsColorScheme  # noqa: PLC0415
        from ..models.web_ui_settings_update_args_key_bindings import WebUiSettingsUpdateArgsKeyBindings  # noqa: PLC0415
        from ..models.web_ui_settings_update_args_use_expanded_rail import WebUiSettingsUpdateArgsUseExpandedRail  # noqa: PLC0415

        d = dict(src_dict)
        color_scheme = WebUiSettingsUpdateArgsColorScheme.from_dict(d.pop("color_scheme"))

        use_expanded_rail = WebUiSettingsUpdateArgsUseExpandedRail.from_dict(d.pop("use_expanded_rail"))

        key_bindings = WebUiSettingsUpdateArgsKeyBindings.from_dict(d.pop("key_bindings"))

        web_ui_settings_update_args = cls(
            color_scheme=color_scheme,
            use_expanded_rail=use_expanded_rail,
            key_bindings=key_bindings,
        )

        web_ui_settings_update_args.additional_properties = d
        return web_ui_settings_update_args

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
