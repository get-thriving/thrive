import { NamedEntityTag } from "@jupiter/webapi-client";
import type { LoaderFunctionArgs } from "react-router";
import { z } from "zod";
import { parseQuery } from "zodix";
import { getLoggedInApiClient } from "@jupiter/core/infra/api-clients.server";

const QuerySchema = z.object({
  entityType: z.nativeEnum(NamedEntityTag),
  entityRefId: z.string(),
});

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const query = parseQuery(request, QuerySchema);

  const result = await apiClient.infra.getEntityMutationHistory({
    entity_type: query.entityType,
    entity_ref_id: query.entityRefId,
  });

  return {
    entries: result.entries,
    users: result.users,
  };
}
