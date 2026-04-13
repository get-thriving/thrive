import { ApiError } from "@jupiter/webapi-client";
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

const UpsertTagsFormSchema = z.object({
  owner: z.string().min(1),
  tags: z
    .string()
    .transform((s) => (s.trim() !== "" ? s.trim().split(",") : [])),
});

export async function action({ request }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const form = await parseForm(request, UpsertTagsFormSchema);

  try {
    await apiClient.tags.tagLinkUpsert({
      owner: form.owner,
      tag_names: form.tags,
    });

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
