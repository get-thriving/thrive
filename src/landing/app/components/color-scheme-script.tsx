/**
 * Puts the device's color scheme on the page before it is first drawn, and
 * keeps it there if the device changes. The page has no user, so, as the
 * published pages do (ADR 0019), it follows the device. Unlike the app's
 * version it keeps nothing in a cookie: with no server there is no one to read
 * it, and a page that sets none needs no notice.
 */
export function ColorSchemeScript() {
  const script = `(function(){
  var query = window.matchMedia("(prefers-color-scheme: dark)");
  function apply() {
    document.documentElement.setAttribute("data-color-scheme", query.matches ? "dark" : "light");
  }
  apply();
  query.addEventListener("change", apply);
})();`;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
