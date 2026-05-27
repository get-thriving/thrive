from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

T = TypeVar("T", bound="ChapterCreateArgs")


@_attrs_define
class ChapterCreateArgs:
    """Chapter create args.

    Attributes:
        name (str): The name of a chapter in a life plan.
        aspect_ref_id (str): A generic entity id.
        start_date (str): A date in the life plan.
        end_date (str): A date in the life plan.
    """

    name: str
    aspect_ref_id: str
    start_date: str
    end_date: str
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        name = self.name

        aspect_ref_id = self.aspect_ref_id

        start_date = self.start_date

        end_date = self.end_date

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "name": name,
                "aspect_ref_id": aspect_ref_id,
                "start_date": start_date,
                "end_date": end_date,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        name = d.pop("name")

        aspect_ref_id = d.pop("aspect_ref_id")

        start_date = d.pop("start_date")

        end_date = d.pop("end_date")

        chapter_create_args = cls(
            name=name,
            aspect_ref_id=aspect_ref_id,
            start_date=start_date,
            end_date=end_date,
        )

        chapter_create_args.additional_properties = d
        return chapter_create_args

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
