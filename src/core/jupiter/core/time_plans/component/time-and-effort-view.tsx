import {
  InboxTask,
  TimePlan,
  TimePlanActivity,
  TimePlanActivityDoneness,
  TimePlanActivityFeasability,
  TimePlanActivityTarget,
} from "@jupiter/webapi-client";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import { inferDurationMinsFromInboxTask } from "#/core/inbox_tasks/root";
import { timePlanActivityFeasabilityName } from "#/core/time_plans/sub/activity/feasability";
import { timePlanActivityDonenessName } from "#/core/time_plans/sub/activity/doneness";
import { estimateScoreForInboxTask } from "#/core/gamification/scores";

interface TimeAndEffortViewProps {
  timePlan: TimePlan;
  timePlanActivities: TimePlanActivity[];
  targetInboxTasksByRefId: Map<string, InboxTask>;
  activityDoneness: Record<string, TimePlanActivityDoneness>;
}

interface TimeAndEffortSummary {
  planned: {
    totalActivities: number;
    activitiesByFeasability: Record<TimePlanActivityFeasability, number>;
    totalScore: number;
    scoreByFeasability: Record<TimePlanActivityFeasability, number>;
    totalHours: number;
    hoursByFeasability: Record<TimePlanActivityFeasability, number>;
  };
  achieved: {
    totalActivitiesByDoneness: Record<TimePlanActivityDoneness, number>;
    activitiesByFeasabilityByDoneness: Record<
      TimePlanActivityDoneness,
      Record<TimePlanActivityFeasability, number>
    >;
    totalScoreByDoneness: Record<TimePlanActivityDoneness, number>;
    scoreByFeasabilityByDoneness: Record<
      TimePlanActivityDoneness,
      Record<TimePlanActivityFeasability, number>
    >;
    totalHours: number;
    hoursByFeasability: Record<TimePlanActivityFeasability, number>;
  };
}

export function TimeAndEffortView(props: TimeAndEffortViewProps) {
  const timeAndEffortSummary = computeTimeAndEffortSummary(props);
  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Category</TableCell>
            <TableCell colSpan={3}>Planned</TableCell>
            <TableCell colSpan={7}>Achieved</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={4} />
            <TableCell colSpan={3}>Activities</TableCell>
            <TableCell colSpan={3}>Scores</TableCell>
            <TableCell>Hours</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={1} />
            <TableCell>Activities</TableCell>
            <TableCell>Est. Score</TableCell>
            <TableCell>Est. Hours</TableCell>
            <TableCell>
              {timePlanActivityDonenessName(TimePlanActivityDoneness.DONE)}
            </TableCell>
            <TableCell>
              {timePlanActivityDonenessName(TimePlanActivityDoneness.WORKING)}
            </TableCell>
            <TableCell>
              {timePlanActivityDonenessName(TimePlanActivityDoneness.NOT_DONE)}
            </TableCell>
            <TableCell>
              {timePlanActivityDonenessName(TimePlanActivityDoneness.DONE)}
            </TableCell>
            <TableCell>
              {timePlanActivityDonenessName(TimePlanActivityDoneness.WORKING)}
            </TableCell>
            <TableCell>
              {timePlanActivityDonenessName(TimePlanActivityDoneness.NOT_DONE)}
            </TableCell>
            <TableCell colSpan={1} />
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Total</TableCell>
            <TableCell>
              {timeAndEffortSummary.planned.totalActivities}
            </TableCell>
            <TableCell>{timeAndEffortSummary.planned.totalScore}</TableCell>
            <TableCell>
              {timeAndEffortSummary.planned.totalHours.toFixed(2)}
            </TableCell>
            <TableCell>
              {
                timeAndEffortSummary.achieved.totalActivitiesByDoneness[
                  TimePlanActivityDoneness.DONE
                ]
              }
            </TableCell>
            <TableCell>
              {
                timeAndEffortSummary.achieved.totalActivitiesByDoneness[
                  TimePlanActivityDoneness.WORKING
                ]
              }
            </TableCell>
            <TableCell>
              {
                timeAndEffortSummary.achieved.totalActivitiesByDoneness[
                  TimePlanActivityDoneness.NOT_DONE
                ]
              }
            </TableCell>
            <TableCell>
              {
                timeAndEffortSummary.achieved.totalScoreByDoneness[
                  TimePlanActivityDoneness.DONE
                ]
              }
            </TableCell>
            <TableCell>
              {
                timeAndEffortSummary.achieved.totalScoreByDoneness[
                  TimePlanActivityDoneness.WORKING
                ]
              }
            </TableCell>
            <TableCell>
              {
                timeAndEffortSummary.achieved.totalScoreByDoneness[
                  TimePlanActivityDoneness.NOT_DONE
                ]
              }
            </TableCell>
            <TableCell>
              {timeAndEffortSummary.achieved.totalHours.toFixed(2)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              {timePlanActivityFeasabilityName(
                TimePlanActivityFeasability.MUST_DO,
              )}
            </TableCell>
            <TableCell>
              {
                timeAndEffortSummary.planned.activitiesByFeasability[
                  TimePlanActivityFeasability.MUST_DO
                ]
              }
            </TableCell>
            <TableCell>
              {
                timeAndEffortSummary.planned.scoreByFeasability[
                  TimePlanActivityFeasability.MUST_DO
                ]
              }
            </TableCell>
            <TableCell>
              {timeAndEffortSummary.planned.hoursByFeasability[
                TimePlanActivityFeasability.MUST_DO
              ].toFixed(2)}
            </TableCell>
            <TableCell>
              {
                timeAndEffortSummary.achieved.activitiesByFeasabilityByDoneness[
                  TimePlanActivityDoneness.DONE
                ][TimePlanActivityFeasability.MUST_DO]
              }
            </TableCell>
            <TableCell>
              {
                timeAndEffortSummary.achieved.activitiesByFeasabilityByDoneness[
                  TimePlanActivityDoneness.WORKING
                ][TimePlanActivityFeasability.MUST_DO]
              }
            </TableCell>
            <TableCell>
              {
                timeAndEffortSummary.achieved.activitiesByFeasabilityByDoneness[
                  TimePlanActivityDoneness.NOT_DONE
                ][TimePlanActivityFeasability.MUST_DO]
              }
            </TableCell>
            <TableCell>
              {
                timeAndEffortSummary.achieved.scoreByFeasabilityByDoneness[
                  TimePlanActivityDoneness.DONE
                ][TimePlanActivityFeasability.MUST_DO]
              }
            </TableCell>
            <TableCell>
              {
                timeAndEffortSummary.achieved.scoreByFeasabilityByDoneness[
                  TimePlanActivityDoneness.WORKING
                ][TimePlanActivityFeasability.MUST_DO]
              }
            </TableCell>
            <TableCell>
              {
                timeAndEffortSummary.achieved.scoreByFeasabilityByDoneness[
                  TimePlanActivityDoneness.NOT_DONE
                ][TimePlanActivityFeasability.MUST_DO]
              }
            </TableCell>
            <TableCell>
              {timeAndEffortSummary.achieved.hoursByFeasability[
                TimePlanActivityFeasability.MUST_DO
              ].toFixed(2)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              {timePlanActivityFeasabilityName(
                TimePlanActivityFeasability.NICE_TO_HAVE,
              )}
            </TableCell>
            <TableCell>
              {
                timeAndEffortSummary.planned.activitiesByFeasability[
                  TimePlanActivityFeasability.NICE_TO_HAVE
                ]
              }
            </TableCell>
            <TableCell>
              {
                timeAndEffortSummary.planned.scoreByFeasability[
                  TimePlanActivityFeasability.NICE_TO_HAVE
                ]
              }
            </TableCell>
            <TableCell>
              {timeAndEffortSummary.planned.hoursByFeasability[
                TimePlanActivityFeasability.NICE_TO_HAVE
              ].toFixed(2)}
            </TableCell>
            <TableCell>
              {
                timeAndEffortSummary.achieved.activitiesByFeasabilityByDoneness[
                  TimePlanActivityDoneness.DONE
                ][TimePlanActivityFeasability.NICE_TO_HAVE]
              }
            </TableCell>
            <TableCell>
              {
                timeAndEffortSummary.achieved.activitiesByFeasabilityByDoneness[
                  TimePlanActivityDoneness.WORKING
                ][TimePlanActivityFeasability.NICE_TO_HAVE]
              }
            </TableCell>
            <TableCell>
              {
                timeAndEffortSummary.achieved.activitiesByFeasabilityByDoneness[
                  TimePlanActivityDoneness.NOT_DONE
                ][TimePlanActivityFeasability.NICE_TO_HAVE]
              }
            </TableCell>
            <TableCell>
              {
                timeAndEffortSummary.achieved.scoreByFeasabilityByDoneness[
                  TimePlanActivityDoneness.DONE
                ][TimePlanActivityFeasability.NICE_TO_HAVE]
              }
            </TableCell>
            <TableCell>
              {
                timeAndEffortSummary.achieved.scoreByFeasabilityByDoneness[
                  TimePlanActivityDoneness.WORKING
                ][TimePlanActivityFeasability.NICE_TO_HAVE]
              }
            </TableCell>
            <TableCell>
              {
                timeAndEffortSummary.achieved.scoreByFeasabilityByDoneness[
                  TimePlanActivityDoneness.NOT_DONE
                ][TimePlanActivityFeasability.NICE_TO_HAVE]
              }
            </TableCell>
            <TableCell>
              {timeAndEffortSummary.achieved.hoursByFeasability[
                TimePlanActivityFeasability.NICE_TO_HAVE
              ].toFixed(2)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              {timePlanActivityFeasabilityName(
                TimePlanActivityFeasability.STRETCH,
              )}
            </TableCell>
            <TableCell>
              {
                timeAndEffortSummary.planned.activitiesByFeasability[
                  TimePlanActivityFeasability.STRETCH
                ]
              }
            </TableCell>
            <TableCell>
              {
                timeAndEffortSummary.planned.scoreByFeasability[
                  TimePlanActivityFeasability.STRETCH
                ]
              }
            </TableCell>
            <TableCell>
              {timeAndEffortSummary.planned.hoursByFeasability[
                TimePlanActivityFeasability.STRETCH
              ].toFixed(2)}
            </TableCell>
            <TableCell>
              {
                timeAndEffortSummary.achieved.activitiesByFeasabilityByDoneness[
                  TimePlanActivityDoneness.DONE
                ][TimePlanActivityFeasability.STRETCH]
              }
            </TableCell>
            <TableCell>
              {
                timeAndEffortSummary.achieved.activitiesByFeasabilityByDoneness[
                  TimePlanActivityDoneness.WORKING
                ][TimePlanActivityFeasability.STRETCH]
              }
            </TableCell>
            <TableCell>
              {
                timeAndEffortSummary.achieved.activitiesByFeasabilityByDoneness[
                  TimePlanActivityDoneness.NOT_DONE
                ][TimePlanActivityFeasability.STRETCH]
              }
            </TableCell>
            <TableCell>
              {
                timeAndEffortSummary.achieved.scoreByFeasabilityByDoneness[
                  TimePlanActivityDoneness.DONE
                ][TimePlanActivityFeasability.STRETCH]
              }
            </TableCell>
            <TableCell>
              {
                timeAndEffortSummary.achieved.scoreByFeasabilityByDoneness[
                  TimePlanActivityDoneness.WORKING
                ][TimePlanActivityFeasability.STRETCH]
              }
            </TableCell>
            <TableCell>
              {
                timeAndEffortSummary.achieved.scoreByFeasabilityByDoneness[
                  TimePlanActivityDoneness.NOT_DONE
                ][TimePlanActivityFeasability.STRETCH]
              }
            </TableCell>
            <TableCell>
              {timeAndEffortSummary.achieved.hoursByFeasability[
                TimePlanActivityFeasability.STRETCH
              ].toFixed(2)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function computeTimeAndEffortSummary(
  props: TimeAndEffortViewProps,
): TimeAndEffortSummary {
  return {
    planned: computePlannedTimeAndEffortSummary(props).planned,
    achieved: computeAchievedTimeAndEffortSummary(props).achieved,
  };
}

function computePlannedTimeAndEffortSummary(
  props: TimeAndEffortViewProps,
): Omit<TimeAndEffortSummary, "achieved"> {
  let totalActivities = 0;
  const activitiesByFeasability: Record<TimePlanActivityFeasability, number> = {
    [TimePlanActivityFeasability.MUST_DO]: 0,
    [TimePlanActivityFeasability.NICE_TO_HAVE]: 0,
    [TimePlanActivityFeasability.STRETCH]: 0,
  };
  let totalScore = 0;
  const scoreByFeasability: Record<TimePlanActivityFeasability, number> = {
    [TimePlanActivityFeasability.MUST_DO]: 0,
    [TimePlanActivityFeasability.NICE_TO_HAVE]: 0,
    [TimePlanActivityFeasability.STRETCH]: 0,
  };
  let totalHours = 0;
  const hoursByFeasability: Record<TimePlanActivityFeasability, number> = {
    [TimePlanActivityFeasability.MUST_DO]: 0,
    [TimePlanActivityFeasability.NICE_TO_HAVE]: 0,
    [TimePlanActivityFeasability.STRETCH]: 0,
  };

  for (const activity of props.timePlanActivities) {
    if (activity.target !== TimePlanActivityTarget.INBOX_TASK) {
      continue;
    }

    const targetInboxTask = props.targetInboxTasksByRefId.get(
      activity.target_ref_id,
    )!;
    totalActivities++;
    activitiesByFeasability[activity.feasability]++;
    totalScore += estimateScoreForInboxTask(targetInboxTask);
    scoreByFeasability[activity.feasability] +=
      estimateScoreForInboxTask(targetInboxTask);
    totalHours += inferDurationMinsFromInboxTask(targetInboxTask) / 60;
    hoursByFeasability[activity.feasability] +=
      inferDurationMinsFromInboxTask(targetInboxTask) / 60;
  }

  return {
    planned: {
      totalActivities: totalActivities,
      activitiesByFeasability: activitiesByFeasability,
      totalScore: totalScore,
      scoreByFeasability: scoreByFeasability,
      totalHours: totalHours,
      hoursByFeasability: hoursByFeasability,
    },
  };
}

function computeAchievedTimeAndEffortSummary(
  props: TimeAndEffortViewProps,
): Omit<TimeAndEffortSummary, "planned"> {
  const totalActivitiesByDoneness: Record<TimePlanActivityDoneness, number> = {
    [TimePlanActivityDoneness.DONE]: 0,
    [TimePlanActivityDoneness.WORKING]: 0,
    [TimePlanActivityDoneness.NOT_DONE]: 0,
  };
  const activitiesByFeasabilityByDoneness: Record<
    TimePlanActivityDoneness,
    Record<TimePlanActivityFeasability, number>
  > = {
    [TimePlanActivityDoneness.DONE]: {
      [TimePlanActivityFeasability.MUST_DO]: 0,
      [TimePlanActivityFeasability.NICE_TO_HAVE]: 0,
      [TimePlanActivityFeasability.STRETCH]: 0,
    },
    [TimePlanActivityDoneness.WORKING]: {
      [TimePlanActivityFeasability.MUST_DO]: 0,
      [TimePlanActivityFeasability.NICE_TO_HAVE]: 0,
      [TimePlanActivityFeasability.STRETCH]: 0,
    },
    [TimePlanActivityDoneness.NOT_DONE]: {
      [TimePlanActivityFeasability.MUST_DO]: 0,
      [TimePlanActivityFeasability.NICE_TO_HAVE]: 0,
      [TimePlanActivityFeasability.STRETCH]: 0,
    },
  };
  const totalScoreByDoneness: Record<TimePlanActivityDoneness, number> = {
    [TimePlanActivityDoneness.DONE]: 0,
    [TimePlanActivityDoneness.WORKING]: 0,
    [TimePlanActivityDoneness.NOT_DONE]: 0,
  };
  const scoreByFeasabilityByDoneness: Record<
    TimePlanActivityDoneness,
    Record<TimePlanActivityFeasability, number>
  > = {
    [TimePlanActivityDoneness.DONE]: {
      [TimePlanActivityFeasability.MUST_DO]: 0,
      [TimePlanActivityFeasability.NICE_TO_HAVE]: 0,
      [TimePlanActivityFeasability.STRETCH]: 0,
    },
    [TimePlanActivityDoneness.WORKING]: {
      [TimePlanActivityFeasability.MUST_DO]: 0,
      [TimePlanActivityFeasability.NICE_TO_HAVE]: 0,
      [TimePlanActivityFeasability.STRETCH]: 0,
    },
    [TimePlanActivityDoneness.NOT_DONE]: {
      [TimePlanActivityFeasability.MUST_DO]: 0,
      [TimePlanActivityFeasability.NICE_TO_HAVE]: 0,
      [TimePlanActivityFeasability.STRETCH]: 0,
    },
  };
  let totalHours: number = 0;
  const hoursByFeasability: Record<TimePlanActivityFeasability, number> = {
    [TimePlanActivityFeasability.MUST_DO]: 0,
    [TimePlanActivityFeasability.NICE_TO_HAVE]: 0,
    [TimePlanActivityFeasability.STRETCH]: 0,
  };

  for (const activity of props.timePlanActivities) {
    if (activity.target !== TimePlanActivityTarget.INBOX_TASK) {
      continue;
    }

    const targetInboxTask = props.targetInboxTasksByRefId.get(
      activity.target_ref_id,
    )!;
    const doneness =
      props.activityDoneness[activity.ref_id] ??
      TimePlanActivityDoneness.NOT_DONE;
    totalActivitiesByDoneness[doneness]++;
    activitiesByFeasabilityByDoneness[doneness][activity.feasability]++;
    totalScoreByDoneness[doneness] +=
      estimateScoreForInboxTask(targetInboxTask);
    scoreByFeasabilityByDoneness[doneness][activity.feasability] +=
      estimateScoreForInboxTask(targetInboxTask);

    if (
      doneness === TimePlanActivityDoneness.DONE ||
      doneness === TimePlanActivityDoneness.WORKING
    ) {
      totalHours += inferDurationMinsFromInboxTask(targetInboxTask) / 60;
      hoursByFeasability[activity.feasability] +=
        inferDurationMinsFromInboxTask(targetInboxTask) / 60;
    }
  }

  return {
    achieved: {
      totalActivitiesByDoneness: totalActivitiesByDoneness,
      activitiesByFeasabilityByDoneness: activitiesByFeasabilityByDoneness,
      totalScoreByDoneness: totalScoreByDoneness,
      scoreByFeasabilityByDoneness: scoreByFeasabilityByDoneness,
      totalHours: totalHours,
      hoursByFeasability: hoursByFeasability,
    },
  };
}
