import { Box, Stack, Tooltip, Typography } from "@mui/material";
import { DateTime } from "luxon";

import { lifePlanBirthdayDate } from "#/core/life_plan/root";
import { aDateToDate } from "#/core/common/adate";
import { WidgetProps } from "#/core/home/component/common";

const TOTAL_YEARS = 100;
const WEEKS_PER_YEAR = 52;

export function LifeWeeksWidget(props: WidgetProps) {
  const lifePlan = props.lifePlan!;
  const birthday = lifePlanBirthdayDate(lifePlan);
  const today = aDateToDate(props.topLevelInfo.today);
  const todayMillis = today.toMillis();

  return (
    <Box sx={{ overflowX: "auto" }}>
      {Array.from({ length: TOTAL_YEARS }, (_, year) => (
        <Stack key={year} direction="row" sx={{ alignItems: "center" }}>
          {Array.from({ length: WEEKS_PER_YEAR }, (_, week) => {
            const weekIndex = year * WEEKS_PER_YEAR + week;
            const weekStart = birthday.plus({ weeks: weekIndex });
            const weekEnd = weekStart.plus({ weeks: 1 });
            const weekStartMillis = weekStart.toMillis();
            const weekEndMillis = weekEnd.toMillis();

            const isCurrent =
              weekStartMillis <= todayMillis && todayMillis < weekEndMillis;
            const isPast = weekEndMillis <= todayMillis;

            const backgroundColor = isCurrent
              ? "#ffd700"
              : isPast
                ? "#cccccc"
                : "#f0f0f0";

            return (
              <Tooltip
                key={week}
                title={`Age ${year}, Week ${week + 1}`}
                placement="top"
              >
                <Box
                  sx={{
                    width: "2px",
                    height: "2px",
                    margin: "0.5px",
                    flexShrink: 0,
                    backgroundColor,
                  }}
                />
              </Tooltip>
            );
          })}
        </Stack>
      ))}
    </Box>
  );
}
