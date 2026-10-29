from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..models.image_purpose import ImagePurpose

T = TypeVar("T", bound="ImageLoadArgs")


@_attrs_define
class ImageLoadArgs:
    """ImageLoad args.

    Attributes:
        purpose (ImagePurpose): What a stored image is used for.

            Each purpose has its own bucket or directory, so a new use of images (for
            example pictures inside docs) gets a clean namespace and its own rules.
        path (str): The path of an image inside the store of a purpose.

            A relative path of lowercase segments, ending in a known image extension.
            These end up in file names and URLs, so anything else is rejected here
            rather than trusted further down.
    """

    purpose: ImagePurpose
    path: str
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        purpose = self.purpose.value

        path = self.path

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "purpose": purpose,
                "path": path,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        purpose = ImagePurpose(d.pop("purpose"))

        path = d.pop("path")

        image_load_args = cls(
            purpose=purpose,
            path=path,
        )

        image_load_args.additional_properties = d
        return image_load_args

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
