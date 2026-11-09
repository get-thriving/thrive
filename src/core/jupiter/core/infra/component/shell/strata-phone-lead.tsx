import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import MenuIcon from "@mui/icons-material/Menu";
import { Box, IconButton } from "@mui/material";
import { useContext } from "react";
import { useLocation } from "react-router";

import { StrataColumnsContext } from "#/core/infra/component/layout/strata-columns-context";
import { strataPhoneTitle } from "#/core/infra/component/shell/strata-phone-title";
import {
  strataColors,
  strataFonts,
  strataType,
} from "#/core/infra/component/strata-tokens";

interface StrataPhoneLeadProps {
  onOpenDrawer: () => void;
}

/**
 * The left of the phone's top bar: the way back, or the menu when there is
 * nowhere to go back to, and what page this is. Back shows the panel before
 * the focused one, which leaves the one it came from as a sliver to go in again.
 */
export function StrataPhoneLead(props: StrataPhoneLeadProps) {
  const columns = useContext(StrataColumnsContext);
  const { pathname } = useLocation();
  const { trail, title } = strataPhoneTitle(pathname);
  const canGoOut = columns !== null && columns.position.index > 0;

  return (
    <>
      <IconButton
        id={canGoOut ? "strata-phone-back" : "show-sidebar"}
        size="large"
        edge="start"
        color="inherit"
        aria-label={canGoOut ? "Back to the previous panel" : "Open the menu"}
        onClick={() => {
          if (!columns?.focusOut()) {
            props.onOpenDrawer();
          }
        }}
      >
        {canGoOut ? <ArrowBackIosNewIcon fontSize="small" /> : <MenuIcon />}
      </IconButton>
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          lineHeight: 1.2,
        }}
      >
        <Box
          component="span"
          sx={{
            fontFamily: strataFonts.mono,
            fontSize: strataType.meta.size,
            color: strataColors.textFaint,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {trail}
        </Box>
        <Box
          component="span"
          id="strata-phone-title"
          sx={{
            fontWeight: 600,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {title}
        </Box>
      </Box>
    </>
  );
}
