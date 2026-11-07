import { useContext, useState } from "react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import {
  Box,
  IconButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Menu,
  MenuItem,
  Tooltip,
  alpha,
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
import type { RailEntry } from "#/core/infra/component/shell/rail-entry";

function isActive(pathname: string, entry: RailEntry): boolean {
  if (entry.exact) {
    return pathname === entry.to;
  }
  // Docs' entry point redirects, so match on the app's own prefix.
  const base = entry.to.replace(/\/(root-redirect|persons)$/, "");
  return pathname === base || pathname.startsWith(`${base}/`);
}

/**
 * The Strata icon rail (ADR 0019): the sidebar's destinations as a 52px column
 * of icons that is always visible on big screens. Entries follow the same
 * workspace feature gating as the classic sidebar; everything that does not fit
 * lives behind the More button.
 */
export function StrataRail() {
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

  const buttonSx = {
    width: strataSize.railButton,
    height: strataSize.railButton,
    borderRadius: `${theme.shape.borderRadius}px`,
    color: theme.palette.text.secondary,
    "&:hover": { color: theme.palette.text.primary },
  };

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
        width: strataSize.rail,
        zIndex: theme.zIndex.appBar - 1,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "4px",
        paddingBlock: "8px",
        overflowY: "auto",
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": { display: "none" },
        backgroundColor: strataColors.ground,
        borderRight: `1px solid ${theme.palette.divider}`,
      }}
    >
      {entries.map((entry) => {
        const active = isActive(location.pathname, entry);
        const Icon = entry.icon;
        return (
          <Tooltip key={entry.to} title={entry.label} placement="right">
            <IconButton
              component={Link}
              to={entry.to}
              aria-label={entry.label}
              aria-current={active ? "page" : undefined}
              sx={{
                ...buttonSx,
                ...(active && {
                  color: theme.palette.primary.main,
                  backgroundColor: alpha(theme.palette.primary.main, 0.14),
                  "&:hover": {
                    color: theme.palette.primary.main,
                    backgroundColor: alpha(theme.palette.primary.main, 0.2),
                  },
                }),
              }}
            >
              <Icon fontSize="small" />
            </IconButton>
          </Tooltip>
        );
      })}

      <Tooltip title="More" placement="right">
        <IconButton
          aria-label="More"
          aria-haspopup="menu"
          aria-expanded={moreAnchor !== null}
          onClick={(e) => setMoreAnchor(e.currentTarget)}
          sx={buttonSx}
        >
          <MoreHorizIcon fontSize="small" />
        </IconButton>
      </Tooltip>

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
