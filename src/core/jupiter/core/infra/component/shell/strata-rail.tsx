import { useContext, useState } from "react";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import {
  Box,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Menu,
  MenuItem,
  useTheme,
} from "@mui/material";
import { Link, useLocation } from "react-router";

import { isWorkspaceFeatureAvailable } from "#/core/workspaces/root";
import { TopLevelInfoContext } from "#/core/infra/top-level-context";
import { strataColors, strataSize } from "#/core/infra/component/strata-tokens";
import {
  RAIL_ENTRIES,
  RAIL_MORE_GROUPS,
} from "#/core/infra/component/shell/rail-entries";
import { RailItem } from "#/core/infra/component/shell/rail-item";
import type { RailEntry } from "#/core/infra/component/shell/rail-entry";

function isActive(pathname: string, entry: RailEntry): boolean {
  if (entry.exact) {
    return pathname === entry.to;
  }
  // Docs' entry point redirects, so match on the app's own prefix.
  const base = entry.to.replace(/\/(root-redirect|persons)$/, "");
  return pathname === base || pathname.startsWith(`${base}/`);
}

interface StrataRailProps {
  /** Show labels beside the icons, in a wider rail. */
  expanded: boolean;
  /** Whether the window has room for the wider rail, so the toggle is offered. */
  canExpand: boolean;
  onToggleExpanded: () => void;
}

/**
 * The Strata icon rail (ADR 0019): the sidebar's destinations as a 52px column
 * of icons that is always visible on big screens. Entries follow the same
 * workspace feature gating as the classic sidebar; everything that does not fit
 * lives behind the More button.
 */
export function StrataRail(props: StrataRailProps) {
  const theme = useTheme();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const location = useLocation();
  const [moreAnchor, setMoreAnchor] = useState<HTMLElement | null>(null);

  const entries = RAIL_ENTRIES.filter(
    (entry) =>
      entry.features === undefined ||
      entry.features.some((feature) =>
        isWorkspaceFeatureAvailable(topLevelInfo.workspace, feature),
      ),
  );

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
      {entries.map((entry) => (
        <RailItem
          key={entry.to}
          label={entry.label}
          icon={entry.icon}
          to={entry.to}
          expanded={props.expanded}
          active={isActive(location.pathname, entry)}
        />
      ))}

      <RailItem
        label="More"
        icon={MoreHorizIcon}
        expanded={props.expanded}
        onClick={(e) => setMoreAnchor(e.currentTarget)}
        ariaProps={{
          "aria-haspopup": "menu",
          "aria-expanded": moreAnchor !== null,
        }}
      />

      {props.canExpand && (
        <RailItem
          label={props.expanded ? "Collapse sidebar" : "Expand sidebar"}
          icon={
            props.expanded
              ? KeyboardDoubleArrowLeftIcon
              : KeyboardDoubleArrowRightIcon
          }
          expanded={props.expanded}
          onClick={props.onToggleExpanded}
        />
      )}

      <Menu
        anchorEl={moreAnchor}
        open={moreAnchor !== null}
        onClose={() => setMoreAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        {RAIL_MORE_GROUPS.flatMap((group) => [
          <ListSubheader
            key={`${group.title}-title`}
            sx={{
              lineHeight: "28px",
              fontFamily: theme.typography.overline.fontFamily,
              fontSize: theme.typography.overline.fontSize,
              letterSpacing: theme.typography.overline.letterSpacing,
              textTransform: "uppercase",
              backgroundColor: "transparent",
              color: theme.palette.text.secondary,
            }}
          >
            {group.title}
          </ListSubheader>,
          ...group.entries.map((entry) => {
            const Icon = entry.icon;
            return (
              <MenuItem
                key={entry.to}
                component={Link}
                to={entry.to}
                selected={isActive(location.pathname, entry)}
                onClick={() => setMoreAnchor(null)}
              >
                <ListItemIcon>
                  <Icon fontSize="small" />
                </ListItemIcon>
                <ListItemText>{entry.label}</ListItemText>
              </MenuItem>
            );
          }),
        ])}
      </Menu>
    </Box>
  );
}
