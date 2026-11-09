import { useContext, useState } from "react";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import {
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

interface StrataRailEntriesProps {
  /** Show labels beside the icons, in a wider rail. */
  expanded: boolean;
  /** Whether there is room for the wider rail, so the toggle is offered. */
  canExpand: boolean;
  onToggleExpanded: () => void;
  /** Called after the user picks a destination, e.g. to close a drawer. */
  onNavigate?: () => void;
}

/**
 * The rail's items: the sidebar's destinations that follow the workspace
 * features, the More menu with the rest, and the width toggle. Used in the
 * rail on big screens and in the drawer on small ones.
 */
export function StrataRailEntries(props: StrataRailEntriesProps) {
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
    <>
      {entries.map((entry) => (
        <RailItem
          key={entry.to}
          label={entry.label}
          icon={entry.icon}
          to={entry.to}
          expanded={props.expanded}
          active={isActive(location.pathname, entry)}
          onClick={props.onNavigate}
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
                onClick={() => {
                  setMoreAnchor(null);
                  props.onNavigate?.();
                }}
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
    </>
  );
}
