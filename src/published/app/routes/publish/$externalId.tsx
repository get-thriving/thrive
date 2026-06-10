import { NamedEntityTag } from "@jupiter/webapi-client";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { z } from "zod";
import { parseParams } from "zodix";
import { parseEntityLinkStd } from "@jupiter/core/common/entity-link";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";

import { getGuestApiClient } from "~/api-clients.server";
import { handlePublishedLoaderError } from "~/rendering/published-loader.server";

const ParamsSchema = z.object({
  externalId: z.string(),
});

function publishedEntityLocation(externalId: string, owner: string): string {
  const { theType } = parseEntityLinkStd(owner);

  switch (theType) {
    case NamedEntityTag.TODO_TASK:
      return `/publish/todo-task/${externalId}`;
    case NamedEntityTag.VACATION:
      return `/publish/vacation/${externalId}`;
    case NamedEntityTag.JOURNAL:
      return `/publish/journal/${externalId}`;
    case NamedEntityTag.TIME_PLAN:
      return `/publish/time-plan/${externalId}`;
    case NamedEntityTag.SCHEDULE_EVENT_IN_DAY:
      return `/publish/schedule-event-in-day/${externalId}`;
    case NamedEntityTag.SCHEDULE_EVENT_FULL_DAYS:
      return `/publish/schedule-event-full-days/${externalId}`;
    case NamedEntityTag.SMART_LIST:
      return `/publish/smart-list/${externalId}`;
    case NamedEntityTag.SMART_LIST_ITEM:
      return `/publish/smart-list/item/${externalId}`;
    case NamedEntityTag.METRIC:
      return `/publish/metric/${externalId}`;
    case NamedEntityTag.METRIC_ENTRY:
      return `/publish/metric/entry/${externalId}`;
    case NamedEntityTag.DOC:
      return `/publish/doc/doc/${externalId}`;
    case NamedEntityTag.DIR:
      return `/publish/doc/dir/${externalId}`;
    case NamedEntityTag.PERSON:
      return `/publish/person/${externalId}`;
    case NamedEntityTag.HABIT:
      return `/publish/habit/${externalId}`;
    case NamedEntityTag.CHORE:
      return `/publish/chore/${externalId}`;
    case NamedEntityTag.BIG_PLAN:
      return `/publish/big-plan/${externalId}`;
    case NamedEntityTag.SCHEDULE_STREAM:
      return `/publish/schedule-stream/${externalId}`;
    default:
      throw new Response(ReasonPhrases.NOT_FOUND, {
        status: StatusCodes.NOT_FOUND,
        statusText: ReasonPhrases.NOT_FOUND,
      });
  }
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  try {
    const { externalId } = parseParams(params, ParamsSchema);
    const apiClient = await getGuestApiClient(request);

    const result = await apiClient.publish.publishEntityLoadByExternalId({
      external_id: externalId,
    });

    return redirect(
      publishedEntityLocation(externalId, result.publish_entity.owner),
    );
  } catch (error) {
    handlePublishedLoaderError(error);
  }
}

export default function PublishedEntityRedirect() {
  return null;
}

export const ErrorBoundary = makeLeafErrorBoundary("/publish", ParamsSchema, {
  notFound: (params) => `Could not find published entity ${params.externalId}!`,
  error: (params) =>
    `There was an error loading published entity ${params.externalId}! Please try again!`,
});
