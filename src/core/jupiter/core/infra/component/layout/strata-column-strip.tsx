import { Box } from "@mui/material";

import {
  STRATA_PHONE_BAR_HEIGHT_PX,
  STRATA_PHONE_STRIP_HEIGHT_PX,
} from "#/core/infra/component/layout/strata-columns-top";
import {
  strataColors,
  strataFonts,
  strataType,
} from "#/core/infra/component/strata-tokens";

interface StrataColumnStripProps {
  /** Which column is shown, from 0. */
  index: number;
  count: number;
}

/**
 * On a phone, under the app bar: a dash for each open panel and which one is
 * shown, so it is clear there are more to go in and out to.
 */
export function StrataColumnStrip(props: StrataColumnStripProps) {
  return (
    <Box
      id="strata-column-strip"
      sx={{
        position: "fixed",
        left: 0,
        right: 0,
        top: `calc(env(safe-area-inset-top) + ${STRATA_PHONE_BAR_HEIGHT_PX}px)`,
        height: STRATA_PHONE_STRIP_HEIGHT_PX,
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        gap: 1,
        paddingInline: 2,
        zIndex: (theme) => theme.zIndex.appBar - 1,
        backgroundColor: strataColors.ground,
        borderBottom: `1px solid ${strataColors.line}`,
        fontFamily: strataFonts.mono,
        fontSize: strataType.meta.size,
        color: strataColors.textFaint,
      }}
    >
      <Box aria-hidden="true" sx={{ display: "flex", gap: "3px" }}>
        {Array.from({ length: props.count }, (_, index) => (
          <Box
            key={index}
            component="span"
            sx={{
              width: 18,
              height: 3,
              borderRadius: "2px",
              backgroundColor:
                index === props.index
                  ? strataColors.amber
                  : index < props.index
                    ? strataColors.textFaintest
                    : strataColors.line,
            }}
          />
        ))}
      </Box>
      <span>
        column {props.index + 1} of {props.count}
      </span>
    </Box>
  );
}
