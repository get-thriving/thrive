import { Box, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";

import {
  getGoogleMaps,
  loadGoogleMapsApi,
  resolvedPlaceFromGooglePlace,
  type ResolvedPlace,
} from "#/core/common/sub/locations/component/google-maps-loader";
import { useGoogleMapsFrontend } from "#/core/common/sub/locations/component/google-maps-frontend-context";

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
  const { enabled, apiKey } = useGoogleMapsFrontend();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const onPlaceSelectedRef = useRef(onPlaceSelected);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    onPlaceSelectedRef.current = onPlaceSelected;
  }, [onPlaceSelected]);

  useEffect(() => {
    if (!enabled || !apiKey || disabled) {
      return;
    }
    const container = containerRef.current;
    if (!container) {
      return;
    }

    let cancelled = false;
    let widget: HTMLElement | null = null;
    let classicInput: HTMLInputElement | null = null;
    let classicListener: { remove?: () => void } | null = null;

    async function mount() {
      try {
        await loadGoogleMapsApi(apiKey as string);
        if (cancelled || !container) {
          return;
        }
        const maps = getGoogleMaps();
        const places = maps.places;
        if (!places) {
          return;
        }

        const PlaceAutocompleteElement = (
          places as {
            PlaceAutocompleteElement?: new () => HTMLElement;
          }
        ).PlaceAutocompleteElement;

        if (PlaceAutocompleteElement) {
          widget = new PlaceAutocompleteElement();
          widget.setAttribute("placeholder", label);
          widget.style.width = "100%";
          widget.addEventListener("gmp-select", handleNewSelect as EventListener);
          container.replaceChildren(widget);
          setReady(true);
          return;
        }

        const Autocomplete = (
          places as {
            Autocomplete?: new (
              input: HTMLInputElement,
              opts?: { fields?: string[] },
            ) => {
              addListener: (event: string, handler: () => void) => {
                remove?: () => void;
              };
              getPlace: () => Parameters<typeof resolvedPlaceFromGooglePlace>[0];
            };
          }
        ).Autocomplete;
        if (!Autocomplete) {
          return;
        }
        classicInput = document.createElement("input");
        classicInput.type = "text";
        classicInput.placeholder = label;
        classicInput.style.width = "100%";
        classicInput.style.boxSizing = "border-box";
        classicInput.style.padding = "12px 14px";
        classicInput.style.border = "1px solid rgba(0, 0, 0, 0.23)";
        classicInput.style.borderRadius = "4px";
        classicInput.style.font = "inherit";
        container.replaceChildren(classicInput);
        const autocomplete = new Autocomplete(classicInput, {
          fields: [
            "name",
            "formatted_address",
            "geometry",
            "address_components",
            "place_id",
          ],
        });
        classicListener = autocomplete.addListener("place_changed", () => {
          const resolved = resolvedPlaceFromGooglePlace(autocomplete.getPlace());
          if (resolved) {
            onPlaceSelectedRef.current(resolved);
          }
        });
        setReady(true);
      } catch {
        setReady(false);
      }
    }

    async function handleNewSelect(event: Event) {
      const detail = event as Event & {
        placePrediction?: {
          toPlace?: () => {
            fetchFields: (opts: { fields: string[] }) => Promise<void>;
          } & Parameters<typeof resolvedPlaceFromGooglePlace>[0];
        };
      };
      const place = detail.placePrediction?.toPlace?.();
      if (!place) {
        return;
      }
      await place.fetchFields({
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

    void mount();

    return () => {
      cancelled = true;
      widget?.removeEventListener("gmp-select", handleNewSelect as EventListener);
      classicListener?.remove?.();
      container.replaceChildren();
    };
  }, [apiKey, disabled, enabled, label]);

  if (!enabled) {
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
