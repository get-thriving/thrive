import { OS_COLOR_SCHEME_COOKIE_NAME } from "#/core/infra/names";
import type { StrataColorScheme } from "#/core/infra/component/strata-tokens";

/**
 * The color scheme the device last said it prefers, which a script on the page
 * keeps in a cookie. It lets the server draw the right one for a user who
 * follows the device, as it can't ask it. Null until the first visit has been
 * seen.
 */
export function readOsColorScheme(
  cookieHeader: string | null,
): StrataColorScheme | null {
  if (cookieHeader === null) {
    return null;
  }
  const match = cookieHeader.match(
    new RegExp(`(?:^|; )${OS_COLOR_SCHEME_COOKIE_NAME}=(dark|light)`),
  );
  return match === null ? null : (match[1] as StrataColorScheme);
}
