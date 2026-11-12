import { Box, useTheme } from "@mui/material";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router";

import { isTypingTarget } from "#/core/infra/component/layout/is-typing-target";
import { StrataColumnsContext } from "#/core/infra/component/layout/strata-columns-context";
import { strataJumpTo } from "#/core/infra/component/layout/strata-jump-to";
import { strataMapColumns } from "#/core/infra/component/layout/strata-map-columns";
import { StrataMapEntry } from "#/core/infra/component/layout/strata-map-entry";
import {
  strataColors,
  strataFonts,
  strataRadius,
} from "#/core/infra/component/strata-tokens";
import { strataHintKeyAction } from "#/core/infra/strata/strata-hint-key";
import {
  strataHintLabels,
  strataHintProgress,
} from "#/core/infra/strata/strata-hint-labels";
import type { StrataMapColumn } from "#/core/infra/strata/strata-map-column";
import { isStrataMapEnterKey } from "#/core/infra/strata/strata-map-key";
import {
  strataMapTargets,
  type StrataMapTarget,
} from "#/core/infra/strata/strata-map-targets";

interface MapSession {
  columns: StrataMapColumn[];
  targets: StrataMapTarget[];
  labels: string[];
  typed: string;
}

// The room a column of the map takes.
const COLUMN_WIDTH = 176;

const STATE_TAGS: Record<StrataMapColumn["state"], string | null> = {
  full: null,
  squeezed: null,
  partial: "partly shown",
  spine: "folded",
};

/**
 * The map of the columns, as hint mode is the map of what can be pressed: `a`
 * draws the open columns, side by side as they are on screen, with the sections
 * of each in it, and a label on every column and section. Typing a label goes
 * there: a column is focused, brought in whole if it was folded, and a section
 * takes the keyboard focus, so `j` and `k` go on from it. A click does the
 * same. `Escape` leaves; so does a click outside, a move to another page, or a
 * shortcut with a modifier. While it is on, the labels take every key.
 */
export function StrataMap() {
  const theme = useTheme();
  const location = useLocation();
  const columns = useContext(StrataColumnsContext);
  const [session, setSession] = useState<MapSession | null>(null);
  // The handler of keys reads the session and the columns as they are now, not
  // as they were rendered.
  const current = useRef<MapSession | null>(null);
  const columnsRef = useRef(columns);
  columnsRef.current = columns;

  const change = useCallback((next: MapSession | null) => {
    current.current = next;
    setSession(next);
  }, []);

  const exit = useCallback(() => {
    if (current.current !== null) {
      change(null);
    }
  }, [change]);

  const choose = useCallback(
    (target: StrataMapTarget) => {
      const api = columnsRef.current;
      // The mode is over before the jump, so what it moves finds a page
      // without the map over it.
      exit();
      if (api !== null) {
        strataJumpTo(target, api);
      }
    },
    [exit],
  );

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const now = current.current;
      if (now === null) {
        if (
          !isStrataMapEnterKey(event, isTypingTarget(event.target)) ||
          document.querySelector("[data-strata-hints]") !== null
        ) {
          return;
        }
        const open = strataMapColumns(columnsRef.current?.slots ?? []);
        const targets = strataMapTargets(open);
        // One column with nothing in it has nowhere to jump to.
        if (targets.length < 2) {
          return;
        }
        event.preventDefault();
        event.stopPropagation();
        change({
          columns: open,
          targets,
          labels: strataHintLabels(targets.length),
          typed: "",
        });
        return;
      }

      const action = strataHintKeyAction(event);
      if (action.kind === "leave") {
        exit();
        return;
      }
      // Nothing behind the map gets a key, nor does the page scroll.
      event.preventDefault();
      event.stopPropagation();
      switch (action.kind) {
        case "exit":
          exit();
          return;
        case "back":
          change({ ...now, typed: now.typed.slice(0, -1) });
          return;
        case "letter": {
          const typed = now.typed + action.letter;
          const progress = strataHintProgress(now.labels, typed);
          if (progress.matching.length === 0) {
            return;
          }
          if (progress.chosen === null) {
            change({ ...now, typed });
            return;
          }
          choose(now.targets[progress.chosen]);
          return;
        }
        case "ignore":
          return;
      }
    }
    // Before the keys of the columns, and of hint mode and find, which listen
    // after it: it is rendered before them.
    window.addEventListener("keydown", handleKeyDown, true);
    window.addEventListener("blur", exit);
    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
      window.removeEventListener("blur", exit);
    };
  }, [change, exit, choose]);

  // A move to another page leaves a stale map behind.
  useEffect(() => {
    exit();
  }, [location.key, exit]);

  const matching = useMemo(
    () =>
      session === null
        ? new Set<number>()
        : new Set(strataHintProgress(session.labels, session.typed).matching),
    [session],
  );

  if (session === null) {
    return null;
  }

  // Which entry has which label: the targets are numbered in the order they
  // are drawn, so a column comes first, and its sections after it.
  const firstTarget = session.columns.map((_, position) =>
    session.columns
      .slice(0, position)
      .reduce((total, column) => total + 1 + column.sections.length, 0),
  );
  const focusedSubject = session.columns.find(
    (column) => column.focused,
  )?.subject;

  return createPortal(
    <Box
      role="dialog"
      aria-label="Jump to a column or section"
      data-strata-map="true"
      onClick={(event) => {
        // A click on the dimmed window around the map leaves it.
        if (event.target === event.currentTarget) {
          exit();
        }
      }}
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: theme.zIndex.tooltip + 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.55)",
      }}
    >
      <Box
        sx={{
          maxWidth: "calc(100vw - 32px)",
          maxHeight: "calc(100vh - 64px)",
          overflow: "auto",
          padding: "12px 14px 14px",
          backgroundColor: strataColors.panel,
          border: `1px solid ${strataColors.lineStrong}`,
          borderRadius: `${strataRadius.small}px`,
          boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            mb: "10px",
            fontFamily: strataFonts.mono,
            fontSize: 11,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: strataColors.textMuted,
          }}
        >
          <Box component="span" sx={{ color: strataColors.amber }}>
            Jump to
          </Box>
          <Box component="span" data-strata-map-typed="true">
            {session.typed === "" ? "type a label" : session.typed}
          </Box>
          <Box component="span" sx={{ color: strataColors.textFaint }}>
            esc cancels
          </Box>
        </Box>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
          {session.columns.map((column, position) => {
            const columnIndex = firstTarget[position];
            const subjectFirst =
              position > 0 &&
              session.columns[position - 1].subject !== column.subject;
            const tag = STATE_TAGS[column.state];
            const line = column.focused
              ? strataColors.amber
              : column.subject === focusedSubject
                ? strataColors.amberLine
                : strataColors.lineStrong;
            return (
              <Box
                key={column.key}
                data-strata-map-column={column.key}
                data-focused={column.focused ? "true" : undefined}
                sx={{
                  flex: `0 0 ${COLUMN_WIDTH}px`,
                  boxSizing: "border-box",
                  ml: subjectFirst ? "8px" : 0,
                  padding: "6px 6px 8px",
                  backgroundColor: strataColors.column,
                  borderTop: `2px solid ${line}`,
                  borderRadius: `${strataRadius.small}px`,
                }}
              >
                <StrataMapEntry
                  label={session.labels[columnIndex]}
                  typed={session.typed.length}
                  dimmed={!matching.has(columnIndex)}
                  onChoose={() => choose(session.targets[columnIndex])}
                  ariaLabel={`Go to the ${column.label} column`}
                >
                  <Box
                    component="span"
                    sx={{
                      fontFamily: strataFonts.mono,
                      fontSize: 11,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: column.focused
                        ? strataColors.amber
                        : strataColors.textMuted,
                    }}
                  >
                    {column.label}
                  </Box>
                  {tag !== null && (
                    <Box
                      component="span"
                      sx={{
                        fontFamily: strataFonts.mono,
                        fontSize: 10,
                        color: strataColors.textFaint,
                      }}
                    >
                      {tag}
                    </Box>
                  )}
                </StrataMapEntry>
                {column.sections.map((section, sectionPosition) => {
                  const index = columnIndex + 1 + sectionPosition;
                  return (
                    <StrataMapEntry
                      key={section.id}
                      label={session.labels[index]}
                      typed={session.typed.length}
                      dimmed={!matching.has(index)}
                      onChoose={() => choose(session.targets[index])}
                      ariaLabel={`Go to the ${section.title} section`}
                      section={section.id}
                    >
                      <Box
                        component="span"
                        sx={{
                          minWidth: 0,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          fontSize: 12,
                          color: strataColors.textSecondary,
                        }}
                      >
                        {section.title}
                      </Box>
                    </StrataMapEntry>
                  );
                })}
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>,
    document.body,
  );
}
