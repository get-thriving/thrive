import { Drawer } from "@mui/material";

import { STRATA_PHONE_BAR_HEIGHT_PX } from "#/core/infra/component/layout/strata-columns-top";
import { StrataRailEntries } from "#/core/infra/component/shell/strata-rail-entries";
import { strataColors } from "#/core/infra/component/strata-tokens";

const DRAWER_WIDTH_PX = 260;

interface StrataDrawerProps {
  open: boolean;
  onClose: () => void;
}

/**
 * On a small screen the rail is a drawer: the same entries, with their names,
 * under the top bar.
 */
export function StrataDrawer(props: StrataDrawerProps) {
  return (
    <Drawer
      id="strata-drawer"
      anchor="left"
      open={props.open}
      onClose={props.onClose}
      slotProps={{
        paper: {
          component: "nav",
          "aria-label": "Main",
          sx: {
            width: DRAWER_WIDTH_PX,
            boxSizing: "border-box",
            top: `calc(env(safe-area-inset-top) + ${STRATA_PHONE_BAR_HEIGHT_PX}px)`,
            height: "auto",
            bottom: 0,
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            padding: "8px",
            overflowY: "auto",
            backgroundColor: strataColors.ground,
            borderRight: `1px solid ${strataColors.line}`,
            backgroundImage: "none",
          },
        },
      }}
    >
      <StrataRailEntries
        expanded
        canExpand={false}
        onToggleExpanded={props.onClose}
        onNavigate={props.onClose}
      />
    </Drawer>
  );
}
