from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..models.user_auth_method import UserAuthMethod

T = TypeVar("T", bound="UnlinkAuthMethodArgs")


@_attrs_define
class UnlinkAuthMethodArgs:
    """Unlink auth method arguments.

    Attributes:
        auth_method (UserAuthMethod): The auth method for a user.
    """

    auth_method: UserAuthMethod
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        auth_method = self.auth_method.value

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "auth_method": auth_method,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        auth_method = UserAuthMethod(d.pop("auth_method"))

        unlink_auth_method_args = cls(
            auth_method=auth_method,
        )

        unlink_auth_method_args.additional_properties = d
        return unlink_auth_method_args

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
