from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..models.tag_namespace import TagNamespace

T = TypeVar("T", bound="TagCreateArgs")


@_attrs_define
class TagCreateArgs:
    """TagCreate args.

    Attributes:
        namespace (TagNamespace): The namespace of a tag.
        name (str): The base value object for any kind of tag tag.
    """

    namespace: TagNamespace
    name: str
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        namespace = self.namespace.value

        name = self.name

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "namespace": namespace,
                "name": name,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        namespace = TagNamespace(d.pop("namespace"))

        name = d.pop("name")

        tag_create_args = cls(
            namespace=namespace,
            name=name,
        )

        tag_create_args.additional_properties = d
        return tag_create_args

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
