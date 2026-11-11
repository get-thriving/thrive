import { useCallback, useContext, useEffect, useMemo } from "react";
import type { PropsWithChildren } from "react";
import { z } from "zod";

import { useStrataColumnKey } from "#/core/infra/component/layout/strata-column-key-context";
import { StrataColumnsContext } from "#/core/infra/component/layout/strata-columns-context";
import { StrataSectionsContext } from "#/core/infra/component/strata-sections-context";
import { isTypingTarget } from "#/core/infra/component/layout/is-typing-target";
import { strataEnterEditable } from "#/core/infra/component/layout/strata-enter-editable";
import { useSectionFilters } from "#/core/infra/component/use-section-filter";
import { isStrataCollapseKey } from "#/core/infra/strata/strata-collapse-key";
import { strataSplitKey } from "#/core/infra/strata/strata-columns-with-splits";
import { strataSplitKeyAction } from "#/core/infra/strata/strata-split-key";
import {
  strataNextSection,
  strataStackKeyAction,
} from "#/core/infra/strata/strata-stack-key";

const FILTERS = z.object({
  collapsed: z.array(z.string()).default([]),
  split: z.array(z.string()).default([]),
});

interface StrataSectionStackProps {
  /** The panel id of the column the sections are in (ADR 0014). */
  panelId: string;
}

/**
 * Sections of one subject, one under another. It keeps which of them are
 * collapsed, and which are split out into columns of their own, in the URL as
 * `panel-id[collapsed]=section-id` and `panel-id[split]=section-id`, and lets
 * `z`, `s` and `⇧s` work on them while the column they are in has the focus,
 * and `j`, `k` and `↵` move between them, and go into one: `↵` starts editing
 * its note, if it has one, and else opens the first item of its list.
 */
export function StrataSectionStack(
  props: PropsWithChildren<StrataSectionStackProps>,
) {
  const { panelId } = props;
  const [filters, setFilters] = useSectionFilters(panelId, FILTERS);
  const columns = useContext(StrataColumnsContext);
  const parentKey = useStrataColumnKey();
  const { collapsed, split } = filters;
  const focusColumn = columns?.focusColumn;

  const toggle = useCallback(
    (sectionId: string) => {
      setFilters({
        collapsed: collapsed.includes(sectionId)
          ? collapsed.filter((id) => id !== sectionId)
          : [...collapsed, sectionId],
      });
    },
    [collapsed, setFilters],
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
      const collapse = isStrataCollapseKey(event, typing);
      const splitAction = strataSplitKeyAction(event, typing);
      const stackAction = strataStackKeyAction(event, typing);
      if (!collapse && splitAction === null && stackAction === null) {
        return;
      }
      const column = document.querySelector<HTMLElement>(
        '[data-strata-column][data-focused="true"]',
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

      if (stackAction !== null) {
        // The sections themselves, not the split placeholders, in the order
        // they are on the page.
        const sections = mine.filter(
          (el) => el.dataset.strataSectionSplit === undefined,
        );
        const current = sections.findIndex(
          (el) => active !== null && el.contains(active),
        );
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
          const item = sections[current].querySelector<HTMLAnchorElement>(
            "[id$='-body'] a[href]",
          );
          if (item === null) {
            return;
          }
          event.preventDefault();
          item.click();
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

      const pick = (candidates: HTMLElement[]) =>
        candidates.find((el) => active !== null && el.contains(active)) ??
        candidates[0];

      let target: HTMLElement | undefined;
      if (collapse) {
        target = pick(
          mine.filter(
            (el) =>
              el.dataset.strataSectionFixed === undefined &&
              el.dataset.strataSectionSplit === undefined,
          ),
        );
      } else if (splitAction === "split") {
        target = pick(
          mine.filter(
            (el) =>
              el.dataset.strataSplittable === "true" &&
              el.dataset.strataSectionSplit === undefined,
          ),
        );
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
        toggle(sectionId);
      } else {
        setSplit(sectionId, splitAction === "split");
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [panelId, toggle, setSplit]);

  const value = useMemo(
    () => ({ panelId, parentKey, collapsed, toggle, split, setSplit }),
    [panelId, parentKey, collapsed, toggle, split, setSplit],
  );

  return (
    <StrataSectionsContext.Provider value={value}>
      {props.children}
    </StrataSectionsContext.Provider>
  );
}
