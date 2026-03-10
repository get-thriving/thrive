import { Box, Button, Stack, Typography } from "@mui/material";
import { Link } from "@remix-run/react";
import { WidgetProps } from "#/core/home/component/common";
import { VisionSnippet } from "#/core/life_plan/sub/visions/components/snippet";

export function LifeVisionWidget(props: WidgetProps) {
  const { activeVision, activeVisionNote } = props;

  return (
    <Stack
      direction="column"
      sx={{ width: "100%", height: "100%", gap: 1, overflow: "hidden" }}
    >
      <Stack
        direction="row"
        sx={{ alignItems: "center", justifyContent: "space-between" }}
      >
        <Typography variant="h6" sx={{ fontSize: "0.9rem", fontWeight: "bold" }}>
          Life Vision
        </Typography>
        <Button
          size="small"
          variant="outlined"
          component={Link}
          to="/app/workspace/life-plan/visions"
          sx={{ fontSize: "0.7rem", padding: "2px 8px" }}
        >
          View All
        </Button>
      </Stack>

      <Box sx={{ flex: 1, overflow: "hidden" }}>
        <VisionSnippet vision={activeVision} note={activeVisionNote} />
      </Box>
    </Stack>
  );
}
