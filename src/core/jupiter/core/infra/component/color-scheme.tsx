import { useSyncExternalStore } from "react";

import {
  NIGHT_MODE_COOKIE_NAME,
  OS_NIGHT_MODE_COOKIE_NAME,
  UI_STYLE_COOKIE_NAME,
} from "#/core/infra/names";
import { STRATA_APP_BACKGROUND } from "#/core/infra/component/strata-theme";
import {
  APP_BACKGROUND_DARK,
  APP_BACKGROUND_LIGHT,
} from "#/core/infra/component/theme";

export const MUI_LIGHT_BACKGROUND = APP_BACKGROUND_LIGHT;
export const MUI_DARK_BACKGROUND = APP_BACKGROUND_DARK;

function subscribeToSystemNightMode(onStoreChange: () => void) {
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

function getSystemNightMode() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

/** Live OS night/day preference; `serverHint` is used for SSR (cookie). */
export function useSystemNightMode(serverHint: boolean | null): boolean {
  return useSyncExternalStore(
    subscribeToSystemNightMode,
    getSystemNightMode,
    () => serverHint ?? false,
  );
}

export function htmlColorSchemeStyle(
  useNightMode: boolean,
  isStrata: boolean = false,
) {
  return {
    colorScheme: useNightMode ? "dark" : "light",
    backgroundColor: isStrata
      ? STRATA_APP_BACKGROUND
      : useNightMode
        ? MUI_DARK_BACKGROUND
        : MUI_LIGHT_BACKGROUND,
  };
}

/**
 * Paints html background and color-scheme before React hydrates.
 * In the workspace, prefers the user night-mode cookie; otherwise OS.
 */
export function ApplyColorSchemeScript() {
  const script = `(function(){
  var inWorkspace = location.pathname === "/app/workspace" || location.pathname.indexOf("/app/workspace/") === 0;
  var userMatch = document.cookie.match(/(?:^|; )${NIGHT_MODE_COOKIE_NAME}=(true|false)/);
  var osNight = window.matchMedia("(prefers-color-scheme: dark)").matches;
  // The cookie holds base64 JSON (see ui-style.server.ts), e.g. "strata".
  var strata = false;
  try {
    var uiMatch = document.cookie.match(/(?:^|; )${UI_STYLE_COOKIE_NAME}=([^;]*)/);
    strata = inWorkspace && uiMatch !== null && JSON.parse(atob(decodeURIComponent(uiMatch[1]))) === "strata";
  } catch (e) {}
  var night = strata || (inWorkspace && userMatch ? userMatch[1] === "true" : osNight);
  var root = document.documentElement;
  root.style.colorScheme = night ? "dark" : "light";
  root.style.backgroundColor = strata ? "${STRATA_APP_BACKGROUND}" : night ? "${MUI_DARK_BACKGROUND}" : "${MUI_LIGHT_BACKGROUND}";
  document.cookie = "${OS_NIGHT_MODE_COOKIE_NAME}=" + (osNight ? "true" : "false") + "; Path=/; Max-Age=31536000; SameSite=Lax";
})();`;

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `html{background-color:${MUI_LIGHT_BACKGROUND}}@media(prefers-color-scheme:dark){html{background-color:${MUI_DARK_BACKGROUND}}}`,
        }}
      />
      <script dangerouslySetInnerHTML={{ __html: script }} />
    </>
  );
}
