import {
  strataColumnFrame,
  strataColumnSections,
} from "#/core/infra/component/layout/strata-map-columns";
import type { StrataColumnsApi } from "#/core/infra/component/layout/strata-columns-context";
import type { StrataMapTarget } from "#/core/infra/strata/strata-map-targets";

// How many frames to wait for a column to come in before giving up: it slides
// for about a tenth of a second.
const MAX_FRAMES = 40;

// A newer jump leaves an older one that is still waiting.
let latest = 0;

/**
 * Goes to a target of the map. A column gets the focus, which brings it in
 * whole and puts the keyboard focus on it. A section gets the focus of its
 * column, and then the keyboard focus itself, scrolled to the top of the
 * column, so `j` and `k` go on from it. The column may be folded or only
 * partly shown, which a section can't take the focus in, so the jump waits for
 * the layout to bring it in.
 */
export function strataJumpTo(
  target: StrataMapTarget,
  columns: Pick<StrataColumnsApi, "focusColumn" | "slots">,
) {
  latest += 1;
  const mine = latest;
  if (target.kind === "column") {
    columns.focusColumn(target.columnKey);
    return;
  }
  const { columnKey, sectionId } = target;
  columns.focusColumn(columnKey, false);

  // Alone on the screen a column is never marked as focused.
  const alone = columns.slots.length === 1;
  let frames = 0;
  function attempt() {
    if (mine !== latest || frames > MAX_FRAMES) {
      return;
    }
    frames += 1;
    const frame = strataColumnFrame(columnKey);
    const ready =
      frame !== null &&
      (alone || frame.dataset.focused === "true") &&
      frame.dataset.folded === undefined &&
      frame.dataset.peek === undefined;
    if (!ready) {
      requestAnimationFrame(attempt);
      return;
    }
    const section = strataColumnSections(frame).find(
      (candidate) => candidate.dataset.strataSection === sectionId,
    );
    if (section === undefined) {
      frame.focus({ preventScroll: true });
      return;
    }
    section.focus({ preventScroll: true });
    section.scrollIntoView({ block: "start" });
  }
  attempt();
}
