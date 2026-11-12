/**
 * Strata layout engine: route columns and split columns on X units.
 *
 * Pure functions, no DOM and no React, so they can be unit tested and shared by
 * the web app, Electron and Capacitor.
 *
 * This is the engine the workspace runs on (ADR 0021). Split columns and
 * `layoutColumns` are in place for the column work that comes next; route
 * columns use `layoutUnits` directly until then.
 *
 * Two layers:
 *
 * 1. `layoutUnits` places a row of columns on X units. Every column declares a
 *    size (S = 1, M = 2, B = 3). The focused column always shows whole; the
 *    others are added outward from it while they fit whole; the first that
 *    doesn't fit gets the leftover units (drawn hashed); everything further out
 *    is a 10px spine. Spare units go to columns marked `grow`, rightmost first,
 *    one size step each when the cap is on (S→M, M→B, B→XL).
 *
 * 2. `layoutColumns` knows the three kinds of column. Route columns come from
 *    navigation (the URL path). Split columns are a section of a subject that
 *    is already on screen, pulled out into its own column, and view columns are
 *    a view of a panel (its history, say). All three are laid out alike: whole
 *    while there is room, a hashed peek or a 10px spine when there is not. None
 *    is ever put back into its parent for lack of room, as that builds its body
 *    again in the new place, which for a long list is slow. The kinds differ in
 *    what they belong to: a split or a view shares the subject of the route
 *    column before it.
 */

export type UnitSize = 1 | 2 | 3;
/** What a column declares: a number of units, or the whole screen. */
export type ColumnSize = UnitSize | "full";
export type FillOrder = "alternate" | "parents" | "children";
export type SlotState = "full" | "squeezed" | "partial" | "spine";
export type ColumnKind = "route" | "split" | "view";

export interface ColumnSpec {
  /** Stable id: the route id for route columns, `split:<id>` for split and view columns. */
  key: string;
  kind: ColumnKind;
  size: ColumnSize;
  /** May take spare units, growing to the right. */
  grow?: boolean;
}

export interface Slot {
  key: string;
  kind: ColumnKind;
  /** Declared size in units; a `"full"` column declares all of them. */
  size: number;
  state: SlotState;
  /** Units occupied. 0 for a spine. */
  units: number;
  /** Units added by growth. */
  grownBy: number;
}

export interface LayoutResult {
  slots: Slot[];
  /** Units left over, drawn as an empty slot at the right end. */
  emptyUnits: number;
  usedUnits: number;
  units: number;
  focus: number;
}

export interface LayoutUnitsInput {
  columns: ColumnSpec[];
  /** Index into `columns` of the focused column. */
  focus: number;
  /** X, usually from `unitsForWidth`. */
  units: number;
  /** Default "alternate": child first, then parent, moving outward. */
  order?: FillOrder;
  /** Default true. */
  capGrowth?: boolean;
}

export function fillSequence(
  focus: number,
  count: number,
  order: FillOrder,
): number[] {
  const seq: number[] = [];
  if (order === "alternate") {
    for (let d = 1; d < count; d++) {
      if (focus + d < count) seq.push(focus + d);
      if (focus - d >= 0) seq.push(focus - d);
    }
  } else if (order === "parents") {
    for (let i = focus - 1; i >= 0; i--) seq.push(i);
    for (let i = focus + 1; i < count; i++) seq.push(i);
  } else {
    for (let i = focus + 1; i < count; i++) seq.push(i);
    for (let i = focus - 1; i >= 0; i--) seq.push(i);
  }
  return seq;
}

export function layoutUnits(input: LayoutUnitsInput): LayoutResult {
  const { columns, units: x } = input;
  if (columns.length === 0) throw new Error("layoutUnits: no columns");
  if (x < 1) throw new Error("layoutUnits: units must be at least 1");
  const focus = Math.max(0, Math.min(columns.length - 1, input.focus));
  const order = input.order ?? "alternate";
  const cap = input.capGrowth ?? true;
  const n = columns.length;
  const sizes = columns.map((c) => (c.size === "full" ? x : c.size));
  const u = new Array<number>(n).fill(0);
  const st = new Array<SlotState>(n).fill("spine");
  u[focus] = Math.min(sizes[focus], x);
  st[focus] = sizes[focus] > x ? "squeezed" : "full";
  let remaining = x - u[focus];
  for (const c of fillSequence(focus, n, order)) {
    if (remaining <= 0) break;
    if (sizes[c] <= remaining) {
      u[c] = sizes[c];
      st[c] = "full";
      remaining -= sizes[c];
    } else {
      u[c] = remaining;
      st[c] = "partial";
      remaining = 0;
      break;
    }
  }
  const grownBy = new Array<number>(n).fill(0);
  for (let g = n - 1; g >= 0 && remaining > 0; g--) {
    if (!columns[g].grow || st[g] !== "full") continue;
    const add = cap ? Math.min(remaining, 1) : remaining;
    u[g] += add;
    grownBy[g] = add;
    remaining -= add;
  }
  return {
    slots: columns.map((c, i) => ({
      key: c.key,
      kind: c.kind,
      size: sizes[i],
      state: st[i],
      units: u[i],
      grownBy: grownBy[i],
    })),
    emptyUnits: remaining,
    usedUnits: u.reduce((a, b) => a + b, 0),
    units: x,
    focus,
  };
}

export interface LayoutColumnsInput {
  /** The columns, left to right: route columns, with splits and views after theirs. */
  columns: ColumnSpec[];
  /** Key of the focused column. If it isn't present, `fallbackFocus` decides. */
  focusKey: string;
  /** Index to focus when `focusKey` isn't among the columns. Default: the last route column. */
  fallbackFocus?: (columns: ColumnSpec[]) => number;
  units: number;
  order?: FillOrder;
  capGrowth?: boolean;
}

export interface ColumnsResult {
  columns: ColumnSpec[];
  layout: LayoutResult;
}

export function layoutColumns(input: LayoutColumnsInput): ColumnsResult {
  const fallback =
    input.fallbackFocus ??
    ((cols: ColumnSpec[]) => {
      for (let i = cols.length - 1; i >= 0; i--)
        if (cols[i].kind === "route") return i;
      return cols.length - 1;
    });
  const columns = input.columns;
  let focus = columns.findIndex((c) => c.key === input.focusKey);
  if (focus < 0) focus = fallback(columns);
  return {
    columns,
    layout: layoutUnits({
      columns,
      focus,
      units: input.units,
      order: input.order,
      capGrowth: input.capGrowth,
    }),
  };
}

export interface UnitsForWidthOptions {
  /** Target width of one unit, in px. Default 190. */
  targetUnit?: number;
  /** Most units on any screen; past this, units get wider. Default 9. */
  maxUnits?: number;
  /** Below this width it's the phone layout: one unit, no rail. Default 700. */
  phoneBelow?: number;
  /** Rail width on big screens. Default 52. */
  rail?: number;
}

export function railWidth(
  width: number,
  opts: UnitsForWidthOptions = {},
): number {
  return width < (opts.phoneBelow ?? 700) ? 0 : (opts.rail ?? 52);
}

export function unitsForWidth(
  width: number,
  opts: UnitsForWidthOptions = {},
): number {
  if (width < (opts.phoneBelow ?? 700)) return 1;
  const x = Math.floor(
    (width - railWidth(width, opts)) / (opts.targetUnit ?? 190),
  );
  return Math.max(1, Math.min(opts.maxUnits ?? 9, x));
}

export interface PlacedSlot {
  key: string;
  left: number;
  width: number;
  /** Width to lay content out at: the declared size for a partial slot (clipped), else `width`. */
  contentWidth: number;
}

export function toPixels(
  layout: LayoutResult,
  width: number,
  opts: UnitsForWidthOptions & { spine?: number } = {},
) {
  const spine = opts.spine ?? 10;
  const rail = railWidth(width, opts);
  const spines = layout.slots.filter((s) => s.state === "spine").length;
  const unitPx = (width - rail - spines * spine) / layout.units;
  let left = rail;
  const slots: PlacedSlot[] = layout.slots.map((s) => {
    const w = s.state === "spine" ? spine : s.units * unitPx;
    const placed = {
      key: s.key,
      left,
      width: w,
      contentWidth: s.state === "partial" ? s.size * unitPx : w,
    };
    left += w;
    return placed;
  });
  return {
    slots,
    empty:
      layout.emptyUnits > 0
        ? { left, width: layout.emptyUnits * unitPx }
        : null,
    unitPx,
  };
}

/**
 * Compact text form, used by the tests and handy in logs:
 * `key:3` whole, `key:3+1` grown, `key:1/3~` partial (hashed), `key:2/3!` squeezed,
 * `key:|` spine, `_:2` empty slot.
 */
export function describeLayout(layout: LayoutResult): string {
  const parts = layout.slots.map((s) => {
    const v =
      s.state === "spine"
        ? "|"
        : s.state === "partial"
          ? `${s.units}/${s.size}~`
          : s.state === "squeezed"
            ? `${s.units}/${s.size}!`
            : s.grownBy > 0
              ? `${s.size}+${s.grownBy}`
              : `${s.units}`;
    return `${s.key}:${v}`;
  });
  if (layout.emptyUnits > 0) parts.push(`_:${layout.emptyUnits}`);
  return parts.join(" ");
}
