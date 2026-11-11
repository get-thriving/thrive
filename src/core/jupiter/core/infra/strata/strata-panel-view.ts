/**
 * What a panel can show about its entity apart from the entity itself. Each
 * is a view of its own: a column beside the panel when there is room, and the
 * panel's content swapped for it when there is none (ADR 0021).
 */
export type StrataPanelView = "history" | "publish" | "access";

/** In the order of the buttons in the panel's header. */
export const STRATA_PANEL_VIEWS: readonly StrataPanelView[] = [
  "publish",
  "access",
  "history",
];
