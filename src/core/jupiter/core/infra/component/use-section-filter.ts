import { useCallback, useMemo, useRef } from "react";
import { useLocation, useResolvedPath, useSearchParams } from "react-router";

import type {
  SectionFilters,
  SectionFiltersSchema,
} from "#/core/infra/section-filters";
import {
  readSectionFilters,
  sectionFilterPanelOf,
  withSectionFiltersPreserved,
  writeSectionFilters,
} from "#/core/infra/section-filters";

// Which path each panel with filters sits at, so that a link can tell whether
// the panel is still going to be there where it leads. Panel ids are fixed per
// route, so this only ever learns the same things over again.
const PANEL_PATHS = new Map<string, string>();

function useRegisterPanel(panelId: string): void {
  // Resolved relative to the route rendering the panel, so it's the path of
  // that route - the one under which the panel stays on screen.
  const panelPath = useResolvedPath(".").pathname;
  PANEL_PATHS.set(panelId, panelPath);
}

const NAVIGATE_OPTIONS = { replace: true, preventScrollReset: true } as const;

/**
 * The filters of a panel, kept in the URL as `panelId[filter-name]=value`.
 * See `SectionFiltersSchema` for how the schema describes them. `defaults`
 * gives the defaults which depend on something known only while rendering.
 *
 * Returns the filters, and a setter which changes any number of them in one
 * go. The schema should be made once, at the top of the module.
 */
export function useSectionFilters<S extends SectionFiltersSchema>(
  panelId: string,
  schema: S,
  defaults?: Partial<SectionFilters<S>>,
): [SectionFilters<S>, (update: Partial<SectionFilters<S>>) => void] {
  useRegisterPanel(panelId);
  const [searchParams, setSearchParams] = useSearchParams();

  // Only this panel's params, and the defaults, make for different filters.
  const panelSearch = new URLSearchParams(
    Array.from(searchParams.entries()).filter(
      ([key]) => sectionFilterPanelOf(key) === panelId,
    ),
  ).toString();
  const defaultsKey = JSON.stringify(defaults ?? {});
  const defaultsRef = useRef(defaults);
  defaultsRef.current = defaults;

  const filters = useMemo(
    () =>
      readSectionFilters(
        new URLSearchParams(panelSearch),
        panelId,
        schema,
        defaultsRef.current,
      ),
    // The defaults are compared by what they hold, not by identity.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [panelSearch, panelId, schema, defaultsKey],
  );

  const setFilters = useCallback(
    (update: Partial<SectionFilters<S>>) => {
      setSearchParams(
        (prev) =>
          writeSectionFilters(
            prev,
            panelId,
            schema,
            update,
            defaultsRef.current,
          ),
        NAVIGATE_OPTIONS,
      );
    },
    [setSearchParams, panelId, schema],
  );

  return [filters, setFilters];
}

/**
 * A link target with the section filters of the page on screen carried over,
 * for those panels which will still be on screen where it leads. Opening a
 * panel below a filtered list, or closing it again, keeps the list filtered.
 */
export function useSectionFiltersPreservedTo(to: string): string;
export function useSectionFiltersPreservedTo(
  to: string | undefined,
): string | undefined;
export function useSectionFiltersPreservedTo(
  to: string | undefined,
): string | undefined {
  const location = useLocation();
  return useMemo(
    () =>
      to === undefined
        ? undefined
        : withSectionFiltersPreserved(
            to,
            new URLSearchParams(location.search),
            PANEL_PATHS,
          ),
    [to, location.search],
  );
}

/**
 * Like `useSectionFiltersPreservedTo`, for when the target is only known at
 * the time of navigating.
 */
export function useSectionFiltersPreserver(): (to: string) => string {
  const location = useLocation();
  return useCallback(
    (to: string) =>
      withSectionFiltersPreserved(
        to,
        new URLSearchParams(location.search),
        PANEL_PATHS,
      ),
    [location.search],
  );
}
