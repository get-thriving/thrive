import { AppPlatform, AppShell } from "@jupiter/webapi-client";
import { useMediaQuery, useTheme } from "@mui/material";
import { useContext } from "react";

import { ServicePropertiesContext } from "#/core/config-client";

export function useBigScreen(): boolean {
  const serviceProperties = useContext(ServicePropertiesContext);
  const theme = useTheme();
  const mediaQuery = useMediaQuery(theme.breakpoints.up("md"));

  switch (serviceProperties.frontDoorInfo.appShell) {
    case AppShell.BROWSER:
      switch (serviceProperties.frontDoorInfo.appPlatform) {
        case AppPlatform.DESKTOP_MACOS:
          return mediaQuery;
        case AppPlatform.MOBILE_IOS:
        case AppPlatform.MOBILE_ANDROID:
          return false;
        case AppPlatform.TABLET_IOS:
        case AppPlatform.TABLET_ANDROID:
          return true;
      }
      break;
    case AppShell.DESKTOP_ELECTRON: {
      const mdBreakpointPx = theme.breakpoints.values["md"];

      if (serviceProperties.frontDoorInfo.initialWindowWidth !== undefined) {
        if (
          serviceProperties.frontDoorInfo.initialWindowWidth > mdBreakpointPx
        ) {
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
      switch (serviceProperties.frontDoorInfo.appPlatform) {
        case AppPlatform.DESKTOP_MACOS:
          return mediaQuery;
        case AppPlatform.MOBILE_IOS:
        case AppPlatform.MOBILE_ANDROID:
          return false;
        case AppPlatform.TABLET_IOS:
        case AppPlatform.TABLET_ANDROID:
          return true;
      }
      break;
    default:
      return true;
  }
}
