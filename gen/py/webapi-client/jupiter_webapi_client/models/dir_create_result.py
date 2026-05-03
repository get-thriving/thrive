from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.dir_ import Dir


T = TypeVar("T", bound="DirCreateResult")


@_attrs_define
class DirCreateResult:
    """DirCreate result.

    Attributes:
        new_dir (Dir): A directory in the doc collection.
    """

    new_dir: Dir
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        new_dir = self.new_dir.to_dict()

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "new_dir": new_dir,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.dir_ import Dir

        d = dict(src_dict)
        new_dir = Dir.from_dict(d.pop("new_dir"))

        dir_create_result = cls(
            new_dir=new_dir,
        )

        dir_create_result.additional_properties = d
        return dir_create_result

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
