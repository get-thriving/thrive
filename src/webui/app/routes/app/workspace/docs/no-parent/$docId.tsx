import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { z } from "zod";
import { parseParams } from "zodix";
import { handleLoaderApiError } from "@jupiter/core/infra/errors.server";

import { getLoggedInApiClient } from "~/api-clients.server";

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
    return redirect(`/app/workspace/docs/${dirId}/doc/${docId}`);
  } catch (error) {
    handleLoaderApiError(error);
  }
}
