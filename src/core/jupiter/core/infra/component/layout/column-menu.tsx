import { MoreHoriz as MoreHorizIcon } from "@mui/icons-material";
import { Box, Divider, IconButton, Menu, MenuItem } from "@mui/material";
import { Fragment, useState } from "react";
import type { MouseEvent } from "react";

import { ColumnMenuActions } from "#/core/infra/component/layout/column-menu-actions";
import type { ColumnMenuEntry } from "#/core/infra/component/layout/column-menu-entry";
import { useStrataColumnKey } from "#/core/infra/component/layout/strata-column-key-context";
import { strataColors } from "#/core/infra/component/strata-tokens";
import { useStrataMenuActions } from "#/core/infra/component/layout/strata-menu-actions";

interface ColumnMenuProps {
  /** The id of the header the menu is in; the button's id starts with it. */
  headerId: string;
  entries: readonly ColumnMenuEntry[];
}

/**
 * The `⋯` of a column's header (ADR 0021): the commands of the column, never
 * things to look at. `.` opens it for the focused column, through the marker
 * on the button. Choosing a command closes the menu first and then runs it.
 *
 * It starts with the actions the headers of the column had no room for, as
 * entries like the commands (`ColumnMenuActions`), each set under the name of
 * its section (the first section's, which is the column's own, under none), and
 * then come the commands.
 */
export function ColumnMenu(props: ColumnMenuProps) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const groups = useStrataMenuActions(useStrataColumnKey());
  const buttonId = `${props.headerId}-menu`;
  const menuId = `${buttonId}-list`;

  function handleOpen(event: MouseEvent<HTMLElement>) {
    setAnchor(event.currentTarget);
  }

  if (props.entries.length === 0 && groups.length === 0) {
    return null;
  }

  return (
    <>
      <IconButton
        id={buttonId}
        type="button"
        data-strata-menu
        aria-label="Menu"
        title="Menu (.)"
        aria-haspopup="menu"
        aria-controls={anchor === null ? undefined : menuId}
        aria-expanded={anchor === null ? undefined : true}
        onClick={handleOpen}
      >
        <MoreHorizIcon />
      </IconButton>
      <Menu
        id={menuId}
        anchorEl={anchor}
        open={anchor !== null}
        onClose={() => setAnchor(null)}
        slotProps={{ list: { "aria-labelledby": buttonId } }}
      >
        {groups.map((group) => (
          <ColumnMenuActions
            key={group.id}
            group={group}
            onClose={() => setAnchor(null)}
          />
        ))}
        {groups.length > 0 && props.entries.length > 0 && <Divider />}
        {props.entries.map((entry) => (
          <Fragment key={entry.id}>
            {entry.divided === true && <Divider />}
            <MenuItem
              id={entry.id}
              disabled={entry.disabled}
              sx={
                entry.danger === true
                  ? { color: (theme) => theme.palette.error.main }
                  : undefined
              }
              onClick={() => {
                setAnchor(null);
                entry.onSelect();
              }}
            >
              {entry.label}
              {entry.hint !== undefined && (
                <Box
                  component="kbd"
                  aria-hidden
                  sx={{
                    marginLeft: "auto",
                    paddingLeft: "16px",
                    fontFamily: "inherit",
                    fontSize: "0.8em",
                    color: strataColors.textMuted,
                  }}
                >
                  {entry.hint}
                </Box>
              )}
            </MenuItem>
          </Fragment>
        ))}
      </Menu>
    </>
  );
}
