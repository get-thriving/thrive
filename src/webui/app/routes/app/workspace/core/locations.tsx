import type {
  Location,
  LocationResolverCandidate,
} from "@jupiter/webapi-client";
import { DocsHelpSubject } from "@jupiter/webapi-client";
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  Typography,
} from "@mui/material";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { Outlet, useFetcher, useNavigate } from "@remix-run/react";
import { AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { EntityNameComponent } from "@jupiter/core/common/component/entity-name";
import { GooglePlacesSearchWidget } from "@jupiter/core/common/sub/locations/component/google-places-search-widget";
import type { ResolvedPlace } from "@jupiter/core/common/sub/locations/component/google-maps-loader";
import {
  LocationsMap,
  locationToMapMarker,
} from "@jupiter/core/common/sub/locations/component/locations-map";
import {
  EntityCard,
  EntityLink,
} from "@jupiter/core/infra/component/entity-card";
import { EntityNoNothingCard } from "@jupiter/core/infra/component/entity-no-nothing-card";
import { EntityStack } from "@jupiter/core/infra/component/entity-stack";
import { makeTrunkErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { NestingAwareBlock } from "@jupiter/core/infra/component/layout/nesting-aware-block";
import { TrunkPanel } from "@jupiter/core/infra/component/layout/trunk-panel";
import {
  DisplayType,
  useTrunkNeedsToShowLeaf,
} from "@jupiter/core/infra/component/use-nested-entities";
import type { ActionResult } from "@jupiter/core/infra/action-result";
import { isNoErrorSomeData } from "@jupiter/core/infra/action-result";

import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { getLoggedInApiClient } from "~/api-clients.server";

type LocationSearchInstantData = ActionResult<{
  query?: string;
  result?: {
    locations: Array<Location>;
    candidates: Array<LocationResolverCandidate>;
  };
}>;

export const handle = {
  displayType: DisplayType.TRUNK,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);

  const result = await apiClient.locations.locationFind({
    allow_archived: false,
  });

  return json({
    locations: result.locations as Array<Location>,
  });
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

function candidateCreateLocation(candidate: LocationResolverCandidate): string {
  return placeCreateLocation({
    name: candidate.name,
    addressLine: candidate.address_line ?? null,
    country: candidate.country ?? null,
    latitude: candidate.gps?.latitude ?? null,
    longitude: candidate.gps?.longitude ?? null,
    sourceId: candidate.source_id ?? null,
  });
}

function placeCreateLocation(place: ResolvedPlace): string {
  const params = new URLSearchParams();
  params.set("name", place.name);
  if (place.addressLine) {
    params.set("addressLine", place.addressLine);
  }
  if (place.country) {
    params.set("country", place.country);
  }
  if (place.latitude !== null) {
    params.set("latitude", String(place.latitude));
  }
  if (place.longitude !== null) {
    params.set("longitude", String(place.longitude));
  }
  return `/app/workspace/core/locations/new?${params.toString()}`;
}

export default function Locations() {
  const { locations } = useLoaderDataSafeForAnimation<typeof loader>();
  const shouldShowALeafToo = useTrunkNeedsToShowLeaf();
  const searchFetcher = useFetcher<LocationSearchInstantData>();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const handlePlaceSelected = useCallback(
    (place: ResolvedPlace) => {
      navigate(placeCreateLocation(place));
    },
    [navigate],
  );
  const handleMapSelect = useCallback(
    (href: string) => {
      navigate(href);
    },
    [navigate],
  );

  useEffect(() => {
    const trimmed = query.trim();
    const timeout = window.setTimeout(() => {
      if (trimmed === "") {
        return;
      }
      searchFetcher.load(
        `/app/workspace/core/locations/search-instant?query=${encodeURIComponent(trimmed)}`,
      );
    }, 300);
    return () => window.clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fetcher identity is stable
  }, [query]);

  const searchResult =
    query.trim() !== "" &&
    searchFetcher.data &&
    isNoErrorSomeData(searchFetcher.data)
      ? searchFetcher.data.data.result
      : undefined;

  const shownLocations = useMemo(() => {
    const source = searchResult?.locations ?? locations;
    return [...source].sort((a, b) => a.name.localeCompare(b.name));
  }, [locations, searchResult]);

  const mapMarkers = useMemo(
    () =>
      shownLocations.flatMap((location) => {
        const marker = locationToMapMarker(
          location,
          `/app/workspace/core/locations/${location.ref_id}`,
        );
        return marker ? [marker] : [];
      }),
    [shownLocations],
  );

  const candidates = searchResult?.candidates ?? [];
  const showEmptyCard =
    query.trim() === "" &&
    shownLocations.length === 0 &&
    candidates.length === 0;

  return (
    <TrunkPanel
      key={"core/locations"}
      createLocation="/app/workspace/core/locations/new"
      returnLocation="/app/workspace"
    >
      <NestingAwareBlock shouldHide={shouldShowALeafToo}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="location-search">Search</InputLabel>
          <OutlinedInput
            label="Search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </FormControl>

        <GooglePlacesSearchWidget onPlaceSelected={handlePlaceSelected} />
        <LocationsMap
          title="Locations"
          markers={mapMarkers}
          onSelectHref={handleMapSelect}
        />

        {showEmptyCard && (
          <EntityNoNothingCard
            title="No Locations"
            message="There are no locations to show. You can create a new location."
            newEntityLocations="/app/workspace/core/locations/new"
            helpSubject={DocsHelpSubject.ROOT}
          />
        )}

        {query.trim() !== "" && (
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Existing locations
          </Typography>
        )}

        <EntityStack>
          {shownLocations.map((location) => (
            <EntityCard
              entityId={`location-${location.ref_id}`}
              key={`location-${location.ref_id}`}
            >
              <EntityLink
                to={`/app/workspace/core/locations/${location.ref_id}`}
              >
                <EntityNameComponent name={location.name} />
              </EntityLink>
            </EntityCard>
          ))}
        </EntityStack>

        {candidates.length > 0 && (
          <>
            <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
              Suggested locations
            </Typography>
            <EntityStack>
              {candidates.map((candidate) => (
                <EntityCard
                  entityId={`location-candidate-${candidate.source}-${candidate.source_id ?? candidate.name}`}
                  key={`location-candidate-${candidate.source}-${candidate.source_id ?? candidate.name}`}
                >
                  <EntityLink to={candidateCreateLocation(candidate)}>
                    <EntityNameComponent name={candidate.name} />
                  </EntityLink>
                </EntityCard>
              ))}
            </EntityStack>
          </>
        )}
      </NestingAwareBlock>

      <AnimatePresence mode="wait" initial={false}>
        <Outlet />
      </AnimatePresence>
    </TrunkPanel>
  );
}

export const ErrorBoundary = makeTrunkErrorBoundary("/app/workspace", {
  error: () => `There was an error loading the locations! Please try again!`,
});
