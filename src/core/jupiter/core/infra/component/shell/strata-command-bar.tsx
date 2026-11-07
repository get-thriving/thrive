import SearchIcon from "@mui/icons-material/Search";
import { ButtonBase, Typography, useTheme } from "@mui/material";
import { useEffect } from "react";

import {
  strataColors,
  strataRadius,
  strataSize,
} from "#/core/infra/component/strata-tokens";

interface StrataCommandBarProps {
  onOpen: () => void;
}

/**
 * The top bar's search field: a button that opens the instant search dialog
 * (ADR 0006), also reachable with Cmd-K / Ctrl-K.
 */
export function StrataCommandBar({ onOpen }: StrataCommandBarProps) {
  const theme = useTheme();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpen();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onOpen]);

  return (
    <ButtonBase
      id="open-instant-search"
      onClick={onOpen}
      aria-label="Search"
      aria-keyshortcuts="Meta+K Control+K"
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        width: strataSize.commandBar.width,
        maxWidth: "100%",
        height: strataSize.commandBar.height,
        paddingInline: "10px",
        justifyContent: "flex-start",
        textAlign: "left",
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: `${theme.shape.borderRadius}px`,
        color: theme.palette.text.secondary,
      }}
    >
      <SearchIcon sx={{ fontSize: 14 }} />
      <Typography variant="body2" sx={{ flex: 1, color: "inherit" }} noWrap>
        Search…
      </Typography>
      <Typography
        component="kbd"
        variant="caption"
        sx={{
          color: theme.palette.text.secondary,
          border: `1px solid ${strataColors.lineStrong}`,
          borderRadius: `${strataRadius.small}px`,
          paddingInline: "5px",
          lineHeight: "18px",
        }}
      >
        ⌘K
      </Typography>
    </ButtonBase>
  );
}
