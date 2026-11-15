import type { WorkspaceFeature } from "@jupiter/webapi-client";
import type { SvgIconComponent } from "@mui/icons-material";

/** One destination in the Strata icon rail, or in its More popover. */
export interface RailEntry {
  label: string;
  to: string;
  icon: SvgIconComponent;
  /** Shown only when one of these workspace features is available. */
  features?: Array<WorkspaceFeature>;
  /** Active only on exactly this path, e.g. Home. */
  exact?: boolean;
}
