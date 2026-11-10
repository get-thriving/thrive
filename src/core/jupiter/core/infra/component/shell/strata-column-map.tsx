import { Box } from "@mui/material";
import { useContext } from "react";

import { StrataColumnsContext } from "#/core/infra/component/layout/strata-columns-context";
import { strataColors } from "#/core/infra/component/strata-tokens";

/**
 * In the top bar: one square for each open panel, as it is laid out. Whole
 * panels are wide, a peek is striped and a spine is a thin bar; the focused one
 * is amber. Each is a button that focuses its panel.
 */
export function StrataColumnMap() {
  const columns = useContext(StrataColumnsContext);

  if (columns === null || columns.slots.length < 2) {
    return null;
  }

  return (
    <Box
      id="strata-column-map"
      role="group"
      aria-label="Open columns"
      sx={{ display: "flex", alignItems: "center", gap: "4px", mx: 2 }}
    >
      {columns.slots.map((slot, index) => {
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
              height: 12,
              width: slot.state === "spine" ? 4 : 16,
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
  );
}
