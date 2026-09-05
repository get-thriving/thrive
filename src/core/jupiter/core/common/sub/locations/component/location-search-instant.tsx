import type {
  Location,
  LocationResolverCandidate,
} from "@jupiter/webapi-client";
import { Popper } from "@mui/material";
import type { PopperProps } from "@mui/material";
import { useFetcher } from "@remix-run/react";
import { useEffect } from "react";

import type { ActionResult } from "#/core/infra/action-result";
import { isNoErrorSomeData } from "#/core/infra/action-result";

const LOCATION_SEARCH_INSTANT_ROUTE =
  "/app/workspace/core/locations/search-instant";

const SEARCH_DEBOUNCE_MS = 300;

interface LocationSearchInstantResult {
  locations: Array<Location>;
  candidates: Array<LocationResolverCandidate>;
}

interface LocationSearchInstantPayload {
  query?: string;
  result?: LocationSearchInstantResult;
}

type LocationSearchInstantData = ActionResult<LocationSearchInstantPayload>;

export function useLocationSearchInstant(
  query: string,
  enabled: boolean,
  options?: { includeCandidates?: boolean },
) {
  const searchFetcher = useFetcher<LocationSearchInstantData>();
  const includeCandidates = options?.includeCandidates ?? true;

  useEffect(() => {
    if (!enabled) {
      return;
    }
    const trimmed = query.trim();
    const timeout = window.setTimeout(() => {
      if (trimmed === "") {
        return;
      }
      const params = new URLSearchParams({ query: trimmed });
      if (!includeCandidates) {
        params.set("includeCandidates", "false");
      }
      searchFetcher.load(
        `${LOCATION_SEARCH_INSTANT_ROUTE}?${params.toString()}`,
      );
    }, SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fetcher identity is stable
  }, [enabled, includeCandidates, query]);

  const trimmed = query.trim();
  const searchResult =
    trimmed !== "" &&
    searchFetcher.data &&
    isNoErrorSomeData(searchFetcher.data) &&
    (searchFetcher.data.data.query?.trim() ?? "") === trimmed
      ? searchFetcher.data.data.result
      : undefined;
  const searching = enabled && trimmed !== "" && searchFetcher.state !== "idle";

  return { searchResult, searching };
}

export function LocationSearchPopper({ style, ...other }: PopperProps) {
  return (
    <Popper
      {...other}
      placement="bottom-start"
      style={{ ...style, width: undefined }}
      sx={{
        minWidth: style?.width,
        width: "fit-content",
        maxWidth: "min(36rem, calc(100vw - 2rem))",
        zIndex: (theme) => theme.zIndex.modal + 1,
      }}
    />
  );
}
