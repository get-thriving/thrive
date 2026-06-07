import { ApiError, NamedEntityTag } from "@jupiter/webapi-client";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { z } from "zod";
import { parseParams } from "zodix";
import { parseEntityLinkStd } from "@jupiter/core/common/entity-link";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";

import { getGuestApiClient } from "~/api-clients.server";

const ParamsSchema = z.object({
  externalId: z.string(),
});

function publishedEntityLocation(externalId: string, owner: string): string {
  const { theType } = parseEntityLinkStd(owner);

  switch (theType) {
    case NamedEntityTag.TODO_TASK:
      return `/app/public/published/todo-task/${externalId}`;
    default:
      throw new Response(ReasonPhrases.NOT_FOUND, {
        status: StatusCodes.NOT_FOUND,
        statusText: ReasonPhrases.NOT_FOUND,
      });
  }
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { externalId } = parseParams(params, ParamsSchema);
  const apiClient = await getGuestApiClient(request);

  try {
    const result = await apiClient.publish.publishEntityLoadByExternalId({
      external_id: externalId,
    });

    return redirect(
      publishedEntityLocation(externalId, result.publish_entity.owner),
    );
  } catch (error) {
    if (error instanceof ApiError && error.status === StatusCodes.NOT_FOUND) {
      throw new Response(ReasonPhrases.NOT_FOUND, {
        status: StatusCodes.NOT_FOUND,
        statusText: ReasonPhrases.NOT_FOUND,
      });
    }

    throw error;
  }
}

export default function PublishedEntityRedirect() {
  return null;
}

export const ErrorBoundary = makeLeafErrorBoundary("/app", ParamsSchema, {
  notFound: (params) => `Could not find published entity ${params.externalId}!`,
  error: (params) =>
    `There was an error loading published entity ${params.externalId}! Please try again!`,
});
