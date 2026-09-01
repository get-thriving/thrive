import * as React from "react";
import { Box, Chip } from "@mui/material";
import type { ChipProps } from "@mui/material";
import { styled } from "@mui/material/styles";

import { CARD_INNER_CORNER_RADIUS } from "#/core/infra/component/theme";

type ChipComponent = React.ComponentType<ChipProps>;

export const SlimChip: ChipComponent = styled(Chip)<ChipProps>(() => ({
  maxWidth: "130px",
  minWidth: "2rem",
  fontSize: "0.75rem",
  lineHeight: "1rem",
  height: "1rem",
  "& .MuiChip-icon": {
    fontSize: "0.75rem",
    marginLeft: "0.15rem",
    marginRight: "-0.1rem",
  },
}));

export const FatChip: ChipComponent = styled(Chip)<ChipProps>(() => ({
  fontSize: "0.75rem",
  lineHeight: "1rem",
  height: "1rem",
}));

export const CornerChip: ChipComponent = styled(Chip)<ChipProps>(() => ({
  fontSize: "0.75rem",
  height: "1rem",
  paddingTop: "0.05rem",
  paddingBottom: "0.05rem",
  paddingRight: "0.5rem",
  paddingLeft: "0.5rem",
  borderRadius: "0px",
  borderTopLeftRadius: CARD_INNER_CORNER_RADIUS,
  borderBottomRightRadius: "4px",
  width: "fit-content",
}));

export const OwnerCornerChip: ChipComponent = styled(Chip)<ChipProps>(() => ({
  fontSize: "0.6rem",
  height: "0.85rem",
  paddingTop: "0",
  paddingBottom: "0",
  paddingRight: "0.35rem",
  paddingLeft: "0.35rem",
  borderRadius: "0px",
  borderTopLeftRadius: "4px",
  borderBottomRightRadius: CARD_INNER_CORNER_RADIUS,
  width: "fit-content",
  "& .MuiChip-label": {
    paddingLeft: "0.35rem",
    paddingRight: "0.35rem",
  },
}));

export const CardCornerChipStack = styled(Box)({
  position: "absolute",
  top: 0,
  left: 0,
  display: "flex",
  flexDirection: "row",
  zIndex: 1,
  "& .MuiChip-root:not(:last-child)": {
    borderBottomRightRadius: 0,
  },
  "& .MuiChip-root:not(:first-child)": {
    borderTopLeftRadius: 0,
  },
});

export const CardBottomRightChipStack = styled(Box)({
  position: "absolute",
  bottom: 0,
  right: 0,
  display: "flex",
  flexDirection: "row",
  zIndex: 1,
  "& .MuiChip-root:not(:first-child)": {
    borderTopLeftRadius: 0,
  },
  "& .MuiChip-root:not(:last-child)": {
    borderBottomRightRadius: 0,
  },
});
