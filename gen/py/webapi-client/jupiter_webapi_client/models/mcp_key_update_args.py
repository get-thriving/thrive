from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.mcp_key_update_args_name import MCPKeyUpdateArgsName


T = TypeVar("T", bound="MCPKeyUpdateArgs")


@_attrs_define
class MCPKeyUpdateArgs:
    """MCP key update args.

    Attributes:
        ref_id (str): A generic entity id.
        name (MCPKeyUpdateArgsName):
    """

    ref_id: str
    name: MCPKeyUpdateArgsName
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        ref_id = self.ref_id

        name = self.name.to_dict()

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "ref_id": ref_id,
                "name": name,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.mcp_key_update_args_name import MCPKeyUpdateArgsName

        d = dict(src_dict)
        ref_id = d.pop("ref_id")

        name = MCPKeyUpdateArgsName.from_dict(d.pop("name"))

        mcp_key_update_args = cls(
            ref_id=ref_id,
            name=name,
        )

        mcp_key_update_args.additional_properties = d
        return mcp_key_update_args

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
