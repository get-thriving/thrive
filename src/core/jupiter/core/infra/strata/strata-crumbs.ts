import type { StrataCrumb } from "#/core/infra/strata/strata-crumb";
import { strataLabelOf } from "#/core/infra/strata/strata-label-of";
import { strataMatchLabel } from "#/core/infra/strata/strata-match-label";
import { strataLastSegment } from "#/core/infra/strata/strata-last-segment";
import { strataLevelOf } from "#/core/infra/strata/strata-level-of";

/** What the crumbs need of a matched route (`useMatches`). */
export interface StrataCrumbMatch {
  id: string;
  pathname: string;
  params: Readonly<Record<string, string | undefined>>;
  loaderData: unknown;
  handle: unknown;
}

function labelOf(match: StrataCrumbMatch): string {
  // A route whose label cannot be said yet (it threw, or has not loaded) is
  // still a part of the path: it shows what it ends with.
  return strataMatchLabel(match) ?? (strataLastSegment(match.pathname) || "…");
}

/**
 * The path of the top bar (ADR 0021), as the routes that matched give it: one
 * part for each that has a label, in the order of the path, with the label it
 * says (or works out of what it loaded). A part belongs to the first open panel
 * at or after its route, so the one that is a panel is its own and the rest go
 * to the next; one past the last panel goes to the last. Routes with no label
 * are layout and have no part.
 */
export function strataCrumbs(
  matches: readonly StrataCrumbMatch[],
): StrataCrumb[] {
  // The place of each match among the panels, or -1 when it is none.
  let panels = 0;
  const panelOf = matches.map((match) =>
    strataLevelOf(match.handle) !== null ? panels++ : -1,
  );
  return matches.flatMap((match, index) => {
    if (strataLabelOf(match.handle) === null) {
      return [];
    }
    const next = panelOf.slice(index).find((panel) => panel >= 0);
    return [
      {
        id: match.id,
        label: labelOf(match),
        owner: next ?? panels - 1,
      },
    ];
  });
}
