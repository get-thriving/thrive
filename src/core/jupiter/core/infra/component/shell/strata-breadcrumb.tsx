import { Box, useTheme } from "@mui/material";
import { Fragment, useContext } from "react";
import { useLocation, useMatches } from "react-router";

import { StrataColumnsContext } from "#/core/infra/component/layout/strata-columns-context";
import { strataPathSegments } from "#/core/infra/component/shell/strata-path-segments";
import { strataLevelOf } from "#/core/infra/strata/strata-level-of";
import { strataSegmentColumns } from "#/core/infra/strata/strata-segment-columns";

/**
 * The mono path in the top bar, built from the URL, e.g. `big-plans / 1`. It
 * names the section and ids only; entity names arrive with the routes' labels.
 * Each part is a button that focuses the column it belongs to.
 */
export function StrataBreadcrumb() {
  const theme = useTheme();
  const { pathname } = useLocation();
  const matches = useMatches();
  const columns = useContext(StrataColumnsContext);

  const segments = strataPathSegments(pathname);

  if (segments.length === 0) {
    return null;
  }

  const owners = strataSegmentColumns(
    matches
      .filter((match) => strataLevelOf(match.handle) !== null)
      .map((match) => strataPathSegments(match.pathname).length),
    segments.length,
  );

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
        const owner = owners[i];
        return (
          <Fragment key={`${i}-${segment}`}>
            {i > 0 && (
              <Box component="span" sx={{ color: theme.palette.text.disabled }}>
                /
              </Box>
            )}
            <Box
              component={columns !== null && owner >= 0 ? "button" : "span"}
              type={columns !== null && owner >= 0 ? "button" : undefined}
              aria-current={last ? "page" : undefined}
              onClick={
                columns !== null && owner >= 0
                  ? () => columns.focusRoute(owner)
                  : undefined
              }
              sx={{
                // A button that reads as the text it was.
                background: "none",
                border: 0,
                padding: 0,
                font: "inherit",
                cursor: columns !== null && owner >= 0 ? "pointer" : "default",
                color: last
                  ? theme.palette.text.primary
                  : theme.palette.text.secondary,
                "&:hover":
                  columns !== null ? { textDecoration: "underline" } : {},
              }}
            >
              {segment}
            </Box>
          </Fragment>
        );
      })}
      {columns !== null && columns.splits.length > 0 && (
        <Box
          component="span"
          aria-label="Split sections"
          role="group"
          sx={{ display: "inline-flex", gap: "6px", ml: 1 }}
        >
          {columns.splits.map((split) => (
            <Box
              key={split.id}
              component="button"
              type="button"
              data-split={split.id}
              title={`Show ${split.title}`}
              onClick={() => columns.focusColumn(split.key)}
              sx={{
                background: "none",
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: "3px",
                px: "6px",
                py: 0,
                font: "inherit",
                cursor: "pointer",
                color: theme.palette.text.secondary,
                "&:hover": { borderColor: theme.palette.primary.main },
              }}
            >
              {split.title.toLowerCase()}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
