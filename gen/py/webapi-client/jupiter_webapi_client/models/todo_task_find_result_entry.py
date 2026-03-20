from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..types import UNSET, Unset

if TYPE_CHECKING:
    from ..models.aspect import Aspect
    from ..models.chapter import Chapter
    from ..models.contact import Contact
    from ..models.goal import Goal
    from ..models.inbox_task import InboxTask
    from ..models.note import Note
    from ..models.tag import Tag
    from ..models.todo_task import TodoTask


T = TypeVar("T", bound="TodoTaskFindResultEntry")


@_attrs_define
class TodoTaskFindResultEntry:
    """A single entry in the todo task find response.

    Attributes:
        todo_task (TodoTask): A todo task.
        tags (list[Tag]):
        contacts (list[Contact]):
        inbox_task (InboxTask | None | Unset):
        note (None | Note | Unset):
        aspect (Aspect | None | Unset):
        chapter (Chapter | None | Unset):
        goal (Goal | None | Unset):
    """

    todo_task: TodoTask
    tags: list[Tag]
    contacts: list[Contact]
    inbox_task: InboxTask | None | Unset = UNSET
    note: None | Note | Unset = UNSET
    aspect: Aspect | None | Unset = UNSET
    chapter: Chapter | None | Unset = UNSET
    goal: Goal | None | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        from ..models.aspect import Aspect
        from ..models.chapter import Chapter
        from ..models.goal import Goal
        from ..models.inbox_task import InboxTask
        from ..models.note import Note

        todo_task = self.todo_task.to_dict()

        tags = []
        for tags_item_data in self.tags:
            tags_item = tags_item_data.to_dict()
            tags.append(tags_item)

        contacts = []
        for contacts_item_data in self.contacts:
            contacts_item = contacts_item_data.to_dict()
            contacts.append(contacts_item)

        inbox_task: dict[str, Any] | None | Unset
        if isinstance(self.inbox_task, Unset):
            inbox_task = UNSET
        elif isinstance(self.inbox_task, InboxTask):
            inbox_task = self.inbox_task.to_dict()
        else:
            inbox_task = self.inbox_task

        note: dict[str, Any] | None | Unset
        if isinstance(self.note, Unset):
            note = UNSET
        elif isinstance(self.note, Note):
            note = self.note.to_dict()
        else:
            note = self.note

        aspect: dict[str, Any] | None | Unset
        if isinstance(self.aspect, Unset):
            aspect = UNSET
        elif isinstance(self.aspect, Aspect):
            aspect = self.aspect.to_dict()
        else:
            aspect = self.aspect

        chapter: dict[str, Any] | None | Unset
        if isinstance(self.chapter, Unset):
            chapter = UNSET
        elif isinstance(self.chapter, Chapter):
            chapter = self.chapter.to_dict()
        else:
            chapter = self.chapter

        goal: dict[str, Any] | None | Unset
        if isinstance(self.goal, Unset):
            goal = UNSET
        elif isinstance(self.goal, Goal):
            goal = self.goal.to_dict()
        else:
            goal = self.goal

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "todo_task": todo_task,
                "tags": tags,
                "contacts": contacts,
            }
        )
        if inbox_task is not UNSET:
            field_dict["inbox_task"] = inbox_task
        if note is not UNSET:
            field_dict["note"] = note
        if aspect is not UNSET:
            field_dict["aspect"] = aspect
        if chapter is not UNSET:
            field_dict["chapter"] = chapter
        if goal is not UNSET:
            field_dict["goal"] = goal

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.aspect import Aspect
        from ..models.chapter import Chapter
        from ..models.contact import Contact
        from ..models.goal import Goal
        from ..models.inbox_task import InboxTask
        from ..models.note import Note
        from ..models.tag import Tag
        from ..models.todo_task import TodoTask

        d = dict(src_dict)
        todo_task = TodoTask.from_dict(d.pop("todo_task"))

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

        def _parse_inbox_task(data: object) -> InboxTask | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, dict):
                    raise TypeError()
                inbox_task_type_0 = InboxTask.from_dict(data)

                return inbox_task_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(InboxTask | None | Unset, data)

        inbox_task = _parse_inbox_task(d.pop("inbox_task", UNSET))

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

        def _parse_aspect(data: object) -> Aspect | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, dict):
                    raise TypeError()
                aspect_type_0 = Aspect.from_dict(data)

                return aspect_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(Aspect | None | Unset, data)

        aspect = _parse_aspect(d.pop("aspect", UNSET))

        def _parse_chapter(data: object) -> Chapter | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, dict):
                    raise TypeError()
                chapter_type_0 = Chapter.from_dict(data)

                return chapter_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(Chapter | None | Unset, data)

        chapter = _parse_chapter(d.pop("chapter", UNSET))

        def _parse_goal(data: object) -> Goal | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, dict):
                    raise TypeError()
                goal_type_0 = Goal.from_dict(data)

                return goal_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(Goal | None | Unset, data)

        goal = _parse_goal(d.pop("goal", UNSET))

        todo_task_find_result_entry = cls(
            todo_task=todo_task,
            tags=tags,
            contacts=contacts,
            inbox_task=inbox_task,
            note=note,
            aspect=aspect,
            chapter=chapter,
            goal=goal,
        )

        todo_task_find_result_entry.additional_properties = d
        return todo_task_find_result_entry

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
