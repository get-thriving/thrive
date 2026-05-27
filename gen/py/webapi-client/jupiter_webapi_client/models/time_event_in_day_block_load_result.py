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
    from ..models.schedule_event_in_day import ScheduleEventInDay
    from ..models.time_event_in_day_block import TimeEventInDayBlock
    from ..models.time_plan_activity import TimePlanActivity
    from ..models.todo_task import TodoTask


T = TypeVar("T", bound="TimeEventInDayBlockLoadResult")


@_attrs_define
class TimeEventInDayBlockLoadResult:
    """InDayBlockLoadResult.

    Attributes:
        in_day_block (TimeEventInDayBlock): Time event.
        schedule_event (None | ScheduleEventInDay | Unset):
        big_plan (BigPlan | None | Unset):
        todo_task (None | TodoTask | Unset):
        habit (Habit | None | Unset):
        chore (Chore | None | Unset):
        time_plan_activity (None | TimePlanActivity | Unset):
    """

    in_day_block: TimeEventInDayBlock
    schedule_event: None | ScheduleEventInDay | Unset = UNSET
    big_plan: BigPlan | None | Unset = UNSET
    todo_task: None | TodoTask | Unset = UNSET
    habit: Habit | None | Unset = UNSET
    chore: Chore | None | Unset = UNSET
    time_plan_activity: None | TimePlanActivity | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        from ..models.big_plan import BigPlan
        from ..models.chore import Chore
        from ..models.habit import Habit
        from ..models.schedule_event_in_day import ScheduleEventInDay
        from ..models.time_plan_activity import TimePlanActivity
        from ..models.todo_task import TodoTask

        in_day_block = self.in_day_block.to_dict()

        schedule_event: dict[str, Any] | None | Unset
        if isinstance(self.schedule_event, Unset):
            schedule_event = UNSET
        elif isinstance(self.schedule_event, ScheduleEventInDay):
            schedule_event = self.schedule_event.to_dict()
        else:
            schedule_event = self.schedule_event

        big_plan: dict[str, Any] | None | Unset
        if isinstance(self.big_plan, Unset):
            big_plan = UNSET
        elif isinstance(self.big_plan, BigPlan):
            big_plan = self.big_plan.to_dict()
        else:
            big_plan = self.big_plan

        todo_task: dict[str, Any] | None | Unset
        if isinstance(self.todo_task, Unset):
            todo_task = UNSET
        elif isinstance(self.todo_task, TodoTask):
            todo_task = self.todo_task.to_dict()
        else:
            todo_task = self.todo_task

        habit: dict[str, Any] | None | Unset
        if isinstance(self.habit, Unset):
            habit = UNSET
        elif isinstance(self.habit, Habit):
            habit = self.habit.to_dict()
        else:
            habit = self.habit

        chore: dict[str, Any] | None | Unset
        if isinstance(self.chore, Unset):
            chore = UNSET
        elif isinstance(self.chore, Chore):
            chore = self.chore.to_dict()
        else:
            chore = self.chore

        time_plan_activity: dict[str, Any] | None | Unset
        if isinstance(self.time_plan_activity, Unset):
            time_plan_activity = UNSET
        elif isinstance(self.time_plan_activity, TimePlanActivity):
            time_plan_activity = self.time_plan_activity.to_dict()
        else:
            time_plan_activity = self.time_plan_activity

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "in_day_block": in_day_block,
            }
        )
        if schedule_event is not UNSET:
            field_dict["schedule_event"] = schedule_event
        if big_plan is not UNSET:
            field_dict["big_plan"] = big_plan
        if todo_task is not UNSET:
            field_dict["todo_task"] = todo_task
        if habit is not UNSET:
            field_dict["habit"] = habit
        if chore is not UNSET:
            field_dict["chore"] = chore
        if time_plan_activity is not UNSET:
            field_dict["time_plan_activity"] = time_plan_activity

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.big_plan import BigPlan
        from ..models.chore import Chore
        from ..models.habit import Habit
        from ..models.schedule_event_in_day import ScheduleEventInDay
        from ..models.time_event_in_day_block import TimeEventInDayBlock
        from ..models.time_plan_activity import TimePlanActivity
        from ..models.todo_task import TodoTask

        d = dict(src_dict)
        in_day_block = TimeEventInDayBlock.from_dict(d.pop("in_day_block"))

        def _parse_schedule_event(data: object) -> None | ScheduleEventInDay | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, dict):
                    raise TypeError()
                schedule_event_type_0 = ScheduleEventInDay.from_dict(data)

                return schedule_event_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(None | ScheduleEventInDay | Unset, data)

        schedule_event = _parse_schedule_event(d.pop("schedule_event", UNSET))

        def _parse_big_plan(data: object) -> BigPlan | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, dict):
                    raise TypeError()
                big_plan_type_0 = BigPlan.from_dict(data)

                return big_plan_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(BigPlan | None | Unset, data)

        big_plan = _parse_big_plan(d.pop("big_plan", UNSET))

        def _parse_todo_task(data: object) -> None | TodoTask | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, dict):
                    raise TypeError()
                todo_task_type_0 = TodoTask.from_dict(data)

                return todo_task_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(None | TodoTask | Unset, data)

        todo_task = _parse_todo_task(d.pop("todo_task", UNSET))

        def _parse_habit(data: object) -> Habit | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, dict):
                    raise TypeError()
                habit_type_0 = Habit.from_dict(data)

                return habit_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(Habit | None | Unset, data)

        habit = _parse_habit(d.pop("habit", UNSET))

        def _parse_chore(data: object) -> Chore | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, dict):
                    raise TypeError()
                chore_type_0 = Chore.from_dict(data)

                return chore_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(Chore | None | Unset, data)

        chore = _parse_chore(d.pop("chore", UNSET))

        def _parse_time_plan_activity(data: object) -> None | TimePlanActivity | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, dict):
                    raise TypeError()
                time_plan_activity_type_0 = TimePlanActivity.from_dict(data)

                return time_plan_activity_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(None | TimePlanActivity | Unset, data)

        time_plan_activity = _parse_time_plan_activity(d.pop("time_plan_activity", UNSET))

        time_event_in_day_block_load_result = cls(
            in_day_block=in_day_block,
            schedule_event=schedule_event,
            big_plan=big_plan,
            todo_task=todo_task,
            habit=habit,
            chore=chore,
            time_plan_activity=time_plan_activity,
        )

        time_event_in_day_block_load_result.additional_properties = d
        return time_event_in_day_block_load_result

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
