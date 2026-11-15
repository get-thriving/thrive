import { useMemo } from "react";
import { useRouteLoaderData } from "react-router";

import {
  strataKeyBindingsFrom,
  type StrataKeyBindings,
} from "#/core/infra/strata/strata-key-bindings";

/**
 * The keys the user chose for the keyboard actions (ADR 0021), from the root
 * loader. The defaults when there is no root data, e.g. in tests and outside
 * the workspace.
 */
export function useStrataKeyBindings(): StrataKeyBindings {
  const rootData = useRouteLoaderData("root") as
    { keyBindings?: Record<string, string> } | undefined;
  const saved = rootData?.keyBindings;
  return useMemo(() => strataKeyBindingsFrom(saved), [saved]);
}
