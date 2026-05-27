from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.aspect_update_args_name import AspectUpdateArgsName
    from ..models.aspect_update_args_parent_aspect_ref_id import AspectUpdateArgsParentAspectRefId


T = TypeVar("T", bound="AspectUpdateArgs")


@_attrs_define
class AspectUpdateArgs:
    """PersonFindArgs.

    Attributes:
        ref_id (str): A generic entity id.
        name (AspectUpdateArgsName):
        parent_aspect_ref_id (AspectUpdateArgsParentAspectRefId):
    """

    ref_id: str
    name: AspectUpdateArgsName
    parent_aspect_ref_id: AspectUpdateArgsParentAspectRefId
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        ref_id = self.ref_id

        name = self.name.to_dict()

        parent_aspect_ref_id = self.parent_aspect_ref_id.to_dict()

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "ref_id": ref_id,
                "name": name,
                "parent_aspect_ref_id": parent_aspect_ref_id,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.aspect_update_args_name import AspectUpdateArgsName
        from ..models.aspect_update_args_parent_aspect_ref_id import AspectUpdateArgsParentAspectRefId

        d = dict(src_dict)
        ref_id = d.pop("ref_id")

        name = AspectUpdateArgsName.from_dict(d.pop("name"))

        parent_aspect_ref_id = AspectUpdateArgsParentAspectRefId.from_dict(d.pop("parent_aspect_ref_id"))

        aspect_update_args = cls(
            ref_id=ref_id,
            name=name,
            parent_aspect_ref_id=parent_aspect_ref_id,
        )

        aspect_update_args.additional_properties = d
        return aspect_update_args

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
