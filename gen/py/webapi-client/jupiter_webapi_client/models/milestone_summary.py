from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

T = TypeVar("T", bound="MilestoneSummary")


@_attrs_define
class MilestoneSummary:
    """Summary information about a milestone.

    Attributes:
        ref_id (str): A generic entity id.
        name (str): The name of a milestone in a life plan.
        date (str): A date or possibly a datetime for the application.
        project_ref_id (str): A generic entity id.
    """

    ref_id: str
    name: str
    date: str
    project_ref_id: str
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        ref_id = self.ref_id

        name = self.name

        date = self.date

        project_ref_id = self.project_ref_id

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "ref_id": ref_id,
                "name": name,
                "date": date,
                "project_ref_id": project_ref_id,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        ref_id = d.pop("ref_id")

        name = d.pop("name")

        date = d.pop("date")

        project_ref_id = d.pop("project_ref_id")

        milestone_summary = cls(
            ref_id=ref_id,
            name=name,
            date=date,
            project_ref_id=project_ref_id,
        )

        milestone_summary.additional_properties = d
        return milestone_summary

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
