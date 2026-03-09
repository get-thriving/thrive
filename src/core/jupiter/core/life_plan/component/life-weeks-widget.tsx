import { Box, Tooltip } from "@mui/material";
import { lifePlanBirthdayDate } from "#/core/life_plan/root";
import { aDateToDate } from "#/core/common/adate";
import { WidgetProps } from "#/core/home/component/common";

const COLS = 10;
const ROWS = 10;

export function LifeWeeksWidget(props: WidgetProps) {
  const lifePlan = props.lifePlan!;
  const birthday = lifePlanBirthdayDate(lifePlan);
  const today = aDateToDate(props.topLevelInfo.today);
  const todayMillis = today.toMillis();

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: `repeat(${COLS}, 1fr)`,
        gap: "2px",
        width: "100%",
        height: "100%",
        padding: "4px",
        boxSizing: "border-box",
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
            <Box
              sx={{
                backgroundColor,
                borderRadius: "1px",
                aspectRatio: "1",
              }}
            />
          </Tooltip>
        );
      })}
    </Box>
  );
}
