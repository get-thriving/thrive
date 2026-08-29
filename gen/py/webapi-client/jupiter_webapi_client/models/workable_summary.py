from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.workable_project import WorkableProject


T = TypeVar("T", bound="WorkableSummary")


@_attrs_define
class WorkableSummary:
    """The reporting summary.

    Attributes:
        created_cnt (int):
        not_started_cnt (int):
        working_cnt (int):
        not_done_cnt (int):
        done_cnt (int):
        not_done_projects (list[WorkableProject]):
        done_projects (list[WorkableProject]):
    """

    created_cnt: int
    not_started_cnt: int
    working_cnt: int
    not_done_cnt: int
    done_cnt: int
    not_done_projects: list[WorkableProject]
    done_projects: list[WorkableProject]
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        created_cnt = self.created_cnt

        not_started_cnt = self.not_started_cnt

        working_cnt = self.working_cnt

        not_done_cnt = self.not_done_cnt

        done_cnt = self.done_cnt

        not_done_projects = []
        for not_done_projects_item_data in self.not_done_projects:
            not_done_projects_item = not_done_projects_item_data.to_dict()
            not_done_projects.append(not_done_projects_item)

        done_projects = []
        for done_projects_item_data in self.done_projects:
            done_projects_item = done_projects_item_data.to_dict()
            done_projects.append(done_projects_item)

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "created_cnt": created_cnt,
                "not_started_cnt": not_started_cnt,
                "working_cnt": working_cnt,
                "not_done_cnt": not_done_cnt,
                "done_cnt": done_cnt,
                "not_done_projects": not_done_projects,
                "done_projects": done_projects,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.workable_project import WorkableProject

        d = dict(src_dict)
        created_cnt = d.pop("created_cnt")

        not_started_cnt = d.pop("not_started_cnt")

        working_cnt = d.pop("working_cnt")

        not_done_cnt = d.pop("not_done_cnt")

        done_cnt = d.pop("done_cnt")

        not_done_projects = []
        _not_done_projects = d.pop("not_done_projects")
        for not_done_projects_item_data in _not_done_projects:
            not_done_projects_item = WorkableProject.from_dict(not_done_projects_item_data)

            not_done_projects.append(not_done_projects_item)

        done_projects = []
        _done_projects = d.pop("done_projects")
        for done_projects_item_data in _done_projects:
            done_projects_item = WorkableProject.from_dict(done_projects_item_data)

            done_projects.append(done_projects_item)

        workable_summary = cls(
            created_cnt=created_cnt,
            not_started_cnt=not_started_cnt,
            working_cnt=working_cnt,
            not_done_cnt=not_done_cnt,
            done_cnt=done_cnt,
            not_done_projects=not_done_projects,
            done_projects=done_projects,
        )

        workable_summary.additional_properties = d
        return workable_summary

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
