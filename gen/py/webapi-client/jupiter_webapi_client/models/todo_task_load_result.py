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


T = TypeVar("T", bound="TodoTaskLoadResult")


@_attrs_define
class TodoTaskLoadResult:
    """TodoTaskLoadResult.

    Attributes:
        todo_task (TodoTask): A todo task.
        inbox_task (InboxTask): An inbox task.
        aspect (Aspect): The aspect.
        tags (list[Tag]):
        contacts (list[Contact]):
        chapter (Chapter | None | Unset):
        goal (Goal | None | Unset):
        note (None | Note | Unset):
    """

    todo_task: TodoTask
    inbox_task: InboxTask
    aspect: Aspect
    tags: list[Tag]
    contacts: list[Contact]
    chapter: Chapter | None | Unset = UNSET
    goal: Goal | None | Unset = UNSET
    note: None | Note | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        from ..models.chapter import Chapter
        from ..models.goal import Goal
        from ..models.note import Note

        todo_task = self.todo_task.to_dict()

        inbox_task = self.inbox_task.to_dict()

        aspect = self.aspect.to_dict()

        tags = []
        for tags_item_data in self.tags:
            tags_item = tags_item_data.to_dict()
            tags.append(tags_item)

        contacts = []
        for contacts_item_data in self.contacts:
            contacts_item = contacts_item_data.to_dict()
            contacts.append(contacts_item)

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
                "todo_task": todo_task,
                "inbox_task": inbox_task,
                "aspect": aspect,
                "tags": tags,
                "contacts": contacts,
            }
        )
        if chapter is not UNSET:
            field_dict["chapter"] = chapter
        if goal is not UNSET:
            field_dict["goal"] = goal
        if note is not UNSET:
            field_dict["note"] = note

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

        inbox_task = InboxTask.from_dict(d.pop("inbox_task"))

        aspect = Aspect.from_dict(d.pop("aspect"))

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

        todo_task_load_result = cls(
            todo_task=todo_task,
            inbox_task=inbox_task,
            aspect=aspect,
            tags=tags,
            contacts=contacts,
            chapter=chapter,
            goal=goal,
            note=note,
        )

        todo_task_load_result.additional_properties = d
        return todo_task_load_result

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
