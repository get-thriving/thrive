from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.planned_time_and_effort_summary_activities_by_feasability import (
        PlannedTimeAndEffortSummaryActivitiesByFeasability,
    )
    from ..models.planned_time_and_effort_summary_hours_by_feasability import (
        PlannedTimeAndEffortSummaryHoursByFeasability,
    )
    from ..models.planned_time_and_effort_summary_score_by_feasability import (
        PlannedTimeAndEffortSummaryScoreByFeasability,
    )


T = TypeVar("T", bound="PlannedTimeAndEffortSummary")


@_attrs_define
class PlannedTimeAndEffortSummary:
    """Planned time and effort summary.

    Attributes:
        total_activities (int):
        activities_by_feasability (PlannedTimeAndEffortSummaryActivitiesByFeasability):
        total_score (int):
        score_by_feasability (PlannedTimeAndEffortSummaryScoreByFeasability):
        total_hours (float):
        hours_by_feasability (PlannedTimeAndEffortSummaryHoursByFeasability):
    """

    total_activities: int
    activities_by_feasability: PlannedTimeAndEffortSummaryActivitiesByFeasability
    total_score: int
    score_by_feasability: PlannedTimeAndEffortSummaryScoreByFeasability
    total_hours: float
    hours_by_feasability: PlannedTimeAndEffortSummaryHoursByFeasability
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        total_activities = self.total_activities

        activities_by_feasability = self.activities_by_feasability.to_dict()

        total_score = self.total_score

        score_by_feasability = self.score_by_feasability.to_dict()

        total_hours = self.total_hours

        hours_by_feasability = self.hours_by_feasability.to_dict()

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "total_activities": total_activities,
                "activities_by_feasability": activities_by_feasability,
                "total_score": total_score,
                "score_by_feasability": score_by_feasability,
                "total_hours": total_hours,
                "hours_by_feasability": hours_by_feasability,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.planned_time_and_effort_summary_activities_by_feasability import (
            PlannedTimeAndEffortSummaryActivitiesByFeasability,
        )
        from ..models.planned_time_and_effort_summary_hours_by_feasability import (
            PlannedTimeAndEffortSummaryHoursByFeasability,
        )
        from ..models.planned_time_and_effort_summary_score_by_feasability import (
            PlannedTimeAndEffortSummaryScoreByFeasability,
        )

        d = dict(src_dict)
        total_activities = d.pop("total_activities")

        activities_by_feasability = PlannedTimeAndEffortSummaryActivitiesByFeasability.from_dict(
            d.pop("activities_by_feasability")
        )

        total_score = d.pop("total_score")

        score_by_feasability = PlannedTimeAndEffortSummaryScoreByFeasability.from_dict(d.pop("score_by_feasability"))

        total_hours = d.pop("total_hours")

        hours_by_feasability = PlannedTimeAndEffortSummaryHoursByFeasability.from_dict(d.pop("hours_by_feasability"))

        planned_time_and_effort_summary = cls(
            total_activities=total_activities,
            activities_by_feasability=activities_by_feasability,
            total_score=total_score,
            score_by_feasability=score_by_feasability,
            total_hours=total_hours,
            hours_by_feasability=hours_by_feasability,
        )

        planned_time_and_effort_summary.additional_properties = d
        return planned_time_and_effort_summary

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
