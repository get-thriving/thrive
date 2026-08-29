import type { ProjectStatus } from "@jupiter/webapi-client";
import { Box, useTheme } from "@mui/material";

import {
  projectStatusIcon,
  projectStatusName,
} from "#/core/apps/projects/status";
import { useBigScreen } from "#/core/infra/component/use-big-screen";

interface ProjectStatusBigTagProps {
  status: ProjectStatus;
}

export function ProjectStatusBigTag(props: ProjectStatusBigTagProps) {
  const isBigScreen = useBigScreen();
  const tagName = projectStatusName(props.status);
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        alignContent: "center",
        justifyContent: "center",
        whiteSpace: "nowrap",
        borderRadius: "5px",
        padding: "0.5rem",
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        height: "100%",
      }}
    >
      {isBigScreen ? tagName : projectStatusIcon(props.status)}
    </Box>
  );
}
