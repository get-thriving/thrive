import type { ActionFunctionArgs } from "react-router";
import { z } from "zod";
import { parseForm } from "zodix";
import { noErrorNoData } from "@jupiter/core/infra/action-result";
import { handleActionApiError } from "@jupiter/core/infra/errors.server";
import { getLoggedInApiClient } from "@jupiter/core/infra/api-clients.server";

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

    return noErrorNoData();
  } catch (error) {
    return handleActionApiError(error);
  }
}
