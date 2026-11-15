import type {
  StrataLayout,
  StrataPlacedSlot,
} from "#/core/infra/strata/strata-layout-for";
import type { ColumnSpec } from "#/core/infra/strata/layout";

/**
 * The strip a panel next to the focused one folds into, at either edge: wide
 * enough for its name in a very small font, set upright.
 */
export const PHONE_STRIP_PX = 14;

/**
 * Lay the open path out on a phone `width` px wide (ADR 0020): one panel at a
 * time, whole. The panel before it is a thin strip at the left edge and the one
 * after it one at the right edge, each saying what it is; every other panel
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
  const parentStrip = hasParent ? PHONE_STRIP_PX : 0;
  const childSliver = hasChild ? PHONE_STRIP_PX : 0;
  const focusedWidth = Math.max(0, width - parentStrip - childSliver);

  const slots: StrataPlacedSlot[] = path.map((panel, index) => {
    const base = {
      key: panel.key,
      kind: panel.kind,
      units: 0,
      focused: false,
      alone: path.length === 1,
      fullScreen: panel.size === "full",
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
        edgeLabel: "left",
        left: 0,
        width: PHONE_STRIP_PX,
        contentWidth: PHONE_STRIP_PX,
      };
    }
    if (index === focusIndex + 1) {
      return {
        ...base,
        state: "spine",
        edgeLabel: "right",
        left: width - PHONE_STRIP_PX,
        width: PHONE_STRIP_PX,
        contentWidth: PHONE_STRIP_PX,
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
        return `${name}:${slot.width > 0 ? "strip" : "|"}`;
      })
      .join(" "),
  };
}
