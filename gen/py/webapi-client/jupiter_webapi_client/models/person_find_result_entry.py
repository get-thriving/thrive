from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..types import UNSET, Unset

if TYPE_CHECKING:
    from ..models.contact import Contact
    from ..models.inbox_task import InboxTask
    from ..models.note import Note
    from ..models.occasion import Occasion
    from ..models.person import Person
    from ..models.tag import Tag
    from ..models.time_event_full_days_block import TimeEventFullDaysBlock


T = TypeVar("T", bound="PersonFindResultEntry")


@_attrs_define
class PersonFindResultEntry:
    """A single person result.

    Attributes:
        person (Person): A person.
        contact (Contact): A contact.
        occasions (list[Occasion]):
        circle_ref_ids (list[str]):
        tags (list[Tag]):
        note (None | Note | Unset):
        occasion_time_event_blocks (list[TimeEventFullDaysBlock] | None | Unset):
        catch_up_inbox_tasks (list[InboxTask] | None | Unset):
        occasion_inbox_tasks (list[InboxTask] | None | Unset):
    """

    person: Person
    contact: Contact
    occasions: list[Occasion]
    circle_ref_ids: list[str]
    tags: list[Tag]
    note: None | Note | Unset = UNSET
    occasion_time_event_blocks: list[TimeEventFullDaysBlock] | None | Unset = UNSET
    catch_up_inbox_tasks: list[InboxTask] | None | Unset = UNSET
    occasion_inbox_tasks: list[InboxTask] | None | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        from ..models.note import Note

        person = self.person.to_dict()

        contact = self.contact.to_dict()

        occasions = []
        for occasions_item_data in self.occasions:
            occasions_item = occasions_item_data.to_dict()
            occasions.append(occasions_item)

        circle_ref_ids = self.circle_ref_ids

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

        occasion_time_event_blocks: list[dict[str, Any]] | None | Unset
        if isinstance(self.occasion_time_event_blocks, Unset):
            occasion_time_event_blocks = UNSET
        elif isinstance(self.occasion_time_event_blocks, list):
            occasion_time_event_blocks = []
            for occasion_time_event_blocks_type_0_item_data in self.occasion_time_event_blocks:
                occasion_time_event_blocks_type_0_item = occasion_time_event_blocks_type_0_item_data.to_dict()
                occasion_time_event_blocks.append(occasion_time_event_blocks_type_0_item)

        else:
            occasion_time_event_blocks = self.occasion_time_event_blocks

        catch_up_inbox_tasks: list[dict[str, Any]] | None | Unset
        if isinstance(self.catch_up_inbox_tasks, Unset):
            catch_up_inbox_tasks = UNSET
        elif isinstance(self.catch_up_inbox_tasks, list):
            catch_up_inbox_tasks = []
            for catch_up_inbox_tasks_type_0_item_data in self.catch_up_inbox_tasks:
                catch_up_inbox_tasks_type_0_item = catch_up_inbox_tasks_type_0_item_data.to_dict()
                catch_up_inbox_tasks.append(catch_up_inbox_tasks_type_0_item)

        else:
            catch_up_inbox_tasks = self.catch_up_inbox_tasks

        occasion_inbox_tasks: list[dict[str, Any]] | None | Unset
        if isinstance(self.occasion_inbox_tasks, Unset):
            occasion_inbox_tasks = UNSET
        elif isinstance(self.occasion_inbox_tasks, list):
            occasion_inbox_tasks = []
            for occasion_inbox_tasks_type_0_item_data in self.occasion_inbox_tasks:
                occasion_inbox_tasks_type_0_item = occasion_inbox_tasks_type_0_item_data.to_dict()
                occasion_inbox_tasks.append(occasion_inbox_tasks_type_0_item)

        else:
            occasion_inbox_tasks = self.occasion_inbox_tasks

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "person": person,
                "contact": contact,
                "occasions": occasions,
                "circle_ref_ids": circle_ref_ids,
                "tags": tags,
            }
        )
        if note is not UNSET:
            field_dict["note"] = note
        if occasion_time_event_blocks is not UNSET:
            field_dict["occasion_time_event_blocks"] = occasion_time_event_blocks
        if catch_up_inbox_tasks is not UNSET:
            field_dict["catch_up_inbox_tasks"] = catch_up_inbox_tasks
        if occasion_inbox_tasks is not UNSET:
            field_dict["occasion_inbox_tasks"] = occasion_inbox_tasks

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.contact import Contact
        from ..models.inbox_task import InboxTask
        from ..models.note import Note
        from ..models.occasion import Occasion
        from ..models.person import Person
        from ..models.tag import Tag
        from ..models.time_event_full_days_block import TimeEventFullDaysBlock

        d = dict(src_dict)
        person = Person.from_dict(d.pop("person"))

        contact = Contact.from_dict(d.pop("contact"))

        occasions = []
        _occasions = d.pop("occasions")
        for occasions_item_data in _occasions:
            occasions_item = Occasion.from_dict(occasions_item_data)

            occasions.append(occasions_item)

        circle_ref_ids = cast(list[str], d.pop("circle_ref_ids"))

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

        def _parse_occasion_time_event_blocks(data: object) -> list[TimeEventFullDaysBlock] | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, list):
                    raise TypeError()
                occasion_time_event_blocks_type_0 = []
                _occasion_time_event_blocks_type_0 = data
                for occasion_time_event_blocks_type_0_item_data in _occasion_time_event_blocks_type_0:
                    occasion_time_event_blocks_type_0_item = TimeEventFullDaysBlock.from_dict(
                        occasion_time_event_blocks_type_0_item_data
                    )

                    occasion_time_event_blocks_type_0.append(occasion_time_event_blocks_type_0_item)

                return occasion_time_event_blocks_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(list[TimeEventFullDaysBlock] | None | Unset, data)

        occasion_time_event_blocks = _parse_occasion_time_event_blocks(d.pop("occasion_time_event_blocks", UNSET))

        def _parse_catch_up_inbox_tasks(data: object) -> list[InboxTask] | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, list):
                    raise TypeError()
                catch_up_inbox_tasks_type_0 = []
                _catch_up_inbox_tasks_type_0 = data
                for catch_up_inbox_tasks_type_0_item_data in _catch_up_inbox_tasks_type_0:
                    catch_up_inbox_tasks_type_0_item = InboxTask.from_dict(catch_up_inbox_tasks_type_0_item_data)

                    catch_up_inbox_tasks_type_0.append(catch_up_inbox_tasks_type_0_item)

                return catch_up_inbox_tasks_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(list[InboxTask] | None | Unset, data)

        catch_up_inbox_tasks = _parse_catch_up_inbox_tasks(d.pop("catch_up_inbox_tasks", UNSET))

        def _parse_occasion_inbox_tasks(data: object) -> list[InboxTask] | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, list):
                    raise TypeError()
                occasion_inbox_tasks_type_0 = []
                _occasion_inbox_tasks_type_0 = data
                for occasion_inbox_tasks_type_0_item_data in _occasion_inbox_tasks_type_0:
                    occasion_inbox_tasks_type_0_item = InboxTask.from_dict(occasion_inbox_tasks_type_0_item_data)

                    occasion_inbox_tasks_type_0.append(occasion_inbox_tasks_type_0_item)

                return occasion_inbox_tasks_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(list[InboxTask] | None | Unset, data)

        occasion_inbox_tasks = _parse_occasion_inbox_tasks(d.pop("occasion_inbox_tasks", UNSET))

        person_find_result_entry = cls(
            person=person,
            contact=contact,
            occasions=occasions,
            circle_ref_ids=circle_ref_ids,
            tags=tags,
            note=note,
            occasion_time_event_blocks=occasion_time_event_blocks,
            catch_up_inbox_tasks=catch_up_inbox_tasks,
            occasion_inbox_tasks=occasion_inbox_tasks,
        )

        person_find_result_entry.additional_properties = d
        return person_find_result_entry

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
