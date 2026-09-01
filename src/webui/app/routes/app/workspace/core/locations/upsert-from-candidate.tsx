import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { z } from "zod";
import { parseForm } from "zodix";
import { noErrorSomeData } from "@jupiter/core/infra/action-result";
import { handleActionApiError } from "@jupiter/core/infra/errors.server";

import { getLoggedInApiClient } from "~/api-clients.server";

const UpsertFromCandidateFormSchema = z.object({
  owner: z.string().min(1),
  name: z.string().optional(),
  addressLine: z.string().optional(),
  country: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
});

function emptyToNull(value: string | undefined): string | null {
  const trimmed = value?.trim() ?? "";
  return trimmed === "" ? null : trimmed;
}

export async function action({ request }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const form = await parseForm(request, UpsertFromCandidateFormSchema);

  try {
    const lat = emptyToNull(form.latitude);
    const lng = emptyToNull(form.longitude);
    const result = await apiClient.locations.locationLinkUpsertFromCandidate({
      owner: form.owner,
      name: emptyToNull(form.name),
      address_line: emptyToNull(form.addressLine),
      country: emptyToNull(form.country),
      gps:
        lat === null && lng === null
          ? null
          : {
              latitude: lat === null ? Number.NaN : Number(lat),
              longitude: lng === null ? Number.NaN : Number(lng),
            },
    });

    return json(noErrorSomeData({ location: result.new_location }));
  } catch (error) {
    return handleActionApiError(error);
  }
}
