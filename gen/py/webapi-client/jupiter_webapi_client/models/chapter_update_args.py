from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.chapter_update_args_aspect_ref_id import ChapterUpdateArgsAspectRefId
    from ..models.chapter_update_args_end_date import ChapterUpdateArgsEndDate
    from ..models.chapter_update_args_name import ChapterUpdateArgsName
    from ..models.chapter_update_args_start_date import ChapterUpdateArgsStartDate


T = TypeVar("T", bound="ChapterUpdateArgs")


@_attrs_define
class ChapterUpdateArgs:
    """Chapter update args.

    Attributes:
        ref_id (str): A generic entity id.
        name (ChapterUpdateArgsName):
        aspect_ref_id (ChapterUpdateArgsAspectRefId):
        start_date (ChapterUpdateArgsStartDate):
        end_date (ChapterUpdateArgsEndDate):
    """

    ref_id: str
    name: ChapterUpdateArgsName
    aspect_ref_id: ChapterUpdateArgsAspectRefId
    start_date: ChapterUpdateArgsStartDate
    end_date: ChapterUpdateArgsEndDate
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        ref_id = self.ref_id

        name = self.name.to_dict()

        aspect_ref_id = self.aspect_ref_id.to_dict()

        start_date = self.start_date.to_dict()

        end_date = self.end_date.to_dict()

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "ref_id": ref_id,
                "name": name,
                "aspect_ref_id": aspect_ref_id,
                "start_date": start_date,
                "end_date": end_date,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.chapter_update_args_aspect_ref_id import ChapterUpdateArgsAspectRefId
        from ..models.chapter_update_args_end_date import ChapterUpdateArgsEndDate
        from ..models.chapter_update_args_name import ChapterUpdateArgsName
        from ..models.chapter_update_args_start_date import ChapterUpdateArgsStartDate

        d = dict(src_dict)
        ref_id = d.pop("ref_id")

        name = ChapterUpdateArgsName.from_dict(d.pop("name"))

        aspect_ref_id = ChapterUpdateArgsAspectRefId.from_dict(d.pop("aspect_ref_id"))

        start_date = ChapterUpdateArgsStartDate.from_dict(d.pop("start_date"))

        end_date = ChapterUpdateArgsEndDate.from_dict(d.pop("end_date"))

        chapter_update_args = cls(
            ref_id=ref_id,
            name=name,
            aspect_ref_id=aspect_ref_id,
            start_date=start_date,
            end_date=end_date,
        )

        chapter_update_args.additional_properties = d
        return chapter_update_args

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
