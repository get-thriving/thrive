import { Logo } from "~/components/logo";
import { SampleColumnView } from "~/components/sample-column-view";
import type { SampleScreen } from "~/components/sample-screen";

const RAIL_PLACES = [0, 1, 2, 3, 4, 5];

/** A whole sample screen: the top bar, the icon rail and the columns. */
export function SampleScreenView(props: { screen: SampleScreen }) {
  const { screen } = props;
  return (
    <div className="sample-window">
      <div className="sample-topbar">
        <span className="sample-topbar-logo">
          <Logo size={16} />
        </span>
        <span className="sample-crumb">{screen.crumb}</span>
        <span className="sample-search" aria-hidden="true">
          Search<kbd>⌘K</kbd>
        </span>
      </div>
      <div className="sample-frame">
        <div className="sample-rail" aria-hidden="true">
          {RAIL_PLACES.map((place) => (
            <span key={place} data-on={place === screen.railIndex} />
          ))}
        </div>
        {screen.columns.map((column) => (
          <SampleColumnView key={column.title} column={column} />
        ))}
      </div>
    </div>
  );
}
