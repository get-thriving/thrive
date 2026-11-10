import { Box } from "@mui/material";
import type { JSX } from "react";

import {
  strataColors,
  strataFonts,
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
  /** Said after the summary, e.g. "folded back · no room". */
  tag?: string;
  /**
   * Leave the title out, for a section in a column of its own, where the
   * column's header already says it.
   */
  hideTitle?: boolean;
  /** `⇥` pulls the section out into a column; `⇤` takes it back. */
  splitAction?: { kind: "split" | "fold"; label: string; onClick: () => void };
}

/**
 * A section's title row inside a column: the `▾`/`▸` toggle with the title in
 * mono capitals, a short summary, and the section's own actions at the right.
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
  return (
    <Box
      data-strata-section-header
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        minHeight: strataSize.sectionHeader,
        px: 0.5,
      }}
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
          sx={{
            fontFamily: strataFonts.mono,
            fontSize: strataType.meta.size,
            color: strataColors.textFaint,
            minWidth: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {props.summary}
        </Box>
      )}
      {props.tag !== undefined && (
        <Box
          component="span"
          data-strata-section-tag
          sx={{
            flex: "none",
            fontFamily: strataFonts.mono,
            fontSize: strataType.meta.size,
            color: strataColors.amber,
          }}
        >
          {props.tag}
        </Box>
      )}
      <Box sx={{ flex: 1 }} />
      {props.actions}
      {props.splitAction !== undefined && (
        <Box
          component="button"
          type="button"
          data-strata-split-action={props.splitAction.kind}
          aria-label={props.splitAction.label}
          title={props.splitAction.label}
          onClick={props.splitAction.onClick}
          sx={{
            flex: "none",
            p: "0 4px",
            border: 0,
            background: "none",
            cursor: "pointer",
            fontFamily: strataFonts.mono,
            fontSize: strataType.sectionLabel.size,
            color: strataColors.textFaint,
            "&:hover": { color: strataColors.amber },
          }}
        >
          {props.splitAction.kind === "split" ? "⇥" : "⇤"}
        </Box>
      )}
    </Box>
  );
}

const labelSx = {
  display: "inline-flex",
  alignItems: "center",
  gap: 0.5,
  flex: "none",
  p: 0,
  border: 0,
  background: "none",
  cursor: "inherit",
  fontFamily: strataFonts.mono,
  fontSize: strataType.sectionLabel.size,
  letterSpacing: strataType.sectionLabel.letterSpacing,
  textTransform: "uppercase",
  color: strataColors.textFaint,
  "button&": {
    cursor: "pointer",
    "&:hover": { color: strataColors.text },
  },
} as const;
