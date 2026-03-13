from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

T = TypeVar("T", bound="TimePlanAspectLink")


@_attrs_define
class TimePlanAspectLink:
    """A link between a time plan and a aspect (aka aspect).

    Attributes:
        created_time (str): A timestamp in the application.
        last_modified_time (str): A timestamp in the application.
        time_plan_ref_id (str):
        aspect_ref_id (str): A generic entity id.
    """

    created_time: str
    last_modified_time: str
    time_plan_ref_id: str
    aspect_ref_id: str
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        created_time = self.created_time

        last_modified_time = self.last_modified_time

        time_plan_ref_id = self.time_plan_ref_id

        aspect_ref_id = self.aspect_ref_id

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "created_time": created_time,
                "last_modified_time": last_modified_time,
                "time_plan_ref_id": time_plan_ref_id,
                "aspect_ref_id": aspect_ref_id,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        created_time = d.pop("created_time")

        last_modified_time = d.pop("last_modified_time")

        time_plan_ref_id = d.pop("time_plan_ref_id")

        aspect_ref_id = d.pop("aspect_ref_id")

        time_plan_aspect_link = cls(
            created_time=created_time,
            last_modified_time=last_modified_time,
            time_plan_ref_id=time_plan_ref_id,
            aspect_ref_id=aspect_ref_id,
        )

        time_plan_aspect_link.additional_properties = d
        return time_plan_aspect_link

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
