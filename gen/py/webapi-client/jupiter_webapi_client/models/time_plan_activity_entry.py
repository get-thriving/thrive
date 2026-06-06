from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..types import UNSET, Unset

if TYPE_CHECKING:
    from ..models.project import Project
    from ..models.inbox_task import InboxTask
    from ..models.time_event_in_day_block import TimeEventInDayBlock
    from ..models.time_plan_activity import TimePlanActivity


T = TypeVar("T", bound="TimePlanActivityEntry")


@_attrs_define
class TimePlanActivityEntry:
    """Result entry.

    Attributes:
        time_plan_activity (TimePlanActivity): A certain activity that happens in a plan.
        time_events (list[TimeEventInDayBlock]):
        target_inbox_task (InboxTask | None | Unset):
        target_project (Project | None | Unset):
    """

    time_plan_activity: TimePlanActivity
    time_events: list[TimeEventInDayBlock]
    target_inbox_task: InboxTask | None | Unset = UNSET
    target_project: Project | None | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        from ..models.project import Project
        from ..models.inbox_task import InboxTask

        time_plan_activity = self.time_plan_activity.to_dict()

        time_events = []
        for time_events_item_data in self.time_events:
            time_events_item = time_events_item_data.to_dict()
            time_events.append(time_events_item)

        target_inbox_task: dict[str, Any] | None | Unset
        if isinstance(self.target_inbox_task, Unset):
            target_inbox_task = UNSET
        elif isinstance(self.target_inbox_task, InboxTask):
            target_inbox_task = self.target_inbox_task.to_dict()
        else:
            target_inbox_task = self.target_inbox_task

        target_project: dict[str, Any] | None | Unset
        if isinstance(self.target_project, Unset):
            target_project = UNSET
        elif isinstance(self.target_project, Project):
            target_project = self.target_project.to_dict()
        else:
            target_project = self.target_project

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "time_plan_activity": time_plan_activity,
                "time_events": time_events,
            }
        )
        if target_inbox_task is not UNSET:
            field_dict["target_inbox_task"] = target_inbox_task
        if target_project is not UNSET:
            field_dict["target_project"] = target_project

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.project import Project
        from ..models.inbox_task import InboxTask
        from ..models.time_event_in_day_block import TimeEventInDayBlock
        from ..models.time_plan_activity import TimePlanActivity

        d = dict(src_dict)
        time_plan_activity = TimePlanActivity.from_dict(d.pop("time_plan_activity"))

        time_events = []
        _time_events = d.pop("time_events")
        for time_events_item_data in _time_events:
            time_events_item = TimeEventInDayBlock.from_dict(time_events_item_data)

            time_events.append(time_events_item)

        def _parse_target_inbox_task(data: object) -> InboxTask | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, dict):
                    raise TypeError()
                target_inbox_task_type_0 = InboxTask.from_dict(data)

                return target_inbox_task_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(InboxTask | None | Unset, data)

        target_inbox_task = _parse_target_inbox_task(d.pop("target_inbox_task", UNSET))

        def _parse_target_project(data: object) -> Project | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, dict):
                    raise TypeError()
                target_project_type_0 = Project.from_dict(data)

                return target_project_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(Project | None | Unset, data)

        target_project = _parse_target_project(d.pop("target_project", UNSET))

        time_plan_activity_entry = cls(
            time_plan_activity=time_plan_activity,
            time_events=time_events,
            target_inbox_task=target_inbox_task,
            target_project=target_project,
        )

        time_plan_activity_entry.additional_properties = d
        return time_plan_activity_entry

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
