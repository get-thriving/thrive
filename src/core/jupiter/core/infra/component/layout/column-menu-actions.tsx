import { Check as CheckIcon } from "@mui/icons-material";
import {
  Box,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  MenuItem,
} from "@mui/material";
import { useState } from "react";

import type { StrataCommand } from "#/core/infra/component/layout/strata-command";
import type { StrataMenuActions } from "#/core/infra/component/layout/strata-menu-actions";
import { strataSize, strataType } from "#/core/infra/component/strata-tokens";

interface ColumnMenuActionsProps {
  group: StrataMenuActions;
  /** Closes the menu, as choosing a command does before it runs. */
  onClose: () => void;
}

/**
 * The actions the headers of a column had no room for, as entries of its `⋯`
 * menu like the commands that follow them (ADR 0021): a button or a link is an
 * entry that runs it, and a filter is an entry that opens its choices under it,
 * the one that is on marked. Under the name of the section they are from, when
 * it is not the first one.
 */
export function ColumnMenuActions(props: ColumnMenuActionsProps) {
  const { group } = props;
  return (
    <>
      {group.title !== undefined && (
        <ListSubheader
          disableSticky
          sx={(theme) => ({
            lineHeight: `${strataSize.controlSmall}px`,
            fontFamily: theme.typography.caption.fontFamily,
            fontSize: strataType.label.size,
            letterSpacing: strataType.label.letterSpacing,
            textTransform: strataType.label.textTransform,
          })}
        >
          {group.title}
        </ListSubheader>
      )}
      {group.commands.map((command) =>
        command.choices.length > 0 ? (
          <FilterEntry
            key={command.id}
            command={command}
            onClose={props.onClose}
          />
        ) : (
          <MenuItem
            key={command.id}
            disabled={command.disabled}
            onClick={() => {
              props.onClose();
              command.run();
            }}
          >
            {command.label}
          </MenuItem>
        ),
      )}
    </>
  );
}

function FilterEntry(props: { command: StrataCommand; onClose: () => void }) {
  const { command } = props;
  const [open, setOpen] = useState(false);
  return (
    <>
      <MenuItem
        disabled={command.disabled && command.choices.length === 0}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <ListItemText>{command.label}</ListItemText>
        <Box
          component="span"
          aria-hidden
          sx={(theme) => ({
            ml: 2,
            fontFamily: theme.typography.caption.fontFamily,
            fontSize: strataType.meta.size,
            color: theme.palette.text.secondary,
          })}
        >
          {command.detail !== null ? `${command.detail} ` : ""}
          {open ? "▾" : "▸"}
        </Box>
      </MenuItem>
      {open && (
        <Box sx={{ maxHeight: 240, overflowY: "auto" }}>
          {command.choices.map((choice) => (
            <MenuItem
              key={choice.id}
              dense
              disabled={choice.disabled && !choice.current}
              selected={choice.current}
              sx={{ pl: 4 }}
              onClick={() => {
                if (!choice.stays) {
                  props.onClose();
                }
                choice.run();
              }}
            >
              <ListItemIcon sx={{ minWidth: 24 }}>
                {choice.current && <CheckIcon fontSize="small" />}
              </ListItemIcon>
              <ListItemText>{choice.label}</ListItemText>
            </MenuItem>
          ))}
        </Box>
      )}
    </>
  );
}
