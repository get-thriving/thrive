from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.schedule_full_days_event_entry import ScheduleFullDaysEventEntry
    from ..models.schedule_in_day_event_entry import ScheduleInDayEventEntry
    from ..models.schedule_stream import ScheduleStream


T = TypeVar("T", bound="ScheduleExportLoadByExternalIdScheduleStreamEntry")


@_attrs_define
class ScheduleExportLoadByExternalIdScheduleStreamEntry:
    """A schedule stream and the events included in the export.

    Attributes:
        schedule_stream (ScheduleStream): A schedule group or stream of events.
        schedule_event_full_days_entries (list[ScheduleFullDaysEventEntry]):
        schedule_event_in_day_entries (list[ScheduleInDayEventEntry]):
    """

    schedule_stream: ScheduleStream
    schedule_event_full_days_entries: list[ScheduleFullDaysEventEntry]
    schedule_event_in_day_entries: list[ScheduleInDayEventEntry]
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        schedule_stream = self.schedule_stream.to_dict()

        schedule_event_full_days_entries = []
        for schedule_event_full_days_entries_item_data in self.schedule_event_full_days_entries:
            schedule_event_full_days_entries_item = schedule_event_full_days_entries_item_data.to_dict()
            schedule_event_full_days_entries.append(schedule_event_full_days_entries_item)

        schedule_event_in_day_entries = []
        for schedule_event_in_day_entries_item_data in self.schedule_event_in_day_entries:
            schedule_event_in_day_entries_item = schedule_event_in_day_entries_item_data.to_dict()
            schedule_event_in_day_entries.append(schedule_event_in_day_entries_item)

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "schedule_stream": schedule_stream,
                "schedule_event_full_days_entries": schedule_event_full_days_entries,
                "schedule_event_in_day_entries": schedule_event_in_day_entries,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.schedule_full_days_event_entry import ScheduleFullDaysEventEntry
        from ..models.schedule_in_day_event_entry import ScheduleInDayEventEntry
        from ..models.schedule_stream import ScheduleStream

        d = dict(src_dict)
        schedule_stream = ScheduleStream.from_dict(d.pop("schedule_stream"))

        schedule_event_full_days_entries = []
        _schedule_event_full_days_entries = d.pop("schedule_event_full_days_entries")
        for schedule_event_full_days_entries_item_data in _schedule_event_full_days_entries:
            schedule_event_full_days_entries_item = ScheduleFullDaysEventEntry.from_dict(
                schedule_event_full_days_entries_item_data
            )

            schedule_event_full_days_entries.append(schedule_event_full_days_entries_item)

        schedule_event_in_day_entries = []
        _schedule_event_in_day_entries = d.pop("schedule_event_in_day_entries")
        for schedule_event_in_day_entries_item_data in _schedule_event_in_day_entries:
            schedule_event_in_day_entries_item = ScheduleInDayEventEntry.from_dict(
                schedule_event_in_day_entries_item_data
            )

            schedule_event_in_day_entries.append(schedule_event_in_day_entries_item)

        schedule_export_load_by_external_id_schedule_stream_entry = cls(
            schedule_stream=schedule_stream,
            schedule_event_full_days_entries=schedule_event_full_days_entries,
            schedule_event_in_day_entries=schedule_event_in_day_entries,
        )

        schedule_export_load_by_external_id_schedule_stream_entry.additional_properties = d
        return schedule_export_load_by_external_id_schedule_stream_entry

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
