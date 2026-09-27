import type { LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router";

import { getLoggedInApiClient } from "#/core/infra/api-clients.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);

  const result = await apiClient.lifePlan.visionCreateDraft({});

  return redirect(
    `/app/workspace/apps/life-plan/visions/${result.vision.ref_id}`,
  );
}
