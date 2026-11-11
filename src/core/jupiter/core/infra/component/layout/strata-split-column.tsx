import { Box, IconButton } from "@mui/material";
import { useCallback } from "react";

import { ColumnHeader } from "#/core/infra/component/layout/column-header";
import { StrataColumnFrame } from "#/core/infra/component/layout/strata-column-frame";
import type { StrataPlacedSlot } from "#/core/infra/strata/strata-layout-for";

interface StrataSplitColumnProps {
  /** The id of the section it holds. */
  id: string;
  title: string;
  /** One of a panel's views, not a section: it closes, it does not fold back. */
  view: boolean;
  column: StrataPlacedSlot;
  offsetLeft: number;
  animate: boolean;
  onFocus: () => void;
  /** Take the section back into the column it came from. */
  onFold: () => void;
  /** Tells the workspace where the section is drawn. */
  setHost: (id: string, element: HTMLElement | null) => void;
}

/**
 * A section split out of its column (ADR 0021): the frame, one header with the
 * section's name and the control to fold it back, and an empty host which the
 * section draws its body into, so the section keeps its place in the tree and
 * with it its data, forms and fetchers. A view of a panel (its history, its
 * sharing) is the same, with a control to close it.
 */
export function StrataSplitColumn(props: StrataSplitColumnProps) {
  const { id, setHost } = props;
  const hostRef = useCallback(
    (element: HTMLElement | null) => setHost(id, element),
    [id, setHost],
  );
  return (
    <StrataColumnFrame
      id={`split-panel-${id}`}
      split={id}
      column={props.column}
      label={props.title}
      onFocus={props.onFocus}
      fallbackLeft={props.offsetLeft}
      animate={props.animate}
    >
      <ColumnHeader id={`split-panel-controls-${id}`} label={props.title}>
        <IconButton
          data-strata-close
          size="small"
          aria-label={
            props.view
              ? `Close ${props.title}`
              : `Fold ${props.title} back into its section`
          }
          title={props.view ? "Close" : "Fold back"}
          onClick={props.onFold}
        >
          <Box
            component="span"
            aria-hidden
            sx={{ fontSize: 14, lineHeight: 1 }}
          >
            {props.view ? "×" : "⇤"}
          </Box>
        </IconButton>
      </ColumnHeader>
      <Box
        ref={hostRef}
        data-strata-split-host
        sx={{ flex: 1, minHeight: 0, overflowY: "auto", p: "0.5rem" }}
      />
    </StrataColumnFrame>
  );
}
