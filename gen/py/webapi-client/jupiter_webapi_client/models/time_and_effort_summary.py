from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.achieved_time_and_effort_summary import AchievedTimeAndEffortSummary
    from ..models.planned_time_and_effort_summary import PlannedTimeAndEffortSummary


T = TypeVar("T", bound="TimeAndEffortSummary")


@_attrs_define
class TimeAndEffortSummary:
    """Time and effort summary for a time plan.

    Attributes:
        planned (PlannedTimeAndEffortSummary): Planned time and effort summary.
        achieved (AchievedTimeAndEffortSummary): Achieved time and effort summary.
    """

    planned: PlannedTimeAndEffortSummary
    achieved: AchievedTimeAndEffortSummary
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        planned = self.planned.to_dict()

        achieved = self.achieved.to_dict()

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "planned": planned,
                "achieved": achieved,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.achieved_time_and_effort_summary import AchievedTimeAndEffortSummary
        from ..models.planned_time_and_effort_summary import PlannedTimeAndEffortSummary

        d = dict(src_dict)
        planned = PlannedTimeAndEffortSummary.from_dict(d.pop("planned"))

        achieved = AchievedTimeAndEffortSummary.from_dict(d.pop("achieved"))

        time_and_effort_summary = cls(
            planned=planned,
            achieved=achieved,
        )

        time_and_effort_summary.additional_properties = d
        return time_and_effort_summary

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
