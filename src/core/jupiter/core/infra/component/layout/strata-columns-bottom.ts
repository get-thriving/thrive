/**
 * Where the columns end from the bottom: above the key-hint footer, and above
 * the banner a build that is not the production one puts along the bottom.
 * Each of the two sets the custom property for its own height, so the columns
 * need not know whether they are there.
 */
export const STRATA_COLUMNS_BOTTOM =
  "calc(var(--env-banner-height, 0px) + var(--strata-footer-height, 0px))";
