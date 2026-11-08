import { Box, Stack, styled } from "@mui/material";
import { useLocation } from "react-router";
import { motion } from "framer-motion";
import type { PropsWithChildren } from "react";

import { ColumnKind } from "#/core/infra/component/layout/column-kind";
import { StrataColumnFrame } from "#/core/infra/component/layout/strata-column-frame";
import { useStrataColumn } from "#/core/infra/component/layout/use-strata-column";
import { strataColumns } from "#/core/infra/component/strata-tokens";
import { useBigScreen } from "#/core/infra/component/use-big-screen";

const SMALL_SCREEN_ANIMATION_START = "100vw";
const SMALL_SCREEN_ANIMATION_END = "100vw";

export function ToolPanel(props: PropsWithChildren) {
  const isBigScreen = useBigScreen();
  const location = useLocation();
  // A tool page is the only thing on screen, so it is the first column.
  const column = useStrataColumn(
    "trunk",
    ColumnKind.TRUNK,
    strataColumns.trunk.default,
    strataColumns.trunk.min,
  );

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
        placement={column.placement}
        label="page"
        onUnfold={column.unfold}
        fallbackLeft={column.offsetLeft}
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
