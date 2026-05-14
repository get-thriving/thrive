import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";

import { getLoggedInApiClient } from "~/api-clients.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const summaries = await apiClient.application.getSummaries({});
  const rootId = summaries.root_dir?.ref_id;
  if (rootId === undefined || rootId === null) {
    throw new Response("Missing docs root directory", { status: 500 });
  }
  return redirect(`/app/workspace/docs/${rootId}`);
}

export default function DocsRootRedirect() {
  return null;
}
