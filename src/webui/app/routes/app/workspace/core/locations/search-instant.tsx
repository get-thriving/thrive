import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { z } from "zod";
import { parseQuery } from "zodix";
import { noErrorSomeData } from "@jupiter/core/infra/action-result";
import { handleActionApiError } from "@jupiter/core/infra/errors.server";

import { getLoggedInApiClient } from "~/api-clients.server";

const LOCATION_SEARCH_DEFAULT_LIMIT = 10;

const LocationSearchQuerySchema = z.object({
  query: z.string().optional(),
  limit: z.string().optional(),
});

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const parsed = parseQuery(request, LocationSearchQuerySchema);
  const query = parsed.query?.trim() ?? "";

  if (query === "") {
    return json(
      noErrorSomeData({
        query: parsed.query,
        result: undefined,
      }),
    );
  }

  try {
    const result = await apiClient.locations.locationSearch({
      query,
      limit: parsed.limit
        ? parseInt(parsed.limit, 10)
        : LOCATION_SEARCH_DEFAULT_LIMIT,
      include_archived: false,
    });
    return json(
      noErrorSomeData({
        query: parsed.query,
        result,
      }),
    );
  } catch (error) {
    return handleActionApiError(error);
  }
}

export default function LocationSearchInstantRoute() {
  return null;
}
