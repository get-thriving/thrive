import { useContext } from "react";
import { Box, GlobalStyles, useTheme } from "@mui/material";

import { StrataColumnsContext } from "#/core/infra/component/layout/strata-columns-context";
import { useStrataKeysContext } from "#/core/infra/component/layout/use-strata-keys-context";
import {
  strataColors,
  strataFonts,
  strataRadius,
  strataSize,
} from "#/core/infra/component/strata-tokens";
import { strataFooterKeys } from "#/core/infra/strata/strata-footer-keys";

/**
 * The strip along the bottom with the keys that work right now (ADR 0021): the
 * ones that move between columns, sections and items, the ones that act on
 * what has the focus, and the ones that work anywhere. It follows the focus, so
 * it is the place to look to find out what a key does here, and it says how to
 * leave hint mode, the map and find while they hold the keys.
 *
 * Only on a big screen: a phone has no keyboard to speak of. It sits above the
 * banner of a build that is not the production one, and tells the columns how
 * tall it is, so they end above it.
 */
export function StrataFooter() {
  const theme = useTheme();
  const columns = useContext(StrataColumnsContext);
  const context = useStrataKeysContext(columns?.slots ?? []);

  if (columns === null || columns.phone || columns.slots.length === 0) {
    return null;
  }
  const keys = strataFooterKeys(context);

  return (
    <Box
      component="footer"
      id="strata-footer"
      aria-label="Keys that work now"
      sx={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: "var(--env-banner-height, 0px)",
        height: strataSize.footer,
        zIndex: theme.zIndex.appBar - 1,
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        paddingInline: "12px",
        overflow: "hidden",
        fontFamily: strataFonts.mono,
        fontSize: 11,
        lineHeight: "16px",
        color: strataColors.textFaint,
        backgroundColor: strataColors.ground,
        borderTop: `1px solid ${strataColors.line}`,
      }}
    >
      <GlobalStyles
        styles={{
          ":root": { "--strata-footer-height": `${strataSize.footer}px` },
        }}
      />
      {/* What does not fit is dropped from the end, a whole entry at a time:
          the rest wrap to a second row, which the height clips. */}
      <Box
        data-strata-footer-keys="true"
        sx={{
          flex: 1,
          minWidth: 0,
          height: "100%",
          display: "flex",
          flexWrap: "wrap",
          alignContent: "flex-start",
          columnGap: "16px",
          overflow: "hidden",
        }}
      >
        {keys.map((entry) => (
          <Box
            key={`${entry.keys.join("")}${entry.label}`}
            data-strata-footer-key={entry.label}
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              height: strataSize.footer - 1,
              whiteSpace: "nowrap",
            }}
          >
            {entry.keys.length > 0 && (
              <Box sx={{ display: "inline-flex", gap: "3px" }}>
                {entry.keys.map((key) => (
                  <Box
                    key={key}
                    component="kbd"
                    sx={{
                      fontFamily: "inherit",
                      fontSize: "inherit",
                      lineHeight: "14px",
                      paddingInline: "5px",
                      color: strataColors.textMuted,
                      border: `1px solid ${strataColors.lineStrong}`,
                      borderRadius: `${strataRadius.small}px`,
                    }}
                  >
                    {key}
                  </Box>
                ))}
              </Box>
            )}
            <span>{entry.label}</span>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
