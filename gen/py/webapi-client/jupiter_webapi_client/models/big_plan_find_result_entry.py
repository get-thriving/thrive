from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..types import UNSET, Unset

if TYPE_CHECKING:
    from ..models.big_plan import BigPlan
    from ..models.big_plan_milestone import BigPlanMilestone
    from ..models.big_plan_stats import BigPlanStats
    from ..models.chapter import Chapter
    from ..models.goal import Goal
    from ..models.inbox_task import InboxTask
    from ..models.note import Note
    from ..models.project import Project


T = TypeVar("T", bound="BigPlanFindResultEntry")


@_attrs_define
class BigPlanFindResultEntry:
    """A single big plan result.

    Attributes:
        big_plan (BigPlan): A big plan.
        note (None | Note | Unset):
        milestones (list[BigPlanMilestone] | None | Unset):
        stats (BigPlanStats | None | Unset):
        project (None | Project | Unset):
        chapter (Chapter | None | Unset):
        goal (Goal | None | Unset):
        inbox_tasks (list[InboxTask] | None | Unset):
    """

    big_plan: BigPlan
    note: None | Note | Unset = UNSET
    milestones: list[BigPlanMilestone] | None | Unset = UNSET
    stats: BigPlanStats | None | Unset = UNSET
    project: None | Project | Unset = UNSET
    chapter: Chapter | None | Unset = UNSET
    goal: Goal | None | Unset = UNSET
    inbox_tasks: list[InboxTask] | None | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        from ..models.big_plan_stats import BigPlanStats
        from ..models.chapter import Chapter
        from ..models.goal import Goal
        from ..models.note import Note
        from ..models.project import Project

        big_plan = self.big_plan.to_dict()

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
        elif isinstance(self.stats, BigPlanStats):
            stats = self.stats.to_dict()
        else:
            stats = self.stats

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
                "big_plan": big_plan,
            }
        )
        if note is not UNSET:
            field_dict["note"] = note
        if milestones is not UNSET:
            field_dict["milestones"] = milestones
        if stats is not UNSET:
            field_dict["stats"] = stats
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
        from ..models.big_plan import BigPlan
        from ..models.big_plan_milestone import BigPlanMilestone
        from ..models.big_plan_stats import BigPlanStats
        from ..models.chapter import Chapter
        from ..models.goal import Goal
        from ..models.inbox_task import InboxTask
        from ..models.note import Note
        from ..models.project import Project

        d = dict(src_dict)
        big_plan = BigPlan.from_dict(d.pop("big_plan"))

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

        def _parse_milestones(data: object) -> list[BigPlanMilestone] | None | Unset:
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
                    milestones_type_0_item = BigPlanMilestone.from_dict(milestones_type_0_item_data)

                    milestones_type_0.append(milestones_type_0_item)

                return milestones_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(list[BigPlanMilestone] | None | Unset, data)

        milestones = _parse_milestones(d.pop("milestones", UNSET))

        def _parse_stats(data: object) -> BigPlanStats | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, dict):
                    raise TypeError()
                stats_type_0 = BigPlanStats.from_dict(data)

                return stats_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(BigPlanStats | None | Unset, data)

        stats = _parse_stats(d.pop("stats", UNSET))

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

        big_plan_find_result_entry = cls(
            big_plan=big_plan,
            note=note,
            milestones=milestones,
            stats=stats,
            project=project,
            chapter=chapter,
            goal=goal,
            inbox_tasks=inbox_tasks,
        )

        big_plan_find_result_entry.additional_properties = d
        return big_plan_find_result_entry

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
