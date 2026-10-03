import type { EntityName } from "@jupiter/webapi-client";
import type { SxProps, Theme } from "@mui/material";
import { Typography } from "@mui/material";

interface EntityNameProps {
  compact?: boolean;
  name: EntityName;
  color?: string;
  sx?: SxProps<Theme>;
}

export function EntityNameComponent({
  compact,
  name,
  color,
  sx,
}: EntityNameProps) {
  return (
    <Typography
      color={color}
      sx={[
        {
          fontSize: !compact ? "inherit" : "0.85rem",
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {name}
    </Typography>
  );
}

export function EntityNameOneLineComponent({ compact, name }: EntityNameProps) {
  return (
    <Typography
      noWrap
      sx={{
        fontSize: !compact ? "inherit" : "0.85rem",
      }}
    >
      {name}
    </Typography>
  );
}
