import { ADate, Habit, HabitStreakMark } from "@jupiter/webapi-client";
import {
  Box,
  IconButton,
  Stack,
  Theme,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { PropsWithChildren } from "react";
import {
  ArrowBackIosNew as ArrowBackIosNewIcon,
  ArrowForwardIos as ArrowForwardIosIcon,
} from "@mui/icons-material";
import { Link } from "react-router";
import { DateTime } from "luxon";

import { aDateToDate, dateToAdate } from "#/core/common/adate";
import {
  computeDonenessForStreakMark,
  dayCellKind,
  inactiveReasonLabel,
  isInactiveOnDate,
  type StreakInactivePeriodRange,
  weekCellState,
} from "#/core/apps/habits/streak-calendar";

const CELL_SIZE = (theme: Theme) => theme.typography.htmlFontSize - 2;
export const CELL_FULL_SIZE = (theme: Theme) => CELL_SIZE(theme) + 2;

interface HabitStreakCalendarProps {
  earliestDate: ADate;
  latestDate: ADate;
  currentToday: ADate;
  habit: Habit;
  streakMarks: HabitStreakMark[];
  inactivePeriods: StreakInactivePeriodRange[];
  noLabel?: boolean;
  label?: string;
  showNav?: boolean;
  getNavUrl?: (earliestDate: ADate, latestDate: ADate) => string;
}

export function HabitStreakCalendar(props: HabitStreakCalendarProps) {
  const earliestDate = aDateToDate(props.earliestDate);
  const latestDate = aDateToDate(props.latestDate);

  const earliestDateAtWeekStart = aDateToDate(props.earliestDate).startOf(
    "week",
  );
  const latestDateAtWeekStart = aDateToDate(props.latestDate);

  const weeksBetween = [];
  let currentDate = earliestDateAtWeekStart;
  while (currentDate < latestDateAtWeekStart) {
    weeksBetween.push(currentDate);
    currentDate = currentDate.plus({ weeks: 1 });
  }

  const dataPerDay: Map<string, number> = new Map();
  for (const streakMark of props.streakMarks) {
    dataPerDay.set(
      streakMark.date,
      computeDonenessForStreakMark(streakMark.statuses),
    );
  }

  return (
    <StyledDiv>
      <Stack direction="row" sx={{ alignSelf: "center" }}>
        {props.showNav && props.getNavUrl && (
          <NavBefore
            to={props.getNavUrl(
              dateToAdate(earliestDate.minus({ days: 28 })),
              dateToAdate(latestDate.minus({ days: 28 })),
            )}
          />
        )}

        {props.label && !props.noLabel && (
          <Typography
            variant="body2"
            sx={{ display: "flex", alignItems: "center", textAlign: "center" }}
          >
            {props.label}
          </Typography>
        )}
        {!props.label && !props.noLabel && (
          <Typography
            variant="body2"
            sx={{ display: "flex", alignItems: "center", textAlign: "center" }}
          >
            From {props.earliestDate} <br />
            To {props.latestDate}
          </Typography>
        )}

        {props.showNav && props.getNavUrl && (
          <NavAfter
            to={props.getNavUrl(
              dateToAdate(earliestDate.plus({ days: 28 })),
              dateToAdate(latestDate.plus({ days: 28 })),
            )}
          />
        )}
      </Stack>

      <OneYear
        weeksBetween={weeksBetween}
        currentToday={props.currentToday}
        dataPerDay={dataPerDay}
        streakMarks={props.streakMarks}
        inactivePeriods={props.inactivePeriods}
      />
    </StyledDiv>
  );
}

interface NavBeforeProps {
  to: string;
}

function NavBefore(props: NavBeforeProps) {
  return (
    <IconButton
      aria-label="previous-interval"
      size="large"
      component={Link}
      to={props.to}
    >
      <ArrowBackIosNewIcon fontSize="inherit" />
    </IconButton>
  );
}

interface NavAfterProps {
  to: string;
}

function NavAfter(props: NavAfterProps) {
  return (
    <IconButton
      aria-label="next-interval"
      size="large"
      component={Link}
      to={props.to}
    >
      <ArrowForwardIosIcon fontSize="inherit" />
    </IconButton>
  );
}

interface OneYearProps {
  currentToday: ADate;
  weeksBetween: DateTime<true>[];
  dataPerDay: Map<string, number>;
  streakMarks: HabitStreakMark[];
  inactivePeriods: StreakInactivePeriodRange[];
}

function OneYear(props: OneYearProps) {
  const theme = useTheme();
  return (
    <Stack
      direction="row"
      sx={{ marginLeft: "auto", marginRight: "auto", width: "fit-content" }}
    >
      {props.weeksBetween.map((weekStart, index) => {
        const weekDays = Array.from({ length: 7 }, (_, dayIndex) => {
          return weekStart.plus({ days: dayIndex }).toISODate()!;
        });
        const weekState = weekCellState(
          weekDays,
          props.streakMarks,
          props.inactivePeriods,
        );
        const weekTooltip = weekState.fullyInactive
          ? `Week of ${weekStart.toISODate()} – inactive`
          : `Week of ${weekStart.toISODate()}`;
        return (
          <OneCol
            key={index}
            weekStart={weekStart}
            currentToday={props.currentToday}
          >
            <Tooltip title={weekTooltip}>
              <span>
                <OneCell
                  kind={
                    weekState.fullyInactive
                      ? "inactive"
                      : dayCellKind({
                          isToday: false,
                          isFuture: false,
                          isInactive: false,
                          doneness: weekState.doneness,
                        })
                  }
                  doneness={weekState.doneness}
                />
              </span>
            </Tooltip>

            <span
              style={{
                paddingBottom: "0.5rem",
                background: theme.palette.background.paper,
              }}
            ></span>

            {weekDays.map((dayIso, dayIndex) => {
              const value = props.dataPerDay.get(dayIso);
              const inactive = isInactiveOnDate(dayIso, props.inactivePeriods);
              const kind = dayCellKind({
                isToday: props.currentToday == dayIso,
                isFuture: dayIso > props.currentToday,
                isInactive: inactive,
                doneness: value,
              });
              const reason = inactiveReasonLabel(dayIso, props.inactivePeriods);
              const tooltip =
                kind === "today"
                  ? "Today"
                  : kind === "inactive"
                    ? reason
                      ? `${dayIso} – inactive (${reason})`
                      : `${dayIso} – inactive`
                    : value !== undefined
                      ? `${dayIso} - ${value}%`
                      : dayIso;
              return (
                <Tooltip key={dayIndex} title={tooltip}>
                  <span>
                    <OneCell kind={kind} doneness={value} />
                  </span>
                </Tooltip>
              );
            })}
          </OneCol>
        );
      })}
    </Stack>
  );
}

interface OneColProps extends PropsWithChildren {
  weekStart: DateTime<true>;
  currentToday: ADate;
}

function OneCol(props: OneColProps) {
  const currentTodayWeek = aDateToDate(props.currentToday).startOf("week");
  const isCurrentWeek = props.weekStart.equals(currentTodayWeek);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: isCurrentWeek
          ? (theme) => theme.palette.info.light
          : "transparent",
      }}
    >
      {props.children}
    </Box>
  );
}

interface OneCellProps {
  kind: "today" | "future" | "inactive" | "doneness" | "missing";
  doneness: number | undefined;
}

function OneCell(props: OneCellProps) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        width: CELL_SIZE(theme),
        height: CELL_SIZE(theme),
        margin: "1px",
        backgroundColor:
          props.kind === "today"
            ? "#ffd700"
            : props.kind === "future"
              ? theme.palette.info.light
              : props.kind === "inactive"
                ? theme.palette.grey[700]
                : bucketedColorScale(props.doneness),
      }}
    ></Box>
  );
}

function bucketedColorScale(value: number | undefined): string {
  if (value === undefined || value === null) return "#eeeeee";
  if (value <= 15) return "#e57373"; // reddish
  if (value <= 30) return "#ef9a9a"; // lighter red
  if (value <= 45) return "#ffb74d"; // orange
  if (value <= 60) return "#fff176"; // yellow
  if (value <= 75) return "#aed581"; // light green
  return "#81c784"; // green
}

const StyledDiv = styled("div")`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
`;
