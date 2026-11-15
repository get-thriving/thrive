import { useSyncExternalStore } from "react";
import { ColorScheme } from "@jupiter/webapi-client";

import type { StrataColorScheme } from "#/core/infra/component/strata-tokens";

const QUERY = "(prefers-color-scheme: dark)";

function subscribe(onChange: () => void) {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

/**
 * The scheme the app is drawn in: the one the user picked, or the device's.
 * The server hints at the device's, from what it saw last, and a device that
 * changes its mind takes effect at once.
 */
export function useColorScheme(
  preference: ColorScheme,
  deviceHint: StrataColorScheme | null,
): StrataColorScheme {
  const device = useSyncExternalStore<StrataColorScheme>(
    subscribe,
    () => (window.matchMedia(QUERY).matches ? "dark" : "light"),
    () => deviceHint ?? "dark",
  );
  if (preference === ColorScheme.LIGHT) {
    return "light";
  }
  if (preference === ColorScheme.DARK) {
    return "dark";
  }
  return device;
}
