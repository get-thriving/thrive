import { Box, alpha, styled } from "@mui/material";

import { STRATA_COLUMNS_TOP } from "#/core/infra/component/layout/strata-columns-top";
import {
  strataColors,
  strataFonts,
} from "#/core/infra/component/strata-tokens";
import type { StrataLayout } from "#/core/infra/strata/strata-layout-for";

interface StrataDebugOverlayProps {
  layout: StrataLayout;
}

/**
 * The unit grid drawn over the columns, with the layout as text, shown with
 * `?strata-debug=1`. Solid lines are where panels meet, dashed ones are unit
 * boundaries inside a panel.
 */
export function StrataDebugOverlay(props: StrataDebugOverlayProps) {
  const { layout } = props;
  const lines: Array<{ left: number; solid: boolean }> = [];
  for (const slot of layout.slots) {
    lines.push({ left: slot.left, solid: true });
    for (let unit = 1; unit < slot.units; unit++) {
      lines.push({ left: slot.left + unit * layout.unitPx, solid: false });
    }
  }
  for (const gutter of layout.gutters) {
    lines.push({ left: gutter.left, solid: true });
  }

  return (
    <Overlay id="strata-debug-overlay" aria-hidden="true">
      {lines.map((line) => (
        <Line
          key={`${line.left}-${line.solid}`}
          style={{ left: line.left }}
          data-solid={line.solid ? "true" : undefined}
        />
      ))}
      <Caption id="strata-debug-layout">
        X={layout.units} · {layout.description}
      </Caption>
    </Overlay>
  );
}

const Overlay = styled(Box)(({ theme }) => ({
  position: "fixed",
  top: STRATA_COLUMNS_TOP,
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: theme.zIndex.modal + 1,
  pointerEvents: "none",
}));

const Line = styled("div")({
  position: "absolute",
  top: 0,
  bottom: 0,
  width: 0,
  borderLeft: `1px dashed ${alpha(strataColors.amber, 0.35)}`,
  "&[data-solid]": {
    borderLeft: `1px solid ${alpha(strataColors.amber, 0.8)}`,
  },
});

const Caption = styled("div")({
  position: "absolute",
  left: 8,
  bottom: 8,
  padding: "2px 6px",
  fontFamily: strataFonts.mono,
  fontSize: 11,
  color: strataColors.amber,
  backgroundColor: alpha(strataColors.ground, 0.9),
  border: `1px solid ${strataColors.lineStrong}`,
});
