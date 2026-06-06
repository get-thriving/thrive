from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.project_milestone import ProjectMilestone


T = TypeVar("T", bound="ProjectMilestoneLoadResult")


@_attrs_define
class ProjectMilestoneLoadResult:
    """ProjectMilestoneLoadResult.

    Attributes:
        project_milestone (ProjectMilestone): A milestone for tracking progress of a project.
    """

    project_milestone: ProjectMilestone
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        project_milestone = self.project_milestone.to_dict()

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "project_milestone": project_milestone,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.project_milestone import ProjectMilestone

        d = dict(src_dict)
        project_milestone = ProjectMilestone.from_dict(d.pop("project_milestone"))

        project_milestone_load_result = cls(
            project_milestone=project_milestone,
        )

        project_milestone_load_result.additional_properties = d
        return project_milestone_load_result

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
