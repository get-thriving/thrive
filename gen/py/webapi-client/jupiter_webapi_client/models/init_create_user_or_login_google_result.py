from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.user import User


T = TypeVar("T", bound="InitCreateUserOrLoginGoogleResult")


@_attrs_define
class InitCreateUserOrLoginGoogleResult:
    """Init create user or login (Google auth) use case result.

    Attributes:
        new_user (User): A user of jupiter.
        auth_token_ext (str): An externally facing authentication token.
    """

    new_user: User
    auth_token_ext: str
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        new_user = self.new_user.to_dict()

        auth_token_ext = self.auth_token_ext

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "new_user": new_user,
                "auth_token_ext": auth_token_ext,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.user import User

        d = dict(src_dict)
        new_user = User.from_dict(d.pop("new_user"))

        auth_token_ext = d.pop("auth_token_ext")

        init_create_user_or_login_google_result = cls(
            new_user=new_user,
            auth_token_ext=auth_token_ext,
        )

        init_create_user_or_login_google_result.additional_properties = d
        return init_create_user_or_login_google_result

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
