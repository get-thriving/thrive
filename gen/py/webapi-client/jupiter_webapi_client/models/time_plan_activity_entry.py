from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..types import UNSET, Unset

if TYPE_CHECKING:
    from ..models.big_plan import BigPlan
    from ..models.chore import Chore
    from ..models.habit import Habit
    from ..models.inbox_task import InboxTask
    from ..models.time_event_in_day_block import TimeEventInDayBlock
    from ..models.time_plan_activity import TimePlanActivity
    from ..models.todo_task import TodoTask


T = TypeVar("T", bound="TimePlanActivityEntry")


@_attrs_define
class TimePlanActivityEntry:
    """Result entry.

    Attributes:
        time_plan_activity (TimePlanActivity): A certain activity that happens in a plan.
        time_events (list[TimeEventInDayBlock]):
        target_inbox_task (InboxTask | None | Unset):
        target_big_plan (BigPlan | None | Unset):
        target_todo_task (None | TodoTask | Unset):
        target_habit (Habit | None | Unset):
        target_chore (Chore | None | Unset):
    """

    time_plan_activity: TimePlanActivity
    time_events: list[TimeEventInDayBlock]
    target_inbox_task: InboxTask | None | Unset = UNSET
    target_big_plan: BigPlan | None | Unset = UNSET
    target_todo_task: None | TodoTask | Unset = UNSET
    target_habit: Habit | None | Unset = UNSET
    target_chore: Chore | None | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        from ..models.big_plan import BigPlan  # noqa: PLC0415
        from ..models.chore import Chore  # noqa: PLC0415
        from ..models.habit import Habit  # noqa: PLC0415
        from ..models.inbox_task import InboxTask  # noqa: PLC0415
        from ..models.todo_task import TodoTask  # noqa: PLC0415

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

        target_big_plan: dict[str, Any] | None | Unset
        if isinstance(self.target_big_plan, Unset):
            target_big_plan = UNSET
        elif isinstance(self.target_big_plan, BigPlan):
            target_big_plan = self.target_big_plan.to_dict()
        else:
            target_big_plan = self.target_big_plan

        target_todo_task: dict[str, Any] | None | Unset
        if isinstance(self.target_todo_task, Unset):
            target_todo_task = UNSET
        elif isinstance(self.target_todo_task, TodoTask):
            target_todo_task = self.target_todo_task.to_dict()
        else:
            target_todo_task = self.target_todo_task

        target_habit: dict[str, Any] | None | Unset
        if isinstance(self.target_habit, Unset):
            target_habit = UNSET
        elif isinstance(self.target_habit, Habit):
            target_habit = self.target_habit.to_dict()
        else:
            target_habit = self.target_habit

        target_chore: dict[str, Any] | None | Unset
        if isinstance(self.target_chore, Unset):
            target_chore = UNSET
        elif isinstance(self.target_chore, Chore):
            target_chore = self.target_chore.to_dict()
        else:
            target_chore = self.target_chore

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
        if target_big_plan is not UNSET:
            field_dict["target_big_plan"] = target_big_plan
        if target_todo_task is not UNSET:
            field_dict["target_todo_task"] = target_todo_task
        if target_habit is not UNSET:
            field_dict["target_habit"] = target_habit
        if target_chore is not UNSET:
            field_dict["target_chore"] = target_chore

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.big_plan import BigPlan  # noqa: PLC0415
        from ..models.chore import Chore  # noqa: PLC0415
        from ..models.habit import Habit  # noqa: PLC0415
        from ..models.inbox_task import InboxTask  # noqa: PLC0415
        from ..models.time_event_in_day_block import TimeEventInDayBlock  # noqa: PLC0415
        from ..models.time_plan_activity import TimePlanActivity  # noqa: PLC0415
        from ..models.todo_task import TodoTask  # noqa: PLC0415

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

        def _parse_target_big_plan(data: object) -> BigPlan | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, dict):
                    raise TypeError()
                target_big_plan_type_0 = BigPlan.from_dict(data)

                return target_big_plan_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(BigPlan | None | Unset, data)

        target_big_plan = _parse_target_big_plan(d.pop("target_big_plan", UNSET))

        def _parse_target_todo_task(data: object) -> None | TodoTask | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, dict):
                    raise TypeError()
                target_todo_task_type_0 = TodoTask.from_dict(data)

                return target_todo_task_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(None | TodoTask | Unset, data)

        target_todo_task = _parse_target_todo_task(d.pop("target_todo_task", UNSET))

        def _parse_target_habit(data: object) -> Habit | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, dict):
                    raise TypeError()
                target_habit_type_0 = Habit.from_dict(data)

                return target_habit_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(Habit | None | Unset, data)

        target_habit = _parse_target_habit(d.pop("target_habit", UNSET))

        def _parse_target_chore(data: object) -> Chore | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, dict):
                    raise TypeError()
                target_chore_type_0 = Chore.from_dict(data)

                return target_chore_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(Chore | None | Unset, data)

        target_chore = _parse_target_chore(d.pop("target_chore", UNSET))

        time_plan_activity_entry = cls(
            time_plan_activity=time_plan_activity,
            time_events=time_events,
            target_inbox_task=target_inbox_task,
            target_big_plan=target_big_plan,
            target_todo_task=target_todo_task,
            target_habit=target_habit,
            target_chore=target_chore,
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
