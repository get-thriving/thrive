from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.schedule_export_update_args_name import ScheduleExportUpdateArgsName
    from ..models.schedule_export_update_args_schedule_stream_ref_ids import (
        ScheduleExportUpdateArgsScheduleStreamRefIds,
    )


T = TypeVar("T", bound="ScheduleExportUpdateArgs")


@_attrs_define
class ScheduleExportUpdateArgs:
    """Args.

    Attributes:
        ref_id (str): A generic entity id.
        name (ScheduleExportUpdateArgsName):
        schedule_stream_ref_ids (ScheduleExportUpdateArgsScheduleStreamRefIds):
    """

    ref_id: str
    name: ScheduleExportUpdateArgsName
    schedule_stream_ref_ids: ScheduleExportUpdateArgsScheduleStreamRefIds
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        ref_id = self.ref_id

        name = self.name.to_dict()

        schedule_stream_ref_ids = self.schedule_stream_ref_ids.to_dict()

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "ref_id": ref_id,
                "name": name,
                "schedule_stream_ref_ids": schedule_stream_ref_ids,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.schedule_export_update_args_name import ScheduleExportUpdateArgsName
        from ..models.schedule_export_update_args_schedule_stream_ref_ids import (
            ScheduleExportUpdateArgsScheduleStreamRefIds,
        )

        d = dict(src_dict)
        ref_id = d.pop("ref_id")

        name = ScheduleExportUpdateArgsName.from_dict(d.pop("name"))

        schedule_stream_ref_ids = ScheduleExportUpdateArgsScheduleStreamRefIds.from_dict(
            d.pop("schedule_stream_ref_ids")
        )

        schedule_export_update_args = cls(
            ref_id=ref_id,
            name=name,
            schedule_stream_ref_ids=schedule_stream_ref_ids,
        )

        schedule_export_update_args.additional_properties = d
        return schedule_export_update_args

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
