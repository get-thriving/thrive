import type { SampleColumn, SampleProperty } from "~/components/sample-screen";
import { SampleCalendarView } from "~/components/sample-calendar-view";
import { SampleEntryView } from "~/components/sample-entry-view";
import { SampleRowView } from "~/components/sample-row-view";
import { SampleTimePlanView } from "~/components/sample-time-plan-view";

function PropertyView(props: { property: SampleProperty }) {
  const { property } = props;
  return (
    <div className="sample-property">
      <span className="sample-property-label">{property.label}</span>
      {property.kind === "options" ? (
        <span className="sample-options">
          {property.options.map((option, index) => (
            <span key={option} data-on={index === property.active}>
              {option}
            </span>
          ))}
        </span>
      ) : null}
      {property.kind === "text" ? (
        <span className="sample-property-value">{property.value}</span>
      ) : null}
      {property.kind === "progress" ? (
        <span className="sample-progress">
          <span className="sample-progress-track">
            <i style={{ width: `${property.percent}%` }} />
          </span>
          <span className="sample-progress-value">{property.value}</span>
        </span>
      ) : null}
    </div>
  );
}

/** One column of a sample screen, in the shape the product draws it. */
export function SampleColumnView(props: { column: SampleColumn }) {
  const { column } = props;
  return (
    <div
      className="sample-column"
      data-focused={column.focused === true}
      style={{ flexGrow: column.units }}
    >
      <div className="sample-column-header">
        <span className="sample-column-title">{column.title}</span>
        {column.count ? (
          <span className="sample-column-count">{column.count}</span>
        ) : null}
      </div>
      <div className="sample-column-body">
        {column.kind === "list"
          ? column.groups.map((group) => (
              <div key={group.label}>
                <div className="sample-group">
                  <span>{group.label}</span>
                </div>
                {group.rows.map((row) => (
                  <SampleRowView key={row.name} row={row} />
                ))}
              </div>
            ))
          : null}
        {column.kind === "calendar" ? (
          <SampleCalendarView calendar={column} />
        ) : null}
        {column.kind === "timeplan" ? (
          <SampleTimePlanView column={column} />
        ) : null}
        {column.kind === "entry" ? <SampleEntryView column={column} /> : null}
        {column.kind === "details" ? (
          <>
            <div className="sample-details-head">
              <span className="sample-details-name">{column.name}</span>
              <span className="sample-details-meta">{column.meta}</span>
            </div>
            {column.properties.map((property) => (
              <PropertyView key={property.label} property={property} />
            ))}
            <div className="sample-section">
              <span aria-hidden="true">▾</span>
              <span>{column.sectionTitle}</span>
            </div>
            {column.rows.map((row) => (
              <SampleRowView key={row.name} row={row} />
            ))}
          </>
        ) : null}
      </div>
    </div>
  );
}
