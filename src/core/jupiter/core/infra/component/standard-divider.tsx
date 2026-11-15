import { Box } from "@mui/material";

import { StrataSectionLabel } from "#/core/infra/component/strata/strata-section-label";

interface StandardDividerProps {
  title: string;
  size: "small" | "medium" | "large";
}

/** A section is a mono label, a group a plain bold line (ADR 0019). */
export function StandardDivider(props: StandardDividerProps) {
  return props.size === "medium" ? (
    <Box
      sx={{
        padding: "8px 4px 4px",
        fontWeight: 600,
        color: "text.primary",
      }}
    >
      {props.title}
    </Box>
  ) : (
    <StrataSectionLabel>{props.title}</StrataSectionLabel>
  );
}
