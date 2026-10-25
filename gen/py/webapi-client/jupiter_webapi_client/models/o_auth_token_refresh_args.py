from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

T = TypeVar("T", bound="OAuthTokenRefreshArgs")


@_attrs_define
class OAuthTokenRefreshArgs:
    """OAuth token refresh args.

    Attributes:
        refresh_token (str): A refresh token, as the client sees it: ``or_<grant id>.<secret>``.
        client_id (str): The identifier an OAuth client uses to identify itself.

            For apps that describe themselves this is the URL of their metadata document.
            Until those documents are fetched, any visible text without spaces is allowed.
    """

    refresh_token: str
    client_id: str
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        refresh_token = self.refresh_token

        client_id = self.client_id

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "refresh_token": refresh_token,
                "client_id": client_id,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        refresh_token = d.pop("refresh_token")

        client_id = d.pop("client_id")

        o_auth_token_refresh_args = cls(
            refresh_token=refresh_token,
            client_id=client_id,
        )

        o_auth_token_refresh_args.additional_properties = d
        return o_auth_token_refresh_args

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
