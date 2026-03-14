from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.mcp_key_summary import MCPKeySummary


T = TypeVar("T", bound="MCPKeyLoadResult")


@_attrs_define
class MCPKeyLoadResult:
    """MCPKeyLoad result.

    Attributes:
        mcp_key (MCPKeySummary): Summary of an MCP key, safe for web display.
    """

    mcp_key: MCPKeySummary
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        mcp_key = self.mcp_key.to_dict()

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "mcp_key": mcp_key,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.mcp_key_summary import MCPKeySummary

        d = dict(src_dict)
        mcp_key = MCPKeySummary.from_dict(d.pop("mcp_key"))

        mcp_key_load_result = cls(
            mcp_key=mcp_key,
        )

        mcp_key_load_result.additional_properties = d
        return mcp_key_load_result

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
