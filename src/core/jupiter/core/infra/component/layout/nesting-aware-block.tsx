import { Box, Stack } from "@mui/material";
import { useContext, type PropsWithChildren } from "react";

import { StrataColumnsContext } from "#/core/infra/component/layout/strata-columns-context";
import { useBigScreen } from "#/core/infra/component/use-big-screen";

interface NestingAwarePanelProps {
  shouldHide: boolean;
  branchForceHide?: boolean;
}

export function NestingAwareBlock(
  props: PropsWithChildren<NestingAwarePanelProps>,
) {
  const isBigScreen = useBigScreen();
  // With columns the list stays visible beside what opens from it.
  const inColumns = useContext(StrataColumnsContext) !== null && isBigScreen;

  if (!isBigScreen && props.shouldHide) {
    return null;
  }

  if (props.branchForceHide && !inColumns) {
    return null;
  }

  return (
    <Stack spacing={2}>
      {props.children}
      <Box sx={{ height: "4rem" }}></Box>
    </Stack>
  );
}
