import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";

import { getLoggedInApiClient } from "~/api-clients.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);

  const result = await apiClient.lifePlan.visionCreateDraft({});

  return redirect(`/app/workspace/life-plan/visions/${result.vision.ref_id}`);
}


