/// <reference types="google.maps" />

import {
  importLibrary,
  setOptions,
  type LibraryMap,
} from "@googlemaps/js-api-loader";

let configured = false;

export interface ResolvedPlace {
  name: string;
  addressLine: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  sourceId: string | null;
}

interface AddressComponentLike {
  types?: string[];
  shortText?: string | null;
  short_name?: string;
}

interface PlaceLike {
  id?: string;
  place_id?: string;
  displayName?: string | { text?: string } | null;
  name?: string;
  formattedAddress?: string | null;
  formatted_address?: string;
  location?: {
    lat?: number | (() => number);
    lng?: number | (() => number);
  } | null;
  geometry?: {
    location?: {
      lat?: number | (() => number);
      lng?: number | (() => number);
    };
  };
  addressComponents?: AddressComponentLike[];
  address_components?: AddressComponentLike[];
}

function configureGoogleMapsLoader(apiKey: string): void {
  if (typeof window === "undefined") {
    throw new Error("Google Maps can only load in the browser");
  }
  if (configured) {
    return;
  }
  setOptions({ key: apiKey, v: "weekly" });
  configured = true;
}

export async function loadGoogleMapsLibrary<T extends keyof LibraryMap>(
  apiKey: string,
  library: T,
): Promise<LibraryMap[T]> {
  configureGoogleMapsLoader(apiKey);
  return importLibrary(library);
}

function readCoord(value: number | (() => number) | undefined): number | null {
  if (typeof value === "function") {
    const result = value();
    return typeof result === "number" ? result : null;
  }
  return typeof value === "number" ? value : null;
}

function readText(
  value: string | { text?: string } | null | undefined,
): string | null {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }
  if (value && typeof value === "object" && typeof value.text === "string") {
    const trimmed = value.text.trim();
    return trimmed.length > 0 ? trimmed : null;
  }
  return null;
}

function countryFromComponents(
  components: AddressComponentLike[] | undefined,
): string | null {
  if (!components) {
    return null;
  }
  for (const component of components) {
    if (!component.types?.includes("country")) {
      continue;
    }
    const short = component.shortText ?? component.short_name;
    if (typeof short === "string" && short.trim()) {
      return short.trim().toUpperCase();
    }
  }
  return null;
}

export function resolvedPlaceFromGooglePlace(
  place: PlaceLike,
): ResolvedPlace | null {
  const name =
    readText(place.displayName) ??
    readText(place.name) ??
    readText(place.formattedAddress) ??
    readText(place.formatted_address);
  if (!name) {
    return null;
  }
  const location = place.location ?? place.geometry?.location;
  return {
    name,
    addressLine:
      readText(place.formattedAddress) ?? readText(place.formatted_address),
    country: countryFromComponents(
      place.addressComponents ?? place.address_components,
    ),
    latitude: readCoord(location?.lat),
    longitude: readCoord(location?.lng),
    sourceId:
      typeof place.id === "string"
        ? place.id
        : typeof place.place_id === "string"
          ? place.place_id
          : null,
  };
}
