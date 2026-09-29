import { useCallback, useMemo } from "react";
import { useLocation, useResolvedPath, useSearchParams } from "react-router";

import {
  sectionFilterParam,
  withSectionFiltersPreserved,
} from "#/core/infra/section-filters";

/**
 * How a filter's values are written into, and read back from, the URL.
 */
export interface SectionFilterCodec<K> {
  encode: (value: K) => string;
  // Returns undefined for anything the filter doesn't know, which is dropped.
  decode: (raw: string) => K | undefined;
}

/** Plain strings, like entity ref ids. */
export const stringFilterCodec: SectionFilterCodec<string> = {
  encode: (value) => value,
  decode: (raw) => raw,
};

export const booleanFilterCodec: SectionFilterCodec<boolean> = {
  encode: (value) => (value ? "true" : "false"),
  decode: (raw) =>
    raw === "true" ? true : raw === "false" ? false : undefined,
};

// Codecs are made once per enum, so building one while rendering is cheap and
// hands out the same codec - and so the same filter values - every time.
const ENUM_CODECS = new WeakMap<object, unknown>();

/** One of a known set of string values - usually the values of an enum. */
export function enumFilterCodec<K extends string>(
  values: ReadonlyArray<K> | Record<string, K>,
): SectionFilterCodec<K> {
  const cached = ENUM_CODECS.get(values);
  if (cached !== undefined) {
    return cached as SectionFilterCodec<K>;
  }
  const known = new Set<string>(
    Array.isArray(values) ? values : Object.values(values),
  );
  const codec: SectionFilterCodec<K> = {
    encode: (value) => value,
    decode: (raw) => (known.has(raw) ? (raw as K) : undefined),
  };
  ENUM_CODECS.set(values, codec);
  return codec;
}

/**
 * A codec for filters where `null` stands for "all" - which is the default,
 * and so never written to the URL.
 */
export function nullableFilterCodec<K>(
  inner: SectionFilterCodec<K>,
): SectionFilterCodec<K | null> {
  const cached = NULLABLE_CODECS.get(inner);
  if (cached !== undefined) {
    return cached as SectionFilterCodec<K | null>;
  }
  const codec: SectionFilterCodec<K | null> = {
    encode: (value) => (value === null ? "" : inner.encode(value)),
    decode: (raw) => inner.decode(raw),
  };
  NULLABLE_CODECS.set(inner, codec);
  return codec;
}

const NULLABLE_CODECS = new WeakMap<object, unknown>();

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
 * A filter which takes a single value, kept in the URL under
 * `panelId[filterName]`. The default isn't written to the URL.
 */
export function useSectionFilterOne<K>(
  panelId: string,
  filterName: string,
  defaultValue: K,
  codec: SectionFilterCodec<K>,
): [K, (value: K) => void] {
  useRegisterPanel(panelId);
  const [searchParams, setSearchParams] = useSearchParams();
  const param = sectionFilterParam(panelId, filterName);

  const raw = searchParams.get(param);
  const decoded = raw === null ? undefined : codec.decode(raw);
  const value = decoded === undefined ? defaultValue : decoded;

  const setValue = useCallback(
    (next: K) => {
      setSearchParams((prev) => {
        const result = new URLSearchParams(prev);
        result.delete(param);
        if (next !== defaultValue) {
          result.set(param, codec.encode(next));
        }
        return result;
      }, NAVIGATE_OPTIONS);
    },
    [setSearchParams, param, defaultValue, codec],
  );

  return [value, setValue];
}

/**
 * A filter which takes any number of values, kept in the URL as repeated
 * `panelId[filterName]` params. No values - the default - means no params.
 */
export function useSectionFilterMany<K>(
  panelId: string,
  filterName: string,
  codec: SectionFilterCodec<K>,
): [Array<K>, (values: Array<K>) => void] {
  useRegisterPanel(panelId);
  const [searchParams, setSearchParams] = useSearchParams();
  const param = sectionFilterParam(panelId, filterName);

  const rawValues = searchParams.getAll(param);
  const rawKey = rawValues.join("\u0000");
  const values = useMemo(
    () => {
      const result: Array<K> = [];
      for (const raw of rawValues) {
        const decoded = codec.decode(raw);
        if (decoded !== undefined && !result.includes(decoded)) {
          result.push(decoded);
        }
      }
      return result;
    },
    // The values are only new when what's in the URL is.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rawKey, codec],
  );

  const setValues = useCallback(
    (next: Array<K>) => {
      setSearchParams((prev) => {
        const result = new URLSearchParams(prev);
        result.delete(param);
        for (const value of next) {
          result.append(param, codec.encode(value));
        }
        return result;
      }, NAVIGATE_OPTIONS);
    },
    [setSearchParams, param, codec],
  );

  return [values, setValues];
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
