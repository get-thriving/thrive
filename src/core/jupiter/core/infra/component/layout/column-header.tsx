import { styled } from "@mui/material";
import type { PropsWithChildren } from "react";

import { strataSize, strataType } from "#/core/infra/component/strata-tokens";

interface ColumnHeaderProps {
  id: string;
  /** The column's name, set in mono capitals; amber while the column is focused. */
  label: string;
}

/**
 * The one header of a Strata column: its name on the left and the controls the
 * panel offers after it. There is no second title row above or below it.
 */
export function ColumnHeader(props: PropsWithChildren<ColumnHeaderProps>) {
  return (
    <Header id={props.id} data-strata-header>
      <Label>{props.label}</Label>
      <Actions>{props.children}</Actions>
    </Header>
  );
}

const Header = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  flex: "none",
  height: strataSize.columnHeader,
  boxSizing: "border-box",
  paddingInline: theme.spacing(1.5),
  gap: theme.spacing(1.5),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const Label = styled("span")(({ theme }) => ({
  flex: "none",
  fontFamily: theme.typography.caption.fontFamily,
  fontSize: strataType.label.size,
  letterSpacing: strataType.label.letterSpacing,
  textTransform: strataType.label.textTransform,
  color: theme.palette.text.secondary,
  // The frame says which column is focused.
  "[data-focused='true'] &": { color: theme.palette.primary.main },
}));

// The panels bring their own controls; this only makes them fit a 36px row.
const Actions = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  flex: 1,
  minWidth: 0,
  gap: theme.spacing(0.5),
  "& .MuiIconButton-root": { padding: theme.spacing(0.5) },
  "& .MuiSvgIcon-root": { fontSize: 18 },
  "& .MuiButton-root": {
    minWidth: 0,
    height: 26,
    paddingBlock: 0,
    paddingInline: theme.spacing(1),
  },
}));
