import type { StrataCrumb } from "#/core/infra/strata/strata-crumb";

export interface StrataPhoneTitle {
  /** The line above the title: where it is under, in mono. */
  trail: string;
  title: string;
}

const ROOT_TRAIL = "thrive /";

/**
 * What the phone's top bar says for the path (ADR 0021): the label of the last
 * part, with the one before it above, so `Habits` over `Buy milk`. The routes
 * supply the labels; the home page has none.
 */
export function strataPhoneTitle(
  crumbs: readonly StrataCrumb[],
): StrataPhoneTitle {
  const last = crumbs[crumbs.length - 1];
  if (last === undefined) {
    return { trail: ROOT_TRAIL, title: "Home" };
  }
  const before = crumbs[crumbs.length - 2];
  return {
    trail: before === undefined ? ROOT_TRAIL : `${before.label} /`,
    title: last.label,
  };
}
