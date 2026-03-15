import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

import { getGuestApiClient } from "~/api-clients.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const externalId = params.externalId;
  if (!externalId) {
    throw new Response("Missing externalId", { status: 400 });
  }

  const apiClient = await getGuestApiClient(request);
  const result = await apiClient.schedule.scheduleExportLoadByExternalId({
    external_id: externalId,
  });

  return json(result);
}
