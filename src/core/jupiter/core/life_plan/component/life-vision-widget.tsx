import { Box } from "@mui/material";
import { WidgetProps } from "#/core/home/component/common";
import { VisionSnippet } from "#/core/life_plan/sub/visions/components/snippet";

export function LifeVisionWidget(props: WidgetProps) {
  const { activeVision } = props;

  return (
    <Box sx={{ width: "100%", height: "100%", overflow: "hidden" }}>
      <VisionSnippet vision={activeVision?.vision} note={activeVision?.note} />
    </Box>
  );
}
