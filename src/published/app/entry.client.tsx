import { RemixBrowser } from "@remix-run/react";
import { Buffer } from "buffer-polyfill";
import { StrictMode, startTransition } from "react";
import { hydrateRoot } from "react-dom/client";

function hydrate() {
  startTransition(() => {
    hydrateRoot(
      document,
      <StrictMode>
        <RemixBrowser />
      </StrictMode>,
    );
  });
}

document
  .querySelectorAll(
    [
      "html > *:not(body, head)",
      'script[src*="extension://"]',
      'link[href*="extension://"]',
    ].join(", "),
  )
  .forEach((s) => {
    s.parentNode?.removeChild(s);
  });

window.onerror = (event: Event | string) => {
  if (
    typeof event === "string" &&
    (event.indexOf("Hydration failed") !== -1 ||
      event.indexOf("Minified React error") !== -1)
  ) {
    const destUrl = Buffer.from(
      `${window.location.pathname}?${window.location.search}`,
      "utf-8",
    ).toString("base64");
    window.location.replace(`/render-fix?returnTo=${destUrl}`);
    return true;
  }

  return false;
};

if (window.requestIdleCallback) {
  window.requestIdleCallback(hydrate);
} else {
  window.setTimeout(hydrate, 1);
}
