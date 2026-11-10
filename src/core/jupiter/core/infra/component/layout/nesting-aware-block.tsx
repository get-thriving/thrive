import { Box, Stack } from "@mui/material";
import type { PropsWithChildren } from "react";

/** A panel's body: a stack with room under it for the last row to scroll clear. */
export function NestingAwareBlock(props: PropsWithChildren) {
  return (
    <Stack spacing={2}>
      {props.children}
      <Box sx={{ height: "4rem" }}></Box>
    </Stack>
  );
}
