import type {
  ShouldRevalidateFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from "react-router";
import { NamedEntityTag } from "@jupiter/webapi-client";
import type { Tag } from "@jupiter/webapi-client";
import { z } from "zod";
import { parseParams } from "zodix";
import { parseEntityLinkStd } from "@jupiter/core/common/entity-link";
import { PublishedDocDirPanel } from "@jupiter/core/apps/docs/component/published-doc-dir-panel";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { handleLoaderApiError } from "@jupiter/core/infra/errors.server";
import { useLoaderDataSafeForAnimation } from "@jupiter/core/infra/component/use-loader-data-for-animation";
import { getGuestApiClient } from "@jupiter/core/infra/api-clients.server";

import {
  buildPublishedPageMeta,
  metaDescriptorsForPublishedPage,
  publishedDirListingSummary,
} from "~/rendering/published-meta";

const ParamsSchema = z.object({
  externalId: z.string(),
  dirId: z.string(),
});

export const handle = {
  displayType: DisplayType.LEAF,
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

    const basePath = `/doc/dirtree/${externalId}`;
    // The published root folder has no parent to go back to.
    const returnLocation =
      dirId === publishedRootDirRefId
        ? undefined
        : dirLoad.dir.parent_dir_ref_id === publishedRootDirRefId
          ? `${basePath}/${publishedRootDirRefId}`
          : `${basePath}/${dirLoad.dir.parent_dir_ref_id}`;

    return {
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
    };
  } catch (error) {
    handleLoaderApiError(error);
  }
}

export const meta: MetaFunction<typeof loader> = ({ data }) =>
  metaDescriptorsForPublishedPage(data?.pageMeta);

// Single fetch only skips a loader on navigation when the route says it may be
// skipped, so keep the default (don't refetch this parent when only a child
// param changed).
export const shouldRevalidate: ShouldRevalidateFunction = ({
  defaultShouldRevalidate,
}) => defaultShouldRevalidate;

export default function PublishedDocDirView() {
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

export const ErrorBoundary = makeLeafErrorBoundary("/", ParamsSchema, {
  notFound: (params) => `Could not find published folder ${params.dirId}!`,
  error: (params) =>
    `There was an error loading published folder ${params.dirId}! Please try again!`,
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
