import { Box } from "@mui/material";
import type { PropsWithChildren } from "react";

import { StrataLabelChip } from "#/core/infra/component/layout/strata-label-chip";
import { strataColors } from "#/core/infra/component/strata-tokens";

interface StrataMapEntryProps {
  /** The letters that go to it. */
  label: string;
  /** How many of them were typed already. */
  typed: number;
  /** What the typed letters rule out. */
  dimmed: boolean;
  /** Spoken in place of what is drawn. */
  ariaLabel: string;
  /** The id of the section it stands for; left out for a column. */
  section?: string;
  onChoose: () => void;
}

/**
 * One row of the map of the columns: the label to type, then what it goes to,
 * a column or one of its sections. A button, so a click goes there too.
 */
export function StrataMapEntry(props: PropsWithChildren<StrataMapEntryProps>) {
  return (
    <Box
      component="button"
      type="button"
      aria-label={props.ariaLabel}
      data-strata-map-section={props.section}
      onClick={props.onChoose}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        width: "100%",
        padding: "3px 2px",
        border: 0,
        background: "none",
        textAlign: "left",
        font: "inherit",
        cursor: "pointer",
        opacity: props.dimmed ? 0.25 : 1,
        "&:hover": { backgroundColor: strataColors.raised },
      }}
    >
      <StrataLabelChip
        label={props.label}
        typed={props.typed}
        data-strata-map-label={props.label}
        sx={{ flex: "none", minWidth: 18, textAlign: "center" }}
      />
      {props.children}
    </Box>
  );
}
