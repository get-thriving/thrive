import { Box, Stack, styled } from "@mui/material";
import { useLocation } from "react-router";
import { motion } from "framer-motion";
import type { PropsWithChildren } from "react";

import { StrataColumnFrame } from "#/core/infra/component/layout/strata-column-frame";
import { useStrataColumn } from "#/core/infra/component/layout/use-strata-column";
import { useBigScreen } from "#/core/infra/component/use-big-screen";
import { DisplayType } from "#/core/infra/component/use-nested-entities";

const SMALL_SCREEN_ANIMATION_START = "100vw";
const SMALL_SCREEN_ANIMATION_END = "100vw";

export function ToolPanel(props: PropsWithChildren) {
  const isBigScreen = useBigScreen();
  const location = useLocation();
  // A tool page stands where a trunk would, as the first column.
  const column = useStrataColumn(DisplayType.TOOL);

  const body = (
    <ToolCardContent
      id="tool-panel-content"
      isbigscreen={isBigScreen ? "true" : "false"}
    >
      <Stack spacing={2}>{props.children}</Stack>
    </ToolCardContent>
  );

  if (column.active) {
    return (
      <StrataColumnFrame
        id="tool-panel"
        key={location.pathname}
        column={column.column}
        label="page"
        onFocus={column.focus}
        fallbackLeft={column.offsetLeft}
        animate={column.animate}
      >
        {body}
      </StrataColumnFrame>
    );
  }

  return (
    <ToolPanelFrame
      id="tool-panel"
      key={location.pathname}
      initial={{
        opacity: 0,
        x: isBigScreen ? undefined : SMALL_SCREEN_ANIMATION_START,
      }}
      animate={{ opacity: 1, x: isBigScreen ? undefined : 0 }}
      exit={{
        opacity: 0,
        x: isBigScreen ? undefined : SMALL_SCREEN_ANIMATION_END,
      }}
      transition={{ duration: 0.5 }}
    >
      {body}
    </ToolPanelFrame>
  );
}

const ToolPanelFrame = styled(motion.div)(() => ({}));

interface ToolCardContentProps {
  isbigscreen: string;
}

const ToolCardContent = styled(Box)<ToolCardContentProps>(
  ({ isbigscreen }) => ({
    padding: "0.5rem",
    height: `calc(var(--vh, 1vh) * 100 - env(safe-area-inset-top) - 4rem - ${
      isbigscreen === "true" ? "4rem" : "3.5rem"
    })`,
    overflowY: "scroll",
  }),
);
