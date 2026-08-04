import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { z } from "zod";
import { parseQuery } from "zodix";
import { noErrorSomeData } from "@jupiter/core/infra/action-result";
import { handleActionApiError } from "@jupiter/core/infra/errors.server";

import { getLoggedInApiClient } from "~/api-clients.server";

const SEARCH_FOR_USER_DEFAULT_LIMIT = 20;

const QuerySchema = z.object({
  query: z.string().optional(),
  limit: z.string().optional(),
});

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const query = parseQuery(request, QuerySchema);

  if (query.query === undefined || query.query.trim().length < 2) {
    return json(noErrorSomeData({ users: [] }));
  }

  const parsedLimit =
    query.limit !== undefined && query.limit.trim() !== ""
      ? parseInt(query.limit, 10)
      : SEARCH_FOR_USER_DEFAULT_LIMIT;

  try {
    const result = await apiClient.application.searchForUser({
      query: query.query.trim(),
      limit: Number.isNaN(parsedLimit)
        ? SEARCH_FOR_USER_DEFAULT_LIMIT
        : parsedLimit,
    });

    return json(noErrorSomeData({ users: result.users }));
  } catch (error) {
    return handleActionApiError(error);
  }
}

export default function SearchForUserRoute() {
  return null;
}
