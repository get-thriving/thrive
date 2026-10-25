from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

T = TypeVar("T", bound="OAuthTokenExchangeArgs")


@_attrs_define
class OAuthTokenExchangeArgs:
    """OAuth token exchange args.

    Attributes:
        code (str): An authorization code, as the client sees it: ``oc_<grant id>.<secret>``.
        code_verifier (str): The secret a client makes up when it starts, and shows when it redeems its code.
        client_id (str): The identifier an OAuth client uses to identify itself.

            For apps that describe themselves this is the URL of their metadata document.
            Until those documents are fetched, any visible text without spaces is allowed.
        redirect_uri (str): A system URL that may point at localhost.
        resource (str): The resource an OAuth grant gives access to.

            This is the resource indicator from RFC 8707: the URL of the server the
            access is for, such as the MCP endpoint. The client names it when it asks for
            access, and the grant is tied to it so the access cannot be used for another
            server.
    """

    code: str
    code_verifier: str
    client_id: str
    redirect_uri: str
    resource: str
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        code = self.code

        code_verifier = self.code_verifier

        client_id = self.client_id

        redirect_uri = self.redirect_uri

        resource = self.resource

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "code": code,
                "code_verifier": code_verifier,
                "client_id": client_id,
                "redirect_uri": redirect_uri,
                "resource": resource,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        code = d.pop("code")

        code_verifier = d.pop("code_verifier")

        client_id = d.pop("client_id")

        redirect_uri = d.pop("redirect_uri")

        resource = d.pop("resource")

        o_auth_token_exchange_args = cls(
            code=code,
            code_verifier=code_verifier,
            client_id=client_id,
            redirect_uri=redirect_uri,
            resource=resource,
        )

        o_auth_token_exchange_args.additional_properties = d
        return o_auth_token_exchange_args

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
