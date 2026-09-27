import type { LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { z } from "zod";
import { parseParams } from "zodix";

import { handleLoaderApiError } from "#/core/infra/errors.server";
import { getLoggedInApiClient } from "#/core/infra/api-clients.server";

const ParamsSchema = z.object({
  docId: z.string(),
});

export async function loader({ request, params }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const { docId } = parseParams(params, ParamsSchema);

  try {
    const result = await apiClient.docs.docLoad({
      ref_id: docId,
      allow_archived: true,
    });
    const dirId = result.doc.parent_dir_ref_id;
    return redirect(`/app/workspace/apps/docs/${dirId}/doc/${docId}`);
  } catch (error) {
    handleLoaderApiError(error);
  }
}
