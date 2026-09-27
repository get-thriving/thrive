import type { ActionFunctionArgs } from "react-router";
import { z } from "zod";
import { parseForm } from "zodix";
import { noErrorNoData } from "@jupiter/core/infra/action-result";
import { handleActionApiError } from "@jupiter/core/infra/errors.server";
import { getLoggedInApiClient } from "@jupiter/core/infra/api-clients.server";

const CancelInviteFormSchema = z.object({
  accessInviteRefId: z.string().min(1),
});

export async function action({ request }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const form = await parseForm(request, CancelInviteFormSchema);

  try {
    await apiClient.application.cancelAccessInvite({
      access_invite_ref_id: form.accessInviteRefId,
    });

    return noErrorNoData();
  } catch (error) {
    return handleActionApiError(error);
  }
}

export default function AccessCancelInviteRoute() {
  return null;
}
