import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
} from "@mui/material";

import {
  strataColors,
  strataRadius,
} from "#/core/infra/component/strata-tokens";

interface EntityArchiveDialogProps {
  open: boolean;
  onClose: () => void;
  /** The entity is archived already: the choice is to remove it for good. */
  archived: boolean;
  /** The confirming button is disabled, as the menu entry was. */
  confirmDisabled: boolean;
  /** The confirming button's id is `<prefix>-entity-archive-confirm`. */
  idPrefix: string;
  /** The id of the form the confirming button submits. */
  formId: string;
}

/**
 * `y` answers yes and `n` no, wherever the focus is in the dialog: the footer
 * lists them (`overlay: "confirm"`). Not with `Ctrl`, `Alt` or `Cmd` held, so
 * browser shortcuts keep working.
 */
function useConfirmKeys(
  open: boolean,
  confirmId: string,
  confirmDisabled: boolean,
  onNo: () => void,
) {
  useEffect(() => {
    if (!open) {
      return;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.altKey || event.metaKey || event.repeat) {
        return;
      }
      const key = event.key.toLowerCase();
      if (key === "n") {
        event.preventDefault();
        event.stopPropagation();
        onNo();
      } else if (key === "y") {
        event.preventDefault();
        event.stopPropagation();
        if (!confirmDisabled) {
          document.getElementById(confirmId)?.click();
        }
      }
    };
    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [open, confirmId, confirmDisabled, onNo]);
}

/** A button's label with the key that presses it, drawn as the footer does. */
function WithKey(props: { keyName: string; children: ReactNode }) {
  return (
    <>
      {props.children}
      <Box
        component="kbd"
        aria-hidden
        sx={{
          marginLeft: "8px",
          fontFamily: "inherit",
          fontSize: "0.75em",
          lineHeight: "14px",
          paddingInline: "5px",
          textTransform: "none",
          color: strataColors.textMuted,
          border: `1px solid ${strataColors.lineStrong}`,
          borderRadius: `${strataRadius.small}px`,
        }}
      >
        {props.keyName}
      </Box>
    </>
  );
}

/**
 * Asks whether to archive an entity, or, once it is archived, to remove it for
 * good. Its button submits the form of the panel, by the `form` attribute, with
 * `intent` set to `archive` or `remove`. It is drawn in a portal, over
 * everything: in place, it would be in the stack of its column, which the
 * columns beside it, the rail and the footer paint over.
 */
export function EntityArchiveDialog(props: EntityArchiveDialogProps) {
  // What it asks is what it was opened with: archiving makes the entity
  // archived while the dialog is still on its way out, and it must not turn
  // into the question about removing it for good, nor submit that.
  const [archived, setArchived] = useState(props.archived);
  if (!props.open && archived !== props.archived) {
    setArchived(props.archived);
  }
  const confirmId = `${props.idPrefix}-entity-archive-confirm`;
  useConfirmKeys(props.open, confirmId, props.confirmDisabled, props.onClose);
  return (
    <Dialog
      onClose={props.onClose}
      open={props.open}
      slotProps={{ root: { "data-strata-confirm": "" } as object }}
    >
      <DialogTitle>Careful!</DialogTitle>
      <DialogContent>
        Are you sure you want to {archived ? "remove" : "archive"} this entity?
        {archived ? " This action cannot be undone." : ""}
      </DialogContent>
      <DialogActions>
        <Button
          id={confirmId}
          sx={{ marginLeft: "auto" }}
          disabled={props.confirmDisabled}
          form={props.formId}
          type="submit"
          name="intent"
          value={archived ? "remove" : "archive"}
          aria-keyshortcuts="y"
        >
          <WithKey keyName="y">Yes</WithKey>
        </Button>
        <Button onClick={props.onClose} aria-keyshortcuts="n">
          <WithKey keyName="n">No</WithKey>
        </Button>
      </DialogActions>
    </Dialog>
  );
}
