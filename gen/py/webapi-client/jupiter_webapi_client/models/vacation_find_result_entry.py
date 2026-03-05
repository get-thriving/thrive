from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..types import UNSET, Unset

if TYPE_CHECKING:
    from ..models.contact import Contact
    from ..models.note import Note
    from ..models.tag import Tag
    from ..models.time_event_full_days_block import TimeEventFullDaysBlock
    from ..models.vacation import Vacation


T = TypeVar("T", bound="VacationFindResultEntry")


@_attrs_define
class VacationFindResultEntry:
    """PersonFindResult object.

    Attributes:
        vacation (Vacation): A vacation.
        tags (list[Tag]):
        contacts (list[Contact]):
        note (None | Note | Unset):
        time_event_block (None | TimeEventFullDaysBlock | Unset):
    """

    vacation: Vacation
    tags: list[Tag]
    contacts: list[Contact]
    note: None | Note | Unset = UNSET
    time_event_block: None | TimeEventFullDaysBlock | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        from ..models.note import Note
        from ..models.time_event_full_days_block import TimeEventFullDaysBlock

        vacation = self.vacation.to_dict()

        tags = []
        for tags_item_data in self.tags:
            tags_item = tags_item_data.to_dict()
            tags.append(tags_item)

        contacts = []
        for contacts_item_data in self.contacts:
            contacts_item = contacts_item_data.to_dict()
            contacts.append(contacts_item)

        note: dict[str, Any] | None | Unset
        if isinstance(self.note, Unset):
            note = UNSET
        elif isinstance(self.note, Note):
            note = self.note.to_dict()
        else:
            note = self.note

        time_event_block: dict[str, Any] | None | Unset
        if isinstance(self.time_event_block, Unset):
            time_event_block = UNSET
        elif isinstance(self.time_event_block, TimeEventFullDaysBlock):
            time_event_block = self.time_event_block.to_dict()
        else:
            time_event_block = self.time_event_block

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "vacation": vacation,
                "tags": tags,
                "contacts": contacts,
            }
        )
        if note is not UNSET:
            field_dict["note"] = note
        if time_event_block is not UNSET:
            field_dict["time_event_block"] = time_event_block

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.contact import Contact
        from ..models.note import Note
        from ..models.tag import Tag
        from ..models.time_event_full_days_block import TimeEventFullDaysBlock
        from ..models.vacation import Vacation

        d = dict(src_dict)
        vacation = Vacation.from_dict(d.pop("vacation"))

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

        def _parse_time_event_block(data: object) -> None | TimeEventFullDaysBlock | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, dict):
                    raise TypeError()
                time_event_block_type_0 = TimeEventFullDaysBlock.from_dict(data)

                return time_event_block_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(None | TimeEventFullDaysBlock | Unset, data)

        time_event_block = _parse_time_event_block(d.pop("time_event_block", UNSET))

        vacation_find_result_entry = cls(
            vacation=vacation,
            tags=tags,
            contacts=contacts,
            note=note,
            time_event_block=time_event_block,
        )

        vacation_find_result_entry.additional_properties = d
        return vacation_find_result_entry

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
