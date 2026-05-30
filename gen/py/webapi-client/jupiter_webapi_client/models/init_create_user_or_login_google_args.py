from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

T = TypeVar("T", bound="InitCreateUserOrLoginGoogleArgs")


@_attrs_define
class InitCreateUserOrLoginGoogleArgs:
    """Init create user or login (Google auth) use case arguments.

    Attributes:
        google_auth_code (str): A Google OAuth authorisation code or access token. Never stored.
        callback_uri (str): A system URL that may point at localhost.
    """

    google_auth_code: str
    callback_uri: str
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        google_auth_code = self.google_auth_code

        callback_uri = self.callback_uri

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "google_auth_code": google_auth_code,
                "callback_uri": callback_uri,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        google_auth_code = d.pop("google_auth_code")

        callback_uri = d.pop("callback_uri")

        init_create_user_or_login_google_args = cls(
            google_auth_code=google_auth_code,
            callback_uri=callback_uri,
        )

        init_create_user_or_login_google_args.additional_properties = d
        return init_create_user_or_login_google_args

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
