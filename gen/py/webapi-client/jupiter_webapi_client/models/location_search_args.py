from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..types import UNSET, Unset

T = TypeVar("T", bound="LocationSearchArgs")


@_attrs_define
class LocationSearchArgs:
    """LocationSearch args."""

    query: str
    limit: None | int | Unset = UNSET
    include_archived: None | bool | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        field_dict: dict[str, Any] = {"query": self.query}
        if not isinstance(self.limit, Unset):
            field_dict["limit"] = self.limit
        if not isinstance(self.include_archived, Unset):
            field_dict["include_archived"] = self.include_archived
        field_dict.update(self.additional_properties)
        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        args = cls(
            query=d.pop("query"),
            limit=d.pop("limit", UNSET),
            include_archived=d.pop("include_archived", UNSET),
        )
        args.additional_properties = d
        return args
