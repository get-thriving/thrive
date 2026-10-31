from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..models.image_content_type import ImageContentType

T = TypeVar("T", bound="ImageLoadResult")


@_attrs_define
class ImageLoadResult:
    """ImageLoad result.

    Attributes:
        content_type (ImageContentType): The content type of a stored image.

            The store only ever holds images we normalised ourselves, so this lists
            the formats we write rather than the ones we accept.
        content_base64 (str):
    """

    content_type: ImageContentType
    content_base64: str
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        content_type = self.content_type.value

        content_base64 = self.content_base64

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "content_type": content_type,
                "content_base64": content_base64,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        content_type = ImageContentType(d.pop("content_type"))

        content_base64 = d.pop("content_base64")

        image_load_result = cls(
            content_type=content_type,
            content_base64=content_base64,
        )

        image_load_result.additional_properties = d
        return image_load_result

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
