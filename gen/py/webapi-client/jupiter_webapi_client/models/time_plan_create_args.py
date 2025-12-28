from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar, cast

from attrs import define as _attrs_define
from attrs import field as _attrs_field

from ..models.recurring_task_period import RecurringTaskPeriod
from ..types import UNSET, Unset

T = TypeVar("T", bound="TimePlanCreateArgs")


@_attrs_define
class TimePlanCreateArgs:
    """Args.

    Attributes:
        right_now (str): A date or possibly a datetime for the application.
        period (RecurringTaskPeriod): A period for a particular task.
        chapter_ref_ids (list[str] | None | Unset):
        project_ref_ids (list[str] | None | Unset):
        goal_ref_ids (list[str] | None | Unset):
    """

    right_now: str
    period: RecurringTaskPeriod
    chapter_ref_ids: list[str] | None | Unset = UNSET
    project_ref_ids: list[str] | None | Unset = UNSET
    goal_ref_ids: list[str] | None | Unset = UNSET
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        right_now = self.right_now

        period = self.period.value

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
                "right_now": right_now,
                "period": period,
            }
        )
        if chapter_ref_ids is not UNSET:
            field_dict["chapter_ref_ids"] = chapter_ref_ids
        if project_ref_ids is not UNSET:
            field_dict["project_ref_ids"] = project_ref_ids
        if goal_ref_ids is not UNSET:
            field_dict["goal_ref_ids"] = goal_ref_ids

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        right_now = d.pop("right_now")

        period = RecurringTaskPeriod(d.pop("period"))

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

        time_plan_create_args = cls(
            right_now=right_now,
            period=period,
            chapter_ref_ids=chapter_ref_ids,
            project_ref_ids=project_ref_ids,
            goal_ref_ids=goal_ref_ids,
        )

        time_plan_create_args.additional_properties = d
        return time_plan_create_args

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
