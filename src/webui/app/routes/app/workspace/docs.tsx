import type { DocFindResultEntry, Tag } from "@jupiter/webapi-client";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { Outlet } from "@remix-run/react";
import { AnimatePresence } from "framer-motion";
import { DocsHelpSubject, TagNamespace } from "@jupiter/webapi-client";
import { useContext, useState } from "react";
import { EntityNameComponent } from "@jupiter/core/common/component/entity-name";
import { EntityNoNothingCard } from "@jupiter/core/infra/component/entity-no-nothing-card";
import {
  EntityCard,
  EntityLink,
} from "@jupiter/core/infra/component/entity-card";
import { EntityStack } from "@jupiter/core/infra/component/entity-stack";
import { makeTrunkErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { NestingAwareBlock } from "@jupiter/core/infra/component/layout/nesting-aware-block";
import { TrunkPanel } from "@jupiter/core/infra/component/layout/trunk-panel";
import {
  FilterManyOptions,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import {
  DisplayType,
  useTrunkNeedsToShowLeaf,
} from "@jupiter/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import { TagTag } from "@jupiter/core/common/sub/tags/component/tag-tag";

import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { getLoggedInApiClient } from "~/api-clients.server";

export const handle = {
  displayType: DisplayType.TRUNK,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const body = await apiClient.docs.docFind({
    include_notes: false,
    allow_archived: false,
    include_subdocs: false,
    include_tags: true,
  });

  const allTags = await apiClient.tags.tagFind({
    allow_archived: false,
    filter_namespace: [TagNamespace.DOC],
  });

  return json({
    entries: body.entries,
    allTags: allTags.tags,
  });
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

export default function Docs() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const shouldShowALeaf = useTrunkNeedsToShowLeaf();
  const topLevelInfo = useContext(TopLevelInfoContext);

  const entriesByRefId = new Map<string, DocFindResultEntry>();
  for (const entry of loaderData.entries) {
    entriesByRefId.set(entry.doc.ref_id, entry);
  }

  const [selectedTagsRefId, setSelectedTagsRefId] = useState<string[]>([]);

  const filteredEntries =
    selectedTagsRefId.length === 0
      ? loaderData.entries
      : loaderData.entries.filter((entry) =>
          entry.tags.some((tag: Tag) => selectedTagsRefId.includes(tag.ref_id)),
        );

  return (
    <TrunkPanel
      key={"docs"}
      createLocation="/app/workspace/docs/new"
      returnLocation="/app/workspace"
      actions={
        <SectionActions
          id="docs-actions"
          topLevelInfo={topLevelInfo}
          inputsEnabled={true}
          actions={[
            FilterManyOptions(
              "Tags",
              loaderData.allTags.map((tag) => ({
                value: tag.ref_id,
                text: tag.name,
              })),
              setSelectedTagsRefId,
            ),
          ]}
        />
      }
    >
      <NestingAwareBlock shouldHide={shouldShowALeaf}>
        {filteredEntries.length === 0 && (
          <EntityNoNothingCard
            title="You Have To Start Somewhere"
            message="There are no docs to show. You can create a new doc."
            newEntityLocations="/app/workspace/docs/new"
            helpSubject={DocsHelpSubject.DOCS}
          />
        )}

        <EntityStack>
          {filteredEntries.map((entry) => (
            <EntityCard
              key={`doc-${entry.doc.ref_id}`}
              entityId={`doc-${entry.doc.ref_id}`}
            >
              <EntityLink to={`/app/workspace/docs/${entry.doc.ref_id}`}>
                <EntityNameComponent name={entry.doc.name} />
                {entriesByRefId.get(entry.doc.ref_id)?.tags.map((tag: Tag) => (
                  <TagTag key={tag.ref_id} tag={tag} />
                ))}
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
  error: () => `There was an error loading the docs! Please try again!`,
});
