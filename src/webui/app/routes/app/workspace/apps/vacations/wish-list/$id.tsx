import { Contact, NamedEntityTag, Tag } from "@jupiter/webapi-client";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { useActionData, useNavigation } from "@remix-run/react";
import { useContext } from "react";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { GlobalError } from "@jupiter/core/infra/component/errors";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import { TravelWishEditor } from "@jupiter/core/apps/vacations/sub/travel_wish/component/editor";
import { accessStatusAllowsWriterOrAbove } from "#/core/common/sub/access/access-level";
import {
  handleActionApiError,
  handleLoaderApiError,
} from "@jupiter/core/infra/errors.server";

import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { getLoggedInApiClient } from "~/api-clients.server";

const ParamsSchema = z.object({
  id: z.string(),
});

const UpdateFormSchema = z.discriminatedUnion("intent", [
  z.object({
    intent: z.literal("update"),
    name: z.string(),
  }),
  z.object({
    intent: z.literal("archive"),
  }),
  z.object({
    intent: z.literal("remove"),
  }),
]);

export const handle = {
  displayType: DisplayType.LEAF,
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const { id } = parseParams(params, ParamsSchema);

  try {
    const [allTags, allContacts, result] = await Promise.all([
      apiClient.tags.tagFind({
        allow_archived: false,
      }),
      apiClient.contacts.contactFind({
        allow_archived: false,
      }),
      apiClient.vacations.travelWishLoad({
        ref_id: id,
        allow_archived: true,
      }),
    ]);

    return json({
      travelWish: result.travel_wish,
      tags: result.tags,
      contacts: result.contacts ?? [],
      locations: result.locations ?? [],
      owner: result.owner,
      accessStatus: result.access_status ?? null,
      allTags: allTags.tags as Array<Tag>,
      allContacts: allContacts.contacts as Array<Contact>,
    });
  } catch (error) {
    handleLoaderApiError(error);
  }
}

export async function action({ request, params }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const { id } = parseParams(params, ParamsSchema);
  const form = await parseForm(request, UpdateFormSchema);

  try {
    switch (form.intent) {
      case "update": {
        await apiClient.vacations.travelWishUpdate({
          ref_id: id,
          name: {
            should_change: true,
            value: form.name,
          },
        });

        return redirect(`/app/workspace/apps/vacations/wish-list`);
      }

      case "archive": {
        await apiClient.vacations.travelWishArchive({
          ref_id: id,
        });
        return redirect(`/app/workspace/apps/vacations/wish-list`);
      }

      case "remove": {
        await apiClient.vacations.travelWishRemove({
          ref_id: id,
        });
        return redirect(`/app/workspace/apps/vacations/wish-list`);
      }

      default:
        throw new Response("Bad Intent", { status: 500 });
    }
  } catch (error) {
    return handleActionApiError(error);
  }
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

export default function TravelWish() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const topLevelInfo = useContext(TopLevelInfoContext);

  const inputsEnabled =
    navigation.state === "idle" &&
    !loaderData.travelWish.archived &&
    accessStatusAllowsWriterOrAbove(loaderData.accessStatus);

  return (
    <LeafPanel
      key={`travel-wish-${loaderData.travelWish.ref_id}`}
      entityType={NamedEntityTag.TRAVEL_WISH}
      entityRefId={loaderData.travelWish.ref_id}
      fakeKey={`travel-wish-${loaderData.travelWish.ref_id}`}
      showArchiveAndRemoveButton
      inputsEnabled={inputsEnabled}
      entityArchived={loaderData.travelWish.archived}
      returnLocation="/app/workspace/apps/vacations/wish-list"
      accessable
      accessOwner={loaderData.owner}
      accessStatus={loaderData.accessStatus}
    >
      <GlobalError actionResult={actionData} />
      <TravelWishEditor
        travelWish={loaderData.travelWish}
        tags={loaderData.tags}
        contacts={loaderData.contacts}
        locations={loaderData.locations}
        allTags={loaderData.allTags}
        allContacts={loaderData.allContacts}
        inputsEnabled={inputsEnabled}
        topLevelInfo={topLevelInfo}
        actionResult={actionData}
      />
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary(
  "/app/workspace/apps/vacations/wish-list",
  ParamsSchema,
  {
    notFound: (params) => `Could not find travel wish #${params.id}!`,
    error: (params) =>
      `There was an error loading travel wish #${params.id}! Please try again!`,
  },
);
