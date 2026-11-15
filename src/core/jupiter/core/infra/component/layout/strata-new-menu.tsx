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
import { useLocation, useNavigate } from "react-router";

import { TopLevelInfoContext } from "#/core/infra/top-level-context";
import { isTypingTarget } from "#/core/infra/component/layout/is-typing-target";
import { StrataColumnsContext } from "#/core/infra/component/layout/strata-columns-context";
import { StrataLabelChip } from "#/core/infra/component/layout/strata-label-chip";
import { newEntityGroups } from "#/core/infra/component/shell/new-entity-groups";
import type { NewEntityEntry } from "#/core/infra/component/shell/new-entity-entry";
import {
  strataColors,
  strataFonts,
  strataRadius,
} from "#/core/infra/component/strata-tokens";
import { useStrataKeyBindings } from "#/core/infra/component/use-strata-key-bindings";
import { strataAppMenuKeyAction } from "#/core/infra/strata/strata-app-menu-key";
import { strataAppMenuLabels } from "#/core/infra/strata/strata-app-menu-labels";
import { strataHintProgress } from "#/core/infra/strata/strata-hint-labels";
import { isStrataNewMenuEnterKey } from "#/core/infra/strata/strata-new-menu-key";
import { isWorkspaceFeatureAvailable } from "#/core/workspaces/root";

/**
 * The menu of new items (ADR 0021): the key of `NEW` (`n`) draws every kind of
 * item the workspace can create, by app, each with a letter to type, and typing
 * it goes to the page that creates it. It is the menu of apps for creating: the
 * letters come from the names (`h` for Habit), `Escape` leaves, and so does a
 * click outside, a move to another page, or a shortcut with a modifier. While
 * it is open the labels take every key.
 */
export function StrataNewMenu() {
  const keyBindings = useStrataKeyBindings();
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const columns = useContext(StrataColumnsContext);
  const topLevelInfo = useContext(TopLevelInfoContext);

  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState("");
  const openRef = useRef(false);
  const typedRef = useRef("");

  const groups = useMemo(
    () =>
      newEntityGroups({
        isAvailable: (features) =>
          features.some((feature) =>
            isWorkspaceFeatureAvailable(topLevelInfo.workspace, feature),
          ),
      }),
    [topLevelInfo],
  );
  const entries = useMemo(
    () => groups.flatMap((group) => group.entries),
    [groups],
  );
  const labels = useMemo(
    () => strataAppMenuLabels(entries.map((entry) => entry.label)),
    [entries],
  );
  // What the handler of keys reads is what is current, not what rendered.
  const entriesRef = useRef(entries);
  entriesRef.current = entries;
  const labelsRef = useRef(labels);
  labelsRef.current = labels;
  const phoneRef = useRef(false);
  phoneRef.current = columns?.phone ?? false;

  const change = useCallback((isOpen: boolean, next: string) => {
    openRef.current = isOpen;
    typedRef.current = next;
    setOpen(isOpen);
    setTyped(next);
  }, []);

  const exit = useCallback(() => {
    if (openRef.current) {
      change(false, "");
    }
  }, [change]);

  const choose = useCallback(
    (entry: NewEntityEntry) => {
      // The menu is over before the move, so what it moves finds a page
      // without the menu over it.
      exit();
      navigate(entry.to);
    },
    [exit, navigate],
  );

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!openRef.current) {
        if (
          phoneRef.current ||
          event.isComposing ||
          !isStrataNewMenuEnterKey(
            event,
            isTypingTarget(event.target),
            keyBindings,
          ) ||
          document.querySelector(
            "[data-strata-hints], [data-strata-app-menu], [data-strata-commands-menu], [data-strata-map], [data-strata-find]",
          ) !== null ||
          entriesRef.current.length === 0
        ) {
          return;
        }
        event.preventDefault();
        event.stopImmediatePropagation();
        change(true, "");
        return;
      }

      const action = strataAppMenuKeyAction(event);
      if (action.kind === "leave") {
        exit();
        return;
      }
      // Nothing behind the menu gets a key, nor does the page scroll, and no
      // other listener of the window (hints, the map) sees it either.
      event.preventDefault();
      event.stopImmediatePropagation();
      switch (action.kind) {
        case "exit":
          exit();
          return;
        case "back":
          change(true, typedRef.current.slice(0, -1));
          return;
        case "letter": {
          const next = typedRef.current + action.letter;
          const progress = strataHintProgress(labelsRef.current, next);
          if (progress.matching.length === 0) {
            return;
          }
          if (progress.chosen === null) {
            change(true, next);
            return;
          }
          choose(entriesRef.current[progress.chosen]);
          return;
        }
        case "ignore":
          return;
      }
    }
    // Before the keys of the columns, and of hint mode, the map and find, which
    // listen after it: it is rendered before them.
    window.addEventListener("keydown", handleKeyDown, true);
    window.addEventListener("blur", exit);
    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
      window.removeEventListener("blur", exit);
    };
  }, [change, exit, choose, keyBindings]);

  // A move to another page leaves a stale menu behind.
  useEffect(() => {
    exit();
  }, [location.key, exit]);

  const matching = useMemo(
    () => new Set(strataHintProgress(labels, typed).matching),
    [labels, typed],
  );

  if (!open) {
    return null;
  }

  // The labels go to the entries in the order they are drawn, which is the
  // order of `entries`.
  const starts: number[] = [];
  let count = 0;
  for (const group of groups) {
    starts.push(count);
    count += group.entries.length;
  }

  return createPortal(
    <Box
      role="dialog"
      aria-label="Create something new"
      data-strata-new-menu="true"
      onClick={(event) => {
        // A click on the dimmed window around the menu leaves it.
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
            New
          </Box>
          <Box component="span" data-strata-new-menu-typed="true">
            {typed === "" ? "type a label" : typed}
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-start",
            gap: "14px 22px",
            maxWidth: 880,
          }}
        >
          {groups.map((group, groupAt) => (
            <Box
              key={group.title}
              data-strata-new-menu-group={group.title}
              sx={{ minWidth: 168 }}
            >
              <Box sx={groupTitleSx}>{group.title}</Box>
              {group.entries.map((entry, entryAt) => {
                const at = starts[groupAt] + entryAt;
                return (
                  <Box
                    key={entry.to}
                    component="button"
                    type="button"
                    data-strata-new-menu-entry={entry.label}
                    aria-label={`New ${entry.label}`}
                    onClick={() => choose(entry)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      width: "100%",
                      padding: "3px 2px",
                      border: 0,
                      background: "none",
                      textAlign: "left",
                      font: "inherit",
                      fontSize: 13,
                      color: strataColors.textSecondary,
                      cursor: "pointer",
                      opacity: matching.has(at) ? 1 : 0.25,
                      "&:hover": { backgroundColor: strataColors.raised },
                    }}
                  >
                    <StrataLabelChip
                      label={labels[at]}
                      typed={typed.length}
                      data-strata-new-menu-label={labels[at]}
                      sx={{ flex: "none", minWidth: 18, textAlign: "center" }}
                    />
                    <Box component="span">{entry.label}</Box>
                  </Box>
                );
              })}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>,
    document.body,
  );
}

const groupTitleSx = {
  mb: "4px",
  fontFamily: strataFonts.mono,
  fontSize: 10,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: strataColors.textFaint,
} as const;
