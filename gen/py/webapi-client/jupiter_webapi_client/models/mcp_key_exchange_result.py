from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

T = TypeVar("T", bound="MCPKeyExchangeResult")


@_attrs_define
class MCPKeyExchangeResult:
    """MCP key exchange result.

    Attributes:
        auth_token_ext (str): An externally facing authentication token.
    """

    auth_token_ext: str
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        auth_token_ext = self.auth_token_ext

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "auth_token_ext": auth_token_ext,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        auth_token_ext = d.pop("auth_token_ext")

        mcp_key_exchange_result = cls(
            auth_token_ext=auth_token_ext,
        )

        mcp_key_exchange_result.additional_properties = d
        return mcp_key_exchange_result

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
