import type { PropsWithChildren } from "react";
import { ButtonBase, Box, alpha, styled } from "@mui/material";

import type { ColumnPlacement } from "#/core/infra/component/layout/column-placement";
import { strataColors } from "#/core/infra/component/strata-tokens";

/** Where the columns start from the top: below the app bar. */
const COLUMNS_TOP = "calc(env(safe-area-inset-top) + 4rem)";
const CONTROLS_HEIGHT = 44;

interface StrataColumnFrameProps {
  id: string;
  /** Null until the layout has placed it, e.g. on the server render. */
  placement: ColumnPlacement | null;
  /** The column's name, for the spine's label. */
  label: string;
  onUnfold: () => void;
  /** Where the leftover room starts when there is no placement yet. */
  fallbackLeft: number;
}

/**
 * One Strata column (ADR 0019): a panel's controls and content, fixed to the
 * window at the place the layout chose, with no animation. The panels keep
 * their own markup, which was made for a full-width page, so the overrides
 * below squeeze it to the column rather than every panel growing a variant.
 */
export function StrataColumnFrame(
  props: PropsWithChildren<StrataColumnFrameProps>,
) {
  const placement = props.placement;
  const folded = placement?.folded ?? false;

  return (
    <Frame
      id={props.id}
      data-folded={folded ? "true" : undefined}
      style={{
        left: placement?.left ?? props.fallbackLeft,
        width: placement?.width ?? `calc(100vw - ${props.fallbackLeft}px)`,
      }}
    >
      {folded && (
        <Spine
          aria-label={`Show ${props.label}`}
          title={`Show ${props.label}`}
          onClick={props.onUnfold}
        />
      )}
      {/* Kept mounted while folded so its state and scroll position survive.
          It is hidden rather than removed because the columns to its right are
          rendered inside it, in the route tree, though they sit apart on
          screen; each column puts its own visibility back. */}
      <Box
        sx={{
          visibility: folded ? "hidden" : "visible",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          minWidth: 0,
        }}
      >
        {props.children}
      </Box>
    </Frame>
  );
}

const Frame = styled("div")(({ theme }) => ({
  position: "fixed",
  top: COLUMNS_TOP,
  bottom: 0,
  boxSizing: "border-box",
  overflow: "hidden",
  backgroundColor: theme.palette.background.paper,
  borderRight: `1px solid ${theme.palette.divider}`,
  zIndex: theme.zIndex.appBar - 1,
  visibility: "visible",
  // The columns to the right sit in the route tree inside the trunk's content,
  // whose Stack would otherwise push each of them down a spacing step.
  "&&": { margin: 0 },

  // The panels' control bars: a flat 44px strip, not a raised full-width one.
  "& [id$='-panel-controls']": {
    flex: "none",
    height: CONTROLS_HEIGHT,
    marginBottom: 0,
    boxShadow: "none",
    borderBottom: `1px solid ${theme.palette.divider}`,
    alignItems: "center",
  },
  // Trunk and branch centre their controls in a 1200px box; fill the column.
  "& #trunk-panel-controls > div, & #branch-panel-controls > div": {
    width: "100%",
    margin: 0,
    paddingInline: "0.5rem",
  },
  // And the content, which was padded to centre itself in the window.
  "& #trunk-panel-content, & #branch-panel-content, & #leaf-panel-content, & #tool-panel-content":
    {
      flex: 1,
      minHeight: 0,
      height: "auto",
      overflowY: "auto",
      padding: "0.5rem",
    },
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
