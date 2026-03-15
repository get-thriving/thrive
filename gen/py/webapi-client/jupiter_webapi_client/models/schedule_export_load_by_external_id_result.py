from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.schedule_export import ScheduleExport
    from ..models.schedule_export_load_by_external_id_schedule_stream_entry import (
        ScheduleExportLoadByExternalIdScheduleStreamEntry,
    )


T = TypeVar("T", bound="ScheduleExportLoadByExternalIdResult")


@_attrs_define
class ScheduleExportLoadByExternalIdResult:
    """Result.

    Attributes:
        export (ScheduleExport): A calendar export configuration that bundles multiple schedule streams.
        entries (list[ScheduleExportLoadByExternalIdScheduleStreamEntry]):
    """

    export: ScheduleExport
    entries: list[ScheduleExportLoadByExternalIdScheduleStreamEntry]
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        export = self.export.to_dict()

        entries = []
        for entries_item_data in self.entries:
            entries_item = entries_item_data.to_dict()
            entries.append(entries_item)

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "export": export,
                "entries": entries,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.schedule_export import ScheduleExport
        from ..models.schedule_export_load_by_external_id_schedule_stream_entry import (
            ScheduleExportLoadByExternalIdScheduleStreamEntry,
        )

        d = dict(src_dict)
        export = ScheduleExport.from_dict(d.pop("export"))

        entries = []
        _entries = d.pop("entries")
        for entries_item_data in _entries:
            entries_item = ScheduleExportLoadByExternalIdScheduleStreamEntry.from_dict(entries_item_data)

            entries.append(entries_item)

        schedule_export_load_by_external_id_result = cls(
            export=export,
            entries=entries,
        )

        schedule_export_load_by_external_id_result.additional_properties = d
        return schedule_export_load_by_external_id_result

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
