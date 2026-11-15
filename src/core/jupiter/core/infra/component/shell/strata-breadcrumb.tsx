import { Box, useTheme } from "@mui/material";
import { Fragment, useContext } from "react";
import { useMatches } from "react-router";

import { StrataColumnsContext } from "#/core/infra/component/layout/strata-columns-context";
import { strataCrumbs } from "#/core/infra/strata/strata-crumbs";

/**
 * The mono path in the top bar, e.g. `Habits / Buy milk`, made of the labels
 * the routes supply (ADR 0021): a fixed text for a page, the name of the entity
 * for one that is. Each part is a button that focuses the column it belongs to;
 * a long one is cut short with an ellipsis, and the last is the current page.
 */
export function StrataBreadcrumb() {
  const theme = useTheme();
  const matches = useMatches();
  const columns = useContext(StrataColumnsContext);

  const crumbs = strataCrumbs(matches);

  if (crumbs.length === 0) {
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
      {crumbs.map((crumb, i) => {
        const last = i === crumbs.length - 1;
        const owner = crumb.owner;
        return (
          <Fragment key={crumb.id}>
            {i > 0 && (
              <Box component="span" sx={{ color: theme.palette.text.disabled }}>
                /
              </Box>
            )}
            <Box
              component={columns !== null && owner >= 0 ? "button" : "span"}
              type={columns !== null && owner >= 0 ? "button" : undefined}
              aria-current={last ? "page" : undefined}
              title={crumb.label}
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
                // Long labels are cut short; the current page keeps more, and
                // when there is no room it is the one that gives way first.
                minWidth: 0,
                flexShrink: last ? 1 : 0,
                maxWidth: last ? "40ch" : "22ch",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                cursor: columns !== null && owner >= 0 ? "pointer" : "default",
                color: last
                  ? theme.palette.text.primary
                  : theme.palette.text.secondary,
                "&:hover":
                  columns !== null ? { textDecoration: "underline" } : {},
              }}
            >
              {crumb.label}
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
