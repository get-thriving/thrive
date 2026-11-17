import type { StrataPanelView } from "#/core/infra/strata/strata-panel-view";

/** The panels which have views, by their place on the open path. */
export type StrataPanelViewHome = "trunk" | "branch" | "leaf" | "leaflet";

/**
 * The id of a panel's view as a split column. Split ids are unique across the
 * workspace and are what the URL keeps, and there is one panel per place on
 * the open path, so the place and the view say which it is.
 */
export function strataPanelViewId(
  home: StrataPanelViewHome,
  view: StrataPanelView,
): string {
  return `${home}-${view}`;
}

/** The panel id (ADR 0014) whose `[split]` filter holds a panel's open views. */
export function strataPanelViewsPanelId(home: StrataPanelViewHome): string {
  return `${home}-views`;
}
