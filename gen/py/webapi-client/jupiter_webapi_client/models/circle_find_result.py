from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.circle import Circle


T = TypeVar("T", bound="CircleFindResult")


@_attrs_define
class CircleFindResult:
    """Circle find result.

    Attributes:
        circles (list[Circle]):
    """

    circles: list[Circle]
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        circles = []
        for circles_item_data in self.circles:
            circles_item = circles_item_data.to_dict()
            circles.append(circles_item)

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "circles": circles,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.circle import Circle

        d = dict(src_dict)
        circles = []
        _circles = d.pop("circles")
        for circles_item_data in _circles:
            circles_item = Circle.from_dict(circles_item_data)

            circles.append(circles_item)

        circle_find_result = cls(
            circles=circles,
        )

        circle_find_result.additional_properties = d
        return circle_find_result

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
