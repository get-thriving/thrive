import { Box, useTheme } from "@mui/material";
import {
  Fragment,
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
import type { StrataCommand } from "#/core/infra/component/layout/strata-command";
import type { StrataCommandGroup } from "#/core/infra/component/layout/strata-command-group";
import type { StrataCommandsRegistry } from "#/core/infra/component/layout/strata-commands-registry";
import { StrataColumnsContext } from "#/core/infra/component/layout/strata-columns-context";
import { StrataLabelChip } from "#/core/infra/component/layout/strata-label-chip";
import {
  strataColors,
  strataFonts,
  strataRadius,
} from "#/core/infra/component/strata-tokens";
import { useStrataKeyBindings } from "#/core/infra/component/use-strata-key-bindings";
import { strataAppMenuKeyAction } from "#/core/infra/strata/strata-app-menu-key";
import { strataAppMenuLabels } from "#/core/infra/strata/strata-app-menu-labels";
import { strataCommandSearch } from "#/core/infra/strata/strata-command-search";
import { strataCommandSearchKeyAction } from "#/core/infra/strata/strata-command-search-key";
import { isStrataCommandsEnterKey } from "#/core/infra/strata/strata-commands-key";
import { strataHintProgress } from "#/core/infra/strata/strata-hint-labels";

interface StrataCommandsProps {
  registry: StrataCommandsRegistry;
}

/** Which command of the list has its choices open in the panel beside it. */
interface OpenCommand {
  title: string;
  id: string;
}

/** What the menu shows: the commands, the one that is open, what was typed. */
interface MenuView {
  groups: StrataCommandGroup[];
  open: OpenCommand | null;
  /** The letters of a label, or, in a search, the search. */
  typed: string;
  /** In a search, which of the choices that are found has the cursor. */
  cursor: number;
}

/** How long a choice that leaves the menu open waits for the page to move. */
const STAYING_MS = 1500;

/** The column the keys act on: the focused one, or the lone one. */
function focusedColumn(): HTMLElement | null {
  const columns = document.querySelectorAll<HTMLElement>(
    "[data-strata-column]",
  );
  return (
    document.querySelector<HTMLElement>(
      '[data-strata-column][data-focused="true"]',
    ) ?? (columns.length === 1 ? columns[0] : null)
  );
}

/** The ones that can be run, in the order they are drawn. */
function runnableOf(commands: readonly StrataCommand[]): StrataCommand[] {
  return commands.filter((command) => !command.disabled);
}

function topCommands(groups: readonly StrataCommandGroup[]): StrataCommand[] {
  return groups.flatMap((group) => group.commands);
}

/** The command whose choices are open, if it is still in the groups. */
function openCommandOf(view: MenuView): StrataCommand | null {
  if (view.open === null) {
    return null;
  }
  const { title, id } = view.open;
  return (
    view.groups
      .find((group) => group.title === title)
      ?.commands.find((command) => command.id === id) ?? null
  );
}

/** What the keys choose among now: the open command's choices, or the list. */
function choosableOf(view: MenuView): StrataCommand[] {
  const open = openCommandOf(view);
  return runnableOf(open === null ? topCommands(view.groups) : open.choices);
}

/** The choices of a filter of many that a search finds, which can be turned. */
function searchResultsOf(open: StrataCommand, query: string): StrataCommand[] {
  const enabled = runnableOf(open.choices);
  return strataCommandSearch(
    enabled.map((choice) => choice.label),
    query,
  ).map((at) => enabled[at]);
}

/**
 * The menu of commands (ADR 0021): the key of `COMMANDS` (`x`) draws every
 * action of the focused column, each with a letter to type, and typing it runs
 * it. They are grouped under the section they are in: the buttons of its
 * header, the links among them, and, under the column's own name, its main
 * action and its `⋯` menu. A filter is one item, which says what it has chosen:
 * typing its letter opens a panel beside the list with its choices, each with a
 * letter of its own, so a filter of many tags does not crowd the list. The
 * panel of a filter of many choices, such as tags, is a search instead: what is
 * typed narrows the choices, the arrows move along them and `Enter` turns the
 * one under the cursor on or off, as the selector does, and it stays open for
 * the next. `Escape` and `Backspace` on an empty label or search close the
 * panel, back to the list; `Escape` there leaves the menu. A command that cannot be run, as its button
 * would be dimmed, is listed without a letter. The letters come from the names,
 * as the menu of apps's do. `Escape` leaves; so does a click outside, a move to
 * another page, or a shortcut with a modifier. While it is open the labels take
 * every key. A column with no commands does not open it.
 */
export function StrataCommands(props: StrataCommandsProps) {
  const keyBindings = useStrataKeyBindings();
  const theme = useTheme();
  const location = useLocation();
  const columns = useContext(StrataColumnsContext);

  const [view, setView] = useState<MenuView | null>(null);
  const viewRef = useRef<MenuView | null>(null);
  const columnRef = useRef<HTMLElement | null>(null);
  const stayingRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const phoneRef = useRef(false);
  phoneRef.current = columns?.phone ?? false;

  const change = useCallback((next: MenuView | null) => {
    viewRef.current = next;
    setView(next);
  }, []);

  const exit = useCallback(() => {
    if (stayingRef.current !== null) {
      clearTimeout(stayingRef.current);
      stayingRef.current = null;
    }
    if (viewRef.current !== null) {
      change(null);
    }
  }, [change]);

  const choose = useCallback(
    (command: StrataCommand) => {
      if (command.stays) {
        // The menu stays: the page moves (the filter is in the URL), and what
        // the menu shows is taken again from the page once it has.
        if (stayingRef.current !== null) {
          clearTimeout(stayingRef.current);
        }
        stayingRef.current = setTimeout(() => {
          stayingRef.current = null;
        }, STAYING_MS);
        const current = viewRef.current;
        if (current !== null) {
          change({ ...current, typed: "", cursor: 0 });
        }
        command.run();
        return;
      }
      // The menu is over before the command runs, so what it does finds the
      // page without the menu over it.
      exit();
      command.run();
    },
    [change, exit],
  );

  const pick = useCallback(
    (command: StrataCommand) => {
      const current = viewRef.current;
      if (current === null) {
        return;
      }
      if (command.choices.length === 0) {
        choose(command);
        return;
      }
      const group = current.groups.find((candidate) =>
        candidate.commands.includes(command),
      );
      if (group !== undefined) {
        change({
          ...current,
          open: { title: group.title, id: command.id },
          typed: "",
          cursor: 0,
        });
      }
    },
    [change, choose],
  );

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const current = viewRef.current;
      if (current === null) {
        if (
          phoneRef.current ||
          event.isComposing ||
          !isStrataCommandsEnterKey(
            event,
            isTypingTarget(event.target),
            keyBindings,
          ) ||
          document.querySelector(
            "[data-strata-hints], [data-strata-app-menu], [data-strata-new-menu], [data-strata-map], [data-strata-find]",
          ) !== null
        ) {
          return;
        }
        const column = focusedColumn();
        const found = column === null ? [] : props.registry.commandsOf(column);
        // A column with nothing to run leaves the key to the page.
        if (found.length === 0) {
          return;
        }
        event.preventDefault();
        event.stopImmediatePropagation();
        columnRef.current = column;
        change({ groups: found, open: null, typed: "", cursor: 0 });
        return;
      }

      const openNow = openCommandOf(current);
      if (openNow !== null && openNow.searchable) {
        const search = strataCommandSearchKeyAction(event);
        if (search.kind === "leave") {
          exit();
          return;
        }
        event.preventDefault();
        event.stopImmediatePropagation();
        const results = searchResultsOf(openNow, current.typed);
        const at = Math.min(current.cursor, results.length - 1);
        switch (search.kind) {
          case "exit":
            // Back to the list, as `Backspace` on an empty search is.
            change({ ...current, open: null, typed: "", cursor: 0 });
            return;
          case "back":
            if (current.typed !== "") {
              change({
                ...current,
                typed: current.typed.slice(0, -1),
                cursor: 0,
              });
            } else {
              change({ ...current, open: null, cursor: 0 });
            }
            return;
          case "move":
            if (results.length > 0) {
              change({
                ...current,
                cursor: (at + search.by + results.length) % results.length,
              });
            }
            return;
          case "toggle":
            if (results[at] !== undefined) {
              choose(results[at]);
            }
            return;
          case "type":
            // A search does not start with a space.
            if (search.text !== " " || current.typed !== "") {
              change({
                ...current,
                typed: current.typed + search.text,
                cursor: 0,
              });
            }
            return;
          case "ignore":
            return;
        }
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
          // From the choices of a filter, back to the list; from the list, out.
          if (current.open !== null) {
            change({ ...current, open: null, typed: "" });
          } else {
            exit();
          }
          return;
        case "back":
          if (current.typed !== "") {
            change({ ...current, typed: current.typed.slice(0, -1) });
          } else if (current.open !== null) {
            change({ ...current, open: null });
          }
          return;
        case "letter": {
          const choosable = choosableOf(current);
          const labels = strataAppMenuLabels(
            choosable.map((command) => command.label),
          );
          const next = current.typed + action.letter;
          const progress = strataHintProgress(labels, next);
          if (progress.matching.length === 0) {
            return;
          }
          if (progress.chosen === null) {
            change({ ...current, typed: next });
            return;
          }
          pick(choosable[progress.chosen]);
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
  }, [change, choose, exit, pick, keyBindings, props.registry]);

  // What the sections offer changes while the menu is open, as when a choice
  // of a filter has been made: the menu is drawn again from the page, with the
  // same command open and what was typed kept.
  useEffect(
    () =>
      props.registry.subscribe(() => {
        const current = viewRef.current;
        const column = columnRef.current;
        if (current === null || column === null) {
          return;
        }
        const found = props.registry.commandsOf(column);
        if (found.length > 0) {
          change({ ...current, groups: found });
        }
      }),
    [props.registry, change],
  );

  // A move to another page leaves a stale menu behind, but for the one a choice
  // that stays has just made: the page moved for it.
  useEffect(() => {
    if (stayingRef.current === null) {
      exit();
    }
  }, [location.key, exit]);

  const openCommand = view === null ? null : openCommandOf(view);
  const topRunnable = useMemo(
    () => (view === null ? [] : runnableOf(topCommands(view.groups))),
    [view],
  );
  const topLabels = useMemo(
    () => strataAppMenuLabels(topRunnable.map((command) => command.label)),
    [topRunnable],
  );
  const choiceRunnable = useMemo(
    () => (openCommand === null ? [] : runnableOf(openCommand.choices)),
    [openCommand],
  );
  const choiceLabels = useMemo(
    () => strataAppMenuLabels(choiceRunnable.map((command) => command.label)),
    [choiceRunnable],
  );
  const typed = view?.typed ?? "";
  const searching = openCommand !== null && openCommand.searchable;
  const results = useMemo(
    () => (openCommand === null ? [] : searchResultsOf(openCommand, typed)),
    [openCommand, typed],
  );
  const topMatching = useMemo(
    () =>
      new Set(
        strataHintProgress(topLabels, openCommand === null ? typed : "")
          .matching,
      ),
    [topLabels, typed, openCommand],
  );
  const choiceMatching = useMemo(
    () => new Set(strataHintProgress(choiceLabels, typed).matching),
    [choiceLabels, typed],
  );

  if (view === null) {
    return null;
  }

  // `at` is the place of a command among those that can be run, which is where
  // its letters are, and -1 for one that cannot be run.
  const place = (commands: readonly StrataCommand[]) => {
    const placed: Array<{ command: StrataCommand; at: number }> = [];
    let next = 0;
    for (const command of commands) {
      placed.push({ command, at: command.disabled ? -1 : next });
      if (!command.disabled) {
        next += 1;
      }
    }
    return placed;
  };
  const drawnGroups: Array<{
    title: string;
    menu: boolean;
    commands: Array<{ command: StrataCommand; at: number }>;
  }> = [];
  let offset = 0;
  for (const group of view.groups) {
    const placed = place(group.commands).map(({ command, at }) => ({
      command,
      at: at === -1 ? -1 : at + offset,
    }));
    offset += runnableOf(group.commands).length;
    drawnGroups.push({
      title: group.title,
      menu: group.menu,
      commands: placed,
    });
  }
  const drawnChoices = openCommand === null ? [] : place(openCommand.choices);

  function entry(
    command: StrataCommand,
    at: number,
    labels: readonly string[],
    matching: ReadonlySet<number>,
    typedLength: number,
    active: boolean,
    marker: string,
  ) {
    return (
      <Fragment key={command.id}>
        {command.ruleBefore && (
          <Box
            component="hr"
            data-strata-command-rule="true"
            sx={{
              m: "4px 0",
              border: 0,
              borderTop: `1px solid ${strataColors.lineStrong}`,
            }}
          />
        )}
        <Box
          component="button"
          type="button"
          disabled={command.disabled}
          data-strata-command={command.label}
          data-strata-command-kind={command.kind}
          data-strata-command-opens={
            command.choices.length > 0 ? "true" : undefined
          }
          aria-label={command.label}
          onClick={() => pick(command)}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            width: "100%",
            padding: "3px 2px",
            border: 0,
            background: active ? strataColors.raised : "none",
            textAlign: "left",
            font: "inherit",
            fontSize: 13,
            color: command.danger
              ? theme.palette.error.main
              : strataColors.textSecondary,
            cursor: command.disabled ? "not-allowed" : "pointer",
            opacity: command.disabled
              ? 0.35
              : active || matching.has(at)
                ? 1
                : 0.25,
            "&:hover:not(:disabled)": { backgroundColor: strataColors.raised },
          }}
        >
          {command.disabled ? (
            <Box
              component="span"
              sx={{ flex: "none", minWidth: 18, textAlign: "center" }}
            >
              ·
            </Box>
          ) : (
            <StrataLabelChip
              label={labels[at]}
              typed={typedLength}
              data-strata-command-label={labels[at]}
              sx={{ flex: "none", minWidth: 18, textAlign: "center" }}
            />
          )}
          <Box component="span">{command.label}</Box>
          {command.detail !== null && (
            <Box
              component="span"
              data-strata-command-detail="true"
              sx={{ color: strataColors.textMuted, fontSize: 12 }}
            >
              {command.detail}
            </Box>
          )}
          {marker !== "" && (
            <Box
              component="span"
              sx={{ marginLeft: "auto", color: strataColors.amber }}
            >
              {marker}
            </Box>
          )}
        </Box>
      </Fragment>
    );
  }

  function drawGroup(group: (typeof drawnGroups)[number], position: number) {
    return (
      <Box
        key={`${group.title}-${position}`}
        data-strata-commands-group={group.title}
        data-strata-commands-menu-group={group.menu ? "true" : undefined}
        sx={{ minWidth: 168 }}
      >
        <Box sx={groupTitleSx}>{group.title}</Box>
        {group.commands.map(({ command, at }) =>
          entry(
            command,
            at,
            topLabels,
            topMatching,
            openCommand === null ? typed.length : 0,
            openCommand !== null && command === openCommand,
            command.choices.length > 0 ? "›" : "",
          ),
        )}
      </Box>
    );
  }

  return createPortal(
    <Box
      role="dialog"
      aria-label="Run an action of the column"
      data-strata-commands-menu="true"
      data-strata-commands-search={searching ? "true" : undefined}
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
            Run
          </Box>
          <Box component="span" data-strata-commands-typed="true">
            {searching
              ? `search ${openCommand.label}`
              : typed === ""
                ? openCommand === null
                  ? "type a label"
                  : `type a choice of ${openCommand.label}`
                : typed}
          </Box>
        </Box>
        {/* The list, and beside it the choices of the filter that is open. */}
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: "18px" }}>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "flex-start",
              gap: "8px 18px",
              flex: "1 1 auto",
              opacity: openCommand === null ? 1 : 0.6,
            }}
          >
            {drawnGroups
              .filter((group) => !group.menu)
              .map((group, position) => drawGroup(group, position))}
          </Box>
          {/* The menu of the column is rarely wanted: it has a column of its
              own, to the right of the actions, whatever the number of columns
              of the page. */}
          {drawnGroups
            .filter((group) => group.menu)
            .map((group) => (
              <Box
                key="menu"
                sx={{
                  flex: "none",
                  paddingLeft: "14px",
                  borderLeft: `1px solid ${strataColors.lineStrong}`,
                  opacity: openCommand === null ? 1 : 0.6,
                }}
              >
                {drawGroup(group, 0)}
              </Box>
            ))}
          {openCommand !== null && (
            <Box
              data-strata-commands-choices={openCommand.label}
              sx={{
                flex: "none",
                minWidth: 190,
                maxHeight: "calc(100vh - 140px)",
                overflow: "auto",
                paddingLeft: "14px",
                borderLeft: `1px solid ${strataColors.lineStrong}`,
              }}
            >
              <Box sx={groupTitleSx}>
                {openCommand.label}
                {searching && (
                  <Box
                    component="span"
                    data-strata-commands-found={results.length}
                    sx={{ ml: "8px", color: strataColors.textMuted }}
                  >
                    {results.length} of {choiceRunnable.length}
                  </Box>
                )}
              </Box>
              {searching ? (
                <>
                  <Box
                    data-strata-commands-query="true"
                    sx={{
                      mb: "6px",
                      padding: "4px 8px",
                      border: `1px solid ${strataColors.lineStrong}`,
                      borderRadius: `${strataRadius.small}px`,
                      fontSize: 13,
                      color:
                        typed === ""
                          ? strataColors.textMuted
                          : strataColors.textSecondary,
                    }}
                  >
                    {typed === ""
                      ? `Search ${openCommand.label.toLowerCase()}`
                      : typed}
                    <Box component="span" sx={{ color: strataColors.amber }}>
                      ▏
                    </Box>
                  </Box>
                  {results.length === 0 && (
                    <Box sx={{ fontSize: 13, color: strataColors.textMuted }}>
                      No match
                    </Box>
                  )}
                  {results.map((command, position) => {
                    const onCursor =
                      position === Math.min(view.cursor, results.length - 1);
                    return (
                      <Box
                        key={command.id}
                        component="button"
                        type="button"
                        ref={(element: HTMLElement | null) => {
                          if (onCursor && element !== null) {
                            element.scrollIntoView({ block: "nearest" });
                          }
                        }}
                        data-strata-command={command.label}
                        data-strata-command-kind={command.kind}
                        data-strata-command-cursor={
                          onCursor ? "true" : undefined
                        }
                        data-strata-command-on={
                          command.current ? "true" : undefined
                        }
                        aria-label={command.label}
                        aria-pressed={command.current}
                        onClick={() => choose(command)}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          width: "100%",
                          padding: "3px 4px",
                          border: 0,
                          background: onCursor ? strataColors.raised : "none",
                          textAlign: "left",
                          font: "inherit",
                          fontSize: 13,
                          color: strataColors.textSecondary,
                          cursor: "pointer",
                          "&:hover": { backgroundColor: strataColors.raised },
                        }}
                      >
                        <Box
                          component="span"
                          sx={{
                            flex: "none",
                            color: command.current
                              ? strataColors.amber
                              : strataColors.textMuted,
                          }}
                        >
                          {command.current ? "☑" : "☐"}
                        </Box>
                        <Box component="span">{command.label}</Box>
                      </Box>
                    );
                  })}
                </>
              ) : (
                drawnChoices.map(({ command, at }) =>
                  entry(
                    command,
                    at,
                    choiceLabels,
                    choiceMatching,
                    typed.length,
                    false,
                    command.current ? "✓" : "",
                  ),
                )
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Box>,
    document.body,
  );
}

const groupTitleSx = {
  mb: "2px",
  fontFamily: strataFonts.mono,
  fontSize: 10,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: strataColors.textFaint,
} as const;
