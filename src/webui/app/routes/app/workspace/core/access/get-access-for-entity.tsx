import { NamedEntityTag } from "@jupiter/webapi-client";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { z } from "zod";
import { parseQuery } from "zodix";
import { handleLoaderApiError } from "@jupiter/core/infra/errors.server";

import { getLoggedInApiClient } from "~/api-clients.server";

const QuerySchema = z.object({
  entityType: z.nativeEnum(NamedEntityTag),
  entityRefId: z.string(),
});

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const query = parseQuery(request, QuerySchema);

  try {
    const result = await apiClient.application.getAccessForEntity({
      entity_type: query.entityType,
      entity_ref_id: query.entityRefId,
    });

    return json({
      entries: result.entries,
      users: result.users,
    });
  } catch (error) {
    handleLoaderApiError(error);
  }
}

export default function GetAccessForEntityRoute() {
  return null;
}
