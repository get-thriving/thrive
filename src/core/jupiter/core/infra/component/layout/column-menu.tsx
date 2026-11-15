import { MoreHoriz as MoreHorizIcon } from "@mui/icons-material";
import { Divider, IconButton, Menu, MenuItem } from "@mui/material";
import { Fragment, useState } from "react";
import type { MouseEvent } from "react";

import type { ColumnMenuEntry } from "#/core/infra/component/layout/column-menu-entry";

interface ColumnMenuProps {
  /** The id of the header the menu is in; the button's id starts with it. */
  headerId: string;
  entries: readonly ColumnMenuEntry[];
}

/**
 * The `⋯` of a column's header (ADR 0021): the commands of the column, never
 * things to look at. `.` opens it for the focused column, through the marker
 * on the button. Choosing a command closes the menu first and then runs it.
 */
export function ColumnMenu(props: ColumnMenuProps) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const buttonId = `${props.headerId}-menu`;
  const menuId = `${buttonId}-list`;

  function handleOpen(event: MouseEvent<HTMLElement>) {
    setAnchor(event.currentTarget);
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
            </MenuItem>
          </Fragment>
        ))}
      </Menu>
    </>
  );
}
