import { HydratedRouter } from "react-router/dom";
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

// Remove all elements added by extensions of various sorts, or by
// playwrights infra. This is necessary because we don't want to
// cause hydration mismatches.
// The rabbit hole goes deep: https://github.com/facebook/react/issues/24430

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
    // We're handling some sort of React hydration error because of
    // mismatches in SSR and client-side rendering. These mostly occur
    // because of the many time manipulations we do client-side. Which
    // might differ from what's happening server-side, if we're not careful
    // or even if there's noticeable clock skew between the client's
    // machine and the server.
    // If this happens, React Router tends to crash hard - styles are messed up.
    // To prevent this we force a client-side reload to a very safe page. Which
    // then does a React Router reload to the final page. We're gonna log this
    // at some point.

    if (window.location.pathname.startsWith("/app/render-fix")) {
      return true; // We're already on the render fix page, so we don't need to do anything.
    }

    // `search` carries its own "?" already.
    const destUrl = encodeRenderFixReturnTo(
      `${window.location.pathname}${window.location.search}`,
    );
    window.location.replace(`/app/render-fix?returnTo=${destUrl}`);
    return true;
  }

  return false;
};

if (window.requestIdleCallback) {
  window.requestIdleCallback(hydrate);
} else {
  // Safari doesn't support requestIdleCallback
  // https://caniuse.com/requestidlecallback
  window.setTimeout(hydrate, 1);
}
