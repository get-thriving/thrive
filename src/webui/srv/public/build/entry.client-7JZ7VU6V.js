import {
  require_client
} from "/build/_shared/chunk-2PVEFZQQ.js";
import {
  require_buffer_polyfill
} from "/build/_shared/chunk-FUGZILJZ.js";
import {
  jsxDEV
} from "/build/_shared/chunk-CPHZSOF3.js";
import "/build/_shared/chunk-2LCIGNNS.js";
import {
  RemixBrowser
} from "/build/_shared/chunk-VVGD4GL7.js";
import "/build/_shared/chunk-V5CWULKU.js";
import {
  require_react
} from "/build/_shared/chunk-V6BBPW4V.js";
import "/build/_shared/chunk-JFC3UFZQ.js";
import {
  createHotContext
} from "/build/_shared/chunk-YEGFXV2Z.js";
import "/build/_shared/chunk-ZIPKILLR.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// app/entry.client.tsx
var import_buffer_polyfill = __toESM(require_buffer_polyfill());
var import_react2 = __toESM(require_react());
var import_client = __toESM(require_client());
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/entry.client.tsx"
  );
  import.meta.hot.lastModified = "1775685113109.8408";
}
function hydrate() {
  (0, import_react2.startTransition)(() => {
    (0, import_client.hydrateRoot)(
      document,
      /* @__PURE__ */ jsxDEV(import_react2.StrictMode, { children: /* @__PURE__ */ jsxDEV(RemixBrowser, {}, void 0, false, {
        fileName: "app/entry.client.tsx",
        lineNumber: 22,
        columnNumber: 9
      }, this) }, void 0, false, {
        fileName: "app/entry.client.tsx",
        lineNumber: 21,
        columnNumber: 7
      }, this)
    );
  });
}
document.querySelectorAll(
  [
    "html > *:not(body, head)",
    'script[src*="extension://"]',
    'link[href*="extension://"]'
  ].join(", ")
).forEach((s) => {
  s.parentNode?.removeChild(s);
});
window.onerror = (event) => {
  if (typeof event === "string" && (event.indexOf("Hydration failed") !== -1 || event.indexOf("Minified React error") !== -1)) {
    if (window.location.pathname.startsWith("/app/render-fix")) {
      return true;
    }
    const destUrl = import_buffer_polyfill.Buffer.from(
      `${window.location.pathname}?${window.location.search}`,
      "utf-8"
    ).toString("base64");
    window.location.replace(`/app/render-fix?returnTo=${destUrl}`);
    return true;
  }
  return false;
};
if (window.requestIdleCallback) {
  window.requestIdleCallback(hydrate);
} else {
  window.setTimeout(hydrate, 1);
}
//# sourceMappingURL=/build/entry.client-7JZ7VU6V.js.map
