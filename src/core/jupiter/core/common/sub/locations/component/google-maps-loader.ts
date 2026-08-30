const SCRIPT_ID = "jupiter-google-maps-js";

declare global {
  interface Window {
    google?: {
      maps?: {
        places?: Record<string, unknown>;
        Map?: unknown;
        Marker?: unknown;
        LatLngBounds?: unknown;
      };
    };
  }
}

let loadPromise: Promise<void> | null = null;

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
  shortText?: string;
  short_name?: string;
}

interface PlaceLike {
  id?: string;
  place_id?: string;
  displayName?: string | { text?: string };
  name?: string;
  formattedAddress?: string;
  formatted_address?: string;
  location?: {
    lat?: number | (() => number);
    lng?: number | (() => number);
  };
  geometry?: {
    location?: {
      lat?: number | (() => number);
      lng?: number | (() => number);
    };
  };
  addressComponents?: AddressComponentLike[];
  address_components?: AddressComponentLike[];
}

function readCoord(
  value: number | (() => number) | undefined,
): number | null {
  if (typeof value === "function") {
    const result = value();
    return typeof result === "number" ? result : null;
  }
  return typeof value === "number" ? value : null;
}

function readText(value: string | { text?: string } | undefined): string | null {
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

export function resolvedPlaceFromGooglePlace(place: PlaceLike): ResolvedPlace | null {
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

export async function loadGoogleMapsApi(apiKey: string): Promise<void> {
  if (typeof window === "undefined") {
    throw new Error("Google Maps can only load in the browser");
  }
  if (window.google?.maps) {
    return;
  }
  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = new Promise<void>((resolve, reject) => {
    const existing = document.getElementById(SCRIPT_ID);
    if (existing) {
      const check = window.setInterval(() => {
        if (window.google?.maps) {
          window.clearInterval(check);
          resolve();
        }
      }, 50);
      return;
    }
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.async = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&v=weekly&libraries=places`;
    script.onload = () => resolve();
    script.onerror = () => {
      loadPromise = null;
      reject(new Error("Failed to load Google Maps JavaScript API"));
    };
    document.head.appendChild(script);
  });

  return loadPromise;
}

export function getGoogleMaps(): NonNullable<NonNullable<Window["google"]>["maps"]> {
  const maps = window.google?.maps;
  if (!maps) {
    throw new Error("Google Maps JavaScript API is not loaded");
  }
  return maps;
}
