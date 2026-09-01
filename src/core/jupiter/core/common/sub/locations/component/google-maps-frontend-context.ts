import { JupiterLocationResolver } from "@jupiter/webapi-client";
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
  const isGoogleMapsResolver =
    globalProperties.locationResolver === JupiterLocationResolver.GOOGLE_MAPS;
  const enabled = isGoogleMapsResolver && Boolean(apiKey);

  return { enabled, apiKey };
}
