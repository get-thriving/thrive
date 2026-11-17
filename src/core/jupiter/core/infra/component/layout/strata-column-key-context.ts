import { createContext, useContext } from "react";

/** The key of the column a panel is in, which a split names as its parent. */
export const StrataColumnKeyContext = createContext<string | null>(null);

export function useStrataColumnKey(): string | null {
  return useContext(StrataColumnKeyContext);
}
