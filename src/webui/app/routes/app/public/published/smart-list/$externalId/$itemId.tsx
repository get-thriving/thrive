import { Typography } from "@mui/material";
import { NamedEntityTag } from "@jupiter/webapi-client";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useContext } from "react";
import { z } from "zod";
import { parseParams } from "zodix";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { EntityNoteEditor } from "@jupiter/core/infra/component/entity-note-editor";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import { SmartListItemEditor } from "@jupiter/core/smart_lists/sub/item/component/editor";

import { getGuestApiClient } from "~/api-clients.server";
import {
  buildPublishedPageMeta,
  metaDescriptorsForPublishedPage,
} from "~/rendering/published-meta";
import { handlePublishedLoaderError } from "~/rendering/published-loader.server";
import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";

const ParamsSchema = z.object({
  externalId: z.string(),
  itemId: z.string(),
});

export const handle = {
  displayType: DisplayType.LEAFLET,
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  try {
    const { externalId, itemId } = parseParams(params, ParamsSchema);
    const apiClient = await getGuestApiClient(request);

    const result =
      await apiClient.smartLists.smartListItemLoadPublicFromSmartList({
        external_id: externalId,
        ref_id: itemId,
      });

    return json({
      pageMeta: buildPublishedPageMeta({
        request,
        entityType: NamedEntityTag.SMART_LIST_ITEM,
        name: result.item.name,
        note: result.note,
        dateModified: result.item.last_modified_time,
      }),
      externalId,
      item: result.item,
      genericTags: result.generic_tags ?? [],
      contacts: result.contacts ?? [],
      note: result.note ?? null,
    });
  } catch (error) {
    handlePublishedLoaderError(error);
  }
}

export const meta: MetaFunction<typeof loader> = ({ data }) =>
  metaDescriptorsForPublishedPage(data?.pageMeta);

export default function PublishedSmartListItemFromList() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const { item, genericTags, contacts, note } = loaderData;

  return (
    <LeafPanel
      key={`published-smart-list-item-${item.ref_id}`}
      fakeKey={`published-smart-list-item-${item.ref_id}`}
      isLeaflet
      inputsEnabled={false}
      entityNotEditable={true}
      returnLocation={`/app/public/published/smart-list/${loaderData.externalId}`}
    >
      <SmartListItemEditor
        item={item}
        genericTags={genericTags}
        contacts={contacts}
        allTags={genericTags}
        allContacts={contacts}
        inputsEnabled={false}
        topLevelInfo={topLevelInfo}
      />

      <SectionCard title="Note">
        {note ? (
          <EntityNoteEditor initialNote={note} inputsEnabled={false} />
        ) : (
          <Typography variant="body2" color="text.secondary">
            No note.
          </Typography>
        )}
      </SectionCard>
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary(
  (params) => `/app/public/published/smart-list/${params.externalId}`,
  ParamsSchema,
  {
    notFound: (params) =>
      `Could not find smart list item ${params.itemId} in published smart list ${params.externalId}!`,
    error: (params) =>
      `There was an error loading smart list item ${params.itemId}! Please try again!`,
  },
);
