import { styled } from "@mui/material";

import { STRATA_COLUMNS_TOP } from "#/core/infra/component/layout/strata-columns-top";

interface StrataEmptySlotProps {
  side: "left" | "right";
  left: number;
  width: number;
}

/** The room no panel took, on one side of the row, which sits in the middle. */
export function StrataEmptySlot(props: StrataEmptySlotProps) {
  return (
    <EmptySlot
      id={`strata-empty-slot-${props.side}`}
      aria-hidden="true"
      data-side={props.side}
      style={{ left: props.left, width: props.width }}
    />
  );
}

const EmptySlot = styled("div")(({ theme }) => ({
  position: "fixed",
  top: STRATA_COLUMNS_TOP,
  bottom: 0,
  boxSizing: "border-box",
  backgroundColor: theme.palette.background.default,
  zIndex: theme.zIndex.appBar - 2,
  pointerEvents: "none",
  // The row sits in the middle, so its first column needs an edge too.
  "&[data-side='left']": {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));
