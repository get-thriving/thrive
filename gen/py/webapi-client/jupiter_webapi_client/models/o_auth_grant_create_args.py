from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..models.pkce_code_challenge_method import PkceCodeChallengeMethod

T = TypeVar("T", bound="OAuthGrantCreateArgs")


@_attrs_define
class OAuthGrantCreateArgs:
    """OAuth grant create args.

    Attributes:
        client_id (str): The identifier an OAuth client uses to identify itself.

            For apps that describe themselves this is the URL of their metadata document.
            Until those documents are fetched, any visible text without spaces is allowed.
        redirect_uri (str): A system URL that may point at localhost.
        resource (str): The resource an OAuth grant gives access to.

            This is the resource indicator from RFC 8707: the URL of the server the
            access is for, such as the MCP endpoint. The client names it when it asks for
            access, and the grant is tied to it so the access cannot be used for another
            server.
        code_challenge (str): The S256 fingerprint of a verifier, which the client sends up front.
        code_challenge_method (PkceCodeChallengeMethod): The method a PKCE code challenge was made with.

            Only S256, the SHA-256 form, is supported. The plain method, where the challenge
            is the verifier itself, gives no protection against an intercepted code.
    """

    client_id: str
    redirect_uri: str
    resource: str
    code_challenge: str
    code_challenge_method: PkceCodeChallengeMethod
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        client_id = self.client_id

        redirect_uri = self.redirect_uri

        resource = self.resource

        code_challenge = self.code_challenge

        code_challenge_method = self.code_challenge_method.value

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "client_id": client_id,
                "redirect_uri": redirect_uri,
                "resource": resource,
                "code_challenge": code_challenge,
                "code_challenge_method": code_challenge_method,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        client_id = d.pop("client_id")

        redirect_uri = d.pop("redirect_uri")

        resource = d.pop("resource")

        code_challenge = d.pop("code_challenge")

        code_challenge_method = PkceCodeChallengeMethod(d.pop("code_challenge_method"))

        o_auth_grant_create_args = cls(
            client_id=client_id,
            redirect_uri=redirect_uri,
            resource=resource,
            code_challenge=code_challenge,
            code_challenge_method=code_challenge_method,
        )

        o_auth_grant_create_args.additional_properties = d
        return o_auth_grant_create_args

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
