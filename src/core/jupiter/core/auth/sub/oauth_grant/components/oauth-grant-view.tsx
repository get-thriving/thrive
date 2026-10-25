import { OAuthGrantStatus } from "@jupiter/webapi-client";
import type { OAuthGrantSummary } from "@jupiter/webapi-client";
import { Chip, Stack, Typography } from "@mui/material";
import { DateTime } from "luxon";

interface OAuthGrantViewProps {
  oauthGrant: OAuthGrantSummary;
}

const STATUS_LABEL: Record<OAuthGrantStatus, string> = {
  [OAuthGrantStatus.PENDING]: "Waiting for the app",
  [OAuthGrantStatus.ACTIVE]: "Active",
  [OAuthGrantStatus.EXPIRED]: "Expired",
  [OAuthGrantStatus.REVOKED]: "Revoked",
};

const STATUS_COLOR: Record<
  OAuthGrantStatus,
  "default" | "success" | "warning" | "error"
> = {
  [OAuthGrantStatus.PENDING]: "warning",
  [OAuthGrantStatus.ACTIVE]: "success",
  [OAuthGrantStatus.EXPIRED]: "default",
  [OAuthGrantStatus.REVOKED]: "error",
};

export function oauthGrantStatusLabel(status: OAuthGrantStatus): string {
  return STATUS_LABEL[status];
}

export function formatOAuthTimestamp(timestamp: string): string {
  return DateTime.fromISO(timestamp).toLocaleString(DateTime.DATETIME_MED);
}

/** Displays an OAuth grant as the app, its status and when it was last refreshed. */
export function OAuthGrantView(props: OAuthGrantViewProps) {
  const { oauthGrant } = props;
  const lastActive = oauthGrant.refresh_issued_time ?? oauthGrant.created_time;

  return (
    <Stack spacing={0.5}>
      <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
        <Typography variant="body1" sx={{ wordBreak: "break-all" }}>
          {oauthGrant.client_id}
        </Typography>
        <Chip
          size="small"
          label={STATUS_LABEL[oauthGrant.status]}
          color={STATUS_COLOR[oauthGrant.status]}
        />
      </Stack>
      <Typography variant="body2" color="text.secondary">
        Last active {formatOAuthTimestamp(lastActive)}
      </Typography>
    </Stack>
  );
}
