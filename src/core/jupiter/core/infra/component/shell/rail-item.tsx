import type { ReactNode } from "react";
import { ButtonBase, Tooltip, alpha, useTheme } from "@mui/material";
import type { SvgIconComponent } from "@mui/icons-material";
import { Link } from "react-router";

import { strataSize } from "#/core/infra/component/strata-tokens";

interface RailItemProps {
  label: string;
  icon: SvgIconComponent;
  /** With a label beside the icon, or the icon alone with a tooltip. */
  expanded: boolean;
  active?: boolean;
  /** A destination makes the item a link; without one it is a button. */
  to?: string;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  /** Extra attributes for the button, such as the popover ones on More. */
  ariaProps?: Record<string, string | boolean | undefined>;
}

/** One entry of the Strata rail, in either of its widths. */
export function RailItem(props: RailItemProps): ReactNode {
  const theme = useTheme();
  const Icon = props.icon;
  const active = props.active ?? false;

  const sx = {
    height: strataSize.railButton,
    boxSizing: "border-box" as const,
    borderRadius: `${theme.shape.borderRadius}px`,
    color: active ? theme.palette.primary.main : theme.palette.text.secondary,
    backgroundColor: active
      ? alpha(theme.palette.primary.main, 0.14)
      : "transparent",
    "&:hover": {
      color: active ? theme.palette.primary.main : theme.palette.text.primary,
      backgroundColor: active
        ? alpha(theme.palette.primary.main, 0.2)
        : theme.palette.action.hover,
    },
    ...(props.expanded
      ? {
          width: "100%",
          justifyContent: "flex-start",
          gap: "12px",
          paddingInline: `${(strataSize.railButton - 20) / 2}px`,
          fontSize: "13px",
          whiteSpace: "nowrap" as const,
        }
      : {
          width: strataSize.railButton,
          justifyContent: "center",
        }),
  };

  const content = (
    <>
      <Icon fontSize="small" />
      {props.expanded && <span>{props.label}</span>}
    </>
  );

  const common = {
    "aria-label": props.label,
    "aria-current": active ? ("page" as const) : undefined,
    sx,
    onClick: props.onClick,
    ...props.ariaProps,
  };

  const item = props.to ? (
    <ButtonBase component={Link} to={props.to} {...common}>
      {content}
    </ButtonBase>
  ) : (
    <ButtonBase {...common}>{content}</ButtonBase>
  );

  // The label is visible beside the icon when expanded, so no tooltip then.
  return props.expanded ? (
    item
  ) : (
    <Tooltip title={props.label} placement="right">
      {item}
    </Tooltip>
  );
}
