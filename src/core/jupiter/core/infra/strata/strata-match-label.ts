import { strataLabelOf } from "#/core/infra/strata/strata-label-of";

/** What a route's label is worked out from (a matched route, `useMatches`). */
export interface StrataLabelMatch {
  pathname: string;
  params: Readonly<Record<string, string | undefined>>;
  loaderData: unknown;
  handle: unknown;
}

/**
 * The label a matched route says for its panel, or null when it says none or
 * cannot say it yet (its function threw, or its data has not loaded).
 */
export function strataMatchLabel(match: StrataLabelMatch): string | null {
  const label = strataLabelOf(match.handle);
  if (label === null) {
    return null;
  }
  const resolved =
    typeof label === "function"
      ? label({
          loaderData: match.loaderData,
          pathname: match.pathname,
          params: match.params,
        })
      : label;
  const text = resolved?.trim() ?? "";
  return text !== "" ? text : null;
}
