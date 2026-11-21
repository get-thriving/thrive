import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router";

import { strataItemPath } from "#/core/infra/component/layout/strata-item-path";
import {
  strataParentPath,
  strataPosition,
} from "#/core/infra/strata/strata-position";

/**
 * Makes the open item follow the selection of a list (ADR 0021): while `j` and
 * `k` move through the items of a list, if one of them is open in the column
 * after it, that column shows the item the selection moves to, as `o` and `p`
 * in it would. Nothing happens when none of the list's items is open, so moving
 * through a list opens nothing by itself; `↵` is what opens.
 *
 * The item replaces the open one in the history, so a walk through a list is
 * not a walk through the browser's back. The query string stays as it is. Only
 * items of the open one's own collection are followed, not those of another
 * kind in the same list. An item that says it is not to be followed
 * (`data-strata-follow="false"`) is only selected.
 */
export function useStrataFollowItem(): (
  items: readonly HTMLElement[],
  target: HTMLElement,
) => void {
  const navigate = useNavigate();
  const { pathname, search } = useLocation();

  return useCallback(
    (items, target) => {
      const targetPath = strataItemPath(target);
      if (targetPath === null || target.dataset.strataFollow === "false") {
        return;
      }
      const paths = items
        .map((item) => strataItemPath(item))
        .filter((path): path is string => path !== null);
      const open = strataPosition(paths, pathname);
      // Only to an item of the same collection as the open one: a list that
      // shows more than one kind of thing has the open item stay where it is
      // while the selection goes past another kind.
      if (
        open === null ||
        targetPath === pathname ||
        strataParentPath(targetPath) !== strataParentPath(paths[open.index])
      ) {
        return;
      }
      void navigate({ pathname: targetPath, search }, { replace: true });
    },
    [navigate, pathname, search],
  );
}
