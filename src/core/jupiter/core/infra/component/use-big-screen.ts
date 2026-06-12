import { AppPlatform, AppShell } from "@jupiter/webapi-client";
import { useMediaQuery, useTheme } from "@mui/material";
import { useContext } from "react";

import { FrontDoorInfoContext } from "#/core/infra/frontdoor-info-context";

export function useBigScreen(): boolean {
  const frontDoorInfo = useContext(FrontDoorInfoContext);
  const theme = useTheme();
  const mediaQuery = useMediaQuery(theme.breakpoints.up("md"));

  switch (frontDoorInfo.appShell) {
    case AppShell.BROWSER:
      switch (frontDoorInfo.appPlatform) {
        case AppPlatform.DESKTOP_MACOS:
          return mediaQuery;
        case AppPlatform.MOBILE_IOS:
        case AppPlatform.MOBILE_ANDROID:
          return false;
        case AppPlatform.TABLET_IOS:
        case AppPlatform.TABLET_ANDROID:
          return true;
        case AppPlatform.API:
          return false;
        case AppPlatform.MCP:
          return false;
      }
      break;
    case AppShell.DESKTOP_ELECTRON: {
      const mdBreakpointPx = theme.breakpoints.values["md"];

      if (frontDoorInfo.initialWindowWidth !== undefined) {
        if (frontDoorInfo.initialWindowWidth > mdBreakpointPx) {
          return true;
        } else {
          return false;
        }
      }

      return true;
    }
    case AppShell.MOBILE_CAPACITOR:
      return false;
    case AppShell.PWA:
      switch (frontDoorInfo.appPlatform) {
        case AppPlatform.DESKTOP_MACOS:
          return mediaQuery;
        case AppPlatform.MOBILE_IOS:
        case AppPlatform.MOBILE_ANDROID:
          return false;
        case AppPlatform.TABLET_IOS:
        case AppPlatform.TABLET_ANDROID:
          return true;
        case AppPlatform.API:
          return false;
        case AppPlatform.MCP:
          return false;
      }
      break;
    case AppShell.API:
      return false;
    case AppShell.MCP:
      return false;
    default:
      return true;
  }
}
