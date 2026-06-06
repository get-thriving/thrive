from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.project_entry import ProjectEntry
    from ..models.chore_entry import ChoreEntry
    from ..models.habit_entry import HabitEntry
    from ..models.person_occasion_entry import PersonOccasionEntry
    from ..models.schedule_full_days_event_entry import ScheduleFullDaysEventEntry
    from ..models.schedule_in_day_event_entry import ScheduleInDayEventEntry
    from ..models.time_plan_activity_entry import TimePlanActivityEntry
    from ..models.todo_task_entry import TodoTaskEntry
    from ..models.vacation_entry import VacationEntry


T = TypeVar("T", bound="CalendarEventsEntries")


@_attrs_define
class CalendarEventsEntries:
    """Full entries for results.

    Attributes:
        schedule_event_full_days_entries (list[ScheduleFullDaysEventEntry]):
        schedule_event_in_day_entries (list[ScheduleInDayEventEntry]):
        project_entries (list[ProjectEntry]):
        todo_task_entries (list[TodoTaskEntry]):
        habit_entries (list[HabitEntry]):
        chore_entries (list[ChoreEntry]):
        time_plan_activity_entries (list[TimePlanActivityEntry]):
        person_occasion_entries (list[PersonOccasionEntry]):
        vacation_entries (list[VacationEntry]):
    """

    schedule_event_full_days_entries: list[ScheduleFullDaysEventEntry]
    schedule_event_in_day_entries: list[ScheduleInDayEventEntry]
    project_entries: list[ProjectEntry]
    todo_task_entries: list[TodoTaskEntry]
    habit_entries: list[HabitEntry]
    chore_entries: list[ChoreEntry]
    time_plan_activity_entries: list[TimePlanActivityEntry]
    person_occasion_entries: list[PersonOccasionEntry]
    vacation_entries: list[VacationEntry]
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        schedule_event_full_days_entries = []
        for schedule_event_full_days_entries_item_data in self.schedule_event_full_days_entries:
            schedule_event_full_days_entries_item = schedule_event_full_days_entries_item_data.to_dict()
            schedule_event_full_days_entries.append(schedule_event_full_days_entries_item)

        schedule_event_in_day_entries = []
        for schedule_event_in_day_entries_item_data in self.schedule_event_in_day_entries:
            schedule_event_in_day_entries_item = schedule_event_in_day_entries_item_data.to_dict()
            schedule_event_in_day_entries.append(schedule_event_in_day_entries_item)

        project_entries = []
        for project_entries_item_data in self.project_entries:
            project_entries_item = project_entries_item_data.to_dict()
            project_entries.append(project_entries_item)

        todo_task_entries = []
        for todo_task_entries_item_data in self.todo_task_entries:
            todo_task_entries_item = todo_task_entries_item_data.to_dict()
            todo_task_entries.append(todo_task_entries_item)

        habit_entries = []
        for habit_entries_item_data in self.habit_entries:
            habit_entries_item = habit_entries_item_data.to_dict()
            habit_entries.append(habit_entries_item)

        chore_entries = []
        for chore_entries_item_data in self.chore_entries:
            chore_entries_item = chore_entries_item_data.to_dict()
            chore_entries.append(chore_entries_item)

        time_plan_activity_entries = []
        for time_plan_activity_entries_item_data in self.time_plan_activity_entries:
            time_plan_activity_entries_item = time_plan_activity_entries_item_data.to_dict()
            time_plan_activity_entries.append(time_plan_activity_entries_item)

        person_occasion_entries = []
        for person_occasion_entries_item_data in self.person_occasion_entries:
            person_occasion_entries_item = person_occasion_entries_item_data.to_dict()
            person_occasion_entries.append(person_occasion_entries_item)

        vacation_entries = []
        for vacation_entries_item_data in self.vacation_entries:
            vacation_entries_item = vacation_entries_item_data.to_dict()
            vacation_entries.append(vacation_entries_item)

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "schedule_event_full_days_entries": schedule_event_full_days_entries,
                "schedule_event_in_day_entries": schedule_event_in_day_entries,
                "project_entries": project_entries,
                "todo_task_entries": todo_task_entries,
                "habit_entries": habit_entries,
                "chore_entries": chore_entries,
                "time_plan_activity_entries": time_plan_activity_entries,
                "person_occasion_entries": person_occasion_entries,
                "vacation_entries": vacation_entries,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.project_entry import ProjectEntry
        from ..models.chore_entry import ChoreEntry
        from ..models.habit_entry import HabitEntry
        from ..models.person_occasion_entry import PersonOccasionEntry
        from ..models.schedule_full_days_event_entry import ScheduleFullDaysEventEntry
        from ..models.schedule_in_day_event_entry import ScheduleInDayEventEntry
        from ..models.time_plan_activity_entry import TimePlanActivityEntry
        from ..models.todo_task_entry import TodoTaskEntry
        from ..models.vacation_entry import VacationEntry

        d = dict(src_dict)
        schedule_event_full_days_entries = []
        _schedule_event_full_days_entries = d.pop("schedule_event_full_days_entries")
        for schedule_event_full_days_entries_item_data in _schedule_event_full_days_entries:
            schedule_event_full_days_entries_item = ScheduleFullDaysEventEntry.from_dict(
                schedule_event_full_days_entries_item_data
            )

            schedule_event_full_days_entries.append(schedule_event_full_days_entries_item)

        schedule_event_in_day_entries = []
        _schedule_event_in_day_entries = d.pop("schedule_event_in_day_entries")
        for schedule_event_in_day_entries_item_data in _schedule_event_in_day_entries:
            schedule_event_in_day_entries_item = ScheduleInDayEventEntry.from_dict(
                schedule_event_in_day_entries_item_data
            )

            schedule_event_in_day_entries.append(schedule_event_in_day_entries_item)

        project_entries = []
        _project_entries = d.pop("project_entries")
        for project_entries_item_data in _project_entries:
            project_entries_item = ProjectEntry.from_dict(project_entries_item_data)

            project_entries.append(project_entries_item)

        todo_task_entries = []
        _todo_task_entries = d.pop("todo_task_entries")
        for todo_task_entries_item_data in _todo_task_entries:
            todo_task_entries_item = TodoTaskEntry.from_dict(todo_task_entries_item_data)

            todo_task_entries.append(todo_task_entries_item)

        habit_entries = []
        _habit_entries = d.pop("habit_entries")
        for habit_entries_item_data in _habit_entries:
            habit_entries_item = HabitEntry.from_dict(habit_entries_item_data)

            habit_entries.append(habit_entries_item)

        chore_entries = []
        _chore_entries = d.pop("chore_entries")
        for chore_entries_item_data in _chore_entries:
            chore_entries_item = ChoreEntry.from_dict(chore_entries_item_data)

            chore_entries.append(chore_entries_item)

        time_plan_activity_entries = []
        _time_plan_activity_entries = d.pop("time_plan_activity_entries")
        for time_plan_activity_entries_item_data in _time_plan_activity_entries:
            time_plan_activity_entries_item = TimePlanActivityEntry.from_dict(time_plan_activity_entries_item_data)

            time_plan_activity_entries.append(time_plan_activity_entries_item)

        person_occasion_entries = []
        _person_occasion_entries = d.pop("person_occasion_entries")
        for person_occasion_entries_item_data in _person_occasion_entries:
            person_occasion_entries_item = PersonOccasionEntry.from_dict(person_occasion_entries_item_data)

            person_occasion_entries.append(person_occasion_entries_item)

        vacation_entries = []
        _vacation_entries = d.pop("vacation_entries")
        for vacation_entries_item_data in _vacation_entries:
            vacation_entries_item = VacationEntry.from_dict(vacation_entries_item_data)

            vacation_entries.append(vacation_entries_item)

        calendar_events_entries = cls(
            schedule_event_full_days_entries=schedule_event_full_days_entries,
            schedule_event_in_day_entries=schedule_event_in_day_entries,
            project_entries=project_entries,
            todo_task_entries=todo_task_entries,
            habit_entries=habit_entries,
            chore_entries=chore_entries,
            time_plan_activity_entries=time_plan_activity_entries,
            person_occasion_entries=person_occasion_entries,
            vacation_entries=vacation_entries,
        )

        calendar_events_entries.additional_properties = d
        return calendar_events_entries

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
