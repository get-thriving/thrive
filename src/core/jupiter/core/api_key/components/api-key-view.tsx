import type { APIKeySummary } from "@jupiter/webapi-client";
import { Typography } from "@mui/material";

interface ApiKeyViewProps {
  apiKey: APIKeySummary;
}

/** Displays an API key as name and ****last4 format. */
export function ApiKeyView(props: ApiKeyViewProps) {
  const { apiKey } = props;
  return (
    <>
      <Typography variant="body1">{apiKey.name}</Typography>
      <Typography variant="body1" sx={{ fontFamily: "monospace" }}>
        ****{apiKey.last_four_digits}
      </Typography>
    </>
  );
}
