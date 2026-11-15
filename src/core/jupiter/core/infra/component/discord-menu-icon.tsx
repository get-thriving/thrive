import { SvgIcon } from "@mui/material";
import type { SvgIconProps } from "@mui/material";

import { DISCORD_LOGO_PATH } from "#/core/infra/component/discord-logo-path";

/**
 * The Discord logo as an icon of a menu: sized and colored as the others are,
 * from the text around it, where the logo of the app bar is white.
 */
export function DiscordMenuIcon(props: SvgIconProps) {
  return (
    <SvgIcon viewBox="0 0 127.14 96.36" {...props}>
      <path d={DISCORD_LOGO_PATH} />
    </SvgIcon>
  );
}
