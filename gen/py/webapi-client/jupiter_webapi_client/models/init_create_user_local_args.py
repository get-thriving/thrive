from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

T = TypeVar("T", bound="InitCreateUserLocalArgs")


@_attrs_define
class InitCreateUserLocalArgs:
    """Init create user (local auth) use case arguments.

    Attributes:
        user_email_address (str): An email address.
        user_name (str): The user name for a user of jupiter.
        auth_password (str): A new password in plain text, as received from a user.
        auth_password_repeat (str): A new password in plain text, as received from a user.
    """

    user_email_address: str
    user_name: str
    auth_password: str
    auth_password_repeat: str
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        user_email_address = self.user_email_address

        user_name = self.user_name

        auth_password = self.auth_password

        auth_password_repeat = self.auth_password_repeat

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "user_email_address": user_email_address,
                "user_name": user_name,
                "auth_password": auth_password,
                "auth_password_repeat": auth_password_repeat,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        user_email_address = d.pop("user_email_address")

        user_name = d.pop("user_name")

        auth_password = d.pop("auth_password")

        auth_password_repeat = d.pop("auth_password_repeat")

        init_create_user_local_args = cls(
            user_email_address=user_email_address,
            user_name=user_name,
            auth_password=auth_password,
            auth_password_repeat=auth_password_repeat,
        )

        init_create_user_local_args.additional_properties = d
        return init_create_user_local_args

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
