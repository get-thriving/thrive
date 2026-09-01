import { JupiterLocationResolver, type Location } from "@jupiter/webapi-client";
import { useContext, useMemo } from "react";

import {
  LocationsMap,
  locationToMapMarker,
} from "#/core/common/sub/locations/component/locations-map";
import { GlobalPropertiesContext } from "#/core/config-client";
import { SectionCard } from "#/core/infra/component/section-card";
import { GoogleMapsApiKeyContext } from "#/core/infra/google-maps-api-key-context";

interface EntityLocationMapSectionProps {
  location: Location | null | undefined;
}

export function EntityLocationMapSection({
  location,
}: EntityLocationMapSectionProps) {
  const globalProperties = useContext(GlobalPropertiesContext);
  const { googleMapsApiKey: apiKey } = useContext(GoogleMapsApiKeyContext);
  const showGoogleMaps =
    globalProperties.locationResolver === JupiterLocationResolver.GOOGLE_MAPS;
  const markers = useMemo(() => {
    if (!location) {
      return [];
    }
    const marker = locationToMapMarker(location);
    return marker ? [marker] : [];
  }, [location]);

  if (!showGoogleMaps || !apiKey || markers.length === 0) {
    return null;
  }

  return (
    <SectionCard id="entity-location-map" title="Map">
      <LocationsMap title="" markers={markers} height={240} />
    </SectionCard>
  );
}
