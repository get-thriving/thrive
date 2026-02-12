from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..types import UNSET, Unset

if TYPE_CHECKING:
    from ..models.inbox_task import InboxTask
    from ..models.note import Note
    from ..models.tag import Tag
    from ..models.time_plan import TimePlan


T = TypeVar("T", bound="TimePlanFindResultEntry")


@_attrs_define
class TimePlanFindResultEntry:
    """Result part.

    Attributes:
        time_plan (TimePlan): A plan for a particular period of time.
        tags (list[Tag]):
        note (None | Note | Unset):
        planning_task (InboxTask | None | Unset):
        chapter_ref_ids (list[str] | None | Unset):
        project_ref_ids (list[str] | None | Unset):
        goal_ref_ids (list[str] | None | Unset):
    """

    time_plan: TimePlan
    tags: list[Tag]
    note: None | Note | Unset = UNSET
    planning_task: InboxTask | None | Unset = UNSET
    chapter_ref_ids: list[str] | None | Unset = UNSET
    project_ref_ids: list[str] | None | Unset = UNSET
    goal_ref_ids: list[str] | None | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        from ..models.inbox_task import InboxTask
        from ..models.note import Note

        time_plan = self.time_plan.to_dict()

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

        planning_task: dict[str, Any] | None | Unset
        if isinstance(self.planning_task, Unset):
            planning_task = UNSET
        elif isinstance(self.planning_task, InboxTask):
            planning_task = self.planning_task.to_dict()
        else:
            planning_task = self.planning_task

        chapter_ref_ids: list[str] | None | Unset
        if isinstance(self.chapter_ref_ids, Unset):
            chapter_ref_ids = UNSET
        elif isinstance(self.chapter_ref_ids, list):
            chapter_ref_ids = self.chapter_ref_ids

        else:
            chapter_ref_ids = self.chapter_ref_ids

        project_ref_ids: list[str] | None | Unset
        if isinstance(self.project_ref_ids, Unset):
            project_ref_ids = UNSET
        elif isinstance(self.project_ref_ids, list):
            project_ref_ids = self.project_ref_ids

        else:
            project_ref_ids = self.project_ref_ids

        goal_ref_ids: list[str] | None | Unset
        if isinstance(self.goal_ref_ids, Unset):
            goal_ref_ids = UNSET
        elif isinstance(self.goal_ref_ids, list):
            goal_ref_ids = self.goal_ref_ids

        else:
            goal_ref_ids = self.goal_ref_ids

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "time_plan": time_plan,
                "tags": tags,
            }
        )
        if note is not UNSET:
            field_dict["note"] = note
        if planning_task is not UNSET:
            field_dict["planning_task"] = planning_task
        if chapter_ref_ids is not UNSET:
            field_dict["chapter_ref_ids"] = chapter_ref_ids
        if project_ref_ids is not UNSET:
            field_dict["project_ref_ids"] = project_ref_ids
        if goal_ref_ids is not UNSET:
            field_dict["goal_ref_ids"] = goal_ref_ids

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.inbox_task import InboxTask
        from ..models.note import Note
        from ..models.tag import Tag
        from ..models.time_plan import TimePlan

        d = dict(src_dict)
        time_plan = TimePlan.from_dict(d.pop("time_plan"))

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

        def _parse_planning_task(data: object) -> InboxTask | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, dict):
                    raise TypeError()
                planning_task_type_0 = InboxTask.from_dict(data)

                return planning_task_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(InboxTask | None | Unset, data)

        planning_task = _parse_planning_task(d.pop("planning_task", UNSET))

        def _parse_chapter_ref_ids(data: object) -> list[str] | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, list):
                    raise TypeError()
                chapter_ref_ids_type_0 = cast(list[str], data)

                return chapter_ref_ids_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(list[str] | None | Unset, data)

        chapter_ref_ids = _parse_chapter_ref_ids(d.pop("chapter_ref_ids", UNSET))

        def _parse_project_ref_ids(data: object) -> list[str] | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, list):
                    raise TypeError()
                project_ref_ids_type_0 = cast(list[str], data)

                return project_ref_ids_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(list[str] | None | Unset, data)

        project_ref_ids = _parse_project_ref_ids(d.pop("project_ref_ids", UNSET))

        def _parse_goal_ref_ids(data: object) -> list[str] | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, list):
                    raise TypeError()
                goal_ref_ids_type_0 = cast(list[str], data)

                return goal_ref_ids_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(list[str] | None | Unset, data)

        goal_ref_ids = _parse_goal_ref_ids(d.pop("goal_ref_ids", UNSET))

        time_plan_find_result_entry = cls(
            time_plan=time_plan,
            tags=tags,
            note=note,
            planning_task=planning_task,
            chapter_ref_ids=chapter_ref_ids,
            project_ref_ids=project_ref_ids,
            goal_ref_ids=goal_ref_ids,
        )

        time_plan_find_result_entry.additional_properties = d
        return time_plan_find_result_entry

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
