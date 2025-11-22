import { ViewAsScheduleDailyAndWeekly } from "#/core/calendar/component/view-as-schedule-daily-and-weekly";
import { WidgetProps } from "#/core/home/component/common";

export function ScheduleDailyWidget(props: WidgetProps) {
  const calendar = props.calendar!;
  return (
    <ViewAsScheduleDailyAndWeekly
      rightNow={props.rightNow}
      today={props.topLevelInfo.today}
      timezone={props.timezone}
      period={calendar.period}
      periodStartDate={calendar.periodStartDate}
      periodEndDate={calendar.periodEndDate}
      entries={calendar.entries}
      calendarLocation={""}
      isAdding={false}
      showOnlyFromRightNowIfDaily
    />
  );
}
