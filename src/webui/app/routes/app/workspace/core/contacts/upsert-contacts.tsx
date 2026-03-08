import { ApiError, ContactNamespace } from "@jupiter/webapi-client";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { parseForm } from "zodix";
import {
  noErrorNoData,
  validationErrorToUIErrorInfo,
} from "@jupiter/core/infra/action-result";

import { getLoggedInApiClient } from "~/api-clients.server";

const UpsertContactsFormSchema = z.object({
  namespace: z.nativeEnum(ContactNamespace),
  sourceEntityRefId: z.string(),
  contacts: z
    .string()
    .transform((s) => (s.trim() !== "" ? s.trim().split(",") : [])),
});

export async function action({ request }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const form = await parseForm(request, UpsertContactsFormSchema);

  try {
    await apiClient.contacts.contactLinkUpsert({
      namespace: form.namespace,
      source_entity_ref_id: form.sourceEntityRefId,
      contact_names: form.contacts,
    } as unknown as Parameters<typeof apiClient.contacts.contactLinkUpsert>[0]);

    return json(noErrorNoData());
  } catch (error) {
    if (
      error instanceof ApiError &&
      error.status === StatusCodes.UNPROCESSABLE_ENTITY
    ) {
      return json(validationErrorToUIErrorInfo(error.body));
    }

    throw error;
  }
}
