import type {
  StrataLayout,
  StrataPlacedSlot,
} from "#/core/infra/strata/strata-layout-for";
import type { ColumnSpec } from "#/core/infra/strata/layout";

/** The strip the panel before the focused one folds into. */
export const PHONE_PARENT_STRIP_PX = 10;
/** The strip the panel after the focused one folds into, with its name. */
export const PHONE_CHILD_SLIVER_PX = 30;

/**
 * Lay the open path out on a phone `width` px wide (ADR 0020): one panel at a
 * time, whole. The panel before it is a thin strip at the left edge and the one
 * after it a sliver at the right edge that says what it is; every other panel
 * has no room at all. The strips only exist where there is a panel to go to.
 */
export function strataPhoneLayoutFor(
  path: ColumnSpec[],
  focus: number,
  width: number,
): StrataLayout {
  const focusIndex = Math.max(0, Math.min(path.length - 1, focus));
  const hasParent = focusIndex > 0;
  const hasChild = focusIndex < path.length - 1;
  const parentStrip = hasParent ? PHONE_PARENT_STRIP_PX : 0;
  const childSliver = hasChild ? PHONE_CHILD_SLIVER_PX : 0;
  const focusedWidth = Math.max(0, width - parentStrip - childSliver);

  const slots: StrataPlacedSlot[] = path.map((panel, index) => {
    const base = {
      key: panel.key,
      kind: panel.kind,
      units: 0,
      focused: false,
      subject: index,
      inFocusedSubject: path.length > 1 && index === focusIndex,
    };
    if (index === focusIndex) {
      return {
        ...base,
        state: "full",
        units: 1,
        focused: path.length > 1,
        left: parentStrip,
        width: focusedWidth,
        contentWidth: focusedWidth,
      };
    }
    if (index === focusIndex - 1) {
      return {
        ...base,
        state: "spine",
        left: 0,
        width: PHONE_PARENT_STRIP_PX,
        contentWidth: PHONE_PARENT_STRIP_PX,
      };
    }
    if (index === focusIndex + 1) {
      return {
        ...base,
        state: "spine",
        sliver: true,
        left: width - PHONE_CHILD_SLIVER_PX,
        width: PHONE_CHILD_SLIVER_PX,
        contentWidth: PHONE_CHILD_SLIVER_PX,
      };
    }
    // Out of reach: folded to nothing, at the edge it came from.
    return {
      ...base,
      state: "spine",
      left: index < focusIndex ? 0 : width,
      width: 0,
      contentWidth: 0,
    };
  });

  return {
    slots,
    gutters: [],
    units: 1,
    unitPx: width,
    description: slots
      .map((slot, index) => {
        const name = path[index].key;
        if (slot.state === "full") {
          return `${name}:1`;
        }
        return `${name}:${slot.sliver ? "sliver" : slot.width > 0 ? "strip" : "|"}`;
      })
      .join(" "),
  };
}
