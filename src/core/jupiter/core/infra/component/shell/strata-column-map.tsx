import { Box } from "@mui/material";
import { useContext, useEffect, useRef } from "react";

import { StrataColumnsContext } from "#/core/infra/component/layout/strata-columns-context";
import { strataColors } from "#/core/infra/component/strata-tokens";
import type { StrataPlacedSlot } from "#/core/infra/strata/strata-layout-for";

/** The side of a column's square, in px. */
const SQUARE = 18;
/** The gap between squares of one subject, and between subjects, in px. */
const GAP_IN = 2;
const GAP_BETWEEN = 5;
/** How many columns fit before the map scrolls. */
const FITS = 7;
/** Seven squares, each in a subject of its own, is the widest the map gets. */
const MAX_WIDTH = FITS * SQUARE + (FITS - 1) * GAP_BETWEEN;

/**
 * In the top bar: one square for each open panel, all the same size. A whole
 * panel is a plain square, a peek is striped, a spine is a darker one and the
 * focused one is amber. Each square is a button that focuses its panel.
 */
export function StrataColumnMap() {
  const columns = useContext(StrataColumnsContext);
  const mapRef = useRef<HTMLDivElement>(null);
  const focusedIndex = columns?.slots.findIndex((slot) => slot.focused) ?? -1;

  // Past seven columns the map scrolls; keep the focused square in view.
  useEffect(() => {
    const map = mapRef.current;
    const square = map?.querySelector<HTMLElement>('[aria-current="true"]');
    if (map === null || square === null || square === undefined) {
      return;
    }
    const left = square.offsetLeft;
    if (left < map.scrollLeft) {
      map.scrollLeft = left;
    } else if (left + square.offsetWidth > map.scrollLeft + map.clientWidth) {
      map.scrollLeft = left + square.offsetWidth - map.clientWidth;
    }
  }, [focusedIndex, columns?.slots.length]);

  if (columns === null || columns.slots.length < 2) {
    return null;
  }

  // The squares of one subject sit together, under one line.
  const groups: Array<{
    subject: number;
    focused: boolean;
    entries: Array<{ slot: StrataPlacedSlot; index: number }>;
  }> = [];
  columns.slots.forEach((slot, index) => {
    const last = groups[groups.length - 1];
    if (last !== undefined && last.subject === slot.subject) {
      last.entries.push({ slot, index });
      last.focused = last.focused || slot.inFocusedSubject;
    } else {
      groups.push({
        subject: slot.subject,
        focused: slot.inFocusedSubject,
        entries: [{ slot, index }],
      });
    }
  });

  return (
    <Box
      id="strata-column-map"
      ref={mapRef}
      role="group"
      aria-label="Open columns"
      sx={{
        display: "flex",
        alignItems: "flex-end",
        gap: `${GAP_BETWEEN}px`,
        mx: 2,
        flex: "none",
        maxWidth: MAX_WIDTH,
        position: "relative",
        overflowX: "auto",
        overflowY: "hidden",
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": { display: "none" },
      }}
    >
      {groups.map((group) => (
        <Box
          key={group.subject}
          data-subject={group.subject}
          data-subject-focused={group.focused ? "true" : undefined}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: `${GAP_IN}px`,
            flex: "none",
            pb: "3px",
            // One underline for the squares of a subject, amber for the
            // focused one, as along the top of its columns.
            borderBottom: `2px solid ${
              group.focused ? strataColors.amber : strataColors.lineStrong
            }`,
          }}
        >
          {group.entries.map(({ slot, index }) => {
            const state =
              slot.state === "spine"
                ? "folded"
                : slot.state === "partial"
                  ? "partly shown"
                  : "shown";
            return (
              <Box
                key={slot.key}
                component="button"
                type="button"
                data-state={slot.state}
                aria-label={`Column ${index + 1} of ${columns.slots.length}, ${state}${
                  slot.focused ? ", focused" : ""
                }`}
                aria-current={slot.focused ? "true" : undefined}
                title={`Column ${index + 1} of ${columns.slots.length}`}
                onClick={() => columns.focusAt(index)}
                sx={{
                  height: SQUARE,
                  width: SQUARE,
                  flex: "none",
                  padding: 0,
                  cursor: "pointer",
                  borderRadius: "2px",
                  border: `1px solid ${
                    slot.focused ? strataColors.amber : strataColors.lineStrong
                  }`,
                  backgroundColor: slot.focused
                    ? strataColors.amber
                    : slot.state === "spine"
                      ? strataColors.lineStrong
                      : strataColors.raised,
                  backgroundImage:
                    slot.state === "partial"
                      ? `repeating-linear-gradient(135deg, transparent 0 2px, ${strataColors.lineStrong} 2px 3px)`
                      : "none",
                  "&:hover": { borderColor: strataColors.amberHover },
                }}
              />
            );
          })}
        </Box>
      ))}
    </Box>
  );
}
