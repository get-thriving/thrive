import { ViewAsCalendarDaily } from "~/calendar/component/view-as-calendar-daily";
import { WidgetProps } from "~/home/component/common";

export function CalendarDailyWidget(props: WidgetProps) {
  const calendar = props.calendar!;
  return (
    <ViewAsCalendarDaily
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
