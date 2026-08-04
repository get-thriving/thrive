import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { z } from "zod";
import { parseForm } from "zodix";
import { noErrorNoData } from "@jupiter/core/infra/action-result";
import { handleActionApiError } from "@jupiter/core/infra/errors.server";

import { getLoggedInApiClient } from "~/api-clients.server";

const UpsertContactsFormSchema = z.object({
  owner: z.string().min(1),
  contacts: z
    .string()
    .transform((s) => (s.trim() !== "" ? s.trim().split(",") : [])),
});

export async function action({ request }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const form = await parseForm(request, UpsertContactsFormSchema);

  try {
    await apiClient.contacts.contactLinkUpsert({
      owner: form.owner,
      contact_names: form.contacts,
    });

    return json(noErrorNoData());
  } catch (error) {
    return handleActionApiError(error);
  }
}
