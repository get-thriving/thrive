import { Close as CloseIcon } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import { Link } from "react-router";

interface ColumnCloseProps {
  /** A route column closes by going to where it came from. */
  to?: string;
  /** A split column closes, or folds back, by this. */
  onClick?: () => void;
  label: string;
  title: string;
  /** `⇤` for a section that folds back into its column, `×` otherwise. */
  fold?: boolean;
}

/**
 * The close control at the right end of a column's header: `×` for a route
 * column, a link to where it closes to; `⇤` for a section split out of its
 * column, which folds back; `×` for a view. `Escape` uses it too, through the
 * marker, so its kept filters and its unsaved-changes check stay the panel's.
 */
export function ColumnClose(props: ColumnCloseProps) {
  const icon =
    props.fold === true ? (
      <Box component="span" aria-hidden sx={{ fontSize: 14, lineHeight: 1 }}>
        ⇤
      </Box>
    ) : (
      <CloseIcon />
    );
  if (props.to !== undefined) {
    return (
      <IconButton
        component={Link}
        to={props.to}
        data-strata-close
        aria-label={props.label}
        title={props.title}
      >
        {icon}
      </IconButton>
    );
  }
  return (
    <IconButton
      data-strata-close
      aria-label={props.label}
      title={props.title}
      onClick={props.onClick}
    >
      {icon}
    </IconButton>
  );
}
