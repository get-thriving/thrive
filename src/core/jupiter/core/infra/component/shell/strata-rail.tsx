import { Box, useTheme } from "@mui/material";

import { strataColors, strataSize } from "#/core/infra/component/strata-tokens";
import { StrataRailEntries } from "#/core/infra/component/shell/strata-rail-entries";

interface StrataRailProps {
  /** Show labels beside the icons, in a wider rail. */
  expanded: boolean;
  /** Whether the window has room for the wider rail, so the toggle is offered. */
  canExpand: boolean;
  onToggleExpanded: () => void;
}

/**
 * The Strata icon rail (ADR 0019): the sidebar's destinations as a 52px column
 * of icons that is always visible on big screens. Everything that does not fit
 * lives behind the More button.
 */
export function StrataRail(props: StrataRailProps) {
  const theme = useTheme();

  return (
    <Box
      component="nav"
      aria-label="Main"
      sx={{
        position: "fixed",
        // Below the app bar, which is a static 4rem toolbar (3.5rem on small
        // screens, where the rail is not shown).
        top: "calc(env(safe-area-inset-top) + 4rem)",
        bottom: 0,
        left: 0,
        width: props.expanded ? strataSize.railExpanded : strataSize.rail,
        zIndex: theme.zIndex.appBar - 1,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: props.expanded ? "stretch" : "center",
        gap: "4px",
        paddingBlock: "8px",
        paddingInline: props.expanded ? "8px" : 0,
        overflowY: "auto",
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": { display: "none" },
        backgroundColor: strataColors.ground,
        borderRight: `1px solid ${theme.palette.divider}`,
      }}
    >
      <StrataRailEntries
        expanded={props.expanded}
        canExpand={props.canExpand}
        onToggleExpanded={props.onToggleExpanded}
      />
    </Box>
  );
}
