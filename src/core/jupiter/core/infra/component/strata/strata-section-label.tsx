import type { ReactNode } from "react";
import { Box } from "@mui/material";

import {
  strataColors,
  strataFonts,
  strataType,
} from "#/core/infra/component/strata-tokens";

interface StrataSectionLabelProps {
  children: ReactNode;
  /** Mono text pushed to the right edge, such as a count. */
  trailing?: ReactNode;
}

/** A section heading in a column: mono, small, uppercase, letter-spaced. */
export function StrataSectionLabel(props: StrataSectionLabelProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
        gap: "8px",
        padding: "14px 4px 6px",
        fontFamily: strataFonts.mono,
        fontSize: strataType.sectionLabel.size,
        lineHeight: `${strataType.sectionLabel.lineHeight}px`,
        letterSpacing: strataType.sectionLabel.letterSpacing,
        textTransform: "uppercase",
        color: strataColors.textFaint,
      }}
    >
      <span>{props.children}</span>
      {props.trailing !== undefined && (
        <Box component="span" sx={{ textTransform: "none", letterSpacing: 0 }}>
          {props.trailing}
        </Box>
      )}
    </Box>
  );
}
