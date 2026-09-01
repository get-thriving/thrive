import { JupiterLocationResolver } from "@jupiter/webapi-client";
import { Box, Typography } from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";

import {
  loadGoogleMapsLibrary,
  resolvedPlaceFromGooglePlace,
  type ResolvedPlace,
} from "#/core/common/sub/locations/component/google-maps-loader";
import { GlobalPropertiesContext } from "#/core/config-client";
import { GoogleMapsApiKeyContext } from "#/core/infra/google-maps-api-key-context";

interface Props {
  label?: string;
  disabled?: boolean;
  onPlaceSelected: (place: ResolvedPlace) => void;
}

export function GooglePlacesSearchWidget({
  label = "Find a place",
  disabled = false,
  onPlaceSelected,
}: Props) {
  const globalProperties = useContext(GlobalPropertiesContext);
  const { googleMapsApiKey: apiKey } = useContext(GoogleMapsApiKeyContext);
  const showGoogleMaps =
    globalProperties.locationResolver === JupiterLocationResolver.GOOGLE_MAPS;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const onPlaceSelectedRef = useRef(onPlaceSelected);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    onPlaceSelectedRef.current = onPlaceSelected;
  }, [onPlaceSelected]);

  useEffect(() => {
    if (!showGoogleMaps || !apiKey || disabled) {
      return;
    }
    const container = containerRef.current;
    if (!container) {
      return;
    }

    let cancelled = false;
    let widget: google.maps.places.PlaceAutocompleteElement | null = null;
    let classicListener: google.maps.MapsEventListener | null = null;

    async function handleNewSelect(event: Event) {
      const selectEvent =
        event as google.maps.places.PlacePredictionSelectEvent;
      const { place } = await selectEvent.placePrediction
        .toPlace()
        .fetchFields({
          fields: [
            "displayName",
            "formattedAddress",
            "location",
            "addressComponents",
            "id",
          ],
        });
      const resolved = resolvedPlaceFromGooglePlace(place);
      if (resolved) {
        onPlaceSelectedRef.current(resolved);
      }
    }

    async function mount() {
      try {
        const places = await loadGoogleMapsLibrary(apiKey as string, "places");
        if (cancelled || !container) {
          return;
        }

        if (places.PlaceAutocompleteElement) {
          widget = new places.PlaceAutocompleteElement();
          widget.placeholder = label;
          widget.style.width = "100%";
          widget.addEventListener("gmp-select", handleNewSelect);
          container.replaceChildren(widget);
          setReady(true);
          return;
        }

        if (!places.Autocomplete) {
          return;
        }
        const classicInput = document.createElement("input");
        classicInput.type = "text";
        classicInput.placeholder = label;
        classicInput.style.width = "100%";
        classicInput.style.boxSizing = "border-box";
        classicInput.style.padding = "12px 14px";
        classicInput.style.border = "1px solid rgba(0, 0, 0, 0.23)";
        classicInput.style.borderRadius = "4px";
        classicInput.style.font = "inherit";
        container.replaceChildren(classicInput);
        const autocomplete = new places.Autocomplete(classicInput, {
          fields: [
            "name",
            "formatted_address",
            "geometry",
            "address_components",
            "place_id",
          ],
        });
        classicListener = autocomplete.addListener("place_changed", () => {
          const resolved = resolvedPlaceFromGooglePlace(
            autocomplete.getPlace(),
          );
          if (resolved) {
            onPlaceSelectedRef.current(resolved);
          }
        });
        setReady(true);
      } catch {
        setReady(false);
      }
    }

    void mount();

    return () => {
      cancelled = true;
      widget?.removeEventListener("gmp-select", handleNewSelect);
      classicListener?.remove();
      container.replaceChildren();
    };
  }, [apiKey, disabled, showGoogleMaps, label]);

  if (!showGoogleMaps) {
    return null;
  }

  return (
    <Box sx={{ mb: 2, width: "100%" }}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        {label}
      </Typography>
      <Box
        ref={containerRef}
        sx={{
          width: "100%",
          minHeight: ready ? undefined : "3rem",
          "& input, & place-autocomplete, & gmp-place-autocomplete": {
            width: "100%",
          },
        }}
      />
    </Box>
  );
}
