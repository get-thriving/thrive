from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..types import UNSET, Unset

if TYPE_CHECKING:
    from ..models.chapter import Chapter
    from ..models.chore import Chore
    from ..models.goal import Goal
    from ..models.inbox_task import InboxTask
    from ..models.note import Note
    from ..models.project import Project


T = TypeVar("T", bound="ChoreFindResultEntry")


@_attrs_define
class ChoreFindResultEntry:
    """A single entry in the load all chores response.

    Attributes:
        chore (Chore): A chore.
        note (None | Note | Unset):
        project (None | Project | Unset):
        chapter (Chapter | None | Unset):
        goal (Goal | None | Unset):
        inbox_tasks (list[InboxTask] | None | Unset):
    """

    chore: Chore
    note: None | Note | Unset = UNSET
    project: None | Project | Unset = UNSET
    chapter: Chapter | None | Unset = UNSET
    goal: Goal | None | Unset = UNSET
    inbox_tasks: list[InboxTask] | None | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        from ..models.chapter import Chapter
        from ..models.goal import Goal
        from ..models.note import Note
        from ..models.project import Project

        chore = self.chore.to_dict()

        note: dict[str, Any] | None | Unset
        if isinstance(self.note, Unset):
            note = UNSET
        elif isinstance(self.note, Note):
            note = self.note.to_dict()
        else:
            note = self.note

        project: dict[str, Any] | None | Unset
        if isinstance(self.project, Unset):
            project = UNSET
        elif isinstance(self.project, Project):
            project = self.project.to_dict()
        else:
            project = self.project

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

        inbox_tasks: list[dict[str, Any]] | None | Unset
        if isinstance(self.inbox_tasks, Unset):
            inbox_tasks = UNSET
        elif isinstance(self.inbox_tasks, list):
            inbox_tasks = []
            for inbox_tasks_type_0_item_data in self.inbox_tasks:
                inbox_tasks_type_0_item = inbox_tasks_type_0_item_data.to_dict()
                inbox_tasks.append(inbox_tasks_type_0_item)

        else:
            inbox_tasks = self.inbox_tasks

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "chore": chore,
            }
        )
        if note is not UNSET:
            field_dict["note"] = note
        if project is not UNSET:
            field_dict["project"] = project
        if chapter is not UNSET:
            field_dict["chapter"] = chapter
        if goal is not UNSET:
            field_dict["goal"] = goal
        if inbox_tasks is not UNSET:
            field_dict["inbox_tasks"] = inbox_tasks

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.chapter import Chapter
        from ..models.chore import Chore
        from ..models.goal import Goal
        from ..models.inbox_task import InboxTask
        from ..models.note import Note
        from ..models.project import Project

        d = dict(src_dict)
        chore = Chore.from_dict(d.pop("chore"))

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

        def _parse_project(data: object) -> None | Project | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, dict):
                    raise TypeError()
                project_type_0 = Project.from_dict(data)

                return project_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(None | Project | Unset, data)

        project = _parse_project(d.pop("project", UNSET))

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

        def _parse_inbox_tasks(data: object) -> list[InboxTask] | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, list):
                    raise TypeError()
                inbox_tasks_type_0 = []
                _inbox_tasks_type_0 = data
                for inbox_tasks_type_0_item_data in _inbox_tasks_type_0:
                    inbox_tasks_type_0_item = InboxTask.from_dict(inbox_tasks_type_0_item_data)

                    inbox_tasks_type_0.append(inbox_tasks_type_0_item)

                return inbox_tasks_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(list[InboxTask] | None | Unset, data)

        inbox_tasks = _parse_inbox_tasks(d.pop("inbox_tasks", UNSET))

        chore_find_result_entry = cls(
            chore=chore,
            note=note,
            project=project,
            chapter=chapter,
            goal=goal,
            inbox_tasks=inbox_tasks,
        )

        chore_find_result_entry.additional_properties = d
        return chore_find_result_entry

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
