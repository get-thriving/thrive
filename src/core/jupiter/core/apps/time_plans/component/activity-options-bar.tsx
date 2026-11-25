import { Box, Stack } from "@mui/material";
import type { PropsWithChildren } from "react";

import { useBigScreen } from "#/core/infra/component/use-big-screen";
import { strataColors } from "#/core/infra/component/strata-tokens";

/**
 * The kind and the feasibility the activities will be added with, over the
 * list they are picked from. A list of chores, of big plans or of tasks can be
 * long, and `j` and `k` walk down it, so the bar sticks to the top of the
 * column while it scrolls: they can be set from anywhere in the list, without
 * going back up to them. It is opaque, so what scrolls under it does not show.
 */
export function ActivityOptionsBar(props: PropsWithChildren) {
  const isBigScreen = useBigScreen();
  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 2,
        // Edge to edge in the card, over its padding.
        marginX: "-0.75rem",
        paddingX: "0.75rem",
        paddingY: 0.75,
        backgroundColor: strataColors.column,
        borderBottom: `1px solid ${strataColors.rowDivider}`,
      }}
    >
      <Stack
        spacing={1.25}
        useFlexGap
        direction={isBigScreen ? "row" : "column"}
      >
        {props.children}
      </Stack>
    </Box>
  );
}
