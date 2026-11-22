import { KeyboardAction } from "@jupiter/webapi-client";

/** How an action is shown on the page where its key is chosen. */
export interface StrataKeyActionInfo {
  action: KeyboardAction;
  /** What it does, in a few words. */
  label: string;
}

/** A run of related actions, under one heading. */
export interface StrataKeyActionGroup {
  title: string;
  actions: StrataKeyActionInfo[];
}

/**
 * Every keyboard action, grouped as the settings page lists them (ADR 0021),
 * in the order the footer draws them: moving between columns, going through
 * sections and items, acting on a section, jumping elsewhere, and scrolling.
 */
export const STRATA_KEY_ACTION_GROUPS: StrataKeyActionGroup[] = [
  {
    title: "Columns",
    actions: [
      { action: KeyboardAction.COLUMN_PREVIOUS, label: "Column to the left" },
      { action: KeyboardAction.COLUMN_NEXT, label: "Column to the right" },
      {
        action: KeyboardAction.COLUMN_NARROWER,
        label: "Make the column narrower",
      },
      { action: KeyboardAction.COLUMN_WIDER, label: "Make the column wider" },
      { action: KeyboardAction.MENU, label: "Open the column's menu" },
      { action: KeyboardAction.CLOSE, label: "Close the column, or go back" },
    ],
  },
  {
    title: "Sections and items",
    actions: [
      { action: KeyboardAction.NEXT, label: "Next section or item" },
      { action: KeyboardAction.PREVIOUS, label: "Previous section or item" },
      { action: KeyboardAction.OPEN, label: "Go in, or open" },
      {
        action: KeyboardAction.EDIT,
        label: "Edit the note, or go into the list",
      },
      {
        action: KeyboardAction.COLLAPSE,
        label: "Collapse or expand a section",
      },
      { action: KeyboardAction.SPLIT, label: "Split a section into a column" },
      { action: KeyboardAction.FOLD_BACK, label: "Fold a split column back" },
    ],
  },
  {
    title: "Jump and search",
    actions: [
      { action: KeyboardAction.HINTS, label: "Hints: click anything by label" },
      {
        action: KeyboardAction.MAP,
        label: "Map: jump to any column or section",
      },
      {
        action: KeyboardAction.APPS,
        label: "Apps: jump to an app or page",
      },
      {
        action: KeyboardAction.COMMANDS,
        label: "Commands: run an action of the column",
      },
      {
        action: KeyboardAction.NEW,
        label: "New: create an item of any kind",
      },
      { action: KeyboardAction.FIND, label: "Find on the page" },
    ],
  },
  {
    title: "Move along and scroll",
    actions: [
      {
        action: KeyboardAction.POSITION_PREVIOUS,
        label: "Previous item in the collection",
      },
      {
        action: KeyboardAction.POSITION_NEXT,
        label: "Next item in the collection",
      },
      {
        action: KeyboardAction.SCROLL_TOP,
        label: "Scroll the column to its top",
      },
      {
        action: KeyboardAction.SCROLL_BOTTOM,
        label: "Scroll the column to its bottom",
      },
    ],
  },
];
