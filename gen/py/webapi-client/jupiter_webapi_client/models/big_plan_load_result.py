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
    from ..models.tag import Tag
    from ..models.time_event_in_day_block import TimeEventInDayBlock


T = TypeVar("T", bound="BigPlanLoadResult")


@_attrs_define
class BigPlanLoadResult:
    """BigPlanLoadResult.

    Attributes:
        big_plan (BigPlan): A big plan.
        project (Project): The project.
        milestones (list[BigPlanMilestone]):
        inbox_tasks (list[InboxTask]):
        tags (list[Tag]):
        time_event_blocks (list[TimeEventInDayBlock]):
        stats (BigPlanStats): Stats about a big plan.
        chapter (Chapter | None | Unset):
        goal (Goal | None | Unset):
        note (None | Note | Unset):
    """

    big_plan: BigPlan
    project: Project
    milestones: list[BigPlanMilestone]
    inbox_tasks: list[InboxTask]
    tags: list[Tag]
    time_event_blocks: list[TimeEventInDayBlock]
    stats: BigPlanStats
    chapter: Chapter | None | Unset = UNSET
    goal: Goal | None | Unset = UNSET
    note: None | Note | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        from ..models.chapter import Chapter
        from ..models.goal import Goal
        from ..models.note import Note

        big_plan = self.big_plan.to_dict()

        project = self.project.to_dict()

        milestones = []
        for milestones_item_data in self.milestones:
            milestones_item = milestones_item_data.to_dict()
            milestones.append(milestones_item)

        inbox_tasks = []
        for inbox_tasks_item_data in self.inbox_tasks:
            inbox_tasks_item = inbox_tasks_item_data.to_dict()
            inbox_tasks.append(inbox_tasks_item)

        tags = []
        for tags_item_data in self.tags:
            tags_item = tags_item_data.to_dict()
            tags.append(tags_item)

        time_event_blocks = []
        for time_event_blocks_item_data in self.time_event_blocks:
            time_event_blocks_item = time_event_blocks_item_data.to_dict()
            time_event_blocks.append(time_event_blocks_item)

        stats = self.stats.to_dict()

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
                "big_plan": big_plan,
                "project": project,
                "milestones": milestones,
                "inbox_tasks": inbox_tasks,
                "tags": tags,
                "time_event_blocks": time_event_blocks,
                "stats": stats,
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
        from ..models.big_plan import BigPlan
        from ..models.big_plan_milestone import BigPlanMilestone
        from ..models.big_plan_stats import BigPlanStats
        from ..models.chapter import Chapter
        from ..models.goal import Goal
        from ..models.inbox_task import InboxTask
        from ..models.note import Note
        from ..models.project import Project
        from ..models.tag import Tag
        from ..models.time_event_in_day_block import TimeEventInDayBlock

        d = dict(src_dict)
        big_plan = BigPlan.from_dict(d.pop("big_plan"))

        project = Project.from_dict(d.pop("project"))

        milestones = []
        _milestones = d.pop("milestones")
        for milestones_item_data in _milestones:
            milestones_item = BigPlanMilestone.from_dict(milestones_item_data)

            milestones.append(milestones_item)

        inbox_tasks = []
        _inbox_tasks = d.pop("inbox_tasks")
        for inbox_tasks_item_data in _inbox_tasks:
            inbox_tasks_item = InboxTask.from_dict(inbox_tasks_item_data)

            inbox_tasks.append(inbox_tasks_item)

        tags = []
        _tags = d.pop("tags")
        for tags_item_data in _tags:
            tags_item = Tag.from_dict(tags_item_data)

            tags.append(tags_item)

        time_event_blocks = []
        _time_event_blocks = d.pop("time_event_blocks")
        for time_event_blocks_item_data in _time_event_blocks:
            time_event_blocks_item = TimeEventInDayBlock.from_dict(time_event_blocks_item_data)

            time_event_blocks.append(time_event_blocks_item)

        stats = BigPlanStats.from_dict(d.pop("stats"))

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

        big_plan_load_result = cls(
            big_plan=big_plan,
            project=project,
            milestones=milestones,
            inbox_tasks=inbox_tasks,
            tags=tags,
            time_event_blocks=time_event_blocks,
            stats=stats,
            chapter=chapter,
            goal=goal,
            note=note,
        )

        big_plan_load_result.additional_properties = d
        return big_plan_load_result

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
