from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..types import UNSET, Unset

T = TypeVar("T", bound="DirSummary")


@_attrs_define
class DirSummary:
    """Summary information about the docs root directory.

    Attributes:
        ref_id (str): A generic entity id.
        name (str): The directory name.
        parent_dir_ref_id (None | str | Unset):
    """

    ref_id: str
    name: str
    parent_dir_ref_id: None | str | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        ref_id = self.ref_id

        name = self.name

        parent_dir_ref_id: None | str | Unset
        if isinstance(self.parent_dir_ref_id, Unset):
            parent_dir_ref_id = UNSET
        else:
            parent_dir_ref_id = self.parent_dir_ref_id

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "ref_id": ref_id,
                "name": name,
            }
        )
        if parent_dir_ref_id is not UNSET:
            field_dict["parent_dir_ref_id"] = parent_dir_ref_id

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        ref_id = d.pop("ref_id")

        name = d.pop("name")

        def _parse_parent_dir_ref_id(data: object) -> None | str | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(None | str | Unset, data)

        parent_dir_ref_id = _parse_parent_dir_ref_id(d.pop("parent_dir_ref_id", UNSET))

        dir_summary = cls(
            ref_id=ref_id,
            name=name,
            parent_dir_ref_id=parent_dir_ref_id,
        )

        dir_summary.additional_properties = d
        return dir_summary

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
