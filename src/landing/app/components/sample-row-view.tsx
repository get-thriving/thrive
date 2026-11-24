import type { SampleRow } from "~/components/sample-screen";

/** One row of a sample list: a marker, a name, an optional streak and a note. */
export function SampleRowView(props: { row: SampleRow }) {
  const { row } = props;
  return (
    <div
      className="sample-row"
      data-state={row.state ?? "normal"}
      style={row.indent ? { paddingLeft: 12 + row.indent } : undefined}
    >
      <span className="sample-marker" data-shape={row.marker} />
      <span className="sample-row-name">{row.name}</span>
      {row.streak ? (
        <span className="sample-streak" aria-hidden="true">
          {row.streak.split("").map((day, index) => (
            <i key={index} data-day={day} />
          ))}
        </span>
      ) : null}
      {row.meta ? <span className="sample-row-meta">{row.meta}</span> : null}
    </div>
  );
}
