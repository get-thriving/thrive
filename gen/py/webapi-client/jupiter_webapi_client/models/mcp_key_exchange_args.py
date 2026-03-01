from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

T = TypeVar("T", bound="MCPKeyExchangeArgs")


@_attrs_define
class MCPKeyExchangeArgs:
    """MCP key exchange arguments.

    Attributes:
        mcp_key_external (str): An external MCP key, as returned to the user.
    """

    mcp_key_external: str
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        mcp_key_external = self.mcp_key_external

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "mcp_key_external": mcp_key_external,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        mcp_key_external = d.pop("mcp_key_external")

        mcp_key_exchange_args = cls(
            mcp_key_external=mcp_key_external,
        )

        mcp_key_exchange_args.additional_properties = d
        return mcp_key_exchange_args

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
