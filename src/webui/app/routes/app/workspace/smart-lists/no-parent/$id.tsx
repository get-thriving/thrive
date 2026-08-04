import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { z } from "zod";
import { parseParams } from "zodix";
import { handleLoaderApiError } from "@jupiter/core/infra/errors.server";

import { getLoggedInApiClient } from "~/api-clients.server";

const ParamsSchema = z.object({
  id: z.string(),
});

export async function loader({ request, params }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const { id } = parseParams(params, ParamsSchema);

  try {
    const result = await apiClient.smartLists.smartListItemLoad({
      ref_id: id,
      allow_archived: true,
    });

    const parent = result.item;

    return redirect(
      `/app/workspace/smart-lists/${parent.smart_list_ref_id}/${id}`,
    );
  } catch (error) {
    handleLoaderApiError(error);
  }
}
