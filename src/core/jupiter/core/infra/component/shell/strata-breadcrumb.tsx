import { Box, useTheme } from "@mui/material";
import { Fragment } from "react";
import { useLocation } from "react-router";

import { strataPathSegments } from "#/core/infra/component/shell/strata-path-segments";

/**
 * The mono path in the top bar, built from the URL, e.g. `big-plans / 1`. It
 * names the section and ids only; entity names arrive with the column layout.
 */
export function StrataBreadcrumb() {
  const theme = useTheme();
  const { pathname } = useLocation();

  const segments = strataPathSegments(pathname);

  if (segments.length === 0) {
    return null;
  }

  return (
    <Box
      component="nav"
      aria-label="Path"
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        flex: 1,
        minWidth: 0,
        overflow: "hidden",
        whiteSpace: "nowrap",
        fontFamily: theme.typography.caption.fontFamily,
        fontSize: theme.typography.body2.fontSize,
      }}
    >
      {segments.map((segment, i) => {
        const last = i === segments.length - 1;
        return (
          <Fragment key={`${i}-${segment}`}>
            {i > 0 && (
              <Box component="span" sx={{ color: theme.palette.text.disabled }}>
                /
              </Box>
            )}
            <Box
              component="span"
              aria-current={last ? "page" : undefined}
              sx={{
                color: last
                  ? theme.palette.text.primary
                  : theme.palette.text.secondary,
              }}
            >
              {segment}
            </Box>
          </Fragment>
        );
      })}
    </Box>
  );
}
