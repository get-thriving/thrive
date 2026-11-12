import { useEffect, useState } from "react";

import {
  STRATA_QUIET_KEYS_CONTEXT,
  strataKeysContextFromPage,
} from "#/core/infra/component/layout/strata-keys-context-from-page";
import type { StrataPlacedSlot } from "#/core/infra/strata/strata-layout-for";
import type { StrataKeysContext } from "#/core/infra/strata/strata-keys-context";

/** How long the page has to be still before it is read again. */
const SETTLE_MS = 30;

function sameContext(a: StrataKeysContext, b: StrataKeysContext): boolean {
  return (
    a.overlay === b.overlay &&
    a.typing === b.typing &&
    a.focus === b.focus &&
    a.columns === b.columns &&
    a.split === b.split &&
    a.sections === b.sections &&
    a.items === b.items &&
    a.targets === b.targets
  );
}

/**
 * What decides which keys work right now, kept up to date as the page changes.
 * It is the quiet context until the first read, so the server render and the
 * first one in the browser agree.
 *
 * The page changes in ways with no event of their own: a list loads, a section
 * collapses, an overlay comes up. So besides the focus moving, it watches the
 * page for added or removed nodes and for the attributes that show, hide or
 * focus a column, and reads again once things have settled for a moment. A
 * timer, not an animation frame: a page that is not being painted, such as one
 * in a background tab, never gets its frame, and the footer would go on saying
 * what it said.
 */
export function useStrataKeysContext(
  slots: readonly StrataPlacedSlot[],
): StrataKeysContext {
  const [context, setContext] = useState(STRATA_QUIET_KEYS_CONTEXT);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    function read() {
      timer = undefined;
      const next = strataKeysContextFromPage(slots);
      setContext((current) => (sameContext(current, next) ? current : next));
    }
    function schedule() {
      if (timer === undefined) {
        timer = setTimeout(read, SETTLE_MS);
      }
    }
    read();
    const observer = new MutationObserver(schedule);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: [
        "class",
        "hidden",
        "aria-hidden",
        "data-focused",
        "data-folded",
        "data-peek",
      ],
    });
    document.addEventListener("focusin", schedule);
    document.addEventListener("focusout", schedule);
    return () => {
      observer.disconnect();
      document.removeEventListener("focusin", schedule);
      document.removeEventListener("focusout", schedule);
      clearTimeout(timer);
    };
  }, [slots]);

  return context;
}
