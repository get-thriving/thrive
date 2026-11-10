import type { PropsWithChildren } from "react";

import { StrataColumnsProvider } from "#/core/infra/component/layout/strata-columns-provider";

interface StrataColumnsShellProps {
  offsetLeft: number;
  phone: boolean;
}

/**
 * Wraps the whole workspace, so the top bar can read which panel is shown as
 * well as the panels.
 */
export function StrataColumnsShell(
  props: PropsWithChildren<StrataColumnsShellProps>,
) {
  return (
    <StrataColumnsProvider offsetLeft={props.offsetLeft} phone={props.phone}>
      {props.children}
    </StrataColumnsProvider>
  );
}
