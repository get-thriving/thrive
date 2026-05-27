from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..types import UNSET, Unset

if TYPE_CHECKING:
    from ..models.inbox_task import InboxTask
    from ..models.note import Note
    from ..models.occasion import Occasion
    from ..models.tag import Tag
    from ..models.time_event_full_days_block import TimeEventFullDaysBlock


T = TypeVar("T", bound="OccasionLoadResult")


@_attrs_define
class OccasionLoadResult:
    """OccasionLoadResult.

    Attributes:
        occasion (Occasion): An occasion.
        tags (list[Tag]):
        occasion_time_event_blocks (list[TimeEventFullDaysBlock]):
        occasion_tasks (list[InboxTask]):
        note (None | Note | Unset):
    """

    occasion: Occasion
    tags: list[Tag]
    occasion_time_event_blocks: list[TimeEventFullDaysBlock]
    occasion_tasks: list[InboxTask]
    note: None | Note | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        from ..models.note import Note

        occasion = self.occasion.to_dict()

        tags = []
        for tags_item_data in self.tags:
            tags_item = tags_item_data.to_dict()
            tags.append(tags_item)

        occasion_time_event_blocks = []
        for occasion_time_event_blocks_item_data in self.occasion_time_event_blocks:
            occasion_time_event_blocks_item = occasion_time_event_blocks_item_data.to_dict()
            occasion_time_event_blocks.append(occasion_time_event_blocks_item)

        occasion_tasks = []
        for occasion_tasks_item_data in self.occasion_tasks:
            occasion_tasks_item = occasion_tasks_item_data.to_dict()
            occasion_tasks.append(occasion_tasks_item)

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
                "occasion": occasion,
                "tags": tags,
                "occasion_time_event_blocks": occasion_time_event_blocks,
                "occasion_tasks": occasion_tasks,
            }
        )
        if note is not UNSET:
            field_dict["note"] = note

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.inbox_task import InboxTask
        from ..models.note import Note
        from ..models.occasion import Occasion
        from ..models.tag import Tag
        from ..models.time_event_full_days_block import TimeEventFullDaysBlock

        d = dict(src_dict)
        occasion = Occasion.from_dict(d.pop("occasion"))

        tags = []
        _tags = d.pop("tags")
        for tags_item_data in _tags:
            tags_item = Tag.from_dict(tags_item_data)

            tags.append(tags_item)

        occasion_time_event_blocks = []
        _occasion_time_event_blocks = d.pop("occasion_time_event_blocks")
        for occasion_time_event_blocks_item_data in _occasion_time_event_blocks:
            occasion_time_event_blocks_item = TimeEventFullDaysBlock.from_dict(occasion_time_event_blocks_item_data)

            occasion_time_event_blocks.append(occasion_time_event_blocks_item)

        occasion_tasks = []
        _occasion_tasks = d.pop("occasion_tasks")
        for occasion_tasks_item_data in _occasion_tasks:
            occasion_tasks_item = InboxTask.from_dict(occasion_tasks_item_data)

            occasion_tasks.append(occasion_tasks_item)

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

        occasion_load_result = cls(
            occasion=occasion,
            tags=tags,
            occasion_time_event_blocks=occasion_time_event_blocks,
            occasion_tasks=occasion_tasks,
            note=note,
        )

        occasion_load_result.additional_properties = d
        return occasion_load_result

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
