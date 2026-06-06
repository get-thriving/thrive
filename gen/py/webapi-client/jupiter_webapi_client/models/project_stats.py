from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

T = TypeVar("T", bound="ProjectStats")


@_attrs_define
class ProjectStats:
    """Stats about a project.

    Attributes:
        created_time (str): A timestamp in the application.
        last_modified_time (str): A timestamp in the application.
        project_ref_id (str):
        all_inbox_tasks_cnt (int):
        completed_inbox_tasks_cnt (int):
    """

    created_time: str
    last_modified_time: str
    project_ref_id: str
    all_inbox_tasks_cnt: int
    completed_inbox_tasks_cnt: int
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        created_time = self.created_time

        last_modified_time = self.last_modified_time

        project_ref_id = self.project_ref_id

        all_inbox_tasks_cnt = self.all_inbox_tasks_cnt

        completed_inbox_tasks_cnt = self.completed_inbox_tasks_cnt

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "created_time": created_time,
                "last_modified_time": last_modified_time,
                "project_ref_id": project_ref_id,
                "all_inbox_tasks_cnt": all_inbox_tasks_cnt,
                "completed_inbox_tasks_cnt": completed_inbox_tasks_cnt,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        created_time = d.pop("created_time")

        last_modified_time = d.pop("last_modified_time")

        project_ref_id = d.pop("project_ref_id")

        all_inbox_tasks_cnt = d.pop("all_inbox_tasks_cnt")

        completed_inbox_tasks_cnt = d.pop("completed_inbox_tasks_cnt")

        project_stats = cls(
            created_time=created_time,
            last_modified_time=last_modified_time,
            project_ref_id=project_ref_id,
            all_inbox_tasks_cnt=all_inbox_tasks_cnt,
            completed_inbox_tasks_cnt=completed_inbox_tasks_cnt,
        )

        project_stats.additional_properties = d
        return project_stats

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
