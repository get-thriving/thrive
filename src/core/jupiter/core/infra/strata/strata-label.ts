/** What a route's label can be worked out from. */
export interface StrataLabelInput {
  /** What the route's loader returned; undefined while it has not, or threw. */
  loaderData: unknown;
  /** The url the route matched, which ends with its own part. */
  pathname: string;
  params: Readonly<Record<string, string | undefined>>;
}

/**
 * What a route calls its panel in the breadcrumb and the page name of the top
 * bar (ADR 0021): a fixed text for a page that is always the same, or a
 * function of what the route loaded for one that is a particular entity. A
 * function that cannot say, because the data is not there, gives null. Routes
 * put it on their `handle`, next to `displayType`.
 */
export type StrataLabel = string | ((input: StrataLabelInput) => string | null);
