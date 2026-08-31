import { JupiterWebApiLocationResolver } from "@jupiter/webapi-client";
import { createContext, useContext } from "react";

import { GlobalPropertiesContext } from "#/core/config-client";

export interface GoogleMapsFrontendConfig {
  apiKey: string | null;
}

export const GoogleMapsFrontendContext =
  createContext<GoogleMapsFrontendConfig>({
    apiKey: null,
  });

export function useGoogleMapsFrontend(): {
  enabled: boolean;
  apiKey: string | null;
} {
  const globalProperties = useContext(GlobalPropertiesContext);
  const maps = useContext(GoogleMapsFrontendContext);
  const apiKey = maps.apiKey && maps.apiKey !== "FAKEFAKE" ? maps.apiKey : null;
  const enabled =
    globalProperties.locationResolver ===
      JupiterWebApiLocationResolver.GOOGLE_MAPS && Boolean(apiKey);
  return { enabled, apiKey };
}
