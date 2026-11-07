import { useCallback, useState } from "react";
import { useFetcher } from "react-router";

import { useExpandedRailPreference } from "#/core/infra/component/use-expanded-rail-preference";

/**
 * The Strata rail's expanded state, kept in step with the user's setting.
 *
 * The state is local so the rail answers a click at once: the root loader does
 * not revalidate after the save, and the account page, which also changes the
 * setting, reloads the whole document.
 */
export function useExpandedRail(): [boolean, () => void] {
  const saved = useExpandedRailPreference();
  const [expanded, setExpanded] = useState(saved);
  const fetcher = useFetcher();

  const toggle = useCallback(() => {
    const next = !expanded;
    setExpanded(next);
    fetcher.submit(
      { intent: "set-expanded-rail", useExpandedRail: String(next) },
      { method: "post", action: "/app/workspace/account" },
    );
  }, [expanded, fetcher]);

  return [expanded, toggle];
}
