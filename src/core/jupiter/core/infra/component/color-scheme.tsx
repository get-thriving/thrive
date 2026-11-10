import { useSyncExternalStore } from "react";

import { OS_NIGHT_MODE_COOKIE_NAME } from "#/core/infra/names";
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

export function htmlColorSchemeStyle(useNightMode: boolean) {
  return {
    colorScheme: useNightMode ? "dark" : "light",
    backgroundColor: useNightMode ? MUI_DARK_BACKGROUND : MUI_LIGHT_BACKGROUND,
  };
}

/** Paints html background and color-scheme before React hydrates, from the OS. */
export function ApplyColorSchemeScript() {
  const script = `(function(){
  var osNight = window.matchMedia("(prefers-color-scheme: dark)").matches;
  var root = document.documentElement;
  root.style.colorScheme = osNight ? "dark" : "light";
  root.style.backgroundColor = osNight ? "${MUI_DARK_BACKGROUND}" : "${MUI_LIGHT_BACKGROUND}";
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
