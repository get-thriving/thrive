from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..types import UNSET, Unset

if TYPE_CHECKING:
    from ..models.note import Note
    from ..models.schedule_event_in_day import ScheduleEventInDay
    from ..models.tag import Tag
    from ..models.time_event_in_day_block import TimeEventInDayBlock


T = TypeVar("T", bound="ScheduleEventInDayLoadResult")


@_attrs_define
class ScheduleEventInDayLoadResult:
    """Result.

    Attributes:
        schedule_event_in_day (ScheduleEventInDay): An event in a schedule.
        time_event_in_day_block (TimeEventInDayBlock): Time event.
        tags (list[Tag]):
        note (None | Note | Unset):
    """

    schedule_event_in_day: ScheduleEventInDay
    time_event_in_day_block: TimeEventInDayBlock
    tags: list[Tag]
    note: None | Note | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        from ..models.note import Note

        schedule_event_in_day = self.schedule_event_in_day.to_dict()

        time_event_in_day_block = self.time_event_in_day_block.to_dict()

        tags = []
        for tags_item_data in self.tags:
            tags_item = tags_item_data.to_dict()
            tags.append(tags_item)

        note: dict[str, Any] | None | Unset
        if isinstance(self.note, Unset):
            note = UNSET
        elif isinstance(self.note, Note):
            note = self.note.to_dict()
        else:
            note = self.note

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "schedule_event_in_day": schedule_event_in_day,
                "time_event_in_day_block": time_event_in_day_block,
                "tags": tags,
            }
        )
        if note is not UNSET:
            field_dict["note"] = note

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.note import Note
        from ..models.schedule_event_in_day import ScheduleEventInDay
        from ..models.tag import Tag
        from ..models.time_event_in_day_block import TimeEventInDayBlock

        d = dict(src_dict)
        schedule_event_in_day = ScheduleEventInDay.from_dict(d.pop("schedule_event_in_day"))

        time_event_in_day_block = TimeEventInDayBlock.from_dict(d.pop("time_event_in_day_block"))

        tags = []
        _tags = d.pop("tags")
        for tags_item_data in _tags:
            tags_item = Tag.from_dict(tags_item_data)

            tags.append(tags_item)

        def _parse_note(data: object) -> None | Note | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, dict):
                    raise TypeError()
                note_type_0 = Note.from_dict(data)

                return note_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(None | Note | Unset, data)

        note = _parse_note(d.pop("note", UNSET))

        schedule_event_in_day_load_result = cls(
            schedule_event_in_day=schedule_event_in_day,
            time_event_in_day_block=time_event_in_day_block,
            tags=tags,
            note=note,
        )

        schedule_event_in_day_load_result.additional_properties = d
        return schedule_event_in_day_load_result

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
