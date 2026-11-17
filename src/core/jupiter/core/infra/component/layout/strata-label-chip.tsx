import { Box } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

import {
  strataColors,
  strataFonts,
  strataRadius,
} from "#/core/infra/component/strata-tokens";

interface StrataLabelChipProps {
  /** The letters of the label. */
  label: string;
  /** How many of them were typed already: they are dimmed. */
  typed: number;
  /** Where it goes, or anything else about it that is not its look. */
  sx?: SxProps<Theme>;
  /** Attributes for the tests to find it by. */
  [attribute: `data-${string}`]: string | undefined;
}

/**
 * The little amber tag with the letters to type, as hint mode puts on what it
 * offers and the map of the columns on what it jumps to. The letters that were
 * typed are dimmed, so what is left to type stands out.
 */
export function StrataLabelChip(props: StrataLabelChipProps) {
  const { label, typed, sx, ...attributes } = props;
  return (
    <Box
      component="span"
      aria-hidden="true"
      {...attributes}
      sx={[
        {
          padding: "0 4px",
          lineHeight: "16px",
          fontFamily: strataFonts.mono,
          fontSize: 11,
          fontWeight: 500,
          textTransform: "uppercase",
          color: strataColors.ground,
          backgroundColor: strataColors.amber,
          border: `1px solid ${strataColors.amberHover}`,
          borderRadius: `${strataRadius.small}px`,
          boxShadow: "0 1px 3px rgba(0,0,0,0.6)",
          whiteSpace: "nowrap",
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Box component="span" sx={{ opacity: 0.4 }}>
        {label.slice(0, typed)}
      </Box>
      {label.slice(typed)}
    </Box>
  );
}
