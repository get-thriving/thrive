from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..types import UNSET, Unset

if TYPE_CHECKING:
    from ..models.contact import Contact
    from ..models.note import Note
    from ..models.publish_entity import PublishEntity
    from ..models.schedule_event_full_days import ScheduleEventFullDays
    from ..models.schedule_stream_summary import ScheduleStreamSummary
    from ..models.tag import Tag
    from ..models.time_event_full_days_block import TimeEventFullDaysBlock


T = TypeVar("T", bound="ScheduleEventFullDaysLoadResult")


@_attrs_define
class ScheduleEventFullDaysLoadResult:
    """ScheduleEventFullDaysLoadResult.

    Attributes:
        schedule_event_full_days (ScheduleEventFullDays): A full day block in a schedule.
        time_event_full_days_block (TimeEventFullDaysBlock): A full day block of time.
        tags (list[Tag]):
        contacts (list[Contact]):
        schedule_stream (ScheduleStreamSummary): Summary information about a schedule stream.
        note (None | Note | Unset):
        publish_entity (None | PublishEntity | Unset):
    """

    schedule_event_full_days: ScheduleEventFullDays
    time_event_full_days_block: TimeEventFullDaysBlock
    tags: list[Tag]
    contacts: list[Contact]
    schedule_stream: ScheduleStreamSummary
    note: None | Note | Unset = UNSET
    publish_entity: None | PublishEntity | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        from ..models.note import Note
        from ..models.publish_entity import PublishEntity

        schedule_event_full_days = self.schedule_event_full_days.to_dict()

        time_event_full_days_block = self.time_event_full_days_block.to_dict()

        tags = []
        for tags_item_data in self.tags:
            tags_item = tags_item_data.to_dict()
            tags.append(tags_item)

        contacts = []
        for contacts_item_data in self.contacts:
            contacts_item = contacts_item_data.to_dict()
            contacts.append(contacts_item)

        schedule_stream = self.schedule_stream.to_dict()

        note: dict[str, Any] | None | Unset
        if isinstance(self.note, Unset):
            note = UNSET
        elif isinstance(self.note, Note):
            note = self.note.to_dict()
        else:
            note = self.note

        publish_entity: dict[str, Any] | None | Unset
        if isinstance(self.publish_entity, Unset):
            publish_entity = UNSET
        elif isinstance(self.publish_entity, PublishEntity):
            publish_entity = self.publish_entity.to_dict()
        else:
            publish_entity = self.publish_entity

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "schedule_event_full_days": schedule_event_full_days,
                "time_event_full_days_block": time_event_full_days_block,
                "tags": tags,
                "contacts": contacts,
                "schedule_stream": schedule_stream,
            }
        )
        if note is not UNSET:
            field_dict["note"] = note
        if publish_entity is not UNSET:
            field_dict["publish_entity"] = publish_entity

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.contact import Contact
        from ..models.note import Note
        from ..models.publish_entity import PublishEntity
        from ..models.schedule_event_full_days import ScheduleEventFullDays
        from ..models.schedule_stream_summary import ScheduleStreamSummary
        from ..models.tag import Tag
        from ..models.time_event_full_days_block import TimeEventFullDaysBlock

        d = dict(src_dict)
        schedule_event_full_days = ScheduleEventFullDays.from_dict(d.pop("schedule_event_full_days"))

        time_event_full_days_block = TimeEventFullDaysBlock.from_dict(d.pop("time_event_full_days_block"))

        tags = []
        _tags = d.pop("tags")
        for tags_item_data in _tags:
            tags_item = Tag.from_dict(tags_item_data)

            tags.append(tags_item)

        contacts = []
        _contacts = d.pop("contacts")
        for contacts_item_data in _contacts:
            contacts_item = Contact.from_dict(contacts_item_data)

            contacts.append(contacts_item)

        schedule_stream = ScheduleStreamSummary.from_dict(d.pop("schedule_stream"))

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

        def _parse_publish_entity(data: object) -> None | PublishEntity | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, dict):
                    raise TypeError()
                publish_entity_type_0 = PublishEntity.from_dict(data)

                return publish_entity_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(None | PublishEntity | Unset, data)

        publish_entity = _parse_publish_entity(d.pop("publish_entity", UNSET))

        schedule_event_full_days_load_result = cls(
            schedule_event_full_days=schedule_event_full_days,
            time_event_full_days_block=time_event_full_days_block,
            tags=tags,
            contacts=contacts,
            schedule_stream=schedule_stream,
            note=note,
            publish_entity=publish_entity,
        )

        schedule_event_full_days_load_result.additional_properties = d
        return schedule_event_full_days_load_result

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
