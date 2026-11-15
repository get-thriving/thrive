import type { SvgIconProps } from "@mui/material";
import type { ComponentType } from "react";

/** One destination in the menu of apps and pages (ADR 0021). */
export interface AppMenuEntry {
  label: string;
  /** A path of the app, or a URL when `external`. */
  to: string;
  icon: ComponentType<SvgIconProps>;
  /** Opens in another tab, outside the app. */
  external: boolean;
}
