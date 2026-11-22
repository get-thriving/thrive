import { createContext, useContext } from "react";

export interface StrataSectionsContextValue {
  /** The panel whose filters hold the collapsed and split sections (ADR 0014). */
  panelId: string;
  /** Key of the route column the sections are in; null before it is laid out. */
  parentKey: string | null;
  /**
   * The header of the column has room for the controls of the first section,
   * which is then the column's header: it has no row of its own (ADR 0021).
   * Known before anything is on the page, so the server draws what the browser
   * does and nothing moves when the page comes alive.
   */
  lendsToHeader: boolean;
  /**
   * Whether the fixed section asking is the one whose controls the header of
   * the column draws: the first to ask, and only that one. A page that holds
   * another stack's fixed section (an editor of another entity, say) leaves
   * that one its own row.
   */
  claimLend: (sectionId: string) => boolean;
  /** Whether a section is collapsed now; some start collapsed, some open. */
  isCollapsed: (sectionId: string, startsCollapsed: boolean) => boolean;
  toggle: (sectionId: string, startsCollapsed: boolean) => void;
  /** Ids of the sections asked to be columns of their own, in the order opened. */
  split: string[];
  /** Ask for a section to be a column of its own, or take that back. */
  setSplit: (sectionId: string, on: boolean) => void;
}

export const StrataSectionsContext =
  createContext<StrataSectionsContextValue | null>(null);

/** The stack of sections a section is in, or null if it stands on its own. */
export function useStrataSections(): StrataSectionsContextValue | null {
  return useContext(StrataSectionsContext);
}
