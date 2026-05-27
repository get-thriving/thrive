import { Box, Stack, Tooltip, Typography } from "@mui/material";

import { lifePlanBirthdayDate } from "#/core/life_plan/root";
import { aDateToDate } from "#/core/common/adate";
import { WidgetProps } from "#/core/home/component/common";

const COLS = 10;
const ROWS = 10;
const TOTAL_YEARS = COLS * ROWS;

export function LifeWeeksWidget(props: WidgetProps) {
  const lifePlan = props.lifePlan!;
  const birthday = lifePlanBirthdayDate(lifePlan);
  const today = aDateToDate(props.topLevelInfo.today);
  const todayMillis = today.toMillis();

  const ageMs = todayMillis - birthday.toMillis();
  const ageYears = ageMs / (365.25 * 24 * 60 * 60 * 1000);
  const percent = Math.min(100, Math.round((ageYears / TOTAL_YEARS) * 100));

  return (
    <Stack
      direction="row"
      sx={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        gap: 1,
        padding: "4px",
        boxSizing: "border-box",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: `repeat(${COLS}, 1fr)`,
          gap: "2px",
          flex: "1 1 0",
          minWidth: 0,
          alignSelf: "stretch",
        }}
      >
        {Array.from({ length: ROWS * COLS }, (_, i) => {
          const year = i;
          const yearStart = birthday.plus({ years: year });
          const yearEnd = birthday.plus({ years: year + 1 });
          const yearStartMillis = yearStart.toMillis();
          const yearEndMillis = yearEnd.toMillis();

          const isCurrent =
            yearStartMillis <= todayMillis && todayMillis < yearEndMillis;
          const isPast = yearEndMillis <= todayMillis;

          const backgroundColor = isCurrent
            ? "#ffd700"
            : isPast
              ? "#cccccc"
              : "#f0f0f0";

          return (
            <Tooltip
              key={year}
              title={`Age ${year} · ${yearStart.toFormat("yyyy")}`}
              placement="top"
            >
              <Box sx={{ backgroundColor, borderRadius: "1px" }} />
            </Tooltip>
          );
        })}
      </Box>

      <Stack
        sx={{
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          width: "33%",
        }}
      >
        <Typography
          sx={{ fontSize: "1.4rem", fontWeight: "bold", lineHeight: 1 }}
        >
          {percent}%
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: "text.secondary",
            fontSize: "0.6rem",
            textAlign: "center",
          }}
        >
          lived so far
        </Typography>
      </Stack>
    </Stack>
  );
}
