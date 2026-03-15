from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

T = TypeVar("T", bound="ScheduleExportCreateArgs")


@_attrs_define
class ScheduleExportCreateArgs:
    """Args.

    Attributes:
        name (str): The name of a schedule export.
        schedule_stream_ref_ids (list[str]):
    """

    name: str
    schedule_stream_ref_ids: list[str]
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        name = self.name

        schedule_stream_ref_ids = self.schedule_stream_ref_ids

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "name": name,
                "schedule_stream_ref_ids": schedule_stream_ref_ids,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        name = d.pop("name")

        schedule_stream_ref_ids = cast(list[str], d.pop("schedule_stream_ref_ids"))

        schedule_export_create_args = cls(
            name=name,
            schedule_stream_ref_ids=schedule_stream_ref_ids,
        )

        schedule_export_create_args.additional_properties = d
        return schedule_export_create_args

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
