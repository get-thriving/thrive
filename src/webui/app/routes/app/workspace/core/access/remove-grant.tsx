import { NamedEntityTag } from "@jupiter/webapi-client";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { z } from "zod";
import { parseForm } from "zodix";
import { noErrorNoData } from "@jupiter/core/infra/action-result";
import { handleActionApiError } from "@jupiter/core/infra/errors.server";

import { getLoggedInApiClient } from "~/api-clients.server";

const RemoveGrantFormSchema = z.object({
  entityType: z.nativeEnum(NamedEntityTag),
  entityRefId: z.string().min(1),
  accessGrantRefId: z.string().min(1),
});

export async function action({ request }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const form = await parseForm(request, RemoveGrantFormSchema);

  try {
    await apiClient.application.removeGrantForEntity({
      entity_type: form.entityType,
      entity_ref_id: form.entityRefId,
      access_grant_ref_id: form.accessGrantRefId,
    });

    return json(noErrorNoData());
  } catch (error) {
    return handleActionApiError(error);
  }
}

export default function AccessRemoveGrantRoute() {
  return null;
}
