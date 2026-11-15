import { createContext } from "react";

import type { StrataCommandsRegistry } from "#/core/infra/component/layout/strata-commands-registry";

/**
 * Where the actions on screen register, for the menu of commands. Null outside
 * the columns, where nothing opens the menu, so a section drawn there has
 * nothing to do.
 */
export const StrataCommandsContext =
  createContext<StrataCommandsRegistry | null>(null);
