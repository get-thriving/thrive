import { createContext } from "react";

// Browser Maps key from the hosting service's properties. WebUI and
// Published each load their own key and pass their service properties here.
export interface GoogleMapsApiKey {
  googleMapsApiKey: string | null;
}

export const GoogleMapsApiKeyContext = createContext<GoogleMapsApiKey>({
  googleMapsApiKey: null,
});
