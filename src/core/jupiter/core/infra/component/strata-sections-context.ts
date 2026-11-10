import { createContext, useContext } from "react";

export interface StrataSectionsContextValue {
  /** The panel whose filters hold the collapsed and split sections (ADR 0014). */
  panelId: string;
  /** Key of the route column the sections are in; null before it is laid out. */
  parentKey: string | null;
  /** Ids of the sections which are collapsed. */
  collapsed: string[];
  toggle: (sectionId: string) => void;
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
