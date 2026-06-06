from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..types import UNSET, Unset

if TYPE_CHECKING:
    from ..models.aspect import Aspect
    from ..models.project import Project
    from ..models.project_milestone import ProjectMilestone
    from ..models.project_stats import ProjectStats
    from ..models.chapter import Chapter
    from ..models.contact import Contact
    from ..models.goal import Goal
    from ..models.inbox_task import InboxTask
    from ..models.note import Note
    from ..models.tag import Tag


T = TypeVar("T", bound="ProjectFindResultEntry")


@_attrs_define
class ProjectFindResultEntry:
    """A single project result.

    Attributes:
        project (Project): A project.
        tags (list[Tag]):
        contacts (list[Contact]):
        note (None | Note | Unset):
        milestones (list[ProjectMilestone] | None | Unset):
        stats (ProjectStats | None | Unset):
        aspect (Aspect | None | Unset):
        chapter (Chapter | None | Unset):
        goal (Goal | None | Unset):
        inbox_tasks (list[InboxTask] | None | Unset):
    """

    project: Project
    tags: list[Tag]
    contacts: list[Contact]
    note: None | Note | Unset = UNSET
    milestones: list[ProjectMilestone] | None | Unset = UNSET
    stats: ProjectStats | None | Unset = UNSET
    aspect: Aspect | None | Unset = UNSET
    chapter: Chapter | None | Unset = UNSET
    goal: Goal | None | Unset = UNSET
    inbox_tasks: list[InboxTask] | None | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        from ..models.aspect import Aspect
        from ..models.project_stats import ProjectStats
        from ..models.chapter import Chapter
        from ..models.goal import Goal
        from ..models.note import Note

        project = self.project.to_dict()

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

        milestones: list[dict[str, Any]] | None | Unset
        if isinstance(self.milestones, Unset):
            milestones = UNSET
        elif isinstance(self.milestones, list):
            milestones = []
            for milestones_type_0_item_data in self.milestones:
                milestones_type_0_item = milestones_type_0_item_data.to_dict()
                milestones.append(milestones_type_0_item)

        else:
            milestones = self.milestones

        stats: dict[str, Any] | None | Unset
        if isinstance(self.stats, Unset):
            stats = UNSET
        elif isinstance(self.stats, ProjectStats):
            stats = self.stats.to_dict()
        else:
            stats = self.stats

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
                "project": project,
                "tags": tags,
                "contacts": contacts,
            }
        )
        if note is not UNSET:
            field_dict["note"] = note
        if milestones is not UNSET:
            field_dict["milestones"] = milestones
        if stats is not UNSET:
            field_dict["stats"] = stats
        if aspect is not UNSET:
            field_dict["aspect"] = aspect
        if chapter is not UNSET:
            field_dict["chapter"] = chapter
        if goal is not UNSET:
            field_dict["goal"] = goal
        if inbox_tasks is not UNSET:
            field_dict["inbox_tasks"] = inbox_tasks

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.aspect import Aspect
        from ..models.project import Project
        from ..models.project_milestone import ProjectMilestone
        from ..models.project_stats import ProjectStats
        from ..models.chapter import Chapter
        from ..models.contact import Contact
        from ..models.goal import Goal
        from ..models.inbox_task import InboxTask
        from ..models.note import Note
        from ..models.tag import Tag

        d = dict(src_dict)
        project = Project.from_dict(d.pop("project"))

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

        def _parse_milestones(data: object) -> list[ProjectMilestone] | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, list):
                    raise TypeError()
                milestones_type_0 = []
                _milestones_type_0 = data
                for milestones_type_0_item_data in _milestones_type_0:
                    milestones_type_0_item = ProjectMilestone.from_dict(milestones_type_0_item_data)

                    milestones_type_0.append(milestones_type_0_item)

                return milestones_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(list[ProjectMilestone] | None | Unset, data)

        milestones = _parse_milestones(d.pop("milestones", UNSET))

        def _parse_stats(data: object) -> ProjectStats | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, dict):
                    raise TypeError()
                stats_type_0 = ProjectStats.from_dict(data)

                return stats_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(ProjectStats | None | Unset, data)

        stats = _parse_stats(d.pop("stats", UNSET))

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

        project_find_result_entry = cls(
            project=project,
            tags=tags,
            contacts=contacts,
            note=note,
            milestones=milestones,
            stats=stats,
            aspect=aspect,
            chapter=chapter,
            goal=goal,
            inbox_tasks=inbox_tasks,
        )

        project_find_result_entry.additional_properties = d
        return project_find_result_entry

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
