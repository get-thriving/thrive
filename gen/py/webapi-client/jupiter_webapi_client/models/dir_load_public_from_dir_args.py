from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

T = TypeVar("T", bound="DirLoadPublicFromDirArgs")


@_attrs_define
class DirLoadPublicFromDirArgs:
    """DirLoadPublicFromDir args.

    Attributes:
        external_id (str): A GUID external id for a publish entity.
        ref_id (str): A generic entity id.
    """

    external_id: str
    ref_id: str
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        external_id = self.external_id

        ref_id = self.ref_id

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "external_id": external_id,
                "ref_id": ref_id,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        external_id = d.pop("external_id")

        ref_id = d.pop("ref_id")

        dir_load_public_from_dir_args = cls(
            external_id=external_id,
            ref_id=ref_id,
        )

        dir_load_public_from_dir_args.additional_properties = d
        return dir_load_public_from_dir_args

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
