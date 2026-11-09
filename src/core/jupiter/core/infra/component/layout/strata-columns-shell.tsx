import type { PropsWithChildren } from "react";

import { StrataColumnsProvider } from "#/core/infra/component/layout/strata-columns-provider";

interface StrataColumnsShellProps {
  /** Whether the UI style is Strata, so the panels are laid out as columns. */
  enabled: boolean;
  offsetLeft: number;
  phone: boolean;
}

/**
 * Wraps the whole workspace, so the top bar can read which panel is shown as
 * well as the panels, and leaves it as it is when the style is classic.
 */
export function StrataColumnsShell(
  props: PropsWithChildren<StrataColumnsShellProps>,
) {
  if (!props.enabled) {
    return <>{props.children}</>;
  }
  return (
    <StrataColumnsProvider offsetLeft={props.offsetLeft} phone={props.phone}>
      {props.children}
    </StrataColumnsProvider>
  );
}
