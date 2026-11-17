import { useRouteLoaderData } from "react-router";

/**
 * Whether the user asked for the Strata rail to show labels (ADR 0019), from
 * the root loader. Off when there is no root data, e.g. in tests and outside the
 * workspace.
 */
export function useExpandedRailPreference(): boolean {
  const rootData = useRouteLoaderData("root") as
    { useExpandedRail?: boolean } | undefined;
  return rootData?.useExpandedRail ?? false;
}
