import type { FocusEvent, PropsWithChildren } from "react";
import { ButtonBase, Box, alpha, styled } from "@mui/material";

import { StrataColumnKeyContext } from "#/core/infra/component/layout/strata-column-key-context";
import { STRATA_COLUMNS_TOP } from "#/core/infra/component/layout/strata-columns-top";
import {
  strataColors,
  strataFonts,
  strataType,
} from "#/core/infra/component/strata-tokens";
import type { StrataPlacedSlot } from "#/core/infra/strata/strata-layout-for";

// How long a panel takes to move to its new place, unless the user prefers
// no motion.
const MOVE_MS = 180;

interface StrataColumnFrameProps {
  id: string;
  /** Null until the layout has placed it, e.g. on the server render. */
  column: StrataPlacedSlot | null;
  /** The column's name, for the spine's and the peek's label. */
  label: string;
  /** Make this the focused panel, which brings it in whole. */
  onFocus: () => void;
  /** Where the leftover room starts when there is no placement yet. */
  fallbackLeft: number;
  /** Whether the panel slides to a new place, rather than jumping. */
  animate: boolean;
  /** For a split column: the id of the section it holds. */
  split?: string;
}

/**
 * One Strata column (ADR 0020): a panel's controls and content, fixed to the
 * window at the place the layout chose. The panels keep their own markup,
 * which was made for a full-width page, so the overrides below squeeze it to
 * the column rather than every panel growing a variant.
 *
 * A spine is the panel folded to 10px; a peek is a panel that only partly
 * fits, laid out at its full size, clipped and striped over.
 */
export function StrataColumnFrame(
  props: PropsWithChildren<StrataColumnFrameProps>,
) {
  const column = props.column;
  const spine = column?.state === "spine";
  const peek = column?.state === "partial";

  function handleFocusCapture(event: FocusEvent<HTMLElement>) {
    // Tabbing into a peek brings it in whole. Focus inside a column nested in
    // this one, which also reaches here, is that column's business.
    if (
      peek &&
      event.target instanceof Element &&
      event.target.closest("[data-strata-column]") === event.currentTarget
    ) {
      props.onFocus();
    }
  }

  return (
    <Frame
      id={props.id}
      data-strata-column={props.id}
      data-folded={spine ? "true" : undefined}
      data-peek={peek ? "true" : undefined}
      data-strata-split={props.split}
      data-focused={column?.focused ? "true" : undefined}
      data-subject-focused={column?.inFocusedSubject ? "true" : undefined}
      data-animate={props.animate ? "true" : undefined}
      tabIndex={-1}
      onFocusCapture={handleFocusCapture}
      style={{
        left: column?.left ?? props.fallbackLeft,
        width: column?.width ?? `calc(100vw - ${props.fallbackLeft}px)`,
      }}
    >
      {spine && (
        <Spine
          aria-label={`Show ${props.label}`}
          title={`Show ${props.label}`}
          onClick={props.onFocus}
        >
          {column?.sliver === true && (
            <SliverLabel aria-hidden="true">{props.label} ›</SliverLabel>
          )}
        </Spine>
      )}
      {peek && (
        <Peek
          aria-label={`Show ${props.label}`}
          title={`Show ${props.label}`}
          onClick={props.onFocus}
        />
      )}
      {/* Kept mounted while folded so its state and scroll position survive.
          It is hidden rather than removed because the columns to its right are
          rendered inside it, in the route tree, though they sit apart on
          screen; each column puts its own visibility back. */}
      <Box
        data-strata-content
        sx={{
          visibility: spine ? "hidden" : "visible",
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          // Pinned to the right edge at the size the panel has when whole, so a
          // peek shows its right part, shifted left, and a panel that comes
          // back slides in from the left rather than growing.
          position: "absolute",
          top: 0,
          bottom: 0,
          right: 0,
          width: column?.contentWidth ?? "100%",
        }}
      >
        <StrataColumnKeyContext.Provider value={column?.key ?? null}>
          {props.children}
        </StrataColumnKeyContext.Provider>
      </Box>
    </Frame>
  );
}

const Frame = styled("div")(({ theme }) => ({
  position: "fixed",
  top: STRATA_COLUMNS_TOP,
  bottom: 0,
  boxSizing: "border-box",
  overflow: "hidden",
  backgroundColor: theme.palette.background.paper,
  borderRight: `1px solid ${theme.palette.divider}`,
  zIndex: theme.zIndex.appBar - 1,
  visibility: "visible",
  "&[data-animate='true']": {
    transition: `left ${MOVE_MS}ms ease, width ${MOVE_MS}ms ease`,
    // The content follows the frame's width, so the two move as one.
    "& > [data-strata-content]": {
      transition: `width ${MOVE_MS}ms ease`,
    },
    "@media (prefers-reduced-motion: reduce)": {
      transition: "none",
      "& > [data-strata-content]": { transition: "none" },
    },
  },
  // The columns to the right sit in the route tree inside the trunk's content,
  // whose Stack would otherwise push each of them down a spacing step.
  "&&": { margin: 0 },
  // The panel itself takes the keyboard focus when it is focused with `h` or
  // `l`; the marker below says so, not the browser's outline.
  "&:focus": { outline: "none" },
  // A 2px line along the top of every column shows what it is about: a dim
  // amber one for the columns of the focused subject (a route column and the
  // sections split out of it), a full amber one for the focused column, and
  // a neutral one for the rest.
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: strataColors.lineStrong,
    zIndex: 2,
    pointerEvents: "none",
  },
  "&[data-subject-focused='true']::before": {
    backgroundColor: strataColors.amberLine,
  },
  "&[data-focused='true']::before": {
    backgroundColor: strataColors.amber,
  },

  // The panels' content, which was padded to centre itself in the window.
  "& #trunk-panel-content, & #branch-panel-content, & #leaf-panel-content, & #tool-panel-content":
    {
      flex: 1,
      minHeight: 0,
      height: "auto",
      overflowY: "auto",
      padding: "0.5rem",
    },
}));

// What a phone's sliver says: the panel it leads to, set upright along the edge.
const SliverLabel = styled("span")(() => ({
  position: "absolute",
  top: 140,
  left: 0,
  right: 0,
  display: "flex",
  justifyContent: "center",
  writingMode: "vertical-rl",
  fontFamily: strataFonts.mono,
  fontSize: strataType.meta.size,
  letterSpacing: "0.04em",
  color: strataColors.amber,
}));

const Spine = styled(ButtonBase)(({ theme }) => ({
  position: "absolute",
  inset: 0,
  width: "100%",
  backgroundColor: strataColors.column,
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.2),
  },
}));

// Covers only this frame, not the columns nested in it, which sit elsewhere on
// screen. Dims what is underneath rather than the content itself, as dimming
// the content would dim the nested columns too.
const Peek = styled(ButtonBase)(({ theme }) => ({
  position: "absolute",
  inset: 0,
  width: "100%",
  zIndex: 1,
  backgroundColor: alpha(theme.palette.background.default, 0.7),
  backgroundImage: `repeating-linear-gradient(135deg, transparent 0 6px, ${strataColors.line} 6px 7px)`,
  "&:hover": {
    backgroundColor: alpha(theme.palette.background.default, 0.5),
  },
}));
