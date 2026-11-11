import { Box, GlobalStyles, InputBase, useTheme } from "@mui/material";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { createPortal, flushSync } from "react-dom";
import { useLocation } from "react-router";

import { isTypingTarget } from "#/core/infra/component/layout/is-typing-target";
import { StrataColumnsContext } from "#/core/infra/component/layout/strata-columns-context";
import { strataEnterEditable } from "#/core/infra/component/layout/strata-enter-editable";
import { strataFindMatches } from "#/core/infra/component/layout/strata-find-matches";
import { strataScrollToCentre } from "#/core/infra/component/layout/strata-scroll-to-centre";
import {
  strataColors,
  strataFonts,
  strataRadius,
} from "#/core/infra/component/strata-tokens";
import { strataFindKeyAction } from "#/core/infra/strata/strata-find-key";
import { strataFindStep } from "#/core/infra/strata/strata-find-ranges";

// The names of the two highlights, which the style below colours: every match,
// and the one the search is at.
const ALL_MATCHES = "strata-find";
const CURRENT_MATCH = "strata-find-current";

// What a match is "in" when it is in one of these, so that the keyboard focus
// can go there and `↵` does what it would on a click.
const PRESSABLE =
  "a[href], button, summary, [role='button'], [role='link'], [role='tab'], [role='menuitem'], [role='checkbox'], [role='switch'], [role='radio']";

interface FindSession {
  query: string;
  /** Which match the search is at, from 0. */
  index: number;
  count: number;
}

function mark(matches: readonly Range[], index: number) {
  if (!("highlights" in CSS)) {
    // Without highlights, the selection marks the match the search is at.
    const selection = window.getSelection();
    selection?.removeAllRanges();
    if (matches[index] !== undefined) {
      selection?.addRange(matches[index]);
    }
    return;
  }
  CSS.highlights.set(ALL_MATCHES, new Highlight(...matches));
  if (matches[index] === undefined) {
    CSS.highlights.delete(CURRENT_MATCH);
    return;
  }
  const current = new Highlight(matches[index]);
  current.priority = 1;
  CSS.highlights.set(CURRENT_MATCH, current);
}

function unmark() {
  if (!("highlights" in CSS)) {
    window.getSelection()?.removeAllRanges();
    return;
  }
  CSS.highlights.delete(ALL_MATCHES);
  CSS.highlights.delete(CURRENT_MATCH);
}

/** Where the keyboard focus goes for a match: what it is in, or else its place. */
function landingOf(match: Range): HTMLElement | null {
  const parent = match.startContainer.parentElement;
  return (
    parent?.closest<HTMLElement>(PRESSABLE) ??
    parent?.closest<HTMLElement>("[data-strata-section][tabindex]") ??
    parent?.closest<HTMLElement>("[data-strata-column]") ??
    null
  );
}

/**
 * Find in the open columns, like `/` in vim. `/` opens a field at the bottom
 * left; what is typed marks every place it is in the text of the open columns,
 * and the one the search is at stands out, and `↓` and `↑` step through them.
 * `↵` goes to the match and the search is over, the field and the marks gone:
 * the match's column is focused and the keyboard focus goes to the link or
 * button it is in, so `↵` follows it; a match in a note is gone into, with the
 * caret at the match. `Escape` ends the search and leaves things where they
 * were, and so does clicking elsewhere.
 *
 * It looks at the text of the columns only, not the rail or the top bar, and
 * not what is hidden, collapsed or folded away.
 */
export function StrataFind() {
  const theme = useTheme();
  const location = useLocation();
  const columns = useContext(StrataColumnsContext);
  const [session, setSession] = useState<FindSession | null>(null);
  // The key handler reads the session as it is now, not as it was rendered.
  const current = useRef<FindSession | null>(null);
  const lastQuery = useRef("");
  const before = useRef<Element | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const columnsRef = useRef(columns);
  columnsRef.current = columns;

  const show = useCallback((next: FindSession | null) => {
    current.current = next;
    setSession(next);
  }, []);

  /**
   * Brings a match into view, and with `focus` the keyboard focus to it. With
   * `enter` as well, a match in a note or a doc is gone into: the caret goes to
   * it, ready to type, which takes the keys from find until `Escape` leaves.
   */
  const land = useCallback((match: Range, focus: boolean, enter = false) => {
    const parent = match.startContainer.parentElement;
    if (parent === null) {
      return;
    }
    strataScrollToCentre(parent);
    if (!focus) {
      return;
    }
    const key = parent.closest<HTMLElement>("[data-strata-column]")?.dataset
      .strataColumnKey;
    const focused = document.querySelector<HTMLElement>(
      '[data-strata-column][data-focused="true"]',
    );
    if (key !== undefined && focused?.dataset.strataColumnKey !== key) {
      // Whole before the focus goes into it: a peek would take the focus back.
      flushSync(() => columnsRef.current?.focusColumn(key, false));
    }
    const place = parent.closest<HTMLElement>(
      "[data-strata-section], [data-strata-column]",
    );
    if (
      enter &&
      place !== null &&
      parent.closest("[contenteditable='true']") !== null &&
      strataEnterEditable(place, match)
    ) {
      return;
    }
    landingOf(match)?.focus({ preventScroll: true });
  }, []);

  const search = useCallback(
    (query: string, index: number) => {
      lastQuery.current = query;
      const matches = strataFindMatches(query);
      const at = matches.length === 0 ? 0 : Math.min(index, matches.length - 1);
      mark(matches, at);
      show({ query, index: at, count: matches.length });
      if (matches[at] !== undefined) {
        land(matches[at], false);
      }
    },
    [land, show],
  );

  /** Ends the search; the query is kept for the next `/`. */
  const end = useCallback(() => {
    const now = current.current;
    if (now === null) {
      return false;
    }
    lastQuery.current = now.query;
    unmark();
    show(null);
    return true;
  }, [show]);

  /** Ends the search and puts the keyboard back where it was before `/`. */
  const cancel = useCallback(() => {
    if (!end()) {
      return;
    }
    const back = before.current;
    const target =
      back instanceof HTMLElement && back.isConnected && back !== document.body
        ? back
        : document.querySelector<HTMLElement>(
            '[data-strata-column][data-focused="true"]',
          );
    target?.focus({ preventScroll: true });
  }, [end]);

  const step = useCallback(
    (direction: "next" | "previous") => {
      const now = current.current;
      if (now === null) {
        return;
      }
      const matches = strataFindMatches(now.query);
      const at = strataFindStep(
        Math.min(now.index, Math.max(matches.length - 1, 0)),
        matches.length,
        direction,
      );
      if (at === null) {
        mark([], 0);
        show({ ...now, index: 0, count: 0 });
        return;
      }
      mark(matches, at);
      show({ ...now, index: at, count: matches.length });
      land(matches[at], false);
    },
    [land, show],
  );

  const commit = useCallback(() => {
    const now = current.current;
    if (now === null || now.count === 0) {
      return;
    }
    const matches = strataFindMatches(now.query);
    const at = Math.min(now.index, matches.length - 1);
    if (matches[at] === undefined) {
      return;
    }
    // The search is over before the match is gone to, so what the keyboard goes
    // into finds a page without the field.
    end();
    land(matches[at], true, true);
  }, [end, land]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      // A letter that is part of a composed character is not a command, and
      // hint mode, when it is on, takes every key.
      if (
        event.isComposing ||
        document.querySelector("[data-strata-hints]") !== null
      ) {
        return;
      }
      const action = strataFindKeyAction(
        event,
        current.current !== null,
        isTypingTarget(event.target),
      );
      if (action === null) {
        return;
      }
      // Before the keys of the columns, and not typed into the field.
      event.preventDefault();
      event.stopPropagation();
      switch (action) {
        case "open":
          before.current = document.activeElement;
          search(lastQuery.current, 0);
          return;
        case "commit":
          commit();
          return;
        case "next":
        case "previous":
          step(action);
          return;
        case "cancel":
          cancel();
          return;
      }
    }
    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [cancel, commit, search, step]);

  // The field takes the focus, with the last query selected, when it opens.
  const open = session !== null;
  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [open]);

  // A move to another page ends the search: what it marked is gone.
  useEffect(() => {
    end();
  }, [location.key, end]);

  if (session === null) {
    return null;
  }

  const searching = session.query.trim() !== "";
  const status = !searching
    ? ""
    : session.count === 0
      ? "no matches"
      : `${session.index + 1}/${session.count}`;

  return createPortal(
    <Box
      role="search"
      data-strata-find="true"
      sx={{
        position: "fixed",
        left: (columns?.offsetLeft ?? 0) + 16,
        // Clear of the banner a local build puts along the bottom.
        bottom: 36,
        zIndex: theme.zIndex.tooltip + 1,
        display: "flex",
        alignItems: "center",
        gap: "10px",
        maxWidth: "calc(100vw - 32px)",
        padding: "2px 10px",
        fontFamily: strataFonts.mono,
        fontSize: 11,
        backgroundColor: strataColors.raised,
        border: `1px solid ${strataColors.lineStrong}`,
        borderRadius: `${strataRadius.default}px`,
        boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
      }}
    >
      <GlobalStyles
        styles={{
          [`::highlight(${ALL_MATCHES})`]: {
            backgroundColor: "rgba(240,180,60,0.3)",
          },
          [`::highlight(${CURRENT_MATCH})`]: {
            backgroundColor: strataColors.amber,
            color: strataColors.ground,
          },
        }}
      />
      <Box component="span" sx={{ color: strataColors.amber }}>
        /
      </Box>
      <InputBase
        inputRef={inputRef}
        value={session.query}
        placeholder="Find in the open columns"
        onChange={(event) => search(event.target.value, 0)}
        onBlur={() => {
          // Clicking elsewhere ends the search, but switching to another
          // window, which blurs the field too, does not.
          if (document.hasFocus()) {
            end();
          }
        }}
        inputProps={{
          "aria-label": "Find in the open columns",
          spellCheck: false,
          autoComplete: "off",
        }}
        sx={{
          width: 220,
          fontFamily: strataFonts.mono,
          fontSize: 12,
          color: strataColors.text,
        }}
      />
      <Box
        component="span"
        aria-live="polite"
        sx={{
          minWidth: 52,
          color:
            searching && session.count === 0
              ? strataColors.coral
              : strataColors.textMuted,
        }}
      >
        {status}
      </Box>
      <Box
        component="span"
        sx={{
          color: strataColors.textFaint,
          letterSpacing: "0.04em",
          whiteSpace: "nowrap",
        }}
      >
        ↵ go · ↑↓ step · esc
      </Box>
    </Box>,
    document.body,
  );
}
