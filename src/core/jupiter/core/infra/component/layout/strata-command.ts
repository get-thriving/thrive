import type { StrataCommandKind } from "#/core/infra/component/layout/strata-command-kind";

/**
 * One thing the menu of commands (ADR 0021) can run: an action, a navigation
 * or a filter of a section, or an entry of the menu of a column. It is made
 * from the same descriptions the screen draws its buttons from, so the two
 * cannot disagree, and it can be run whether or not its button is on screen
 * (the choices behind a drop-down are not).
 */
export interface StrataCommand {
  /** Unique among the commands of one source. */
  id: string;
  /** What it is called, and what its letters come from. */
  label: string;
  kind: StrataCommandKind;
  /**
   * It is listed but cannot be run, as its button would be dimmed: it has no
   * letters, so the keys cannot reach it.
   */
  disabled: boolean;
  /** A filter's choice that is the one on now. */
  current: boolean;
  /** A command that destroys something, drawn in the danger colour. */
  danger: boolean;
  /**
   * What it opens instead of running, when it is a filter: its choices, which
   * the menu shows in a panel beside the list, with letters of their own. Empty
   * for a command that runs.
   */
  choices: StrataCommand[];
  /** What is chosen now, said short, for a filter: `By Aspect`, `Copii +2`. */
  detail: string | null;
  /**
   * Its choices are many, such as tags, so the panel that opens for them is for
   * searching: what is typed narrows them, instead of choosing by letter.
   */
  searchable: boolean;
  /**
   * Running it leaves the menu open, for a choice that is one of several to
   * turn on, such as the tags of a filter.
   */
  stays: boolean;
  /**
   * A rule is drawn above it, to set it apart from the commands before it:
   * where the `⋯` menu has a divider, and where the layout of a section starts.
   */
  ruleBefore: boolean;
  run: () => void;
}
