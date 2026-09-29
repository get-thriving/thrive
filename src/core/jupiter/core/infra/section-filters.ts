/**
 * Section filters that live in the URL.
 *
 * Every panel that shows a SectionActions with filters names itself with a
 * panel id, and every filter in it with a filter name. The choice made in a
 * filter is kept in the query string as `panel[filter]=value` - repeated for
 * filters that take many values - so that a page can be linked to, reloaded,
 * or come back to from one of its panels just as it was being looked at.
 *
 * Pages load everything and filter on the client, so a change in these
 * params is never a reason to load a page's data again. The helpers here say
 * which params are filters, and teach `shouldRevalidate` to look past them.
 */
import type { ShouldRevalidateFunction } from "react-router";
import { z } from "zod";

// A deliberate "load it all again", which nothing here stands in the way of.
const INVALIDATE_TOP_LEVEL_PARAM = "invalidateTopLevel";

const PANEL_ID_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const FILTER_NAME_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const SECTION_FILTER_PARAM_RE =
  /^([a-z0-9]+(?:-[a-z0-9]+)*)\[([a-z0-9]+(?:-[a-z0-9]+)*)\]$/;

/** The query param a filter of a panel is kept in. */
export function sectionFilterParam(
  panelId: string,
  filterName: string,
): string {
  if (!PANEL_ID_RE.test(panelId)) {
    throw new Error(`Invalid section filter panel id "${panelId}"`);
  }
  if (!FILTER_NAME_RE.test(filterName)) {
    throw new Error(`Invalid section filter name "${filterName}"`);
  }
  return `${panelId}[${filterName}]`;
}

/** The panel a query param holds a filter for, if it holds one at all. */
export function sectionFilterPanelOf(param: string): string | undefined {
  const match = SECTION_FILTER_PARAM_RE.exec(param);
  return match === null ? undefined : match[1];
}

export function isSectionFilterParam(param: string): boolean {
  return SECTION_FILTER_PARAM_RE.test(param);
}

/** The query string without any of the section filters, sorted for comparing. */
export function searchWithoutSectionFilters(search: URLSearchParams): string {
  const entries = Array.from(search.entries()).filter(
    ([key]) => !isSectionFilterParam(key),
  );
  entries.sort(([ka, va], [kb, vb]) =>
    ka === kb ? va.localeCompare(vb) : ka.localeCompare(kb),
  );
  return new URLSearchParams(entries).toString();
}

/**
 * Copies the filters of the panels in `panelPaths` from `currentSearch` onto
 * `to`, for those panels which are still on screen where `to` leads - that is,
 * whose path `to` is at or under. Filters `to` already says something about
 * are left as `to` has them.
 */
export function withSectionFiltersPreserved(
  to: string,
  currentSearch: URLSearchParams,
  panelPaths: ReadonlyMap<string, string>,
): string {
  if (!to.startsWith("/") || to.startsWith("//")) {
    // Relative or off-site links are left alone.
    return to;
  }

  const target = new URL(to, "http://thrive.invalid");
  const keysAlreadyInTarget = new Set(target.searchParams.keys());
  let changed = false;

  for (const [key, value] of currentSearch.entries()) {
    if (keysAlreadyInTarget.has(key)) {
      continue;
    }
    const panelId = sectionFilterPanelOf(key);
    if (panelId === undefined) {
      continue;
    }
    const panelPath = panelPaths.get(panelId);
    if (
      panelPath === undefined ||
      !isPathAtOrUnder(target.pathname, panelPath)
    ) {
      continue;
    }
    target.searchParams.append(key, value);
    changed = true;
  }

  if (!changed) {
    return to;
  }

  return `${target.pathname}${target.search}${target.hash}`;
}

function isPathAtOrUnder(pathname: string, prefix: string): boolean {
  const cleanPrefix = prefix.replace(/\/+$/, "");
  const cleanPathname = pathname.replace(/\/+$/, "");
  return (
    cleanPathname === cleanPrefix || cleanPathname.startsWith(`${cleanPrefix}/`)
  );
}

/**
 * Wraps a `shouldRevalidate` so that moving to a URL which differs from the
 * current one only in section filters doesn't load anything again. Pages load
 * all their data and filter on the client, so the filters are never a reason
 * to go back to the server.
 *
 * Actions, and the revalidation that follows them, always get through, as do
 * `useRevalidator()` calls (which ask with the URL the page is already on) and
 * anything asking for the top level to be loaded again.
 */
export function ignoringSectionFilterChanges(
  inner: ShouldRevalidateFunction,
): ShouldRevalidateFunction {
  return (args) => {
    if (
      args.formMethod === undefined &&
      !args.nextUrl.searchParams.has(INVALIDATE_TOP_LEVEL_PARAM) &&
      urlWithoutHash(args.currentUrl) !== urlWithoutHash(args.nextUrl) &&
      searchWithoutSectionFilters(args.currentUrl.searchParams) ===
        searchWithoutSectionFilters(args.nextUrl.searchParams) &&
      noSharedParamChanged(args.currentParams, args.nextParams)
    ) {
      // Either the very same page with other filters, or a panel opening or
      // closing below this one (params only appear or disappear). A route on
      // screen in both places keeps its own params, so none of those changed.
      return false;
    }

    return inner(args);
  };
}

function noSharedParamChanged(
  currentParams: Record<string, string | undefined>,
  nextParams: Record<string, string | undefined>,
): boolean {
  for (const [key, value] of Object.entries(currentParams)) {
    if (key in nextParams && nextParams[key] !== value) {
      return false;
    }
  }
  return true;
}

function urlWithoutHash(url: URL): string {
  return `${url.pathname}${url.search}`;
}

/**
 * The filters of a panel, as a zod object. Each key is a filter - written in
 * the URL in kebab-case, so `groupVisibility` is `panel[group-visibility]` -
 * and each value a schema which parses the filter from its string in the
 * URL: an enum, a string, `sectionFilterBoolean`, or an array of those for a
 * filter which takes many values (which is then repeated in the URL).
 *
 * Values are written back with `String(value)`, so whatever a schema outputs
 * must parse back to itself from that. Anything in the URL a schema refuses
 * is dropped, and the filter falls back to its default.
 *
 * A filter's default is the schema's own (`.default(...)`, `.nullable()` or
 * `.optional()`), or else one given at the time of reading - for defaults
 * which depend on the workspace or the screen. Defaults aren't written to the
 * URL.
 */
export type SectionFiltersShape = Record<
  string,
  z.ZodType<unknown, z.ZodTypeDef, SectionFilterInput>
>;
export type SectionFiltersSchema = z.ZodObject<SectionFiltersShape>;
type SectionFilterInput = string | Array<string> | null | undefined;

/** A yes/no filter, kept in the URL as `true` or `false`. */
export const sectionFilterBoolean = z
  .enum(["true", "false"])
  .transform((value) => value === "true");

export type SectionFilters<S extends SectionFiltersSchema> = z.output<S>;

/** Reads the filters of a panel out of a query string. */
export function readSectionFilters<S extends SectionFiltersSchema>(
  search: URLSearchParams,
  panelId: string,
  schema: S,
  defaults?: Partial<SectionFilters<S>>,
): SectionFilters<S> {
  const result: Record<string, unknown> = {};

  for (const [key, field] of Object.entries(schema.shape)) {
    const param = sectionFilterParam(panelId, filterNameOf(key));
    const fallback = defaultOf(key, field, defaults);
    const element = arrayElementOf(field);

    if (element !== undefined) {
      const values: Array<unknown> = [];
      for (const raw of search.getAll(param)) {
        const parsed = element.safeParse(raw);
        if (parsed.success && !values.includes(parsed.data)) {
          values.push(parsed.data);
        }
      }
      result[key] = values.length > 0 ? values : fallback;
    } else {
      const raw = search.get(param);
      const parsed = raw === null ? undefined : field.safeParse(raw);
      result[key] =
        parsed !== undefined && parsed.success && parsed.data !== undefined
          ? parsed.data
          : fallback;
    }
  }

  return result as SectionFilters<S>;
}

/**
 * Writes some of the filters of a panel into a query string, leaving every
 * other param as it was. A filter set to its default is taken out.
 */
export function writeSectionFilters<S extends SectionFiltersSchema>(
  search: URLSearchParams,
  panelId: string,
  schema: S,
  update: Partial<SectionFilters<S>>,
  defaults?: Partial<SectionFilters<S>>,
): URLSearchParams {
  const result = new URLSearchParams(search);

  for (const [key, value] of Object.entries(update)) {
    const field = schema.shape[key];
    if (field === undefined) {
      continue;
    }
    const param = sectionFilterParam(panelId, filterNameOf(key));
    const fallback = defaultOf(key, field, defaults);
    result.delete(param);

    if (arrayElementOf(field) !== undefined) {
      const values = (value ?? []) as Array<unknown>;
      if (!sameValues(values, fallback as Array<unknown> | undefined)) {
        for (const item of values) {
          result.append(param, String(item));
        }
      }
    } else if (value !== fallback && value !== null && value !== undefined) {
      result.set(param, String(value));
    }
  }

  return result;
}

function filterNameOf(key: string): string {
  return key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
}

function defaultOf(
  key: string,
  field: z.ZodTypeAny,
  defaults: Record<string, unknown> | undefined,
): unknown {
  if (defaults !== undefined && key in defaults) {
    return defaults[key];
  }
  const parsed = field.safeParse(undefined);
  if (parsed.success) {
    return parsed.data;
  }
  // A nullable filter has "nothing chosen" - null - as its default.
  const parsedNull = field.safeParse(null);
  if (parsedNull.success) {
    return parsedNull.data;
  }
  throw new Error(`Section filter "${key}" has no default`);
}

// The element schema of a filter which takes many values, if it's one.
function arrayElementOf(field: z.ZodTypeAny): z.ZodTypeAny | undefined {
  let current: z.ZodTypeAny = field;
  for (;;) {
    if (current instanceof z.ZodArray) {
      return current.element;
    } else if (current instanceof z.ZodDefault) {
      current = current._def.innerType;
    } else if (
      current instanceof z.ZodOptional ||
      current instanceof z.ZodNullable
    ) {
      current = current.unwrap();
    } else {
      return undefined;
    }
  }
}

function sameValues(a: Array<unknown>, b: Array<unknown> | undefined): boolean {
  if (b === undefined) {
    return a.length === 0;
  }
  return a.length === b.length && a.every((value, i) => value === b[i]);
}
