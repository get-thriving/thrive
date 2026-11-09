import { Box, Divider, Typography } from "@mui/material";
import { UiStyle } from "@jupiter/webapi-client";

import { StrataSectionLabel } from "#/core/infra/component/strata/strata-section-label";
import { strataColors } from "#/core/infra/component/strata-tokens";
import { useUiStyle } from "#/core/infra/component/use-ui-style";

interface StandardDividerProps {
  title: string;
  size: "small" | "medium" | "large";
}

export function StandardDivider(props: StandardDividerProps) {
  const uiStyle = useUiStyle();

  // Strata has no centred rule: a section is a mono label, a group a plain
  // bold line (ADR 0019).
  if (uiStyle === UiStyle.STRATA) {
    return props.size === "medium" ? (
      <Box
        sx={{
          padding: "8px 4px 4px",
          fontWeight: 600,
          color: strataColors.text,
        }}
      >
        {props.title}
      </Box>
    ) : (
      <StrataSectionLabel>{props.title}</StrataSectionLabel>
    );
  }

  return (
    <Divider
      variant="fullWidth"
      sx={{
        "& .MuiDivider-wrapper": {
          width: "100%",
        },
        ...(props.size !== "small"
          ? { marginTop: "0.75rem", marginBottom: "0.75rem" }
          : {}),
      }}
    >
      <Typography
        variant={
          props.size === "small"
            ? "subtitle2"
            : props.size === "medium"
              ? "subtitle2"
              : "h6"
        }
        sx={{
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {props.title}
      </Typography>
    </Divider>
  );
}
