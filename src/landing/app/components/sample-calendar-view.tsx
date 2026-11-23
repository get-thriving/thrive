import type { SampleCalendar } from "~/components/sample-screen";

/**
 * A week grid: a column a day, the events placed by the hour they start at.
 * The compact one is for a column that holds more than the calendar.
 */
export function SampleCalendarView(props: {
  calendar: SampleCalendar;
  compact?: boolean;
}) {
  const { days, firstHour, hours, events } = props.calendar;
  const hourMarks = Array.from(
    { length: hours },
    (_, index) => firstHour + index,
  );
  return (
    <div
      className="sample-calendar"
      data-compact={props.compact === true}
      style={{ "--hours": hours } as React.CSSProperties}
    >
      <div className="sample-calendar-days">
        <span />
        {days.map((day) => (
          <span key={day.label} data-today={day.today === true}>
            {day.label}
          </span>
        ))}
      </div>
      <div className="sample-calendar-body">
        <div className="sample-calendar-hours" aria-hidden="true">
          {hourMarks.map((hour) => (
            <span key={hour}>{hour}</span>
          ))}
        </div>
        {days.map((day, dayIndex) => (
          <div
            key={day.label}
            className="sample-calendar-day"
            data-today={day.today === true}
          >
            {events
              .filter((event) => event.day === dayIndex)
              .map((event) => (
                <div
                  key={event.name}
                  className="sample-calendar-event"
                  data-kind={event.kind}
                  style={{
                    top: `${((event.start - firstHour) / hours) * 100}%`,
                    height: `${((event.end - event.start) / hours) * 100}%`,
                  }}
                >
                  {event.name}
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}
