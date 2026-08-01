import type { ReactNode } from "react";
import { Box, Typography } from "@mui/material";

interface EntityAccessRowProps {
  label: "owner" | "user";
  userLabel: string;
  accessLevelControl?: ReactNode;
}

export function EntityAccessRow(props: EntityAccessRowProps) {
  const showAccess = props.accessLevelControl !== undefined;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", rowGap: 0.5 }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "auto 1fr",
          columnGap: 1,
          alignItems: "center",
        }}
      >
        <Typography variant="body2" fontWeight="bold">
          {props.label}:
        </Typography>
        <Typography variant="body2">{props.userLabel}</Typography>
      </Box>

      {showAccess && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            columnGap: 1,
            flexWrap: "wrap",
            rowGap: 0.5,
          }}
        >
          <Typography variant="body2" fontWeight="bold">
            access:
          </Typography>
          {props.accessLevelControl}
        </Box>
      )}
    </Box>
  );
}
