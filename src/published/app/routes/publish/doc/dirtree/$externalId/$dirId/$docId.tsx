import { NamedEntityTag } from "@jupiter/webapi-client";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { z } from "zod";
import { parseParams } from "zodix";
import { Stack } from "@mui/material";
import { entityLinkStd } from "@jupiter/core/common/entity-link";
import { EntityLocationMapSection } from "@jupiter/core/common/sub/locations/component/entity-location-map-section";
import { LocationsEditor } from "@jupiter/core/common/sub/locations/component/locations-editor";
import { TagsEditor } from "@jupiter/core/common/sub/tags/component/tags-editor";
import { DocEditor } from "@jupiter/core/apps/docs/component/editor";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { handleLoaderApiError } from "@jupiter/core/infra/errors.server";

import { getGuestApiClient } from "~/api-clients.server";
import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import {
  buildPublishedPageMeta,
  metaDescriptorsForPublishedPage,
} from "~/rendering/published-meta";

const ParamsSchema = z.object({
  externalId: z.string(),
  dirId: z.string(),
  docId: z.string(),
});

export const handle = {
  displayType: DisplayType.LEAFLET,
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  try {
    const { externalId, dirId, docId } = parseParams(params, ParamsSchema);
    const apiClient = await getGuestApiClient(request);

    const result = await apiClient.docs.docLoadPublicFromDir({
      external_id: externalId,
      dir_ref_id: dirId,
      ref_id: docId,
    });

    return json({
      pageMeta: buildPublishedPageMeta({
        request,
        entityType: NamedEntityTag.DOC,
        name: result.doc.name,
        note: result.note,
        dateModified: result.doc.last_modified_time,
      }),
      externalId,
      dirId,
      doc: result.doc,
      note: result.note,
      tags: result.tags ?? [],
      location: result.location ?? null,
    });
  } catch (error) {
    handleLoaderApiError(error);
  }
}

export const meta: MetaFunction<typeof loader> = ({ data }) =>
  metaDescriptorsForPublishedPage(data?.pageMeta);

export default function PublishedDocFromDir() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const { doc, note, tags, location, externalId, dirId } = loaderData;

  return (
    <LeafPanel
      key={`published-doc-${doc.ref_id}`}
      fakeKey={`published-doc-${doc.ref_id}`}
      isLeaflet
      inputsEnabled={false}
      entityNotEditable={true}
      returnLocation={`/publish/doc/dirtree/${externalId}/${dirId}`}
    >
      <SectionCard title="Doc">
        <DocEditor
          initialDoc={doc}
          initialNote={note}
          inputsEnabled={false}
          parentDirRefId={doc.parent_dir_ref_id}
          rightOfName={
            <Stack direction="row" spacing={1}>
              <TagsEditor
                name="tags"
                allTags={tags}
                defaultValue={tags.map((tag) => tag.ref_id)}
                inputsEnabled={false}
                owner={entityLinkStd(NamedEntityTag.DOC, doc.ref_id)}
              />
              <LocationsEditor
                name="location"
                aloneOnLine
                linkedLocation={location}
                defaultValue={location?.ref_id ?? null}
                inputsEnabled={false}
                owner={entityLinkStd(NamedEntityTag.DOC, doc.ref_id)}
              />
            </Stack>
          }
        />
      </SectionCard>
      <EntityLocationMapSection location={location} />
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary(
  (params) => `/publish/doc/dirtree/${params.externalId}/${params.dirId}`,
  ParamsSchema,
  {
    notFound: (params) => `Could not find published doc ${params.docId}!`,
    error: (params) =>
      `There was an error loading published doc ${params.docId}! Please try again!`,
  },
);
