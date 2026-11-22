import { Box } from "@mui/material";
import type { Theme } from "@mui/material";
import type { JSX } from "react";

import { BarControls } from "#/core/infra/component/layout/bar-controls";
import {
  strataColors,
  strataSize,
  strataType,
} from "#/core/infra/component/strata-tokens";

interface SectionHeaderProps {
  /** DOM id of the section's body, which the toggle controls. */
  bodyId: string;
  title: string;
  /** A short summary or count, kept visible while the section is collapsed. */
  summary?: string;
  /** Leave out for a section which can't be collapsed. */
  collapsed?: boolean;
  onToggle?: () => void;
  actions?: JSX.Element;
  /**
   * Leave the title out, for a section in a column of its own, where the
   * column's header already says it.
   */
  hideTitle?: boolean;
  /** `⇥` pulls the section out into a column. */
  splitAction?: { label: string; onClick: () => void };
}

/**
 * A section's title row inside a column: the `▾`/`▸` toggle with the title in
 * mono capitals, a short summary, and the section's own actions at the right,
 * small, and folded into one button when there is no room for them.
 * `▾`/`▸` mean collapse and nothing else (PLAN 3.5).
 */
export function SectionHeader(props: SectionHeaderProps) {
  const collapsible = props.collapsed !== undefined && props.onToggle;
  const label = (
    <>
      {collapsible && (
        <Box component="span" aria-hidden sx={{ width: 12, flex: "none" }}>
          {props.collapsed ? "▸" : "▾"}
        </Box>
      )}
      {props.hideTitle !== true && <Box component="span">{props.title}</Box>}
    </>
  );
  // In a column of its own, a section with nothing to say besides its title
  // has no row at all: the body starts right under the column's header.
  if (
    props.hideTitle === true &&
    (props.summary === undefined || props.summary === "") &&
    props.actions === undefined &&
    props.splitAction === undefined
  ) {
    return null;
  }
  return (
    <Box
      data-strata-section-header
      sx={(theme) => ({
        display: "flex",
        alignItems: "center",
        // The row of a column's header (`ColumnHeader`), so a section reads as
        // a column that has not been split out yet.
        gap: 1.5,
        height: strataSize.columnHeader,
        boxSizing: "border-box",
        px: 1.5,
        borderBottom:
          props.collapsed === true
            ? "none"
            : `1px solid ${theme.palette.divider}`,
      })}
    >
      {props.hideTitle === true ? null : collapsible ? (
        <Box
          component="button"
          type="button"
          onClick={props.onToggle}
          aria-expanded={!props.collapsed}
          aria-controls={props.bodyId}
          aria-label={`${props.collapsed ? "Expand" : "Collapse"} ${props.title}`}
          sx={labelSx}
        >
          {label}
        </Box>
      ) : (
        <Box component="span" sx={labelSx}>
          {label}
        </Box>
      )}
      {props.summary !== undefined && props.summary !== "" && (
        <Box
          component="span"
          sx={(theme) => ({
            fontFamily: theme.typography.caption.fontFamily,
            fontSize: strataType.meta.size,
            color: theme.palette.text.secondary,
            flex: "0 1 auto",
            minWidth: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          })}
        >
          {props.summary}
        </Box>
      )}
      {props.actions === undefined ? (
        <Box sx={{ flex: 1 }} />
      ) : (
        <BarControls title={props.title}>{props.actions}</BarControls>
      )}
      {props.splitAction !== undefined && (
        <Box
          component="button"
          type="button"
          data-strata-split-action="split"
          aria-label={props.splitAction.label}
          title={props.splitAction.label}
          onClick={props.splitAction.onClick}
          sx={(theme) => ({
            flex: "none",
            width: strataSize.controlSmall,
            height: strataSize.controlSmall,
            p: 0,
            border: 0,
            background: "none",
            cursor: "pointer",
            fontFamily: theme.typography.caption.fontFamily,
            fontSize: 16,
            color: theme.palette.text.secondary,
            "&:hover": { color: strataColors.amber },
            "&:focus-visible": {
              outline: `1px solid ${theme.palette.primary.main}`,
              outlineOffset: 2,
            },
          })}
        >
          ⇥
        </Box>
      )}
    </Box>
  );
}

// The name of the section, as the name of a column is in its header: mono
// capitals, small and quiet, `▾` in front of it where it can be collapsed.
const labelSx = (theme: Theme) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 0.5,
  flex: "0 1 auto",
  minWidth: 0,
  p: 0,
  border: 0,
  background: "none",
  cursor: "inherit",
  whiteSpace: "nowrap",
  fontFamily: theme.typography.caption.fontFamily,
  fontSize: strataType.label.size,
  letterSpacing: strataType.label.letterSpacing,
  textTransform: strataType.label.textTransform,
  color: theme.palette.text.secondary,
  // Amber while the section is the one the keyboard is on, as a column's name
  // is while the column is.
  "[data-strata-section]:focus > [data-strata-section-form] > [data-strata-section-header] &, [data-strata-section][data-strata-remembered] > [data-strata-section-form] > [data-strata-section-header] &":
    { color: theme.palette.primary.main },
  "button&": {
    cursor: "pointer",
    "&:hover": { color: theme.palette.text.primary },
    "&:focus-visible": {
      outline: `1px solid ${theme.palette.primary.main}`,
      outlineOffset: 2,
    },
  },
});
