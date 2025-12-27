from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..types import UNSET, Unset

T = TypeVar("T", bound="BigPlanFindArgs")


@_attrs_define
class BigPlanFindArgs:
    """PersonFindArgs.

    Attributes:
        allow_archived (bool):
        include_life_plan (bool):
        include_inbox_tasks (bool):
        include_notes (bool):
        include_milestones (bool):
        include_stats (bool):
        filter_just_workable (bool | None | Unset):
        filter_ref_ids (list[str] | None | Unset):
        filter_project_ref_ids (list[str] | None | Unset):
    """

    allow_archived: bool
    include_life_plan: bool
    include_inbox_tasks: bool
    include_notes: bool
    include_milestones: bool
    include_stats: bool
    filter_just_workable: bool | None | Unset = UNSET
    filter_ref_ids: list[str] | None | Unset = UNSET
    filter_project_ref_ids: list[str] | None | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        allow_archived = self.allow_archived

        include_life_plan = self.include_life_plan

        include_inbox_tasks = self.include_inbox_tasks

        include_notes = self.include_notes

        include_milestones = self.include_milestones

        include_stats = self.include_stats

        filter_just_workable: bool | None | Unset
        if isinstance(self.filter_just_workable, Unset):
            filter_just_workable = UNSET
        else:
            filter_just_workable = self.filter_just_workable

        filter_ref_ids: list[str] | None | Unset
        if isinstance(self.filter_ref_ids, Unset):
            filter_ref_ids = UNSET
        elif isinstance(self.filter_ref_ids, list):
            filter_ref_ids = self.filter_ref_ids

        else:
            filter_ref_ids = self.filter_ref_ids

        filter_project_ref_ids: list[str] | None | Unset
        if isinstance(self.filter_project_ref_ids, Unset):
            filter_project_ref_ids = UNSET
        elif isinstance(self.filter_project_ref_ids, list):
            filter_project_ref_ids = self.filter_project_ref_ids

        else:
            filter_project_ref_ids = self.filter_project_ref_ids

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "allow_archived": allow_archived,
                "include_life_plan": include_life_plan,
                "include_inbox_tasks": include_inbox_tasks,
                "include_notes": include_notes,
                "include_milestones": include_milestones,
                "include_stats": include_stats,
            }
        )
        if filter_just_workable is not UNSET:
            field_dict["filter_just_workable"] = filter_just_workable
        if filter_ref_ids is not UNSET:
            field_dict["filter_ref_ids"] = filter_ref_ids
        if filter_project_ref_ids is not UNSET:
            field_dict["filter_project_ref_ids"] = filter_project_ref_ids

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        allow_archived = d.pop("allow_archived")

        include_life_plan = d.pop("include_life_plan")

        include_inbox_tasks = d.pop("include_inbox_tasks")

        include_notes = d.pop("include_notes")

        include_milestones = d.pop("include_milestones")

        include_stats = d.pop("include_stats")

        def _parse_filter_just_workable(data: object) -> bool | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(bool | None | Unset, data)

        filter_just_workable = _parse_filter_just_workable(d.pop("filter_just_workable", UNSET))

        def _parse_filter_ref_ids(data: object) -> list[str] | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, list):
                    raise TypeError()
                filter_ref_ids_type_0 = cast(list[str], data)

                return filter_ref_ids_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(list[str] | None | Unset, data)

        filter_ref_ids = _parse_filter_ref_ids(d.pop("filter_ref_ids", UNSET))

        def _parse_filter_project_ref_ids(data: object) -> list[str] | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            try:
                if not isinstance(data, list):
                    raise TypeError()
                filter_project_ref_ids_type_0 = cast(list[str], data)

                return filter_project_ref_ids_type_0
            except (TypeError, ValueError, AttributeError, KeyError):
                pass
            return cast(list[str] | None | Unset, data)

        filter_project_ref_ids = _parse_filter_project_ref_ids(d.pop("filter_project_ref_ids", UNSET))

        big_plan_find_args = cls(
            allow_archived=allow_archived,
            include_life_plan=include_life_plan,
            include_inbox_tasks=include_inbox_tasks,
            include_notes=include_notes,
            include_milestones=include_milestones,
            include_stats=include_stats,
            filter_just_workable=filter_just_workable,
            filter_ref_ids=filter_ref_ids,
            filter_project_ref_ids=filter_project_ref_ids,
        )

        big_plan_find_args.additional_properties = d
        return big_plan_find_args

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
