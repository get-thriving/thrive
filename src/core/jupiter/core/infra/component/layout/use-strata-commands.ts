import { useContext, useEffect, useRef } from "react";

import type { StrataCommand } from "#/core/infra/component/layout/strata-command";
import { StrataCommandsContext } from "#/core/infra/component/layout/strata-commands-context";

/**
 * Offers commands to the menu of commands (ADR 0021) for as long as the
 * caller is on screen. `element` is where it is drawn, and `commands` gives its
 * commands as they are when the menu opens: both are read late, so the latest
 * render's are what the menu sees, and a render that changes them costs
 * nothing more.
 */
export function useStrataCommands(
  element: () => Element | null,
  commands: () => StrataCommand[],
): void {
  const registry = useContext(StrataCommandsContext);
  const elementRef = useRef(element);
  elementRef.current = element;
  const commandsRef = useRef(commands);
  commandsRef.current = commands;

  // After every render, since what the commands are can change with any.
  useEffect(() => {
    registry?.changed();
  });

  useEffect(() => {
    if (registry === null) {
      return;
    }
    return registry.register({
      element: () => elementRef.current(),
      commands: () => commandsRef.current(),
    });
  }, [registry]);
}
