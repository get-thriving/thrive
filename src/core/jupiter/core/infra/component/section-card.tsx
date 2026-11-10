import { Box, Stack } from "@mui/material";
import { Form } from "react-router";
import type { JSX, PropsWithChildren } from "react";

import { useInterceptedSubmit } from "#/core/infra/component/intent-interceptor";
import {
  strataColors,
  strataFonts,
  strataSize,
  strataType,
} from "#/core/infra/component/strata-tokens";

export enum ActionsPosition {
  ABOVE,
  BELOW,
}

interface SectionCardProps {
  id?: string;
  title: string;
  actions?: JSX.Element;
  actionsPosition?: ActionsPosition;
  method?: "get" | "post";
}

export function SectionCard(props: PropsWithChildren<SectionCardProps>) {
  const actionsPosition = props.actionsPosition ?? ActionsPosition.ABOVE;
  const handleSubmit = useInterceptedSubmit();
  // A section is a mono label over a hairline with its actions at the right
  // (ADR 0019).
  return (
    <Box id={props.id} sx={{ borderBottom: 1, borderColor: "divider", pb: 1 }}>
      <Form method={props.method ?? "post"} onSubmit={handleSubmit}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            minHeight: strataSize.columnHeader,
            px: 0.5,
          }}
        >
          <Box
            component="span"
            sx={{
              fontFamily: strataFonts.mono,
              fontSize: strataType.sectionLabel.size,
              letterSpacing: strataType.sectionLabel.letterSpacing,
              textTransform: "uppercase",
              color: strataColors.textFaint,
            }}
          >
            {props.title}
          </Box>
          {actionsPosition === ActionsPosition.ABOVE && props.actions}
        </Box>
        <Box sx={{ px: 0.5 }}>
          <Stack spacing={2}>{props.children}</Stack>
        </Box>
        {actionsPosition === ActionsPosition.BELOW && (
          <Box sx={{ px: 0.5, pt: 1 }}>{props.actions}</Box>
        )}
      </Form>
    </Box>
  );
}
