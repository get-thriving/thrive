/**
 * Where the columns start from the top: below the app bar. On a phone the
 * workspace sets `--strata-columns-top`, as its bar is a different height and
 * has a strip under it.
 */
export const STRATA_COLUMNS_TOP =
  "var(--strata-columns-top, calc(env(safe-area-inset-top) + 4rem))";

/** The height of the phone's app bar, which is a plain toolbar. */
export const STRATA_PHONE_BAR_HEIGHT_PX = 56;

/** The height of the strip under the phone's app bar. */
export const STRATA_PHONE_STRIP_HEIGHT_PX = 28;
