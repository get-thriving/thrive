import { NamedEntityTag } from "@jupiter/webapi-client";
import type { LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { z } from "zod";
import { parseParams } from "zodix";
import { parseEntityLinkStd } from "@jupiter/core/common/entity-link";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { handleLoaderApiError } from "@jupiter/core/infra/errors.server";
import { getGuestApiClient } from "@jupiter/core/infra/api-clients.server";

const ParamsSchema = z.object({
  externalId: z.string(),
});

// No `/publish` prefix: React Router resolves a relative redirect against the
// router basename, so it adds one. Spelling it here as well sent people to
// `/publish/publish/<entity>`, which 404s.
function publishedEntityLocation(externalId: string, owner: string): string {
  const { theType } = parseEntityLinkStd(owner);

  switch (theType) {
    case NamedEntityTag.TODO_TASK:
      return `/todo-task/${externalId}`;
    case NamedEntityTag.VACATION:
      return `/vacation/${externalId}`;
    case NamedEntityTag.JOURNAL:
      return `/journal/${externalId}`;
    case NamedEntityTag.TIME_PLAN:
      return `/time-plan/${externalId}`;
    case NamedEntityTag.SCHEDULE_EVENT_IN_DAY:
      return `/schedule-event-in-day/${externalId}`;
    case NamedEntityTag.SCHEDULE_EVENT_FULL_DAYS:
      return `/schedule-event-full-days/${externalId}`;
    case NamedEntityTag.SMART_LIST:
      return `/smart-list/${externalId}`;
    case NamedEntityTag.SMART_LIST_ITEM:
      return `/smart-list/item/${externalId}`;
    case NamedEntityTag.METRIC:
      return `/metric/${externalId}`;
    case NamedEntityTag.METRIC_ENTRY:
      return `/metric/entry/${externalId}`;
    case NamedEntityTag.DOC:
      return `/doc/doc/${externalId}`;
    case NamedEntityTag.DIR:
      return `/doc/dir/${externalId}`;
    case NamedEntityTag.PERSON:
      return `/person/${externalId}`;
    case NamedEntityTag.HABIT:
      return `/habit/${externalId}`;
    case NamedEntityTag.HABIT_STACK:
      return `/habit-stack/${externalId}`;
    case NamedEntityTag.CHORE:
      return `/chore/${externalId}`;
    case NamedEntityTag.CHORE_STACK:
      return `/chore-stack/${externalId}`;
    case NamedEntityTag.BIG_PLAN:
      return `/big-plan/${externalId}`;
    case NamedEntityTag.SCHEDULE_STREAM:
      return `/schedule-stream/${externalId}`;
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

    // Preserve any query string (e.g. calendar date/period/view) so that
    // shareable deep links survive the redirect to the entity-specific route.
    const { search } = new URL(request.url);

    return redirect(
      publishedEntityLocation(externalId, result.publish_entity.owner) + search,
    );
  } catch (error) {
    handleLoaderApiError(error);
  }
}

export default function PublishedEntityRedirect() {
  return null;
}

export const ErrorBoundary = makeLeafErrorBoundary("/", ParamsSchema, {
  notFound: (params) => `Could not find published entity ${params.externalId}!`,
  error: (params) =>
    `There was an error loading published entity ${params.externalId}! Please try again!`,
});
