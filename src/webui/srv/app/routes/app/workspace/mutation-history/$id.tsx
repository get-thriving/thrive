import { Stack } from "@mui/material";
import { ApiError } from "@jupiter/webapi-client";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { z } from "zod";
import { parseParams } from "zodix";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import { EntityEventList } from "@jupiter/core/infra/component/layout/entity-event-list";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";

import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { getLoggedInApiClient } from "~/api-clients.server";

const ParamsSchema = z.object({
  id: z.string(),
});

export const handle = {
  displayType: DisplayType.LEAF,
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const { id } = parseParams(params, ParamsSchema);

  try {
    const result = await apiClient.infra.getMutationEntityEvents({
      mutation_id: id,
    });

    return json({
      mutationName: result.mutation_name,
      entries: result.entries,
      users: result.users,
    });
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

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

export default function MutationDetail() {
  const { mutationName, entries, users } =
    useLoaderDataSafeForAnimation<typeof loader>();

  const usersById = Object.fromEntries(
    (users as Array<{ ref_id: string; name: string }>).map((u) => [
      u.ref_id,
      u,
    ]),
  );

  const mutationLabel = mutationName.replace(/UseCase$/, "");

  return (
    <LeafPanel
      key={`mutation-history/${mutationLabel}`}
      fakeKey={`mutation-history/${mutationLabel}`}
      returnLocation="/app/workspace/mutation-history"
      inputsEnabled={false}
    >
      <Stack spacing={2}>
        <EntityEventList
          entries={(
            entries as Array<{
              entity_name: string;
              event_kind: string;
              event_name: string;
              timestamp: string;
              source: string;
              user_ref_id: string;
              entity_version: number;
              data: string;
            }>
          ).map((e) => ({
            entity_name: e.entity_name,
            event_kind: e.event_kind,
            event_name: e.event_name,
            timestamp: e.timestamp,
            source: e.source,
            user_ref_id: e.user_ref_id,
            entity_version: e.entity_version,
            data: e.data,
          }))}
          usersById={usersById}
          emptyMessage="No entity events found for this mutation."
        />
      </Stack>
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary(
  `/app/workspace/mutation-history`,
  ParamsSchema,
  {
    notFound: (params) => `Could not find mutation #${params.id}!`,
    error: (params) =>
      `There was an error loading mutation #${params.id}! Please try again!`,
  },
);
