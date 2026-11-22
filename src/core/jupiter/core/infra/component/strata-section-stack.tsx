import { useCallback, useContext, useEffect, useMemo, useRef } from "react";
import type { PropsWithChildren } from "react";

import { useStrataColumnKey } from "#/core/infra/component/layout/strata-column-key-context";
import { StrataColumnsContext } from "#/core/infra/component/layout/strata-columns-context";
import { StrataSectionsContext } from "#/core/infra/component/strata-sections-context";
import { isTypingTarget } from "#/core/infra/component/layout/is-typing-target";
import { strataScrollColumn } from "#/core/infra/component/layout/strata-scroll-column";
import { strataEnterName } from "#/core/infra/component/layout/strata-enter-name";
import { strataEnterEditable } from "#/core/infra/component/layout/strata-enter-editable";
import { strataItemKey } from "#/core/infra/component/layout/strata-item-key";
import { strataResumeNavPosition } from "#/core/infra/component/layout/strata-nav-position";
import {
  strataSectionCollapsible,
  strataSectionSplittable,
} from "#/core/infra/component/layout/strata-section-actions";
import { strataOpenItem } from "#/core/infra/component/layout/strata-open-item";
import { strataSectionItems } from "#/core/infra/component/layout/strata-section-items";
import { useStrataAfterOpen } from "#/core/infra/component/layout/use-strata-after-open";
import { STRATA_SECTION_FILTERS } from "#/core/infra/component/strata-section-filters";
import { useSectionFilters } from "#/core/infra/component/use-section-filter";
import { isStrataCollapseKey } from "#/core/infra/strata/strata-collapse-key";
import { strataSplitKey } from "#/core/infra/strata/strata-columns-with-splits";
import {
  strataSectionCollapsed,
  strataToggleSectionCollapsed,
} from "#/core/infra/strata/strata-section-collapse";
import { useStrataKeyBindings } from "#/core/infra/component/use-strata-key-bindings";
import { strataSplitKeyAction } from "#/core/infra/strata/strata-split-key";
import {
  strataNextSection,
  strataStackKeyAction,
} from "#/core/infra/strata/strata-stack-key";

interface StrataSectionStackProps {
  /** The panel id of the column the sections are in (ADR 0014). */
  panelId: string;
  /** The header of the column has room for the first section's controls. */
  lendsToHeader?: boolean;
}

/**
 * Sections of one subject, one under another. It keeps which of them are
 * collapsed, and which are split out into columns of their own, in the URL as
 * `panel-id[collapsed]=section-id` and `panel-id[split]=section-id`, and lets
 * `z` and `c` work on the one the focus is in while the column they are in has
 * the focus (and `⇧c` on a split column), and `j`, `k` and `↵` move between
 * them, and go into one: `↵` starts editing
 * its note, if it has one, and else opens the first item of its list. `e` goes
 * into the list instead, to its first item, and then `j` and `k` move between
 * the items and `↵` opens one; `Escape` goes back up to the section.
 */
export function StrataSectionStack(
  props: PropsWithChildren<StrataSectionStackProps>,
) {
  const { panelId } = props;
  const lendsToHeader = props.lendsToHeader === true;
  const [filters, setFilters] = useSectionFilters(
    panelId,
    STRATA_SECTION_FILTERS,
  );
  const columns = useContext(StrataColumnsContext);
  const parentKey = useStrataColumnKey();
  const { collapsed, expanded, split } = filters;
  const focusColumn = columns?.focusColumn;
  const lender = useRef<string | null>(null);
  const claimLend = useCallback((sectionId: string) => {
    lender.current ??= sectionId;
    return lender.current === sectionId;
  }, []);
  const afterOpen = useStrataAfterOpen();
  const keyBindings = useStrataKeyBindings();

  // A section that starts collapsed is open when it is in `expanded`, and one
  // that starts open is collapsed when it is in `collapsed`.
  const isCollapsed = useCallback(
    (sectionId: string, startsCollapsed: boolean) =>
      strataSectionCollapsed(
        { collapsed, expanded },
        sectionId,
        startsCollapsed,
      ),
    [collapsed, expanded],
  );
  const toggle = useCallback(
    (sectionId: string, startsCollapsed: boolean) => {
      setFilters(
        strataToggleSectionCollapsed(
          { collapsed, expanded },
          sectionId,
          startsCollapsed,
        ),
      );
    },
    [collapsed, expanded, setFilters],
  );

  // Splitting a section moves the focus to its column; taking it back moves
  // the focus to the column it came from.
  const setSplit = useCallback(
    (sectionId: string, on: boolean) => {
      setFilters({
        split: on
          ? [...split.filter((id) => id !== sectionId), sectionId]
          : split.filter((id) => id !== sectionId),
      });
      if (on) {
        focusColumn?.(strataSplitKey(sectionId));
      } else if (parentKey !== null) {
        focusColumn?.(parentKey);
      }
    },
    [split, setFilters, focusColumn, parentKey],
  );

  // The keys act on the sections of the column that has the focus, and only
  // those of this stack, not the ones of a column nested in it.
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const typing = isTypingTarget(event.target);
      const collapse = isStrataCollapseKey(event, typing, keyBindings);
      const splitAction = strataSplitKeyAction(event, typing, keyBindings);
      const stackAction = strataStackKeyAction(event, typing, keyBindings);
      if (!collapse && splitAction === null && stackAction === null) {
        return;
      }
      // A column alone on the screen is not marked as focused, but the keys
      // act on it all the same (ADR 0021).
      const column = document.querySelector<HTMLElement>(
        '[data-strata-column][data-focused="true"], [data-strata-column][data-alone="true"]',
      );
      if (column === null) {
        return;
      }
      const mine = Array.from(
        column.querySelectorAll<HTMLElement>("[data-strata-section]"),
      ).filter(
        (el) =>
          el.dataset.strataSectionPanel === panelId &&
          el.closest("[data-strata-column]") === column,
      );
      const active = document.activeElement;
      // Another column has the focus: its keys are its own, not those of a
      // stack that is open beside it.
      if (mine.length === 0) {
        return;
      }

      if (stackAction !== null) {
        // The sections themselves, not the split placeholders, in the order
        // they are on the page.
        // The first section, when its header is the column's, is not one of
        // them: the column is what is selected then, and it is the stop ahead
        // of the first of the others.
        const all = mine.filter(
          (el) => el.dataset.strataSectionSplit === undefined,
        );
        const sections = all.filter(
          (el) => el.dataset.strataSectionLent === undefined,
        );
        const lent = all.find(
          (el) => el.dataset.strataSectionLent !== undefined,
        );
        const current = sections.findIndex(
          (el) => active !== null && el.contains(active),
        );

        // The list the keys go through: the section the focus is in, or the one
        // section a split column holds, which has no focus of its own.
        const inSplit =
          column.dataset.strataSplit === undefined
            ? undefined
            : mine.find((el) => el.dataset.strataSectionSplit === "column");
        const scope =
          inSplit ??
          (current >= 0
            ? sections[current]
            : lent !== undefined && active !== null && lent.contains(active)
              ? lent
              : undefined);

        // With the focus on the column and not in a section, `e` goes into the
        // name of the entity, which is in the first section that has one.
        if (
          stackAction === "items" &&
          scope === undefined &&
          active === column &&
          all.some((section) => strataEnterName(section))
        ) {
          event.preventDefault();
          return;
        }

        // With the focus not in a section, but on the column, `j` and `k` go on
        // from where they had got to in it, if they had: the section or the
        // item after or before the one they were on, which is drawn selected.
        // Else they start from the first one.
        if (
          scope === undefined &&
          (stackAction === "next" || stackAction === "previous") &&
          strataResumeNavPosition(column, stackAction === "next" ? 1 : -1)
        ) {
          event.preventDefault();
          return;
        }

        // The items: on one, `j` and `k` move between them and `↵` opens it;
        // `e` goes into the list of the section that has the focus itself, and
        // in a split column, where the section has no focus of its own, `j` and
        // `k` go in too, from the first and from the last.
        if (
          strataItemKey(
            event,
            stackAction,
            scope,
            inSplit === undefined ? "section" : "column",
            afterOpen,
          )
        ) {
          return;
        }
        if (stackAction === "items") {
          return;
        }
        const items = scope === undefined ? [] : strataSectionItems(scope);

        if (stackAction === "open") {
          // Only on the section itself: on anything inside it, `↵` keeps its
          // own meaning (a link opens, a button presses).
          if (current < 0 || sections[current] !== active) {
            return;
          }
          // A note, or anything else that can be written in, is gone into:
          // `↵` starts the editing, with the caret at the end of it.
          if (strataEnterEditable(sections[current])) {
            event.preventDefault();
            return;
          }
          // Otherwise the first item of its list; a list that does not mark
          // its items has its first link opened.
          const first = items[0];
          if (first !== undefined) {
            event.preventDefault();
            strataOpenItem(first);
            return;
          }
          const link = sections[current].querySelector<HTMLAnchorElement>(
            "[id$='-body'] a[href]",
          );
          if (link === null) {
            return;
          }
          event.preventDefault();
          link.click();
          return;
        }
        // Up from the first of the others goes back to the column, whose header
        // is the first section's.
        if (stackAction === "previous" && current === 0 && lent !== undefined) {
          event.preventDefault();
          column.focus({ preventScroll: true });
          strataScrollColumn(column, "top");
          return;
        }
        // The column, or the first section when its header is the column's, is
        // the top of the list, so up from there goes nowhere rather than round
        // to the last section. Down stops at the last as well.
        if (stackAction === "previous" && current < 0) {
          return;
        }
        const next = strataNextSection(stackAction, sections.length, current);
        if (next === null) {
          return;
        }
        event.preventDefault();
        // Without scrolling, as the browser would only bring it into view;
        // the section's top goes to the top of the column.
        sections[next].focus({ preventScroll: true });
        sections[next].scrollIntoView({ block: "start" });
        return;
      }

      // Only the section the focus is in: when it is one that cannot be
      // collapsed or split out, or when none has the focus, the key does
      // nothing, rather than act on another section.
      // With the focus on the column itself, it is its first section that has
      // a header there, so it is the one that acts, if its header is the
      // column's.
      const focused =
        mine.find((el) => active !== null && el.contains(active)) ??
        (active === column
          ? mine.find((el) => el.dataset.strataSectionLent !== undefined)
          : undefined);
      let target: HTMLElement | undefined;
      if (collapse) {
        target =
          focused !== undefined && strataSectionCollapsible(focused)
            ? focused
            : undefined;
      } else if (splitAction === "split") {
        target =
          focused !== undefined && strataSectionSplittable(focused)
            ? focused
            : undefined;
      } else if (column.dataset.strataSplit !== undefined) {
        target = mine.find(
          (el) => el.dataset.strataSection === column.dataset.strataSplit,
        );
      }
      const sectionId = target?.dataset.strataSection;
      if (sectionId === undefined) {
        return;
      }
      event.preventDefault();
      if (collapse) {
        toggle(
          sectionId,
          target?.dataset.strataSectionStartsCollapsed === "true",
        );
      } else {
        setSplit(sectionId, splitAction === "split");
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [panelId, toggle, setSplit, afterOpen, keyBindings]);

  const value = useMemo(
    () => ({
      panelId,
      parentKey,
      lendsToHeader,
      claimLend,
      isCollapsed,
      toggle,
      split,
      setSplit,
    }),
    [
      panelId,
      parentKey,
      lendsToHeader,
      claimLend,
      isCollapsed,
      toggle,
      split,
      setSplit,
    ],
  );

  return (
    <StrataSectionsContext.Provider value={value}>
      {props.children}
    </StrataSectionsContext.Provider>
  );
}
