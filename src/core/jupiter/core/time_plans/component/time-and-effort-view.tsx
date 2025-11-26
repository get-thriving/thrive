import {
  InboxTask,
  TimePlan,
  TimePlanActivity,
  TimePlanActivityDoneness,
  TimePlanActivityFeasability,
  TimePlanActivityTarget,
  UserFeature,
  WorkspaceFeature,
} from "@jupiter/webapi-client";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
} from "@mui/material";

import { inferDurationMinsFromInboxTask } from "#/core/inbox_tasks/root";
import { timePlanActivityFeasabilityName } from "#/core/time_plans/sub/activity/feasability";
import { timePlanActivityDonenessName } from "#/core/time_plans/sub/activity/doneness";
import { estimateScoreForInboxTask } from "#/core/gamification/scores";
import { TopLevelInfo } from "#/core/infra/top-level-context";
import { isUserFeatureAvailable } from "#/core/users/root";
import { isWorkspaceFeatureAvailable } from "#/core/workspaces/root";

interface TimeAndEffortViewProps {
  topLevelInfo: TopLevelInfo;
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
  const theme = useTheme();

  const styles = {
    sx: {
      borderWidth: "1px",
      borderColor: theme.palette.grey[200],
      borderStyle: "solid",
      textAlign: "left",
    },
  };

  let plannedTextColSpan = 1;
  let achievedTextColSpan = 3;
  if (
    isUserFeatureAvailable(props.topLevelInfo.user, UserFeature.GAMIFICATION)
  ) {
    plannedTextColSpan += 1;
    achievedTextColSpan += 3;
  }
  if (
    isWorkspaceFeatureAvailable(
      props.topLevelInfo.workspace,
      WorkspaceFeature.SCHEDULE,
    )
  ) {
    plannedTextColSpan += 1;
    achievedTextColSpan += 1;
  }

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead
          sx={{
            borderBottomWidth: "0.25rem",
            borderBottomStyle: "solid",
            borderBottomColor: "divider",
          }}
        >
          <TableRow>
            <TableCell rowSpan={3} {...styles}>
              Category
            </TableCell>
            <TableCell rowSpan={2} colSpan={plannedTextColSpan} {...styles}>
              Planned
            </TableCell>
            <TableCell colSpan={achievedTextColSpan} {...styles}>
              Achieved
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell colSpan={3} {...styles}>
              Activities
            </TableCell>

            {isUserFeatureAvailable(
              props.topLevelInfo.user,
              UserFeature.GAMIFICATION,
            ) && (
              <TableCell colSpan={3} {...styles}>
                Scores
              </TableCell>
            )}
            {isWorkspaceFeatureAvailable(
              props.topLevelInfo.workspace,
              WorkspaceFeature.SCHEDULE,
            ) && (
              <TableCell rowSpan={2} {...styles}>
                Hours
              </TableCell>
            )}
          </TableRow>

          <TableRow>
            <TableCell {...styles}>Activities</TableCell>
            {isUserFeatureAvailable(
              props.topLevelInfo.user,
              UserFeature.GAMIFICATION,
            ) && <TableCell {...styles}>Est. Score</TableCell>}
            {isWorkspaceFeatureAvailable(
              props.topLevelInfo.workspace,
              WorkspaceFeature.SCHEDULE,
            ) && <TableCell {...styles}>Est. Hours</TableCell>}

            <TableCell {...styles}>
              {timePlanActivityDonenessName(TimePlanActivityDoneness.DONE)}
            </TableCell>
            <TableCell {...styles}>
              {timePlanActivityDonenessName(TimePlanActivityDoneness.WORKING)}
            </TableCell>
            <TableCell {...styles}>
              {timePlanActivityDonenessName(TimePlanActivityDoneness.NOT_DONE)}
            </TableCell>

            {isUserFeatureAvailable(
              props.topLevelInfo.user,
              UserFeature.GAMIFICATION,
            ) && (
              <>
                <TableCell {...styles}>
                  {timePlanActivityDonenessName(TimePlanActivityDoneness.DONE)}
                </TableCell>
                <TableCell {...styles}>
                  {timePlanActivityDonenessName(
                    TimePlanActivityDoneness.WORKING,
                  )}
                </TableCell>
                <TableCell {...styles}>
                  {timePlanActivityDonenessName(
                    TimePlanActivityDoneness.NOT_DONE,
                  )}
                </TableCell>
              </>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell {...styles}>Total</TableCell>
            <TableCell>
              {timeAndEffortSummary.planned.totalActivities}
            </TableCell>

            {isUserFeatureAvailable(
              props.topLevelInfo.user,
              UserFeature.GAMIFICATION,
            ) && (
              <TableCell {...styles}>
                {timeAndEffortSummary.planned.totalScore}
              </TableCell>
            )}
            {isWorkspaceFeatureAvailable(
              props.topLevelInfo.workspace,
              WorkspaceFeature.SCHEDULE,
            ) && (
              <TableCell>
                {timeAndEffortSummary.planned.totalHours.toFixed(2)}
              </TableCell>
            )}

            <TableCell {...styles} align="center">
              {
                timeAndEffortSummary.achieved.totalActivitiesByDoneness[
                  TimePlanActivityDoneness.DONE
                ]
              }{" "}
              [
              {(
                (timeAndEffortSummary.achieved.totalActivitiesByDoneness[
                  TimePlanActivityDoneness.DONE
                ] /
                  timeAndEffortSummary.planned.totalActivities) *
                100
              ).toFixed(0) + "%"}
              ]
            </TableCell>
            <TableCell {...styles} align="center">
              {
                timeAndEffortSummary.achieved.totalActivitiesByDoneness[
                  TimePlanActivityDoneness.WORKING
                ]
              }{" "}
              [
              {(
                (timeAndEffortSummary.achieved.totalActivitiesByDoneness[
                  TimePlanActivityDoneness.WORKING
                ] /
                  timeAndEffortSummary.planned.totalActivities) *
                100
              ).toFixed(0) + "%"}
              ]
            </TableCell>
            <TableCell {...styles} align="center">
              {
                timeAndEffortSummary.achieved.totalActivitiesByDoneness[
                  TimePlanActivityDoneness.NOT_DONE
                ]
              }
            </TableCell>

            {isUserFeatureAvailable(
              props.topLevelInfo.user,
              UserFeature.GAMIFICATION,
            ) && (
              <>
                <TableCell {...styles} align="center">
                  {
                    timeAndEffortSummary.achieved.totalScoreByDoneness[
                      TimePlanActivityDoneness.DONE
                    ]
                  }{" "}
                  [
                  {(
                    (timeAndEffortSummary.achieved.totalScoreByDoneness[
                      TimePlanActivityDoneness.DONE
                    ] /
                      timeAndEffortSummary.planned.totalScore) *
                    100
                  ).toFixed(0) + "%"}
                  ]
                </TableCell>
                <TableCell {...styles} align="center">
                  {
                    timeAndEffortSummary.achieved.totalScoreByDoneness[
                      TimePlanActivityDoneness.WORKING
                    ]
                  }{" "}
                  [
                  {(
                    (timeAndEffortSummary.achieved.totalScoreByDoneness[
                      TimePlanActivityDoneness.WORKING
                    ] /
                      timeAndEffortSummary.planned.totalScore) *
                    100
                  ).toFixed(0) + "%"}
                  ]
                </TableCell>
                <TableCell {...styles} align="center">
                  {
                    timeAndEffortSummary.achieved.totalScoreByDoneness[
                      TimePlanActivityDoneness.NOT_DONE
                    ]
                  }
                </TableCell>
              </>
            )}

            {isWorkspaceFeatureAvailable(
              props.topLevelInfo.workspace,
              WorkspaceFeature.SCHEDULE,
            ) && (
              <TableCell {...styles} align="center">
                {timeAndEffortSummary.achieved.totalHours.toFixed(2)}
              </TableCell>
            )}
          </TableRow>

          <TableRow>
            <TableCell {...styles}>
              {timePlanActivityFeasabilityName(
                TimePlanActivityFeasability.MUST_DO,
              )}
            </TableCell>
            <TableCell {...styles}>
              {
                timeAndEffortSummary.planned.activitiesByFeasability[
                  TimePlanActivityFeasability.MUST_DO
                ]
              }
            </TableCell>

            {isUserFeatureAvailable(
              props.topLevelInfo.user,
              UserFeature.GAMIFICATION,
            ) && (
              <TableCell {...styles}>
                {
                  timeAndEffortSummary.planned.scoreByFeasability[
                    TimePlanActivityFeasability.MUST_DO
                  ]
                }
              </TableCell>
            )}
            {isWorkspaceFeatureAvailable(
              props.topLevelInfo.workspace,
              WorkspaceFeature.SCHEDULE,
            ) && (
              <TableCell {...styles}>
                {timeAndEffortSummary.planned.hoursByFeasability[
                  TimePlanActivityFeasability.MUST_DO
                ].toFixed(2)}
              </TableCell>
            )}

            <TableCell {...styles}>
              {
                timeAndEffortSummary.achieved.activitiesByFeasabilityByDoneness[
                  TimePlanActivityDoneness.DONE
                ][TimePlanActivityFeasability.MUST_DO]
              }{" "}
              [
              {(
                (timeAndEffortSummary.achieved
                  .activitiesByFeasabilityByDoneness[
                  TimePlanActivityDoneness.DONE
                ][TimePlanActivityFeasability.MUST_DO] /
                  timeAndEffortSummary.planned.activitiesByFeasability[
                    TimePlanActivityFeasability.MUST_DO
                  ]) *
                100
              ).toFixed(0) + "%"}
              ]
            </TableCell>
            <TableCell {...styles}>
              {
                timeAndEffortSummary.achieved.activitiesByFeasabilityByDoneness[
                  TimePlanActivityDoneness.WORKING
                ][TimePlanActivityFeasability.MUST_DO]
              }{" "}
              [
              {(
                (timeAndEffortSummary.achieved
                  .activitiesByFeasabilityByDoneness[
                  TimePlanActivityDoneness.WORKING
                ][TimePlanActivityFeasability.MUST_DO] /
                  timeAndEffortSummary.planned.activitiesByFeasability[
                    TimePlanActivityFeasability.MUST_DO
                  ]) *
                100
              ).toFixed(0) + "%"}
              ]
            </TableCell>
            <TableCell {...styles}>
              {
                timeAndEffortSummary.achieved.activitiesByFeasabilityByDoneness[
                  TimePlanActivityDoneness.NOT_DONE
                ][TimePlanActivityFeasability.MUST_DO]
              }
            </TableCell>

            {isUserFeatureAvailable(
              props.topLevelInfo.user,
              UserFeature.GAMIFICATION,
            ) && (
              <>
                <TableCell {...styles}>
                  {
                    timeAndEffortSummary.achieved.scoreByFeasabilityByDoneness[
                      TimePlanActivityDoneness.DONE
                    ][TimePlanActivityFeasability.MUST_DO]
                  }{" "}
                  [
                  {(
                    (timeAndEffortSummary.achieved.scoreByFeasabilityByDoneness[
                      TimePlanActivityDoneness.DONE
                    ][TimePlanActivityFeasability.MUST_DO] /
                      timeAndEffortSummary.planned.scoreByFeasability[
                        TimePlanActivityFeasability.MUST_DO
                      ]) *
                    100
                  ).toFixed(0) + "%"}
                  ]
                </TableCell>
                <TableCell {...styles} align="center">
                  {
                    timeAndEffortSummary.achieved.scoreByFeasabilityByDoneness[
                      TimePlanActivityDoneness.WORKING
                    ][TimePlanActivityFeasability.MUST_DO]
                  }{" "}
                  [
                  {(
                    (timeAndEffortSummary.achieved.scoreByFeasabilityByDoneness[
                      TimePlanActivityDoneness.WORKING
                    ][TimePlanActivityFeasability.MUST_DO] /
                      timeAndEffortSummary.planned.scoreByFeasability[
                        TimePlanActivityFeasability.MUST_DO
                      ]) *
                    100
                  ).toFixed(0) + "%"}
                  ]
                </TableCell>
                <TableCell {...styles} align="center">
                  {
                    timeAndEffortSummary.achieved.scoreByFeasabilityByDoneness[
                      TimePlanActivityDoneness.NOT_DONE
                    ][TimePlanActivityFeasability.MUST_DO]
                  }
                </TableCell>
              </>
            )}
            {isWorkspaceFeatureAvailable(
              props.topLevelInfo.workspace,
              WorkspaceFeature.SCHEDULE,
            ) && (
              <TableCell {...styles}>
                {timeAndEffortSummary.achieved.hoursByFeasability[
                  TimePlanActivityFeasability.MUST_DO
                ].toFixed(2)}
              </TableCell>
            )}
          </TableRow>

          <TableRow>
            <TableCell {...styles}>
              {timePlanActivityFeasabilityName(
                TimePlanActivityFeasability.NICE_TO_HAVE,
              )}
            </TableCell>
            <TableCell {...styles}>
              {
                timeAndEffortSummary.planned.activitiesByFeasability[
                  TimePlanActivityFeasability.NICE_TO_HAVE
                ]
              }
            </TableCell>

            {isUserFeatureAvailable(
              props.topLevelInfo.user,
              UserFeature.GAMIFICATION,
            ) && (
              <TableCell {...styles}>
                {
                  timeAndEffortSummary.planned.scoreByFeasability[
                    TimePlanActivityFeasability.NICE_TO_HAVE
                  ]
                }
              </TableCell>
            )}
            {isWorkspaceFeatureAvailable(
              props.topLevelInfo.workspace,
              WorkspaceFeature.SCHEDULE,
            ) && (
              <TableCell {...styles}>
                {timeAndEffortSummary.planned.hoursByFeasability[
                  TimePlanActivityFeasability.NICE_TO_HAVE
                ].toFixed(2)}
              </TableCell>
            )}

            <TableCell {...styles}>
              {
                timeAndEffortSummary.achieved.activitiesByFeasabilityByDoneness[
                  TimePlanActivityDoneness.DONE
                ][TimePlanActivityFeasability.NICE_TO_HAVE]
              }{" "}
              [
              {(
                (timeAndEffortSummary.achieved
                  .activitiesByFeasabilityByDoneness[
                  TimePlanActivityDoneness.DONE
                ][TimePlanActivityFeasability.NICE_TO_HAVE] /
                  timeAndEffortSummary.planned.activitiesByFeasability[
                    TimePlanActivityFeasability.NICE_TO_HAVE
                  ]) *
                100
              ).toFixed(0) + "%"}
              ]
            </TableCell>
            <TableCell {...styles}>
              {
                timeAndEffortSummary.achieved.activitiesByFeasabilityByDoneness[
                  TimePlanActivityDoneness.WORKING
                ][TimePlanActivityFeasability.NICE_TO_HAVE]
              }{" "}
              [
              {(
                (timeAndEffortSummary.achieved
                  .activitiesByFeasabilityByDoneness[
                  TimePlanActivityDoneness.WORKING
                ][TimePlanActivityFeasability.NICE_TO_HAVE] /
                  timeAndEffortSummary.planned.activitiesByFeasability[
                    TimePlanActivityFeasability.NICE_TO_HAVE
                  ]) *
                100
              ).toFixed(0) + "%"}
              ]
            </TableCell>
            <TableCell {...styles}>
              {
                timeAndEffortSummary.achieved.activitiesByFeasabilityByDoneness[
                  TimePlanActivityDoneness.NOT_DONE
                ][TimePlanActivityFeasability.NICE_TO_HAVE]
              }
            </TableCell>

            {isUserFeatureAvailable(
              props.topLevelInfo.user,
              UserFeature.GAMIFICATION,
            ) && (
              <>
                <TableCell {...styles}>
                  {
                    timeAndEffortSummary.achieved.scoreByFeasabilityByDoneness[
                      TimePlanActivityDoneness.DONE
                    ][TimePlanActivityFeasability.NICE_TO_HAVE]
                  }{" "}
                  [
                  {(
                    (timeAndEffortSummary.achieved.scoreByFeasabilityByDoneness[
                      TimePlanActivityDoneness.DONE
                    ][TimePlanActivityFeasability.NICE_TO_HAVE] /
                      timeAndEffortSummary.planned.scoreByFeasability[
                        TimePlanActivityFeasability.NICE_TO_HAVE
                      ]) *
                    100
                  ).toFixed(0) + "%"}
                  ]
                </TableCell>
                <TableCell {...styles}>
                  {
                    timeAndEffortSummary.achieved.scoreByFeasabilityByDoneness[
                      TimePlanActivityDoneness.WORKING
                    ][TimePlanActivityFeasability.NICE_TO_HAVE]
                  }{" "}
                  [
                  {(
                    (timeAndEffortSummary.achieved.scoreByFeasabilityByDoneness[
                      TimePlanActivityDoneness.WORKING
                    ][TimePlanActivityFeasability.NICE_TO_HAVE] /
                      timeAndEffortSummary.planned.scoreByFeasability[
                        TimePlanActivityFeasability.NICE_TO_HAVE
                      ]) *
                    100
                  ).toFixed(0) + "%"}
                  ]
                </TableCell>
                <TableCell {...styles}>
                  {
                    timeAndEffortSummary.achieved.scoreByFeasabilityByDoneness[
                      TimePlanActivityDoneness.NOT_DONE
                    ][TimePlanActivityFeasability.NICE_TO_HAVE]
                  }
                </TableCell>
              </>
            )}
            {isWorkspaceFeatureAvailable(
              props.topLevelInfo.workspace,
              WorkspaceFeature.SCHEDULE,
            ) && (
              <TableCell {...styles}>
                {timeAndEffortSummary.achieved.hoursByFeasability[
                  TimePlanActivityFeasability.NICE_TO_HAVE
                ].toFixed(2)}
              </TableCell>
            )}
          </TableRow>

          <TableRow>
            <TableCell {...styles}>
              {timePlanActivityFeasabilityName(
                TimePlanActivityFeasability.STRETCH,
              )}
            </TableCell>
            <TableCell {...styles}>
              {
                timeAndEffortSummary.planned.activitiesByFeasability[
                  TimePlanActivityFeasability.STRETCH
                ]
              }
            </TableCell>

            {isUserFeatureAvailable(
              props.topLevelInfo.user,
              UserFeature.GAMIFICATION,
            ) && (
              <TableCell {...styles}>
                {
                  timeAndEffortSummary.planned.scoreByFeasability[
                    TimePlanActivityFeasability.STRETCH
                  ]
                }
              </TableCell>
            )}
            {isWorkspaceFeatureAvailable(
              props.topLevelInfo.workspace,
              WorkspaceFeature.SCHEDULE,
            ) && (
              <TableCell {...styles}>
                {timeAndEffortSummary.planned.hoursByFeasability[
                  TimePlanActivityFeasability.STRETCH
                ].toFixed(2)}
              </TableCell>
            )}

            <TableCell {...styles}>
              {
                timeAndEffortSummary.achieved.activitiesByFeasabilityByDoneness[
                  TimePlanActivityDoneness.DONE
                ][TimePlanActivityFeasability.STRETCH]
              }{" "}
              [
              {(
                (timeAndEffortSummary.achieved
                  .activitiesByFeasabilityByDoneness[
                  TimePlanActivityDoneness.DONE
                ][TimePlanActivityFeasability.STRETCH] /
                  timeAndEffortSummary.planned.activitiesByFeasability[
                    TimePlanActivityFeasability.STRETCH
                  ]) *
                100
              ).toFixed(0) + "%"}
              ]
            </TableCell>
            <TableCell {...styles}>
              {
                timeAndEffortSummary.achieved.activitiesByFeasabilityByDoneness[
                  TimePlanActivityDoneness.WORKING
                ][TimePlanActivityFeasability.STRETCH]
              }{" "}
              [
              {(
                (timeAndEffortSummary.achieved
                  .activitiesByFeasabilityByDoneness[
                  TimePlanActivityDoneness.WORKING
                ][TimePlanActivityFeasability.STRETCH] /
                  timeAndEffortSummary.planned.activitiesByFeasability[
                    TimePlanActivityFeasability.STRETCH
                  ]) *
                100
              ).toFixed(0) + "%"}
              ]
            </TableCell>
            <TableCell {...styles}>
              {
                timeAndEffortSummary.achieved.activitiesByFeasabilityByDoneness[
                  TimePlanActivityDoneness.NOT_DONE
                ][TimePlanActivityFeasability.STRETCH]
              }
            </TableCell>

            {isUserFeatureAvailable(
              props.topLevelInfo.user,
              UserFeature.GAMIFICATION,
            ) && (
              <>
                <TableCell {...styles}>
                  {
                    timeAndEffortSummary.achieved.scoreByFeasabilityByDoneness[
                      TimePlanActivityDoneness.DONE
                    ][TimePlanActivityFeasability.STRETCH]
                  }{" "}
                  [
                  {(
                    (timeAndEffortSummary.achieved.scoreByFeasabilityByDoneness[
                      TimePlanActivityDoneness.DONE
                    ][TimePlanActivityFeasability.STRETCH] /
                      timeAndEffortSummary.planned.scoreByFeasability[
                        TimePlanActivityFeasability.STRETCH
                      ]) *
                    100
                  ).toFixed(0) + "%"}
                  ]
                </TableCell>
                <TableCell {...styles}>
                  {
                    timeAndEffortSummary.achieved.scoreByFeasabilityByDoneness[
                      TimePlanActivityDoneness.WORKING
                    ][TimePlanActivityFeasability.STRETCH]
                  }{" "}
                  [
                  {(
                    (timeAndEffortSummary.achieved.scoreByFeasabilityByDoneness[
                      TimePlanActivityDoneness.WORKING
                    ][TimePlanActivityFeasability.STRETCH] /
                      timeAndEffortSummary.planned.scoreByFeasability[
                        TimePlanActivityFeasability.STRETCH
                      ]) *
                    100
                  ).toFixed(0) + "%"}
                  ]
                </TableCell>
                <TableCell {...styles}>
                  {
                    timeAndEffortSummary.achieved.scoreByFeasabilityByDoneness[
                      TimePlanActivityDoneness.NOT_DONE
                    ][TimePlanActivityFeasability.STRETCH]
                  }
                </TableCell>
              </>
            )}

            {isWorkspaceFeatureAvailable(
              props.topLevelInfo.workspace,
              WorkspaceFeature.SCHEDULE,
            ) && (
              <TableCell {...styles}>
                {timeAndEffortSummary.achieved.hoursByFeasability[
                  TimePlanActivityFeasability.STRETCH
                ].toFixed(2)}
              </TableCell>
            )}
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
