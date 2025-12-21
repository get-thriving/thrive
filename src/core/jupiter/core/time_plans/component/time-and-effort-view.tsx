import {
  TimePlan,
  TimePlanActivityDoneness,
  TimePlanActivityFeasability,
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

import { timePlanActivityFeasabilityName } from "#/core/time_plans/sub/activity/feasability";
import { timePlanActivityDonenessName } from "#/core/time_plans/sub/activity/doneness";
import { TopLevelInfo } from "#/core/infra/top-level-context";
import { isUserFeatureAvailable } from "#/core/users/root";
import { isWorkspaceFeatureAvailable } from "#/core/workspaces/root";
import { TimeAndEffortSummary } from "#/core/time_plans/time-and-effort-summary";

interface TimeAndEffortViewProps {
  topLevelInfo: TopLevelInfo;
  timePlan: TimePlan;
  timeAndEffortSummary: TimeAndEffortSummary;
}

export function TimeAndEffortView(props: TimeAndEffortViewProps) {
  const timeAndEffortSummary = props.timeAndEffortSummary;

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
            <ValueAndPctCell value="Category" rowSpan={3} align="left" />
            <ValueAndPctCell
              value="Planned"
              rowSpan={2}
              colSpan={plannedTextColSpan}
              align="left"
            />
            <ValueAndPctCell
              value="Achieved"
              colSpan={achievedTextColSpan}
              align="left"
            />
          </TableRow>

          <TableRow>
            <ValueAndPctCell value="Activities" colSpan={3} align="left" />

            {isUserFeatureAvailable(
              props.topLevelInfo.user,
              UserFeature.GAMIFICATION,
            ) && <ValueAndPctCell value="Scores" colSpan={3} align="left" />}
            {isWorkspaceFeatureAvailable(
              props.topLevelInfo.workspace,
              WorkspaceFeature.SCHEDULE,
            ) && <ValueAndPctCell value="Hours" rowSpan={2} align="left" />}
          </TableRow>

          <TableRow>
            <ValueAndPctCell value="Activities" align="left" />
            {isUserFeatureAvailable(
              props.topLevelInfo.user,
              UserFeature.GAMIFICATION,
            ) && <ValueAndPctCell value="Est. Score" align="left" />}
            {isWorkspaceFeatureAvailable(
              props.topLevelInfo.workspace,
              WorkspaceFeature.SCHEDULE,
            ) && <ValueAndPctCell value="Est. Hours" align="left" />}

            <ValueAndPctCell
              value={timePlanActivityDonenessName(
                TimePlanActivityDoneness.DONE,
              )}
              align="left"
            />
            <ValueAndPctCell
              value={timePlanActivityDonenessName(
                TimePlanActivityDoneness.WORKING,
              )}
              align="left"
            />
            <ValueAndPctCell
              value={timePlanActivityDonenessName(
                TimePlanActivityDoneness.NOT_DONE,
              )}
              align="left"
            />

            {isUserFeatureAvailable(
              props.topLevelInfo.user,
              UserFeature.GAMIFICATION,
            ) && (
              <>
                <ValueAndPctCell
                  value={timePlanActivityDonenessName(
                    TimePlanActivityDoneness.DONE,
                  )}
                  align="left"
                />
                <ValueAndPctCell
                  value={timePlanActivityDonenessName(
                    TimePlanActivityDoneness.WORKING,
                  )}
                  align="left"
                />
                <ValueAndPctCell
                  value={timePlanActivityDonenessName(
                    TimePlanActivityDoneness.NOT_DONE,
                  )}
                  align="left"
                />
              </>
            )}
          </TableRow>
        </TableHead>

        <TableBody>
          <TableRow>
            <ValueAndPctCell value="Total" align="left" />
            <ValueAndPctCell
              value={timeAndEffortSummary.planned.totalActivities}
            />

            {isUserFeatureAvailable(
              props.topLevelInfo.user,
              UserFeature.GAMIFICATION,
            ) && (
              <ValueAndPctCell
                value={timeAndEffortSummary.planned.totalScore}
              />
            )}
            {isWorkspaceFeatureAvailable(
              props.topLevelInfo.workspace,
              WorkspaceFeature.SCHEDULE,
            ) && (
              <ValueAndPctCell
                value={timeAndEffortSummary.planned.totalHours}
              />
            )}

            <ValueAndPctCell
              value={
                timeAndEffortSummary.achieved.totalActivitiesByDoneness[
                  TimePlanActivityDoneness.DONE
                ]
              }
              total={timeAndEffortSummary.planned.totalActivities}
            />
            <ValueAndPctCell
              value={
                timeAndEffortSummary.achieved.totalActivitiesByDoneness[
                  TimePlanActivityDoneness.WORKING
                ]
              }
              total={timeAndEffortSummary.planned.totalActivities}
            />
            <ValueAndPctCell
              value={
                timeAndEffortSummary.achieved.totalActivitiesByDoneness[
                  TimePlanActivityDoneness.NOT_DONE
                ]
              }
              total={timeAndEffortSummary.planned.totalActivities}
            />

            {isUserFeatureAvailable(
              props.topLevelInfo.user,
              UserFeature.GAMIFICATION,
            ) && (
              <>
                <ValueAndPctCell
                  value={
                    timeAndEffortSummary.achieved.totalScoreByDoneness[
                      TimePlanActivityDoneness.DONE
                    ]
                  }
                  total={timeAndEffortSummary.planned.totalScore}
                />
                <ValueAndPctCell
                  value={
                    timeAndEffortSummary.achieved.totalScoreByDoneness[
                      TimePlanActivityDoneness.WORKING
                    ]
                  }
                  total={timeAndEffortSummary.planned.totalScore}
                />
                <ValueAndPctCell
                  value={
                    timeAndEffortSummary.achieved.totalScoreByDoneness[
                      TimePlanActivityDoneness.NOT_DONE
                    ]
                  }
                  total={timeAndEffortSummary.planned.totalScore}
                />
              </>
            )}

            {isWorkspaceFeatureAvailable(
              props.topLevelInfo.workspace,
              WorkspaceFeature.SCHEDULE,
            ) && (
              <ValueAndPctCell
                value={timeAndEffortSummary.achieved.totalHours}
              />
            )}
          </TableRow>

          <TableRow>
            <ValueAndPctCell
              value={timePlanActivityFeasabilityName(
                TimePlanActivityFeasability.MUST_DO,
              )}
              align="left"
            />
            <ValueAndPctCell
              value={
                timeAndEffortSummary.planned.activitiesByFeasability[
                  TimePlanActivityFeasability.MUST_DO
                ]
              }
            />

            {isUserFeatureAvailable(
              props.topLevelInfo.user,
              UserFeature.GAMIFICATION,
            ) && (
              <ValueAndPctCell
                value={
                  timeAndEffortSummary.planned.scoreByFeasability[
                    TimePlanActivityFeasability.MUST_DO
                  ]
                }
              />
            )}
            {isWorkspaceFeatureAvailable(
              props.topLevelInfo.workspace,
              WorkspaceFeature.SCHEDULE,
            ) && (
              <ValueAndPctCell
                value={
                  timeAndEffortSummary.planned.hoursByFeasability[
                    TimePlanActivityFeasability.MUST_DO
                  ]
                }
              />
            )}

            <ValueAndPctCell
              value={
                timeAndEffortSummary.achieved.activitiesByFeasabilityByDoneness[
                  TimePlanActivityDoneness.DONE
                ][TimePlanActivityFeasability.MUST_DO]
              }
              total={
                timeAndEffortSummary.planned.activitiesByFeasability[
                  TimePlanActivityFeasability.MUST_DO
                ]
              }
            />
            <ValueAndPctCell
              value={
                timeAndEffortSummary.achieved.activitiesByFeasabilityByDoneness[
                  TimePlanActivityDoneness.WORKING
                ][TimePlanActivityFeasability.MUST_DO]
              }
              total={
                timeAndEffortSummary.planned.activitiesByFeasability[
                  TimePlanActivityFeasability.MUST_DO
                ]
              }
            />
            <ValueAndPctCell
              value={
                timeAndEffortSummary.achieved.activitiesByFeasabilityByDoneness[
                  TimePlanActivityDoneness.NOT_DONE
                ][TimePlanActivityFeasability.MUST_DO]
              }
              total={
                timeAndEffortSummary.planned.activitiesByFeasability[
                  TimePlanActivityFeasability.MUST_DO
                ]
              }
            />

            {isUserFeatureAvailable(
              props.topLevelInfo.user,
              UserFeature.GAMIFICATION,
            ) && (
              <>
                <ValueAndPctCell
                  value={
                    timeAndEffortSummary.achieved.scoreByFeasabilityByDoneness[
                      TimePlanActivityDoneness.DONE
                    ][TimePlanActivityFeasability.MUST_DO]
                  }
                  total={
                    timeAndEffortSummary.planned.scoreByFeasability[
                      TimePlanActivityFeasability.MUST_DO
                    ]
                  }
                />
                <ValueAndPctCell
                  value={
                    timeAndEffortSummary.achieved.scoreByFeasabilityByDoneness[
                      TimePlanActivityDoneness.WORKING
                    ][TimePlanActivityFeasability.MUST_DO]
                  }
                  total={
                    timeAndEffortSummary.planned.scoreByFeasability[
                      TimePlanActivityFeasability.MUST_DO
                    ]
                  }
                />
                <ValueAndPctCell
                  value={
                    timeAndEffortSummary.achieved.scoreByFeasabilityByDoneness[
                      TimePlanActivityDoneness.NOT_DONE
                    ][TimePlanActivityFeasability.MUST_DO]
                  }
                  total={
                    timeAndEffortSummary.planned.scoreByFeasability[
                      TimePlanActivityFeasability.MUST_DO
                    ]
                  }
                />
              </>
            )}
            {isWorkspaceFeatureAvailable(
              props.topLevelInfo.workspace,
              WorkspaceFeature.SCHEDULE,
            ) && (
              <ValueAndPctCell
                value={
                  timeAndEffortSummary.achieved.hoursByFeasability[
                    TimePlanActivityFeasability.MUST_DO
                  ]
                }
              />
            )}
          </TableRow>

          <TableRow>
            <ValueAndPctCell
              value={timePlanActivityFeasabilityName(
                TimePlanActivityFeasability.NICE_TO_HAVE,
              )}
              align="left"
            />
            <ValueAndPctCell
              value={
                timeAndEffortSummary.planned.activitiesByFeasability[
                  TimePlanActivityFeasability.NICE_TO_HAVE
                ]
              }
            />

            {isUserFeatureAvailable(
              props.topLevelInfo.user,
              UserFeature.GAMIFICATION,
            ) && (
              <ValueAndPctCell
                value={
                  timeAndEffortSummary.planned.scoreByFeasability[
                    TimePlanActivityFeasability.NICE_TO_HAVE
                  ]
                }
              />
            )}
            {isWorkspaceFeatureAvailable(
              props.topLevelInfo.workspace,
              WorkspaceFeature.SCHEDULE,
            ) && (
              <ValueAndPctCell
                value={
                  timeAndEffortSummary.planned.hoursByFeasability[
                    TimePlanActivityFeasability.NICE_TO_HAVE
                  ]
                }
              />
            )}

            <ValueAndPctCell
              value={
                timeAndEffortSummary.achieved.activitiesByFeasabilityByDoneness[
                  TimePlanActivityDoneness.DONE
                ][TimePlanActivityFeasability.NICE_TO_HAVE]
              }
              total={
                timeAndEffortSummary.planned.activitiesByFeasability[
                  TimePlanActivityFeasability.NICE_TO_HAVE
                ]
              }
            />
            <ValueAndPctCell
              value={
                timeAndEffortSummary.achieved.activitiesByFeasabilityByDoneness[
                  TimePlanActivityDoneness.WORKING
                ][TimePlanActivityFeasability.NICE_TO_HAVE]
              }
              total={
                timeAndEffortSummary.planned.activitiesByFeasability[
                  TimePlanActivityFeasability.NICE_TO_HAVE
                ]
              }
            />
            <ValueAndPctCell
              value={
                timeAndEffortSummary.achieved.activitiesByFeasabilityByDoneness[
                  TimePlanActivityDoneness.NOT_DONE
                ][TimePlanActivityFeasability.NICE_TO_HAVE]
              }
              total={
                timeAndEffortSummary.planned.activitiesByFeasability[
                  TimePlanActivityFeasability.NICE_TO_HAVE
                ]
              }
            />

            {isUserFeatureAvailable(
              props.topLevelInfo.user,
              UserFeature.GAMIFICATION,
            ) && (
              <>
                <ValueAndPctCell
                  value={
                    timeAndEffortSummary.achieved.scoreByFeasabilityByDoneness[
                      TimePlanActivityDoneness.DONE
                    ][TimePlanActivityFeasability.NICE_TO_HAVE]
                  }
                  total={
                    timeAndEffortSummary.planned.scoreByFeasability[
                      TimePlanActivityFeasability.NICE_TO_HAVE
                    ]
                  }
                />
                <ValueAndPctCell
                  value={
                    timeAndEffortSummary.achieved.scoreByFeasabilityByDoneness[
                      TimePlanActivityDoneness.WORKING
                    ][TimePlanActivityFeasability.NICE_TO_HAVE]
                  }
                  total={
                    timeAndEffortSummary.planned.scoreByFeasability[
                      TimePlanActivityFeasability.NICE_TO_HAVE
                    ]
                  }
                />
                <ValueAndPctCell
                  value={
                    timeAndEffortSummary.achieved.scoreByFeasabilityByDoneness[
                      TimePlanActivityDoneness.NOT_DONE
                    ][TimePlanActivityFeasability.NICE_TO_HAVE]
                  }
                  total={
                    timeAndEffortSummary.planned.scoreByFeasability[
                      TimePlanActivityFeasability.NICE_TO_HAVE
                    ]
                  }
                />
              </>
            )}
            {isWorkspaceFeatureAvailable(
              props.topLevelInfo.workspace,
              WorkspaceFeature.SCHEDULE,
            ) && (
              <ValueAndPctCell
                value={
                  timeAndEffortSummary.achieved.hoursByFeasability[
                    TimePlanActivityFeasability.NICE_TO_HAVE
                  ]
                }
              />
            )}
          </TableRow>

          <TableRow>
            <ValueAndPctCell
              value={timePlanActivityFeasabilityName(
                TimePlanActivityFeasability.STRETCH,
              )}
              align="left"
            />
            <ValueAndPctCell
              value={
                timeAndEffortSummary.planned.activitiesByFeasability[
                  TimePlanActivityFeasability.STRETCH
                ]
              }
            />

            {isUserFeatureAvailable(
              props.topLevelInfo.user,
              UserFeature.GAMIFICATION,
            ) && (
              <ValueAndPctCell
                value={
                  timeAndEffortSummary.planned.scoreByFeasability[
                    TimePlanActivityFeasability.STRETCH
                  ]
                }
              />
            )}
            {isWorkspaceFeatureAvailable(
              props.topLevelInfo.workspace,
              WorkspaceFeature.SCHEDULE,
            ) && (
              <ValueAndPctCell
                value={
                  timeAndEffortSummary.planned.hoursByFeasability[
                    TimePlanActivityFeasability.STRETCH
                  ]
                }
              />
            )}

            <ValueAndPctCell
              value={
                timeAndEffortSummary.achieved.activitiesByFeasabilityByDoneness[
                  TimePlanActivityDoneness.DONE
                ][TimePlanActivityFeasability.STRETCH]
              }
              total={
                timeAndEffortSummary.planned.activitiesByFeasability[
                  TimePlanActivityFeasability.STRETCH
                ]
              }
            />
            <ValueAndPctCell
              value={
                timeAndEffortSummary.achieved.activitiesByFeasabilityByDoneness[
                  TimePlanActivityDoneness.WORKING
                ][TimePlanActivityFeasability.STRETCH]
              }
              total={
                timeAndEffortSummary.planned.activitiesByFeasability[
                  TimePlanActivityFeasability.STRETCH
                ]
              }
            />
            <ValueAndPctCell
              value={
                timeAndEffortSummary.achieved.activitiesByFeasabilityByDoneness[
                  TimePlanActivityDoneness.NOT_DONE
                ][TimePlanActivityFeasability.STRETCH]
              }
              total={
                timeAndEffortSummary.planned.activitiesByFeasability[
                  TimePlanActivityFeasability.STRETCH
                ]
              }
            />

            {isUserFeatureAvailable(
              props.topLevelInfo.user,
              UserFeature.GAMIFICATION,
            ) && (
              <>
                <ValueAndPctCell
                  value={
                    timeAndEffortSummary.achieved.scoreByFeasabilityByDoneness[
                      TimePlanActivityDoneness.DONE
                    ][TimePlanActivityFeasability.STRETCH]
                  }
                  total={
                    timeAndEffortSummary.planned.scoreByFeasability[
                      TimePlanActivityFeasability.STRETCH
                    ]
                  }
                />
                <ValueAndPctCell
                  value={
                    timeAndEffortSummary.achieved.scoreByFeasabilityByDoneness[
                      TimePlanActivityDoneness.WORKING
                    ][TimePlanActivityFeasability.STRETCH]
                  }
                  total={
                    timeAndEffortSummary.planned.scoreByFeasability[
                      TimePlanActivityFeasability.STRETCH
                    ]
                  }
                />
                <ValueAndPctCell
                  value={
                    timeAndEffortSummary.achieved.scoreByFeasabilityByDoneness[
                      TimePlanActivityDoneness.NOT_DONE
                    ][TimePlanActivityFeasability.STRETCH]
                  }
                  total={
                    timeAndEffortSummary.planned.scoreByFeasability[
                      TimePlanActivityFeasability.STRETCH
                    ]
                  }
                />
              </>
            )}

            {isWorkspaceFeatureAvailable(
              props.topLevelInfo.workspace,
              WorkspaceFeature.SCHEDULE,
            ) && (
              <ValueAndPctCell
                value={
                  timeAndEffortSummary.achieved.hoursByFeasability[
                    TimePlanActivityFeasability.STRETCH
                  ]
                }
              />
            )}
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

interface ValueAndPctCellProps {
  value: number | string;
  total?: number;
  align?: "center" | "left" | "right";
  rowSpan?: number;
  colSpan?: number;
}

function ValueAndPctCell({
  value,
  total,
  align = "center",
  rowSpan,
  colSpan,
}: ValueAndPctCellProps) {
  const theme = useTheme();
  const styles = {
    sx: {
      borderWidth: "1px",
      borderColor: theme.palette.grey[200],
      borderStyle: "solid",
      textAlign: "left",
    },
  };

  const percentage =
    typeof value === "number" && total !== undefined && total > 0
      ? ((value / total) * 100).toFixed(0) + "%"
      : undefined;

  const displayValue =
    typeof value === "number" && value % 1 !== 0 ? value.toFixed(2) : value;

  return (
    <TableCell {...styles} align={align} rowSpan={rowSpan} colSpan={colSpan}>
      {displayValue}
      {percentage !== undefined && <> [{percentage}]</>}
    </TableCell>
  );
}
