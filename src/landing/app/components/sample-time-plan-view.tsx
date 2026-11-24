import { SampleCalendarView } from "~/components/sample-calendar-view";
import { SampleRowView } from "~/components/sample-row-view";
import type { SampleColumn } from "~/components/sample-screen";

type TimePlanColumn = Extract<SampleColumn, { kind: "timeplan" }>;

/**
 * A time plan in full: its note and figures on top, and under them what it
 * holds, as a list of tasks and as a week calendar.
 */
export function SampleTimePlanView(props: { column: TimePlanColumn }) {
  const { note, stats, tasks, calendar } = props.column;
  return (
    <div className="sample-timeplan">
      <div className="sample-timeplan-top">
        <div className="sample-note">
          <span className="sample-pane-label">Note</span>
          <p>{note}</p>
        </div>
        <div className="sample-stats">
          {stats.map((stat) => (
            <div key={stat.label} className="sample-stat">
              <span className="sample-pane-label">{stat.label}</span>
              <span className="sample-stat-value">{stat.value}</span>
              {stat.detail ? (
                <span className="sample-stat-detail">{stat.detail}</span>
              ) : null}
              {stat.percent !== undefined ? (
                <span className="sample-progress-track">
                  <i style={{ width: `${stat.percent}%` }} />
                </span>
              ) : null}
            </div>
          ))}
        </div>
      </div>
      <div className="sample-timeplan-bottom">
        <div className="sample-timeplan-tasks">
          {tasks.map((group) => (
            <div key={group.label}>
              <div className="sample-group">
                <span>{group.label}</span>
              </div>
              {group.rows.map((row) => (
                <SampleRowView key={row.name} row={row} />
              ))}
            </div>
          ))}
        </div>
        <div className="sample-timeplan-calendar">
          <SampleCalendarView calendar={calendar} compact />
        </div>
      </div>
    </div>
  );
}
