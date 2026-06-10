import { NamedEntityTag } from "@jupiter/webapi-client";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { Tag } from "@jupiter/webapi-client";
import { z } from "zod";
import { parseParams } from "zodix";
import { parseEntityLinkStd } from "@jupiter/core/common/entity-link";
import { PublishedDocDirPanel } from "@jupiter/core/docs/component/published-doc-dir-panel";
import { makeTrunkErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";

import { getGuestApiClient } from "~/api-clients.server";
import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import {
  buildPublishedPageMeta,
  metaDescriptorsForPublishedPage,
  publishedDirListingSummary,
} from "~/rendering/published-meta";
import { handlePublishedLoaderError } from "~/rendering/published-loader.server";

const ParamsSchema = z.object({
  externalId: z.string(),
  dirId: z.string(),
});

export const handle = {
  displayType: DisplayType.TRUNK,
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  try {
    const { externalId, dirId } = parseParams(params, ParamsSchema);
    const apiClient = await getGuestApiClient(request);

    const [dirLoad, publishEntityLoad] = await Promise.all([
      apiClient.docs.dirLoadPublicFromDir({
        external_id: externalId,
        ref_id: dirId,
      }),
      apiClient.publish.publishEntityLoadByExternalId({
        external_id: externalId,
      }),
    ]);

    const publishedRootDirRefId = parseEntityLinkStd(
      publishEntityLoad.publish_entity.owner,
    ).refId;

    const basePath = `/publish/doc/dirtree/${externalId}`;
    const returnLocation =
      dirId === publishedRootDirRefId
        ? "/app"
        : dirLoad.dir.parent_dir_ref_id === publishedRootDirRefId
          ? `${basePath}/${publishedRootDirRefId}`
          : `${basePath}/${dirLoad.dir.parent_dir_ref_id}`;

    return json({
      pageMeta: buildPublishedPageMeta({
        request,
        entityType: NamedEntityTag.DIR,
        name: dirLoad.dir.name,
        summary: publishedDirListingSummary(dirLoad),
        dateModified: dirLoad.dir.last_modified_time,
        ogType: "website",
      }),
      externalId,
      dirLoad,
      publishedRootDirRefId,
      allTags: collectTagsFromDirLoad(dirLoad),
      returnLocation,
    });
  } catch (error) {
    handlePublishedLoaderError(error);
  }
}

export const meta: MetaFunction<typeof loader> = ({ data }) =>
  metaDescriptorsForPublishedPage(data?.pageMeta);

export default function PublishedDocDirChild() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();

  return (
    <PublishedDocDirPanel
      externalId={loaderData.externalId}
      publishedRootDirRefId={loaderData.publishedRootDirRefId}
      dirLoad={loaderData.dirLoad}
      allTags={loaderData.allTags}
      returnLocation={loaderData.returnLocation}
    />
  );
}

export const ErrorBoundary = makeTrunkErrorBoundary("/app", {
  error: () =>
    `There was an error loading the published folder! Please try again!`,
});

function collectTagsFromDirLoad(dirLoad: {
  entries: Array<{ tags: Tag[] }>;
  subdirs: Array<{ tags: Tag[] }>;
}): Tag[] {
  const byRefId = new Map<string, Tag>();
  for (const entry of [...dirLoad.subdirs, ...dirLoad.entries]) {
    for (const tag of entry.tags) {
      byRefId.set(tag.ref_id, tag);
    }
  }
  return [...byRefId.values()];
}
