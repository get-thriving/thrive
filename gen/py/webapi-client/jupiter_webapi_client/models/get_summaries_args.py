from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..types import UNSET, Unset

T = TypeVar("T", bound="GetSummariesArgs")


@_attrs_define
class GetSummariesArgs:
    """Get summaries args.

    Attributes:
        allow_archived (bool | None | Unset):
        include_user (bool | None | Unset):
        include_workspace (bool | None | Unset):
        include_life_plan (bool | None | Unset):
        include_schedule_streams (bool | None | Unset):
        include_vacations (bool | None | Unset):
        include_projects (bool | None | Unset):
        include_chapters (bool | None | Unset):
        include_goals (bool | None | Unset):
        include_milestones (bool | None | Unset):
        include_inbox_tasks (bool | None | Unset):
        include_journals_last_year (bool | None | Unset):
        include_habits (bool | None | Unset):
        include_chores (bool | None | Unset):
        include_big_plans (bool | None | Unset):
        include_smart_lists (bool | None | Unset):
        include_metrics (bool | None | Unset):
        include_persons (bool | None | Unset):
    """

    allow_archived: bool | None | Unset = UNSET
    include_user: bool | None | Unset = UNSET
    include_workspace: bool | None | Unset = UNSET
    include_life_plan: bool | None | Unset = UNSET
    include_schedule_streams: bool | None | Unset = UNSET
    include_vacations: bool | None | Unset = UNSET
    include_projects: bool | None | Unset = UNSET
    include_chapters: bool | None | Unset = UNSET
    include_goals: bool | None | Unset = UNSET
    include_milestones: bool | None | Unset = UNSET
    include_inbox_tasks: bool | None | Unset = UNSET
    include_journals_last_year: bool | None | Unset = UNSET
    include_habits: bool | None | Unset = UNSET
    include_chores: bool | None | Unset = UNSET
    include_big_plans: bool | None | Unset = UNSET
    include_smart_lists: bool | None | Unset = UNSET
    include_metrics: bool | None | Unset = UNSET
    include_persons: bool | None | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        allow_archived: bool | None | Unset
        if isinstance(self.allow_archived, Unset):
            allow_archived = UNSET
        else:
            allow_archived = self.allow_archived

        include_user: bool | None | Unset
        if isinstance(self.include_user, Unset):
            include_user = UNSET
        else:
            include_user = self.include_user

        include_workspace: bool | None | Unset
        if isinstance(self.include_workspace, Unset):
            include_workspace = UNSET
        else:
            include_workspace = self.include_workspace

        include_life_plan: bool | None | Unset
        if isinstance(self.include_life_plan, Unset):
            include_life_plan = UNSET
        else:
            include_life_plan = self.include_life_plan

        include_schedule_streams: bool | None | Unset
        if isinstance(self.include_schedule_streams, Unset):
            include_schedule_streams = UNSET
        else:
            include_schedule_streams = self.include_schedule_streams

        include_vacations: bool | None | Unset
        if isinstance(self.include_vacations, Unset):
            include_vacations = UNSET
        else:
            include_vacations = self.include_vacations

        include_projects: bool | None | Unset
        if isinstance(self.include_projects, Unset):
            include_projects = UNSET
        else:
            include_projects = self.include_projects

        include_chapters: bool | None | Unset
        if isinstance(self.include_chapters, Unset):
            include_chapters = UNSET
        else:
            include_chapters = self.include_chapters

        include_goals: bool | None | Unset
        if isinstance(self.include_goals, Unset):
            include_goals = UNSET
        else:
            include_goals = self.include_goals

        include_milestones: bool | None | Unset
        if isinstance(self.include_milestones, Unset):
            include_milestones = UNSET
        else:
            include_milestones = self.include_milestones

        include_inbox_tasks: bool | None | Unset
        if isinstance(self.include_inbox_tasks, Unset):
            include_inbox_tasks = UNSET
        else:
            include_inbox_tasks = self.include_inbox_tasks

        include_journals_last_year: bool | None | Unset
        if isinstance(self.include_journals_last_year, Unset):
            include_journals_last_year = UNSET
        else:
            include_journals_last_year = self.include_journals_last_year

        include_habits: bool | None | Unset
        if isinstance(self.include_habits, Unset):
            include_habits = UNSET
        else:
            include_habits = self.include_habits

        include_chores: bool | None | Unset
        if isinstance(self.include_chores, Unset):
            include_chores = UNSET
        else:
            include_chores = self.include_chores

        include_big_plans: bool | None | Unset
        if isinstance(self.include_big_plans, Unset):
            include_big_plans = UNSET
        else:
            include_big_plans = self.include_big_plans

        include_smart_lists: bool | None | Unset
        if isinstance(self.include_smart_lists, Unset):
            include_smart_lists = UNSET
        else:
            include_smart_lists = self.include_smart_lists

        include_metrics: bool | None | Unset
        if isinstance(self.include_metrics, Unset):
            include_metrics = UNSET
        else:
            include_metrics = self.include_metrics

        include_persons: bool | None | Unset
        if isinstance(self.include_persons, Unset):
            include_persons = UNSET
        else:
            include_persons = self.include_persons

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update({})
        if allow_archived is not UNSET:
            field_dict["allow_archived"] = allow_archived
        if include_user is not UNSET:
            field_dict["include_user"] = include_user
        if include_workspace is not UNSET:
            field_dict["include_workspace"] = include_workspace
        if include_life_plan is not UNSET:
            field_dict["include_life_plan"] = include_life_plan
        if include_schedule_streams is not UNSET:
            field_dict["include_schedule_streams"] = include_schedule_streams
        if include_vacations is not UNSET:
            field_dict["include_vacations"] = include_vacations
        if include_projects is not UNSET:
            field_dict["include_projects"] = include_projects
        if include_chapters is not UNSET:
            field_dict["include_chapters"] = include_chapters
        if include_goals is not UNSET:
            field_dict["include_goals"] = include_goals
        if include_milestones is not UNSET:
            field_dict["include_milestones"] = include_milestones
        if include_inbox_tasks is not UNSET:
            field_dict["include_inbox_tasks"] = include_inbox_tasks
        if include_journals_last_year is not UNSET:
            field_dict["include_journals_last_year"] = include_journals_last_year
        if include_habits is not UNSET:
            field_dict["include_habits"] = include_habits
        if include_chores is not UNSET:
            field_dict["include_chores"] = include_chores
        if include_big_plans is not UNSET:
            field_dict["include_big_plans"] = include_big_plans
        if include_smart_lists is not UNSET:
            field_dict["include_smart_lists"] = include_smart_lists
        if include_metrics is not UNSET:
            field_dict["include_metrics"] = include_metrics
        if include_persons is not UNSET:
            field_dict["include_persons"] = include_persons

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)

        def _parse_allow_archived(data: object) -> bool | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(bool | None | Unset, data)

        allow_archived = _parse_allow_archived(d.pop("allow_archived", UNSET))

        def _parse_include_user(data: object) -> bool | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(bool | None | Unset, data)

        include_user = _parse_include_user(d.pop("include_user", UNSET))

        def _parse_include_workspace(data: object) -> bool | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(bool | None | Unset, data)

        include_workspace = _parse_include_workspace(d.pop("include_workspace", UNSET))

        def _parse_include_life_plan(data: object) -> bool | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(bool | None | Unset, data)

        include_life_plan = _parse_include_life_plan(d.pop("include_life_plan", UNSET))

        def _parse_include_schedule_streams(data: object) -> bool | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(bool | None | Unset, data)

        include_schedule_streams = _parse_include_schedule_streams(d.pop("include_schedule_streams", UNSET))

        def _parse_include_vacations(data: object) -> bool | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(bool | None | Unset, data)

        include_vacations = _parse_include_vacations(d.pop("include_vacations", UNSET))

        def _parse_include_projects(data: object) -> bool | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(bool | None | Unset, data)

        include_projects = _parse_include_projects(d.pop("include_projects", UNSET))

        def _parse_include_chapters(data: object) -> bool | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(bool | None | Unset, data)

        include_chapters = _parse_include_chapters(d.pop("include_chapters", UNSET))

        def _parse_include_goals(data: object) -> bool | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(bool | None | Unset, data)

        include_goals = _parse_include_goals(d.pop("include_goals", UNSET))

        def _parse_include_milestones(data: object) -> bool | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(bool | None | Unset, data)

        include_milestones = _parse_include_milestones(d.pop("include_milestones", UNSET))

        def _parse_include_inbox_tasks(data: object) -> bool | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(bool | None | Unset, data)

        include_inbox_tasks = _parse_include_inbox_tasks(d.pop("include_inbox_tasks", UNSET))

        def _parse_include_journals_last_year(data: object) -> bool | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(bool | None | Unset, data)

        include_journals_last_year = _parse_include_journals_last_year(d.pop("include_journals_last_year", UNSET))

        def _parse_include_habits(data: object) -> bool | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(bool | None | Unset, data)

        include_habits = _parse_include_habits(d.pop("include_habits", UNSET))

        def _parse_include_chores(data: object) -> bool | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(bool | None | Unset, data)

        include_chores = _parse_include_chores(d.pop("include_chores", UNSET))

        def _parse_include_big_plans(data: object) -> bool | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(bool | None | Unset, data)

        include_big_plans = _parse_include_big_plans(d.pop("include_big_plans", UNSET))

        def _parse_include_smart_lists(data: object) -> bool | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(bool | None | Unset, data)

        include_smart_lists = _parse_include_smart_lists(d.pop("include_smart_lists", UNSET))

        def _parse_include_metrics(data: object) -> bool | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(bool | None | Unset, data)

        include_metrics = _parse_include_metrics(d.pop("include_metrics", UNSET))

        def _parse_include_persons(data: object) -> bool | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(bool | None | Unset, data)

        include_persons = _parse_include_persons(d.pop("include_persons", UNSET))

        get_summaries_args = cls(
            allow_archived=allow_archived,
            include_user=include_user,
            include_workspace=include_workspace,
            include_life_plan=include_life_plan,
            include_schedule_streams=include_schedule_streams,
            include_vacations=include_vacations,
            include_projects=include_projects,
            include_chapters=include_chapters,
            include_goals=include_goals,
            include_milestones=include_milestones,
            include_inbox_tasks=include_inbox_tasks,
            include_journals_last_year=include_journals_last_year,
            include_habits=include_habits,
            include_chores=include_chores,
            include_big_plans=include_big_plans,
            include_smart_lists=include_smart_lists,
            include_metrics=include_metrics,
            include_persons=include_persons,
        )

        get_summaries_args.additional_properties = d
        return get_summaries_args

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
