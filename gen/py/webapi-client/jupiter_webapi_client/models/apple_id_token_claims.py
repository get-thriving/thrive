from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..types import UNSET, Unset

T = TypeVar("T", bound="AppleIdTokenClaims")


@_attrs_define
class AppleIdTokenClaims:
    """Profile fields extracted from an Apple ID token payload.

    Attributes:
        sub (str): The Apple subject ID for a user.
        email (str): An email address.
        email_verified (bool):
        is_private_email (bool | None | Unset):
    """

    sub: str
    email: str
    email_verified: bool
    is_private_email: bool | None | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        sub = self.sub

        email = self.email

        email_verified = self.email_verified

        is_private_email: bool | None | Unset
        if isinstance(self.is_private_email, Unset):
            is_private_email = UNSET
        else:
            is_private_email = self.is_private_email

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "sub": sub,
                "email": email,
                "email_verified": email_verified,
            }
        )
        if is_private_email is not UNSET:
            field_dict["is_private_email"] = is_private_email

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        sub = d.pop("sub")

        email = d.pop("email")

        email_verified = d.pop("email_verified")

        def _parse_is_private_email(data: object) -> bool | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(bool | None | Unset, data)

        is_private_email = _parse_is_private_email(d.pop("is_private_email", UNSET))

        apple_id_token_claims = cls(
            sub=sub,
            email=email,
            email_verified=email_verified,
            is_private_email=is_private_email,
        )

        apple_id_token_claims.additional_properties = d
        return apple_id_token_claims

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
