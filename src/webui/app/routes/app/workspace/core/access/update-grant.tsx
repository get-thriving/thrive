import { AccessLevel, NamedEntityTag } from "@jupiter/webapi-client";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { z } from "zod";
import { parseForm } from "zodix";
import { noErrorNoData } from "@jupiter/core/infra/action-result";
import { handleActionApiError } from "@jupiter/core/infra/errors.server";

import { getLoggedInApiClient } from "~/api-clients.server";

const UpdateGrantFormSchema = z.object({
  entityType: z.nativeEnum(NamedEntityTag),
  entityRefId: z.string().min(1),
  accessGrantRefId: z.string().min(1),
  accessLevel: z
    .nativeEnum(AccessLevel)
    .refine((level) => level !== AccessLevel.OWNER, {
      message: "Grants must use reader, commenter, or writer access level",
    }),
});

export async function action({ request }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const form = await parseForm(request, UpdateGrantFormSchema);

  try {
    await apiClient.application.updateGrantForEntity({
      entity_type: form.entityType,
      entity_ref_id: form.entityRefId,
      access_grant_ref_id: form.accessGrantRefId,
      access_level: form.accessLevel,
    });

    return json(noErrorNoData());
  } catch (error) {
    return handleActionApiError(error);
  }
}

export default function AccessUpdateGrantRoute() {
  return null;
}
