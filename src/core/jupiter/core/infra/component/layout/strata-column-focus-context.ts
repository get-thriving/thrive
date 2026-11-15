import { createContext, useContext } from "react";

/**
 * Whether the column a panel is in is the focused one, or the only one open:
 * the columns whose header shows all of its parts. A column that has not been
 * placed yet, as on the server, shows them all.
 */
export const StrataColumnFocusContext = createContext<boolean>(true);

export function useStrataColumnFocused(): boolean {
  return useContext(StrataColumnFocusContext);
}
