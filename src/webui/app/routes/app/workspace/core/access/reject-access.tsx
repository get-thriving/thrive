import type { ActionFunctionArgs } from "react-router";
import { z } from "zod";
import { parseForm } from "zodix";
import { noErrorNoData } from "@jupiter/core/infra/action-result";
import { handleActionApiError } from "@jupiter/core/infra/errors.server";
import { getLoggedInApiClient } from "@jupiter/core/infra/api-clients.server";

const RejectAccessFormSchema = z.object({
  accessRequestRefId: z.string().min(1),
});

export async function action({ request }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const form = await parseForm(request, RejectAccessFormSchema);

  try {
    await apiClient.application.rejectAccessToEntity({
      access_request_ref_id: form.accessRequestRefId,
    });

    return noErrorNoData();
  } catch (error) {
    return handleActionApiError(error);
  }
}

export default function AccessRejectAccessRoute() {
  return null;
}
