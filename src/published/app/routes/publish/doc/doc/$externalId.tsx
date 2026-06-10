import { NamedEntityTag } from "@jupiter/webapi-client";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { z } from "zod";
import { parseParams } from "zodix";
import { entityLinkStd } from "@jupiter/core/common/entity-link";
import { TagsEditor } from "@jupiter/core/common/sub/tags/component/tags-editor";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { LeafPanelExpansionState } from "@jupiter/core/infra/leaf-panel-expansion";
import { DocEditor } from "@jupiter/core/docs/component/editor";

import { getGuestApiClient } from "~/api-clients.server";
import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import {
  buildPublishedPageMeta,
  metaDescriptorsForPublishedPage,
} from "~/rendering/published-meta";
import { handlePublishedLoaderError } from "~/rendering/published-loader.server";

const ParamsSchema = z.object({
  externalId: z.string(),
});

export const handle = {
  displayType: DisplayType.LEAF,
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  try {
    const { externalId } = parseParams(params, ParamsSchema);
    const apiClient = await getGuestApiClient(request);

    const result = await apiClient.docs.docLoadPublic({
      external_id: externalId,
    });

    return json({
      pageMeta: buildPublishedPageMeta({
        request,
        entityType: NamedEntityTag.DOC,
        name: result.doc.name,
        note: result.note,
        dateModified: result.doc.last_modified_time,
      }),
      doc: result.doc,
      note: result.note,
      tags: result.tags ?? [],
    });
  } catch (error) {
    handlePublishedLoaderError(error);
  }
}

export const meta: MetaFunction<typeof loader> = ({ data }) =>
  metaDescriptorsForPublishedPage(data?.pageMeta);

export default function PublishedDoc() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const { doc, note, tags } = loaderData;

  return (
    <LeafPanel
      key={`published-doc-${doc.ref_id}`}
      fakeKey={`published-doc-${doc.ref_id}`}
      inputsEnabled={false}
      entityNotEditable={true}
      disabled={true}
      returnLocation="/app"
      initialExpansionState={LeafPanelExpansionState.FULL}
      allowedExpansionStates={[LeafPanelExpansionState.FULL]}
    >
      <SectionCard title="Doc">
        <DocEditor
          initialDoc={doc}
          initialNote={note}
          inputsEnabled={false}
          parentDirRefId={doc.parent_dir_ref_id}
          rightOfName={
            <TagsEditor
              name="tags"
              allTags={tags}
              defaultValue={tags.map((tag) => tag.ref_id)}
              inputsEnabled={false}
              owner={entityLinkStd(NamedEntityTag.DOC, doc.ref_id)}
            />
          }
        />
      </SectionCard>
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary("/publish", ParamsSchema, {
  notFound: (params) => `Could not find published doc ${params.externalId}!`,
  error: (params) =>
    `There was an error loading published doc ${params.externalId}! Please try again!`,
});
