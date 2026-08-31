import type { Location } from "@jupiter/webapi-client";
import { Box, Typography } from "@mui/material";
import { useEffect, useMemo, useRef } from "react";

import {
  getGoogleMaps,
  loadGoogleMapsApi,
} from "#/core/common/sub/locations/component/google-maps-loader";
import { useGoogleMapsFrontend } from "#/core/common/sub/locations/component/google-maps-frontend-context";

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
  const { enabled, apiKey } = useGoogleMapsFrontend();
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
    if (!enabled || !apiKey || markers.length === 0) {
      return;
    }
    const container = containerRef.current;
    if (!container) {
      return;
    }

    let cancelled = false;
    const listeners: Array<{ remove?: () => void }> = [];

    async function mount() {
      try {
        await loadGoogleMapsApi(apiKey as string);
        if (cancelled || !container) {
          return;
        }
        const maps = getGoogleMaps() as {
          Map: new (
            el: HTMLElement,
            opts: {
              center: { lat: number; lng: number };
              zoom: number;
              mapTypeControl: boolean;
              streetViewControl: boolean;
              fullscreenControl: boolean;
            },
          ) => {
            fitBounds: (bounds: {
              extend: (pos: { lat: number; lng: number }) => void;
            }) => void;
            setCenter: (pos: { lat: number; lng: number }) => void;
            setZoom: (zoom: number) => void;
          };
          Marker: new (opts: {
            map: unknown;
            position: { lat: number; lng: number };
            title: string;
          }) => {
            addListener: (
              event: string,
              handler: () => void,
            ) => {
              remove?: () => void;
            };
          };
          LatLngBounds: new () => {
            extend: (pos: { lat: number; lng: number }) => void;
          };
        };
        const first = markers[0];
        const map = new maps.Map(container, {
          center: { lat: first.latitude, lng: first.longitude },
          zoom: markers.length === 1 ? 10 : 2,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        });
        const bounds = new maps.LatLngBounds();
        for (const marker of markers) {
          const position = { lat: marker.latitude, lng: marker.longitude };
          const pin = new maps.Marker({
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
  }, [apiKey, enabled, markerKey, markers]);

  if (!enabled || markers.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mb: 2, width: "100%" }}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        {title}
      </Typography>
      <Box
        ref={containerRef}
        sx={{
          width: "100%",
          height,
          borderRadius: 1,
          overflow: "hidden",
          border: "1px solid",
          borderColor: "divider",
        }}
      />
    </Box>
  );
}
