import type { LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { z } from "zod";
import { parseParams } from "zodix";

import { handleLoaderApiError } from "#/core/infra/errors.server";
import { getLoggedInApiClient } from "#/core/infra/api-clients.server";

const ParamsSchema = z.object({
  id: z.string(),
});

export async function loader({ request, params }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const { id } = parseParams(params, ParamsSchema);

  try {
    const result = await apiClient.metrics.metricEntryLoad({
      ref_id: id,
      allow_archived: true,
    });

    const parent = result.metric_entry;

    return redirect(
      `/app/workspace/apps/metrics/${parent.metric_ref_id}/entries/${id}`,
    );
  } catch (error) {
    handleLoaderApiError(error);
  }
}
