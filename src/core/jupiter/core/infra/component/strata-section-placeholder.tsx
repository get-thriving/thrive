import { Box } from "@mui/material";

import {
  strataColors,
  strataFonts,
  strataSize,
  strataType,
} from "#/core/infra/component/strata-tokens";

interface StrataSectionPlaceholderProps {
  title: string;
  /** Focuses the column the section went to. */
  onClick: () => void;
}

/** What a section leaves where it was while it is a column of its own. */
export function StrataSectionPlaceholder(props: StrataSectionPlaceholderProps) {
  return (
    <Box
      component="button"
      type="button"
      data-strata-section-placeholder
      onClick={props.onClick}
      sx={{
        display: "block",
        width: "100%",
        minHeight: strataSize.sectionHeader,
        px: 0.5,
        border: 0,
        background: "none",
        textAlign: "left",
        cursor: "pointer",
        fontFamily: strataFonts.mono,
        fontSize: strataType.meta.size,
        color: strataColors.textFaint,
        "&:hover": { color: strataColors.amber },
      }}
    >
      → {props.title.toLowerCase()} · in its own column
    </Box>
  );
}
