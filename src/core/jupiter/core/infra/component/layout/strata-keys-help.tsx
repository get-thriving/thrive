import { Box, useTheme } from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router";

import { isTypingTarget } from "#/core/infra/component/layout/is-typing-target";
import { StrataColumnsContext } from "#/core/infra/component/layout/strata-columns-context";
import { useStrataKeysContext } from "#/core/infra/component/layout/use-strata-keys-context";
import {
  strataColors,
  strataFonts,
  strataRadius,
} from "#/core/infra/component/strata-tokens";
import { useStrataKeyBindings } from "#/core/infra/component/use-strata-key-bindings";
import type { StrataFooterKey } from "#/core/infra/strata/strata-footer-key";
import { strataFooterKeys } from "#/core/infra/strata/strata-footer-keys";
import { isStrataKeysHelpKey } from "#/core/infra/strata/strata-keys-help-key";

/** What the list says besides the keys of the footer: they work anywhere. */
const ALWAYS: StrataFooterKey[] = [
  { keys: ["⌘K", "ctrl K"], label: "search everything" },
  { keys: ["/"], label: "this list" },
];

/** The list of keys, for the focused column, read while the list is open. */
function KeysHelpList() {
  const theme = useTheme();
  const keyBindings = useStrataKeyBindings();
  const columns = useContext(StrataColumnsContext);
  const context = useStrataKeysContext(columns?.slots ?? []);
  const keys = [...strataFooterKeys(context, keyBindings), ...ALWAYS];

  return (
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
        zIndex: theme.zIndex.tooltip + 1,
      }}
    >
      <Box
        sx={{
          mb: "10px",
          fontFamily: strataFonts.mono,
          fontSize: 11,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: strataColors.amber,
        }}
      >
        Keys that work now
      </Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
          gap: "6px 24px",
          minWidth: 260,
        }}
      >
        {keys.map((entry) => (
          <Box
            key={`${entry.keys.join("")}${entry.label}`}
            data-strata-keys-help-key={entry.label}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: 13,
              color: strataColors.textSecondary,
            }}
          >
            <Box
              sx={{
                display: "inline-flex",
                gap: "3px",
                flex: "none",
                minWidth: 64,
              }}
            >
              {entry.keys.map((key) => (
                <Box
                  key={key}
                  component="kbd"
                  sx={{
                    fontFamily: strataFonts.mono,
                    fontSize: 11,
                    lineHeight: "16px",
                    paddingInline: "5px",
                    color: strataColors.textMuted,
                    border: `1px solid ${strataColors.lineStrong}`,
                    borderRadius: `${strataRadius.small}px`,
                  }}
                >
                  {key}
                </Box>
              ))}
            </Box>
            <span>{entry.label}</span>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

/**
 * The list of the keys that work right now, drawn large (ADR 0021): the strip at
 * the bottom shows the same, but it drops what does not fit, and is small. `/`
 * opens it, `Escape` or `/` leaves, and so does a click outside, a move to
 * another page, or a shortcut with a modifier. It has the keys of the focused
 * column as they are now, and the search that works anywhere. It is not one of
 * the actions whose key the user chooses: `/` is its own, unless the user gave
 * it to find, which then keeps it.
 */
export function StrataKeysHelp() {
  const location = useLocation();
  const columns = useContext(StrataColumnsContext);
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);
  const phoneRef = useRef(false);
  phoneRef.current = columns?.phone ?? false;

  const keyBindings = useStrataKeyBindings();

  useEffect(() => {
    function change(next: boolean) {
      openRef.current = next;
      setOpen(next);
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (!openRef.current) {
        if (
          phoneRef.current ||
          event.isComposing ||
          !isStrataKeysHelpKey(
            event,
            isTypingTarget(event.target),
            keyBindings,
          ) ||
          document.querySelector(
            "[data-strata-hints], [data-strata-app-menu], [data-strata-new-menu], [data-strata-commands-menu], [data-strata-map], [data-strata-find]",
          ) !== null
        ) {
          return;
        }
        event.preventDefault();
        event.stopImmediatePropagation();
        change(true);
        return;
      }
      // A shortcut of the browser or the app goes on, and closes the list.
      if (
        event.ctrlKey ||
        event.metaKey ||
        event.altKey ||
        /^F\d{1,2}$/.test(event.key)
      ) {
        change(false);
        return;
      }
      event.preventDefault();
      event.stopImmediatePropagation();
      if (event.key === "Escape" || event.key === "/") {
        change(false);
      }
    }
    function close() {
      if (openRef.current) {
        change(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown, true);
    window.addEventListener("blur", close);
    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
      window.removeEventListener("blur", close);
    };
  }, [keyBindings]);

  // A move to another page leaves a stale list behind.
  useEffect(() => {
    openRef.current = false;
    setOpen(false);
  }, [location.key]);

  if (!open) {
    return null;
  }

  return createPortal(
    <Box
      role="region"
      aria-label="Keys that work now"
      data-strata-keys-help="true"
      onClick={(event) => {
        // A click on the dimmed window around the list leaves it.
        if (event.target === event.currentTarget) {
          openRef.current = false;
          setOpen(false);
        }
      }}
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 1500,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.55)",
      }}
    >
      <KeysHelpList />
    </Box>,
    document.body,
  );
}
