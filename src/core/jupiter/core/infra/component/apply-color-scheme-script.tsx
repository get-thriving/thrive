import { OS_COLOR_SCHEME_COOKIE_NAME } from "#/core/infra/names";

/**
 * Puts the device's color scheme on the page before it is first drawn, for a
 * user who follows the device, and keeps it in a cookie so the server knows it
 * the next time. A user who picked a scheme has it from the server already.
 */
export function ApplyColorSchemeScript(props: { followDevice: boolean }) {
  const script = `(function(){
  var dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (${props.followDevice ? "true" : "false"}) {
    document.documentElement.setAttribute("data-color-scheme", dark ? "dark" : "light");
  }
  document.cookie = "${OS_COLOR_SCHEME_COOKIE_NAME}=" + (dark ? "dark" : "light") + "; Path=/; Max-Age=31536000; SameSite=Lax";
})();`;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
