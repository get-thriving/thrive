import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { z } from "zod";
import { parseParams } from "zodix";
import { parseEntityLinkStd } from "@jupiter/core/common/entity-link";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";

import { getGuestApiClient } from "~/api-clients.server";
import { handlePublishedLoaderError } from "~/rendering/published-loader.server";

const ParamsSchema = z.object({
  externalId: z.string(),
});

export async function loader({ request, params }: LoaderFunctionArgs) {
  try {
    const { externalId } = parseParams(params, ParamsSchema);
    const apiClient = await getGuestApiClient(request);

    const result = await apiClient.publish.publishEntityLoadByExternalId({
      external_id: externalId,
    });

    const { refId } = parseEntityLinkStd(result.publish_entity.owner);

    return redirect(`/app/public/published/doc/dirtree/${externalId}/${refId}`);
  } catch (error) {
    handlePublishedLoaderError(error);
  }
}

export default function PublishedDocDirRedirect() {
  return null;
}

export const ErrorBoundary = makeLeafErrorBoundary("/app", ParamsSchema, {
  notFound: (params) => `Could not find published folder ${params.externalId}!`,
  error: (params) =>
    `There was an error loading published folder ${params.externalId}! Please try again!`,
});
