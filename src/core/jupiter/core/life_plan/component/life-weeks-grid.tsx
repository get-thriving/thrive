import { Box, Stack, Tooltip, Typography } from "@mui/material";
import { DateTime } from "luxon";

const TOTAL_YEARS = 100;
const WEEKS_PER_YEAR = 52;

export interface LifeWeeksGridProps {
  birthday: DateTime;
  today: DateTime;
  cellSizePx?: number;
  showYearLabels?: boolean;
}

export function LifeWeeksGrid({
  birthday,
  today,
  cellSizePx = 9,
  showYearLabels = true,
}: LifeWeeksGridProps) {
  const todayMillis = today.toMillis();

  return (
    <Box sx={{ overflowX: "auto" }}>
      {Array.from({ length: TOTAL_YEARS }, (_, year) => {
        const yearLabel = year.toString().padStart(2, "0");
        return (
          <Stack key={year} direction="row" sx={{ alignItems: "center" }}>
            {showYearLabels && (
              <Typography
                variant="caption"
                sx={{
                  width: "2rem",
                  minWidth: "2rem",
                  fontSize: "0.55rem",
                  color: "text.disabled",
                  userSelect: "none",
                }}
              >
                {yearLabel}
              </Typography>
            )}
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

              const tooltipTitle = `Age ${year}, Week ${week + 1} · ${weekStart.toFormat("LLL d, yyyy")}`;

              return (
                <Tooltip key={week} title={tooltipTitle} placement="top">
                  <Box
                    sx={{
                      width: `${cellSizePx}px`,
                      height: `${cellSizePx}px`,
                      margin: "1px",
                      flexShrink: 0,
                      backgroundColor,
                    }}
                  />
                </Tooltip>
              );
            })}
          </Stack>
        );
      })}
    </Box>
  );
}
