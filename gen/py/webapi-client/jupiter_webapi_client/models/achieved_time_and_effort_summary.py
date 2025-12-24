from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define
from attrs import field as _attrs_field

if TYPE_CHECKING:
    from ..models.achieved_time_and_effort_summary_activities_by_feasability_by_doneness import (
        AchievedTimeAndEffortSummaryActivitiesByFeasabilityByDoneness,
    )
    from ..models.achieved_time_and_effort_summary_hours_by_feasability import (
        AchievedTimeAndEffortSummaryHoursByFeasability,
    )
    from ..models.achieved_time_and_effort_summary_score_by_feasability_by_doneness import (
        AchievedTimeAndEffortSummaryScoreByFeasabilityByDoneness,
    )
    from ..models.achieved_time_and_effort_summary_total_activities_by_doneness import (
        AchievedTimeAndEffortSummaryTotalActivitiesByDoneness,
    )
    from ..models.achieved_time_and_effort_summary_total_score_by_doneness import (
        AchievedTimeAndEffortSummaryTotalScoreByDoneness,
    )


T = TypeVar("T", bound="AchievedTimeAndEffortSummary")


@_attrs_define
class AchievedTimeAndEffortSummary:
    """Achieved time and effort summary.

    Attributes:
        total_activities_by_doneness (AchievedTimeAndEffortSummaryTotalActivitiesByDoneness):
        activities_by_feasability_by_doneness (AchievedTimeAndEffortSummaryActivitiesByFeasabilityByDoneness):
        total_score_by_doneness (AchievedTimeAndEffortSummaryTotalScoreByDoneness):
        score_by_feasability_by_doneness (AchievedTimeAndEffortSummaryScoreByFeasabilityByDoneness):
        total_hours (float):
        hours_by_feasability (AchievedTimeAndEffortSummaryHoursByFeasability):
    """

    total_activities_by_doneness: AchievedTimeAndEffortSummaryTotalActivitiesByDoneness
    activities_by_feasability_by_doneness: AchievedTimeAndEffortSummaryActivitiesByFeasabilityByDoneness
    total_score_by_doneness: AchievedTimeAndEffortSummaryTotalScoreByDoneness
    score_by_feasability_by_doneness: AchievedTimeAndEffortSummaryScoreByFeasabilityByDoneness
    total_hours: float
    hours_by_feasability: AchievedTimeAndEffortSummaryHoursByFeasability
    additional_properties: dict[str, Any] = _attrs_field(init=False, factory=dict)

    def to_dict(self) -> dict[str, Any]:
        total_activities_by_doneness = self.total_activities_by_doneness.to_dict()

        activities_by_feasability_by_doneness = self.activities_by_feasability_by_doneness.to_dict()

        total_score_by_doneness = self.total_score_by_doneness.to_dict()

        score_by_feasability_by_doneness = self.score_by_feasability_by_doneness.to_dict()

        total_hours = self.total_hours

        hours_by_feasability = self.hours_by_feasability.to_dict()

        field_dict: dict[str, Any] = {}
        field_dict.update(self.additional_properties)
        field_dict.update(
            {
                "total_activities_by_doneness": total_activities_by_doneness,
                "activities_by_feasability_by_doneness": activities_by_feasability_by_doneness,
                "total_score_by_doneness": total_score_by_doneness,
                "score_by_feasability_by_doneness": score_by_feasability_by_doneness,
                "total_hours": total_hours,
                "hours_by_feasability": hours_by_feasability,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.achieved_time_and_effort_summary_activities_by_feasability_by_doneness import (
            AchievedTimeAndEffortSummaryActivitiesByFeasabilityByDoneness,
        )
        from ..models.achieved_time_and_effort_summary_hours_by_feasability import (
            AchievedTimeAndEffortSummaryHoursByFeasability,
        )
        from ..models.achieved_time_and_effort_summary_score_by_feasability_by_doneness import (
            AchievedTimeAndEffortSummaryScoreByFeasabilityByDoneness,
        )
        from ..models.achieved_time_and_effort_summary_total_activities_by_doneness import (
            AchievedTimeAndEffortSummaryTotalActivitiesByDoneness,
        )
        from ..models.achieved_time_and_effort_summary_total_score_by_doneness import (
            AchievedTimeAndEffortSummaryTotalScoreByDoneness,
        )

        d = dict(src_dict)
        total_activities_by_doneness = AchievedTimeAndEffortSummaryTotalActivitiesByDoneness.from_dict(
            d.pop("total_activities_by_doneness")
        )

        activities_by_feasability_by_doneness = AchievedTimeAndEffortSummaryActivitiesByFeasabilityByDoneness.from_dict(
            d.pop("activities_by_feasability_by_doneness")
        )

        total_score_by_doneness = AchievedTimeAndEffortSummaryTotalScoreByDoneness.from_dict(
            d.pop("total_score_by_doneness")
        )

        score_by_feasability_by_doneness = AchievedTimeAndEffortSummaryScoreByFeasabilityByDoneness.from_dict(
            d.pop("score_by_feasability_by_doneness")
        )

        total_hours = d.pop("total_hours")

        hours_by_feasability = AchievedTimeAndEffortSummaryHoursByFeasability.from_dict(d.pop("hours_by_feasability"))

        achieved_time_and_effort_summary = cls(
            total_activities_by_doneness=total_activities_by_doneness,
            activities_by_feasability_by_doneness=activities_by_feasability_by_doneness,
            total_score_by_doneness=total_score_by_doneness,
            score_by_feasability_by_doneness=score_by_feasability_by_doneness,
            total_hours=total_hours,
            hours_by_feasability=hours_by_feasability,
        )

        achieved_time_and_effort_summary.additional_properties = d
        return achieved_time_and_effort_summary

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
