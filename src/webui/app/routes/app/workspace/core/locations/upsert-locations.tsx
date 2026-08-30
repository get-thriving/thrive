import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { z } from "zod";
import { parseForm } from "zodix";
import { noErrorNoData } from "@jupiter/core/infra/action-result";
import { handleActionApiError } from "@jupiter/core/infra/errors.server";

import { getLoggedInApiClient } from "~/api-clients.server";

const UpsertLocationsFormSchema = z.object({
  owner: z.string().min(1),
  locations: z
    .string()
    .transform((s) => (s.trim() !== "" ? s.trim().split(",") : [])),
});

export async function action({ request }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const form = await parseForm(request, UpsertLocationsFormSchema);

  try {
    await apiClient.locations.locationLinkUpsert({
      owner: form.owner,
      location_ref_ids: form.locations,
    });

    return json(noErrorNoData());
  } catch (error) {
    return handleActionApiError(error);
  }
}
