import { useRef, useState } from "react";
import type { KeyboardEvent } from "react";

import { SAMPLE_SCREENS } from "~/components/sample-screens";
import { SampleScreenView } from "~/components/sample-screen-view";

/**
 * The product, drawn in a few of its screens. Every screen is in the page, so
 * it can be read without scripts; the tabs only choose which one is shown.
 */
export function ProductScreens() {
  const [selected, setSelected] = useState(0);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const count = SAMPLE_SCREENS.length;
    let next: number | null = null;
    if (event.key === "ArrowRight") next = (index + 1) % count;
    if (event.key === "ArrowLeft") next = (index + count - 1) % count;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = count - 1;
    if (next === null) return;
    event.preventDefault();
    setSelected(next);
    tabs.current[next]?.focus();
  }

  return (
    <section className="wrap product" aria-label="Thrive screens">
      <div className="product-tabs">
        <div role="tablist" aria-label="Screens" className="product-tablist">
          {SAMPLE_SCREENS.map((screen, index) => (
            <button
              key={screen.id}
              ref={(element) => {
                tabs.current[index] = element;
              }}
              type="button"
              role="tab"
              id={`screen-tab-${screen.id}`}
              aria-selected={index === selected}
              aria-controls={`screen-panel-${screen.id}`}
              tabIndex={index === selected ? 0 : -1}
              className="product-tab"
              onClick={() => setSelected(index)}
              onKeyDown={(event) => onKeyDown(event, index)}
            >
              {screen.label}
            </button>
          ))}
        </div>
        <span className="product-note">Sample data</span>
      </div>
      <div className="product-frame">
        <div className="product-scroll">
          {SAMPLE_SCREENS.map((screen, index) => (
            <div
              key={screen.id}
              role="tabpanel"
              id={`screen-panel-${screen.id}`}
              aria-labelledby={`screen-tab-${screen.id}`}
              hidden={index !== selected}
            >
              <SampleScreenView screen={screen} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
