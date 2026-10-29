from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

T = TypeVar("T", bound="UserAvatarClearResult")


@_attrs_define
class UserAvatarClearResult:
    """UserAvatarClear result.

    Attributes:
        avatar_url (str): A link an image can be fetched from.

            Absolute (a public bucket), or relative to the origin the page was served
            from (``/images/...``, the WebUI serves those). The relative form keeps the
            local store free of host and port settings: the browser resolves it against
            whatever server the app is talking to.

            The picture generated from a user's name is a link too: an inline SVG.
    """

    avatar_url: str
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        avatar_url = self.avatar_url

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "avatar_url": avatar_url,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        avatar_url = d.pop("avatar_url")

        user_avatar_clear_result = cls(
            avatar_url=avatar_url,
        )

        user_avatar_clear_result.additional_properties = d
        return user_avatar_clear_result

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
