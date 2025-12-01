"""Time and effort summary for time plans."""

from jupiter.core.time_plans.sub.activity.doneness import TimePlanActivityDoneness
from jupiter.core.time_plans.sub.activity.feasability import (
    TimePlanActivityFeasability,
)
from jupiter.framework.value import CompositeValue, value


@value
class PlannedTimeAndEffortSummary(CompositeValue):
    """Planned time and effort summary."""

    total_activities: int
    activities_by_feasability: dict[TimePlanActivityFeasability, int]
    total_score: int
    score_by_feasability: dict[TimePlanActivityFeasability, int]
    total_hours: float
    hours_by_feasability: dict[TimePlanActivityFeasability, float]


@value
class AchievedTimeAndEffortSummary(CompositeValue):
    """Achieved time and effort summary."""

    total_activities_by_doneness: dict[TimePlanActivityDoneness, int]
    activities_by_feasability_by_doneness: dict[
        TimePlanActivityDoneness,
        dict[TimePlanActivityFeasability, int],
    ]
    total_score_by_doneness: dict[TimePlanActivityDoneness, int]
    score_by_feasability_by_doneness: dict[
        TimePlanActivityDoneness,
        dict[TimePlanActivityFeasability, int],
    ]
    total_hours: float
    hours_by_feasability: dict[TimePlanActivityFeasability, float]


@value
class TimeAndEffortSummary(CompositeValue):
    """Time and effort summary for a time plan."""

    planned: PlannedTimeAndEffortSummary
    achieved: AchievedTimeAndEffortSummary

    @staticmethod
    def empty() -> "TimeAndEffortSummary":
        """Construct an empty time and effort summary."""
        return TimeAndEffortSummary(
            planned=PlannedTimeAndEffortSummary(
                total_activities=0,
                activities_by_feasability={f: 0 for f in TimePlanActivityFeasability},
                total_score=0,
                score_by_feasability={f: 0 for f in TimePlanActivityFeasability},
                total_hours=0.0,
                hours_by_feasability={f: 0.0 for f in TimePlanActivityFeasability},
            ),
            achieved=AchievedTimeAndEffortSummary(
                total_activities_by_doneness={d: 0 for d in TimePlanActivityDoneness},
                activities_by_feasability_by_doneness={
                    d: {f: 0 for f in TimePlanActivityFeasability}
                    for d in TimePlanActivityDoneness
                },
                total_score_by_doneness={d: 0 for d in TimePlanActivityDoneness},
                score_by_feasability_by_doneness={
                    d: {f: 0 for f in TimePlanActivityFeasability}
                    for d in TimePlanActivityDoneness
                },
                total_hours=0.0,
                hours_by_feasability={f: 0.0 for f in TimePlanActivityFeasability},
            ),
        )
