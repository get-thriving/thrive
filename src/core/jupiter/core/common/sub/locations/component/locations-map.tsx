import { JupiterLocationResolver, type Location } from "@jupiter/webapi-client";
import { Box, Typography } from "@mui/material";
import { useContext, useEffect, useMemo, useRef } from "react";

import { loadGoogleMapsLibrary } from "#/core/common/sub/locations/component/google-maps-loader";
import { GlobalPropertiesContext } from "#/core/config-client";
import { GoogleMapsApiKeyContext } from "#/core/infra/google-maps-api-key-context";

export interface LocationMapMarker {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  href?: string;
}

interface Props {
  title?: string;
  markers: LocationMapMarker[];
  height?: number;
  onSelectHref?: (href: string) => void;
}

export function locationToMapMarker(
  location: Location,
  href?: string,
): LocationMapMarker | null {
  if (!location.gps) {
    return null;
  }
  return {
    id: location.ref_id,
    name: location.name,
    latitude: location.gps.latitude,
    longitude: location.gps.longitude,
    href,
  };
}

export function LocationsMap({
  title = "Map",
  markers,
  height = 280,
  onSelectHref,
}: Props) {
  const globalProperties = useContext(GlobalPropertiesContext);
  const { googleMapsApiKey: apiKey } = useContext(GoogleMapsApiKeyContext);
  const showGoogleMaps =
    globalProperties.locationResolver === JupiterLocationResolver.GOOGLE_MAPS;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const onSelectHrefRef = useRef(onSelectHref);
  const markerKey = useMemo(
    () =>
      markers
        .map(
          (marker) =>
            `${marker.id}:${marker.latitude}:${marker.longitude}:${marker.href ?? ""}`,
        )
        .join("|"),
    [markers],
  );

  useEffect(() => {
    onSelectHrefRef.current = onSelectHref;
  }, [onSelectHref]);

  useEffect(() => {
    if (!showGoogleMaps || !apiKey || markers.length === 0) {
      return;
    }
    const container = containerRef.current;
    if (!container) {
      return;
    }

    let cancelled = false;
    const listeners: google.maps.MapsEventListener[] = [];

    async function mount() {
      try {
        const [{ Map }, { Marker }, { LatLngBounds }] = await Promise.all([
          loadGoogleMapsLibrary(apiKey as string, "maps"),
          loadGoogleMapsLibrary(apiKey as string, "marker"),
          loadGoogleMapsLibrary(apiKey as string, "core"),
        ]);
        if (cancelled || !container) {
          return;
        }
        const first = markers[0];
        const map = new Map(container, {
          center: { lat: first.latitude, lng: first.longitude },
          zoom: markers.length === 1 ? 10 : 2,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        });
        const bounds = new LatLngBounds();
        for (const marker of markers) {
          const position = { lat: marker.latitude, lng: marker.longitude };
          const pin = new Marker({
            map,
            position,
            title: marker.name,
          });
          bounds.extend(position);
          if (marker.href) {
            listeners.push(
              pin.addListener("click", () => {
                onSelectHrefRef.current?.(marker.href as string);
              }),
            );
          }
        }
        if (markers.length > 1) {
          map.fitBounds(bounds);
        }
      } catch {
        // Invalid or blocked API keys should not break the page.
      }
    }

    void mount();

    return () => {
      cancelled = true;
      for (const listener of listeners) {
        listener.remove?.();
      }
      container.replaceChildren();
    };
  }, [apiKey, showGoogleMaps, markerKey, markers]);

  if (!showGoogleMaps || markers.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mb: title ? 2 : 0, width: "100%" }}>
      {title ? (
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          {title}
        </Typography>
      ) : null}
      <Box
        ref={containerRef}
        sx={{
          width: "100%",
          height,
          borderRadius: title ? 1 : 0.5,
          overflow: "hidden",
          ...(title
            ? {
                border: "1px solid",
                borderColor: "divider",
              }
            : undefined),
        }}
      />
    </Box>
  );
}
