import { NamedEntityTag } from "@jupiter/webapi-client";
import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { z } from "zod";
import { parseForm } from "zodix";
import { handleActionApiError } from "@jupiter/core/infra/errors.server";

import { getLoggedInApiClient } from "~/api-clients.server";

const DEFAULT_RETURN_LOCATION = "/app/workspace";

const ForgetGrantFormSchema = z.object({
  entityType: z.nativeEnum(NamedEntityTag),
  entityRefId: z.string().min(1),
  accessGrantRefId: z.string().min(1),
  returnLocation: z.string().optional(),
});

function safeReturnLocation(returnLocation: string | undefined): string {
  if (
    returnLocation === undefined ||
    !returnLocation.startsWith("/app/") ||
    returnLocation.includes("://")
  ) {
    return DEFAULT_RETURN_LOCATION;
  }
  return returnLocation;
}

export async function action({ request }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const form = await parseForm(request, ForgetGrantFormSchema);

  try {
    await apiClient.application.removeGrantForEntity({
      entity_type: form.entityType,
      entity_ref_id: form.entityRefId,
      access_grant_ref_id: form.accessGrantRefId,
    });

    // Leave the entity page immediately — the user no longer has access, so
    // revalidating its loader would fail with UserNotAllowedAccessToEntityError.
    return redirect(safeReturnLocation(form.returnLocation));
  } catch (error) {
    return handleActionApiError(error);
  }
}

export default function AccessForgetGrantRoute() {
  return null;
}
