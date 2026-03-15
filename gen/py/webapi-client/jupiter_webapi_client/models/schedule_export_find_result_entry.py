from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.schedule_export import ScheduleExport


T = TypeVar("T", bound="ScheduleExportFindResultEntry")


@_attrs_define
class ScheduleExportFindResultEntry:
    """A single entry in the find schedule exports response.

    Attributes:
        schedule_export (ScheduleExport): A calendar export configuration that bundles multiple schedule streams.
    """

    schedule_export: ScheduleExport
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        schedule_export = self.schedule_export.to_dict()

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "schedule_export": schedule_export,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.schedule_export import ScheduleExport

        d = dict(src_dict)
        schedule_export = ScheduleExport.from_dict(d.pop("schedule_export"))

        schedule_export_find_result_entry = cls(
            schedule_export=schedule_export,
        )

        schedule_export_find_result_entry.additional_properties = d
        return schedule_export_find_result_entry

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
