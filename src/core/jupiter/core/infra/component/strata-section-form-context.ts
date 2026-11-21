import { createContext } from "react";

/**
 * The id of the form a section's controls submit, for controls drawn apart from
 * it: in the header of a column, which is a form of its own, and not the
 * section's. Null where they are drawn in the section, which is where they
 * submit its form without being told.
 */
export const StrataSectionFormContext = createContext<string | null>(null);
