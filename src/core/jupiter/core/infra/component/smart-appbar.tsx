import { AppBar, Toolbar } from "@mui/material";
import type { PropsWithChildren } from "react";

interface SmartAppBarProps {
  /** A plain 56px bar, as on a phone, whatever the width. */
  compact?: boolean;
}

export function SmartAppBar(props: PropsWithChildren<SmartAppBarProps>) {
  return (
    <AppBar
      position="static"
      sx={{
        paddingTop: "env(safe-area-inset-top)",
        zIndex: (theme) => theme.zIndex.drawer + 10,
      }}
    >
      <Toolbar
        sx={
          props.compact
            ? { minHeight: 56, "@media (min-width:600px)": { minHeight: 56 } }
            : undefined
        }
      >
        {props.children}
      </Toolbar>
    </AppBar>
  );
}
