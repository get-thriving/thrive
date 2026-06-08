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
    case NamedEntityTag.VACATION:
      return `/app/public/published/vacation/${externalId}`;
    case NamedEntityTag.JOURNAL:
      return `/app/public/published/journal/${externalId}`;
    case NamedEntityTag.TIME_PLAN:
      return `/app/public/published/time-plan/${externalId}`;
    case NamedEntityTag.SCHEDULE_EVENT_IN_DAY:
      return `/app/public/published/schedule-event-in-day/${externalId}`;
    case NamedEntityTag.SCHEDULE_EVENT_FULL_DAYS:
      return `/app/public/published/schedule-event-full-days/${externalId}`;
    case NamedEntityTag.SMART_LIST_ITEM:
      return `/app/public/published/smart-list-item/${externalId}`;
    case NamedEntityTag.METRIC_ENTRY:
      return `/app/public/published/metric-entry/${externalId}`;
    case NamedEntityTag.DOC:
      return `/app/public/published/doc/${externalId}`;
    case NamedEntityTag.PERSON:
      return `/app/public/published/person/${externalId}`;
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
