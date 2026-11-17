import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

interface EntityArchiveDialogProps {
  open: boolean;
  onClose: () => void;
  /** The entity is archived already: the choice is to remove it for good. */
  archived: boolean;
  /** The confirming button is disabled, as the menu entry was. */
  confirmDisabled: boolean;
  /** The confirming button's id is `<prefix>-entity-archive-confirm`. */
  idPrefix: string;
}

/**
 * Asks whether to archive an entity, or, once it is archived, to remove it for
 * good. It submits the form it is in with `intent` set to `archive` or
 * `remove`, so it is drawn in place rather than in a portal.
 */
export function EntityArchiveDialog(props: EntityArchiveDialogProps) {
  return (
    <Dialog onClose={props.onClose} open={props.open} disablePortal>
      <DialogTitle>Careful!</DialogTitle>
      <DialogContent>
        Are you sure you want to {props.archived ? "remove" : "archive"} this
        entity?
        {props.archived ? " This action cannot be undone." : ""}
      </DialogContent>
      <DialogActions>
        <Button
          id={`${props.idPrefix}-entity-archive-confirm`}
          sx={{ marginLeft: "auto" }}
          disabled={props.confirmDisabled}
          type="submit"
          name="intent"
          value={props.archived ? "remove" : "archive"}
        >
          Yes
        </Button>
        <Button onClick={props.onClose}>No</Button>
      </DialogActions>
    </Dialog>
  );
}
