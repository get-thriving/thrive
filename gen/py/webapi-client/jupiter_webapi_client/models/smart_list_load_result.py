from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..types import UNSET, Unset

if TYPE_CHECKING:
    from ..models.note import Note
    from ..models.publish_entity import PublishEntity
    from ..models.smart_list import SmartList
    from ..models.smart_list_item import SmartListItem
    from ..models.smart_list_load_result_smart_list_item_contacts_type_0 import (
        SmartListLoadResultSmartListItemContactsType0,
    )
    from ..models.smart_list_load_result_smart_list_item_generic_tags_type_0 import (
        SmartListLoadResultSmartListItemGenericTagsType0,
    )
    from ..models.tag import Tag


T = TypeVar("T", bound="SmartListLoadResult")


@_attrs_define
class SmartListLoadResult:
    """SmartListLoadResult.

    Attributes:
        smart_list (SmartList): A smart list.
        tags (list[Tag]):
        smart_list_items (list[SmartListItem]):
        note (None | Note | Unset):
        smart_list_item_generic_tags (None | SmartListLoadResultSmartListItemGenericTagsType0 | Unset):
        smart_list_item_contacts (None | SmartListLoadResultSmartListItemContactsType0 | Unset):
        smart_list_item_notes (list[Note] | None | Unset):
        publish_entity (None | PublishEntity | Unset):
    """

    smart_list: SmartList
    tags: list[Tag]
    smart_list_items: list[SmartListItem]
    note: None | Note | Unset = UNSET
    smart_list_item_generic_tags: None | SmartListLoadResultSmartListItemGenericTagsType0 | Unset = UNSET
    smart_list_item_contacts: None | SmartListLoadResultSmartListItemContactsType0 | Unset = UNSET
    smart_list_item_notes: list[Note] | None | Unset = UNSET
    publish_entity: None | PublishEntity | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        from ..models.note import Note
        from ..models.publish_entity import PublishEntity
        from ..models.smart_list_load_result_smart_list_item_contacts_type_0 import (
            SmartListLoadResultSmartListItemContactsType0,
        )
        from ..models.smart_list_load_result_smart_list_item_generic_tags_type_0 import (
            SmartListLoadResultSmartListItemGenericTagsType0,
        )

        smart_list = self.smart_list.to_dict()

        tags = []
        for tags_item_data in self.tags:
            tags_item = tags_item_data.to_dict()
            tags.append(tags_item)

        smart_list_items = []
        for smart_list_items_item_data in self.smart_list_items:
            smart_list_items_item = smart_list_items_item_data.to_dict()
            smart_list_items.append(smart_list_items_item)

        note: dict[str, Any] | None | Unset
        if isinstance(self.note, Unset):
            note = UNSET
        elif isinstance(self.note, Note):
            note = self.note.to_dict()
        else:
            note = self.note

        smart_list_item_generic_tags: dict[str, Any] | None | Unset
        if isinstance(self.smart_list_item_generic_tags, Unset):
            smart_list_item_generic_tags = UNSET
        elif isinstance(self.smart_list_item_generic_tags, SmartListLoadResultSmartListItemGenericTagsType0):
            smart_list_item_generic_tags = self.smart_list_item_generic_tags.to_dict()
        else:
            smart_list_item_generic_tags = self.smart_list_item_generic_tags

        smart_list_item_contacts: dict[str, Any] | None | Unset
        if isinstance(self.smart_list_item_contacts, Unset):
            smart_list_item_contacts = UNSET
        elif isinstance(self.smart_list_item_contacts, SmartListLoadResultSmartListItemContactsType0):
            smart_list_item_contacts = self.smart_list_item_contacts.to_dict()
        else:
            smart_list_item_contacts = self.smart_list_item_contacts

        smart_list_item_notes: list[dict[str, Any]] | None | Unset
        if isinstance(self.smart_list_item_notes, Unset):
            smart_list_item_notes = UNSET
        elif isinstance(self.smart_list_item_notes, list):
            smart_list_item_notes = []
            for smart_list_item_notes_type_0_item_data in self.smart_list_item_notes:
                smart_list_item_notes_type_0_item = smart_list_item_notes_type_0_item_data.to_dict()
                smart_list_item_notes.append(smart_list_item_notes_type_0_item)

        else:
            smart_list_item_notes = self.smart_list_item_notes

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
                "smart_list": smart_list,
                "tags": tags,
                "smart_list_items": smart_list_items,
            }
        )
        if note is not UNSET:
            field_dict["note"] = note
        if smart_list_item_generic_tags is not UNSET:
            field_dict["smart_list_item_generic_tags"] = smart_list_item_generic_tags
        if smart_list_item_contacts is not UNSET:
            field_dict["smart_list_item_contacts"] = smart_list_item_contacts
        if smart_list_item_notes is not UNSET:
            field_dict["smart_list_item_notes"] = smart_list_item_notes
        if publish_entity is not UNSET:
            field_dict["publish_entity"] = publish_entity

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.note import Note
        from ..models.publish_entity import PublishEntity
        from ..models.smart_list import SmartList
        from ..models.smart_list_item import SmartListItem
        from ..models.smart_list_load_result_smart_list_item_contacts_type_0 import (
            SmartListLoadResultSmartListItemContactsType0,
        )
        from ..models.smart_list_load_result_smart_list_item_generic_tags_type_0 import (
            SmartListLoadResultSmartListItemGenericTagsType0,
        )
        from ..models.tag import Tag

        d = dict(src_dict)
        smart_list = SmartList.from_dict(d.pop("smart_list"))

        tags = []
        _tags = d.pop("tags")
        for tags_item_data in _tags:
            tags_item = Tag.from_dict(tags_item_data)

            tags.append(tags_item)

        smart_list_items = []
        _smart_list_items = d.pop("smart_list_items")
        for smart_list_items_item_data in _smart_list_items:
            smart_list_items_item = SmartListItem.from_dict(smart_list_items_item_data)

            smart_list_items.append(smart_list_items_item)

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

        def _parse_smart_list_item_generic_tags(
            data: object,
        ) -> None | SmartListLoadResultSmartListItemGenericTagsType0 | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, dict):
                    raise TypeError()
                smart_list_item_generic_tags_type_0 = SmartListLoadResultSmartListItemGenericTagsType0.from_dict(data)

                return smart_list_item_generic_tags_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(None | SmartListLoadResultSmartListItemGenericTagsType0 | Unset, data)

        smart_list_item_generic_tags = _parse_smart_list_item_generic_tags(d.pop("smart_list_item_generic_tags", UNSET))

        def _parse_smart_list_item_contacts(
            data: object,
        ) -> None | SmartListLoadResultSmartListItemContactsType0 | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, dict):
                    raise TypeError()
                smart_list_item_contacts_type_0 = SmartListLoadResultSmartListItemContactsType0.from_dict(data)

                return smart_list_item_contacts_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(None | SmartListLoadResultSmartListItemContactsType0 | Unset, data)

        smart_list_item_contacts = _parse_smart_list_item_contacts(d.pop("smart_list_item_contacts", UNSET))

        def _parse_smart_list_item_notes(data: object) -> list[Note] | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, list):
                    raise TypeError()
                smart_list_item_notes_type_0 = []
                _smart_list_item_notes_type_0 = data
                for smart_list_item_notes_type_0_item_data in _smart_list_item_notes_type_0:
                    smart_list_item_notes_type_0_item = Note.from_dict(smart_list_item_notes_type_0_item_data)

                    smart_list_item_notes_type_0.append(smart_list_item_notes_type_0_item)

                return smart_list_item_notes_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(list[Note] | None | Unset, data)

        smart_list_item_notes = _parse_smart_list_item_notes(d.pop("smart_list_item_notes", UNSET))

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

        smart_list_load_result = cls(
            smart_list=smart_list,
            tags=tags,
            smart_list_items=smart_list_items,
            note=note,
            smart_list_item_generic_tags=smart_list_item_generic_tags,
            smart_list_item_contacts=smart_list_item_contacts,
            smart_list_item_notes=smart_list_item_notes,
            publish_entity=publish_entity,
        )

        smart_list_load_result.additional_properties = d
        return smart_list_load_result

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
