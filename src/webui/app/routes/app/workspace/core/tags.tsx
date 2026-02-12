import type { Tag } from "@jupiter/webapi-client";
import { TagNamespace, DocsHelpSubject } from "@jupiter/webapi-client";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { Outlet } from "@remix-run/react";
import { AnimatePresence } from "framer-motion";
import { useContext, useMemo, useState } from "react";
import { EntityNameComponent } from "@jupiter/core/common/component/entity-name";
import {
  EntityCard,
  EntityLink,
} from "@jupiter/core/infra/component/entity-card";
import { EntityNoNothingCard } from "@jupiter/core/infra/component/entity-no-nothing-card";
import { EntityStack } from "@jupiter/core/infra/component/entity-stack";
import { makeTrunkErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { NestingAwareBlock } from "@jupiter/core/infra/component/layout/nesting-aware-block";
import { TrunkPanel } from "@jupiter/core/infra/component/layout/trunk-panel";
import {
  DisplayType,
  useTrunkNeedsToShowLeaf,
} from "@jupiter/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import {
  FilterManyOptions,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import { TagNamespaceTag } from "#/core/common/sub/tags/component/tag-namespace-tag";
import { tagNamespaceName } from "#/core/common/sub/tags/namespace";

import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { getLoggedInApiClient } from "~/api-clients.server";

export const handle = {
  displayType: DisplayType.TRUNK,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);

  const result = await apiClient.tags.tagFind({
    allow_archived: false,
  });

  return json({
    tags: result.tags as Array<Tag>,
  });
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

export default function Tags() {
  const { tags } = useLoaderDataSafeForAnimation<typeof loader>();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const shouldShowALeafToo = useTrunkNeedsToShowLeaf();

  const [selectedNamespaces, setSelectedNamespaces] = useState<TagNamespace[]>(
    [],
  );

  const namespaceOptions = useMemo(
    () =>
      Object.values(TagNamespace).map((ns) => ({
        value: ns,
        text: tagNamespaceName(ns),
      })),
    [],
  );

  const filteredTags = useMemo(() => {
    const sorted = [...tags].sort((a, b) => {
      if (a.namespace < b.namespace) {
        return -1;
      }
      if (a.namespace > b.namespace) {
        return 1;
      }
      return a.name.localeCompare(b.name);
    });

    if (selectedNamespaces.length === 0) {
      return sorted;
    }

    return sorted.filter((t) => selectedNamespaces.includes(t.namespace));
  }, [tags, selectedNamespaces]);

  return (
    <TrunkPanel
      key={"core/tags"}
      createLocation="/app/workspace/core/tags/new"
      returnLocation="/app/workspace"
      actions={
        <SectionActions
          id="core-tags-actions"
          topLevelInfo={topLevelInfo}
          inputsEnabled={true}
          actions={[
            FilterManyOptions(
              "Namespace",
              namespaceOptions,
              setSelectedNamespaces,
            ),
          ]}
        />
      }
    >
      <NestingAwareBlock shouldHide={shouldShowALeafToo}>
        {filteredTags.length === 0 && (
          <EntityNoNothingCard
            title="No Tags"
            message="There are no tags to show. You can create a new tag."
            newEntityLocations="/app/workspace/core/tags/new"
            helpSubject={DocsHelpSubject.ROOT}
          />
        )}

        <EntityStack>
          {filteredTags.map((tag) => (
            <EntityCard
              entityId={`tag-${tag.ref_id}`}
              key={`tag-${tag.ref_id}`}
            >
              <EntityLink to={`/app/workspace/core/tags/${tag.ref_id}`}>
                <EntityNameComponent name={`#${tag.name}`} />
                <TagNamespaceTag namespace={tag.namespace} />
              </EntityLink>
            </EntityCard>
          ))}
        </EntityStack>
      </NestingAwareBlock>

      <AnimatePresence mode="wait" initial={false}>
        <Outlet />
      </AnimatePresence>
    </TrunkPanel>
  );
}

export const ErrorBoundary = makeTrunkErrorBoundary("/app/workspace", {
  error: () => `There was an error loading the tags! Please try again!`,
});
