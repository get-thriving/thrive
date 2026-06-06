from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

T = TypeVar("T", bound="ProjectMilestoneCreateArgs")


@_attrs_define
class ProjectMilestoneCreateArgs:
    """Project milestone create args.

    Attributes:
        project_ref_id (str): A generic entity id.
        date (str): A date or possibly a datetime for the application.
        name (str): The name for an entity which acts as both name and unique identifier.
    """

    project_ref_id: str
    date: str
    name: str
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        project_ref_id = self.project_ref_id

        date = self.date

        name = self.name

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "project_ref_id": project_ref_id,
                "date": date,
                "name": name,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        project_ref_id = d.pop("project_ref_id")

        date = d.pop("date")

        name = d.pop("name")

        project_milestone_create_args = cls(
            project_ref_id=project_ref_id,
            date=date,
            name=name,
        )

        project_milestone_create_args.additional_properties = d
        return project_milestone_create_args

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
