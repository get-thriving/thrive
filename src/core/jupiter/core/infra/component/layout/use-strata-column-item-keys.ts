import { useEffect } from "react";
import type { RefObject } from "react";

import { isTypingTarget } from "#/core/infra/component/layout/is-typing-target";
import { strataItemKey } from "#/core/infra/component/layout/strata-item-key";
import { strataOpenItem } from "#/core/infra/component/layout/strata-open-item";
import { strataSectionItems } from "#/core/infra/component/layout/strata-section-items";
import { strataStackKeyAction } from "#/core/infra/strata/strata-stack-key";

/**
 * Item mode for a column that has no stack of sections, such as a trunk: its
 * list is the column's own. While the column has the focus, `e`, `j` and `k` go
 * into the list, to the first item (`k` to the last), and then `j` and `k` move
 * between the items, `↵` opens the one with the focus, and `↵` on the column
 * itself opens the first. `Escape` goes back up to the column, as for a section
 * (ADR 0021). A column whose items sit in sections is the stack's, not this.
 *
 * `inside` is any element in the column; the column is the nearest one around
 * it.
 */
export function useStrataColumnItemKeys(
  inside: RefObject<HTMLElement | null>,
): void {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const action = strataStackKeyAction(event, isTypingTarget(event.target));
      if (action === null) {
        return;
      }
      const column =
        inside.current?.closest<HTMLElement>("[data-strata-column]") ?? null;
      if (column === null) {
        return;
      }
      // A column alone on the screen is not marked as focused (there is
      // nothing to tell it from), but the keys are for it all the same.
      const alone =
        document.querySelectorAll("[data-strata-column]").length === 1;
      if (column.dataset.focused !== "true" && !alone) {
        return;
      }
      if (strataItemKey(event, action, column, "column")) {
        return;
      }
      // `↵` on the column itself, with nothing else to go into: its first item.
      if (action === "open" && document.activeElement === column) {
        const first = strataSectionItems(column)[0];
        if (first !== undefined) {
          event.preventDefault();
          strataOpenItem(first);
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [inside]);
}
