import { HydratedRouter } from "react-router/dom";
import { PUBLISHED_ROUTE_PREFIX } from "@jupiter/core/common/sub/publish/published-share-url";
import { encodeRenderFixReturnTo } from "@jupiter/core/infra/render-fix-return-to";
import { StrictMode, startTransition } from "react";
import { hydrateRoot } from "react-dom/client";

function hydrate() {
  startTransition(() => {
    hydrateRoot(
      document,
      <StrictMode>
        <HydratedRouter />
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
    // `search` carries its own "?" already.
    const destUrl = encodeRenderFixReturnTo(
      `${window.location.pathname}${window.location.search}`,
    );
    // A raw browser navigation, so unlike a router link this has to carry the
    // basename itself.
    window.location.replace(
      `${PUBLISHED_ROUTE_PREFIX}/render-fix?returnTo=${destUrl}`,
    );
    return true;
  }

  return false;
};

if (window.requestIdleCallback) {
  window.requestIdleCallback(hydrate);
} else {
  window.setTimeout(hydrate, 1);
}
