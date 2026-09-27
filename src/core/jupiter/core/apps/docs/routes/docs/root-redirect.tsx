import type { LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router";

import { getLoggedInApiClient } from "#/core/infra/api-clients.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const summaries = await apiClient.application.getSummaries({});
  const rootId = summaries.root_dir?.ref_id;
  if (rootId === undefined || rootId === null) {
    throw new Response("Missing docs root directory", { status: 500 });
  }
  return redirect(`/app/workspace/apps/docs/${rootId}`);
}

export default function DocsRootRedirect() {
  return null;
}
