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
import { useLocation, useNavigate } from "react-router";
import { UserFeature } from "@jupiter/webapi-client";

import { GlobalPropertiesContext } from "#/core/config-client";
import { ServiceLinksContext } from "#/core/infra/service-links-context";
import { TopLevelInfoContext } from "#/core/infra/top-level-context";
import { isTypingTarget } from "#/core/infra/component/layout/is-typing-target";
import { StrataColumnsContext } from "#/core/infra/component/layout/strata-columns-context";
import { StrataLabelChip } from "#/core/infra/component/layout/strata-label-chip";
import { useStrataNewTab } from "#/core/infra/component/layout/use-strata-new-tab";
import type { AppMenuEntry } from "#/core/infra/component/shell/app-menu-entry";
import { appMenuGroups } from "#/core/infra/component/shell/app-menu-groups";
import {
  strataColors,
  strataFonts,
  strataRadius,
} from "#/core/infra/component/strata-tokens";
import { useStrataKeyBindings } from "#/core/infra/component/use-strata-key-bindings";
import {
  isStrataAppMenuEnterKey,
  strataAppMenuKeyAction,
} from "#/core/infra/strata/strata-app-menu-key";
import { strataAppMenuLabels } from "#/core/infra/strata/strata-app-menu-labels";
import { strataHintProgress } from "#/core/infra/strata/strata-hint-labels";
import { isUserFeatureAvailable } from "#/core/users/root";
import { isWorkspaceFeatureAvailable } from "#/core/workspaces/root";

const SECTION_TITLES = {
  apps: "Apps",
  pages: "Support and shared",
  account: "You",
} as const;

/**
 * The menu of apps and pages (ADR 0021), as the map is for the columns: the
 * key of `APPS` (`q`) draws every place the left rail and the right of the app
 * bar lead to, each with a letter to type, and typing it goes there. First the
 * apps the workspace has enabled, then, after a rule, the pages that support
 * and are shared by them, then, after another, account, access, settings and
 * the rest. The letters come from the names (`t` for Todos), so they can be
 * learnt. `Escape` leaves; so does a click outside, a move to another page, or
 * a shortcut with a modifier. While it is open the labels take every key.
 */
export function StrataAppMenu() {
  const keyBindings = useStrataKeyBindings();
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const columns = useContext(StrataColumnsContext);
  const topLevelInfo = useContext(TopLevelInfoContext);
  const globalProperties = useContext(GlobalPropertiesContext);
  const serviceLinks = useContext(ServiceLinksContext);

  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState("");
  const openRef = useRef(false);
  const typedRef = useRef("");
  const newTab = useStrataNewTab();
  const newTabRef = useRef(newTab);
  newTabRef.current = newTab;
  // `⇧` was held for a letter of the label: the place goes to a tab of its own.
  const [inNewTab, setInNewTab] = useState(false);
  const inNewTabRef = useRef(false);

  const groups = useMemo(
    () =>
      appMenuGroups({
        isAvailable: (features) =>
          features.some((feature) =>
            isWorkspaceFeatureAvailable(topLevelInfo.workspace, feature),
          ),
        gamification:
          topLevelInfo.user !== undefined &&
          isUserFeatureAvailable(topLevelInfo.user, UserFeature.GAMIFICATION),
        communityUrl: globalProperties.communityUrl,
        docsUrl: serviceLinks.docsUrl,
      }),
    [topLevelInfo, globalProperties.communityUrl, serviceLinks.docsUrl],
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
    if (!isOpen) {
      inNewTabRef.current = false;
      setInNewTab(false);
    }
  }, []);

  const exit = useCallback(() => {
    if (openRef.current) {
      change(false, "");
    }
  }, [change]);

  const choose = useCallback(
    (entry: AppMenuEntry, newTabAsked: boolean) => {
      // The menu is over before the move, so what it moves finds a page
      // without the menu over it.
      exit();
      if (entry.external || newTabAsked) {
        window.open(entry.to, "_blank", "noopener,noreferrer");
      } else {
        navigate(entry.to);
      }
    },
    [exit, navigate],
  );

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!openRef.current) {
        if (
          phoneRef.current ||
          event.isComposing ||
          !isStrataAppMenuEnterKey(
            event,
            isTypingTarget(event.target),
            keyBindings,
          ) ||
          document.querySelector(
            "[data-strata-hints], [data-strata-commands-menu], [data-strata-new-menu], [data-strata-map], [data-strata-find]",
          ) !== null
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
          if (newTabRef.current && action.shift && !inNewTabRef.current) {
            inNewTabRef.current = true;
            setInNewTab(true);
          }
          const progress = strataHintProgress(labelsRef.current, next);
          if (progress.matching.length === 0) {
            return;
          }
          if (progress.chosen === null) {
            change(true, next);
            return;
          }
          choose(entriesRef.current[progress.chosen], inNewTabRef.current);
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
  // order of `entries`: the sections, and in each its groups.
  let index = 0;
  const sections = (["apps", "pages", "account"] as const).flatMap(
    (section) => {
      const own = groups.filter((group) => group.section === section);
      return own.length === 0 ? [] : [{ section, groups: own }];
    },
  );

  return createPortal(
    <Box
      role="dialog"
      aria-label="Jump to an app or page"
      data-strata-app-menu="true"
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
            {inNewTab ? "Go to, new tab" : "Go to"}
          </Box>
          <Box component="span" data-strata-app-menu-typed="true">
            {typed === ""
              ? newTab
                ? "type a label, ⇧ for a new tab"
                : "type a label"
              : typed}
          </Box>
        </Box>
        {/* The sections sit side by side so that all of them fit the window;
            the rule between two is a vertical one. */}
        <Box sx={{ display: "flex", alignItems: "stretch", gap: "14px" }}>
          {sections.map((section, position) => (
            <Fragment key={section.section}>
              {position > 0 && (
                <Box
                  component="hr"
                  sx={{
                    m: 0,
                    border: 0,
                    borderLeft: `1px solid ${strataColors.lineStrong}`,
                  }}
                />
              )}
              <Box
                data-strata-app-menu-section={section.section}
                sx={{ minWidth: 168 }}
              >
                <Box sx={sectionTitleSx}>{SECTION_TITLES[section.section]}</Box>
                {section.groups.map((group) => (
                  <Box key={group.title ?? section.section} sx={{ mb: "8px" }}>
                    {group.title !== null && (
                      <Box sx={groupTitleSx}>{group.title}</Box>
                    )}
                    {group.entries.map((entry) => {
                      const at = index;
                      index += 1;
                      return (
                        <Box
                          key={entry.to}
                          component="button"
                          type="button"
                          data-strata-app-menu-entry={entry.label}
                          aria-label={`Go to ${entry.label}`}
                          onClick={(event) =>
                            choose(
                              entry,
                              newTab && (event.shiftKey || inNewTab),
                            )
                          }
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
                            data-strata-app-menu-label={labels[at]}
                            sx={{
                              flex: "none",
                              minWidth: 18,
                              textAlign: "center",
                            }}
                          />
                          <entry.icon sx={{ fontSize: 16 }} />
                          <Box component="span">{entry.label}</Box>
                        </Box>
                      );
                    })}
                  </Box>
                ))}
              </Box>
            </Fragment>
          ))}
        </Box>
      </Box>
    </Box>,
    document.body,
  );
}

const sectionTitleSx = {
  mb: "6px",
  fontFamily: strataFonts.mono,
  fontSize: 11,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: strataColors.textMuted,
} as const;

const groupTitleSx = {
  mb: "2px",
  fontFamily: strataFonts.mono,
  fontSize: 10,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: strataColors.textFaint,
} as const;
