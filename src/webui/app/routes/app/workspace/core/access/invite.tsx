import { AccessLevel, NamedEntityTag } from "@jupiter/webapi-client";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { z } from "zod";
import { parseForm } from "zodix";
import { noErrorNoData } from "@jupiter/core/infra/action-result";
import { handleActionApiError } from "@jupiter/core/infra/errors.server";

import { getLoggedInApiClient } from "~/api-clients.server";

const InviteFormSchema = z.object({
  entityType: z.nativeEnum(NamedEntityTag),
  entityRefId: z.string().min(1),
  userRefIds: z
    .string()
    .min(1)
    .transform((value) =>
      value
        .split(",")
        .map((refId) => refId.trim())
        .filter((refId) => refId.length > 0),
    ),
  accessLevel: z
    .nativeEnum(AccessLevel)
    .refine((level) => level !== AccessLevel.OWNER, {
      message: "Invites must use reader, commenter, or writer access level",
    }),
});

export async function action({ request }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const form = await parseForm(request, InviteFormSchema);

  try {
    await apiClient.application.inviteUsersToEntity({
      entity_type: form.entityType,
      entity_ref_id: form.entityRefId,
      user_ref_ids: form.userRefIds,
      access_level: form.accessLevel,
    });

    return json(noErrorNoData());
  } catch (error) {
    return handleActionApiError(error);
  }
}

export default function AccessInviteRoute() {
  return null;
}
