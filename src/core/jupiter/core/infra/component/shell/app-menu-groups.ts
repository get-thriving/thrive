import type { WorkspaceFeature } from "@jupiter/webapi-client";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import HelpOutlineIcon from "@mui/icons-material/HelpOutlineOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import SportsEsportsOutlinedIcon from "@mui/icons-material/SportsEsportsOutlined";
import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";

import { DiscordMenuIcon } from "#/core/infra/component/discord-menu-icon";
import type { AppMenuEntry } from "#/core/infra/component/shell/app-menu-entry";
import type { AppMenuGroup } from "#/core/infra/component/shell/app-menu-group";
import {
  RAIL_ENTRIES,
  RAIL_MORE_GROUPS,
} from "#/core/infra/component/shell/rail-entries";

const W = "/app/workspace";

/** What decides which entries the menu has. */
export interface AppMenuInput {
  /**
   * Whether an entry that is gated on workspace features is available, as the
   * rail decides it: when any of them is.
   */
  isAvailable: (features: Array<WorkspaceFeature>) => boolean;
  /** The user has gamification, so its page is theirs to go to. */
  gamification: boolean;
  /** Where the community is, off the app. */
  communityUrl: string;
  /** Where the help is, off the app. */
  docsUrl: string;
}

/**
 * The menu of apps and pages that `q` opens (ADR 0021), as sections of groups
 * of entries. First the apps the workspace has enabled, as the rail lists them;
 * then the pages that support and are shared by them, as the rail's More menu
 * does; then what the right of the app bar has (gamification, account, access,
 * settings, community, help). A destination is listed once, in the last place
 * that has it, so the settings page the account menu calls Settings is not
 * also More Features; a group left with nothing is left out.
 */
export function appMenuGroups(input: AppMenuInput): AppMenuGroup[] {
  const internal = (entry: {
    label: string;
    to: string;
    icon: AppMenuEntry["icon"];
  }): AppMenuEntry => ({ ...entry, external: false });

  const groups: AppMenuGroup[] = [
    {
      section: "apps",
      title: null,
      entries: RAIL_ENTRIES.filter(
        (entry) =>
          entry.features === undefined || input.isAvailable(entry.features),
      ).map(internal),
    },
    ...RAIL_MORE_GROUPS.map((group): AppMenuGroup => ({
      section: "pages",
      title: group.title,
      entries: group.entries.map(internal),
    })),
    {
      section: "account",
      title: null,
      entries: [
        ...(input.gamification
          ? [
              internal({
                label: "Gamification",
                to: `${W}/gamification`,
                icon: SportsEsportsOutlinedIcon,
              }),
            ]
          : []),
        internal({
          label: "Account",
          to: `${W}/account`,
          icon: AccountCircleOutlinedIcon,
        }),
        internal({
          label: "Access",
          to: `${W}/access`,
          icon: VpnKeyOutlinedIcon,
        }),
        internal({
          label: "Settings",
          to: `${W}/settings`,
          icon: SettingsOutlinedIcon,
        }),
        {
          label: "Community",
          to: input.communityUrl,
          icon: DiscordMenuIcon,
          external: true,
        },
        {
          label: "Help",
          to: input.docsUrl,
          icon: HelpOutlineIcon,
          external: true,
        },
      ],
    },
  ];

  const lastPlace = new Map<string, number>();
  groups.forEach((group, position) =>
    group.entries.forEach((entry) => lastPlace.set(entry.to, position)),
  );
  return groups
    .map((group, position) => ({
      ...group,
      entries: group.entries.filter(
        (entry) => lastPlace.get(entry.to) === position,
      ),
    }))
    .filter((group) => group.entries.length > 0);
}
