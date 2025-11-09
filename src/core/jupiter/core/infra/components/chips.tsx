import * as React from "react";
import Chip, { type ChipProps } from "@mui/material/Chip";
import { styled } from "@mui/material/styles";

type ChipComponent = React.ComponentType<ChipProps>;

export const SlimChip: ChipComponent = styled(Chip)<ChipProps>(() => ({
  maxWidth: "130px",
  fontSize: "0.75rem",
  lineHeight: "1rem",
  height: "1rem",
}));

export const FatChip: ChipComponent = styled(Chip)<ChipProps>(() => ({
  fontSize: "0.75rem",
  lineHeight: "1rem",
  height: "1rem",
}));
