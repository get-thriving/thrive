import type { MCPKeySummary } from "@jupiter/webapi-client";
import { Typography } from "@mui/material";

interface McpKeyViewProps {
  mcpKey: MCPKeySummary;
}

/** Displays an MCP key as name and ****last4 format. */
export function McpKeyView(props: McpKeyViewProps) {
  const { mcpKey } = props;
  return (
    <>
      <Typography variant="body1">{mcpKey.name}</Typography>
      <Typography variant="body1" sx={{ fontFamily: "monospace" }}>
        ****{mcpKey.last_four_digits}
      </Typography>
    </>
  );
}
