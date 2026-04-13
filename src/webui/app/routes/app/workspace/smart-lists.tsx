import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { Outlet } from "@remix-run/react";
import { AnimatePresence } from "framer-motion";
import type { Tag } from "@jupiter/webapi-client";
import { DocsHelpSubject } from "@jupiter/webapi-client";
import EntityIconComponent from "@jupiter/core/infra/component/entity-icon";
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
import { TagTag } from "@jupiter/core/common/sub/tags/component/tag-tag";
import {
  DisplayType,
  useTrunkNeedsToShowBranch,
  useTrunkNeedsToShowLeaf,
} from "@jupiter/core/infra/component/use-nested-entities";
import {
  FilterManyOptions,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import { useContext, useState } from "react";

import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { getLoggedInApiClient } from "~/api-clients.server";

export const handle = {
  displayType: DisplayType.TRUNK,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const smartListResponse = await apiClient.smartLists.smartListFind({
    allow_archived: false,
    include_notes: false,
    include_tags: true,
    include_items: false,
    include_item_notes: false,
  });

  const allTags = await apiClient.tags.tagFind({
    allow_archived: false,
  });

  return json({
    entries: smartListResponse.entries,
    allTags: allTags.tags as Array<Tag>,
  });
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

export default function SmartLists() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const topLevelInfo = useContext(TopLevelInfoContext);

  const shouldShowABranch = useTrunkNeedsToShowBranch();
  const shouldShowALeafToo = useTrunkNeedsToShowLeaf();

  const smartListTagsBySmartListRefId = new Map<string, Array<Tag>>();
  for (const entry of loaderData.entries) {
    smartListTagsBySmartListRefId.set(
      entry.smart_list.ref_id,
      entry.tags ?? [],
    );
  }

  const [selectedTagsRefId, setSelectedTagsRefId] = useState<string[]>([]);
  const filteredEntries = loaderData.entries.filter((entry) => {
    if (selectedTagsRefId.length === 0) {
      return true;
    }
    const tags =
      smartListTagsBySmartListRefId.get(entry.smart_list.ref_id) ?? [];
    return tags.some((tag) => selectedTagsRefId.includes(tag.ref_id));
  });

  return (
    <TrunkPanel
      key={"smart-lists"}
      createLocation="/app/workspace/smart-lists/new"
      returnLocation="/app/workspace"
      actions={
        <SectionActions
          id="smart-lists"
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
      <NestingAwareBlock
        branchForceHide={shouldShowABranch}
        shouldHide={shouldShowABranch || shouldShowALeafToo}
      >
        <EntityStack>
          {filteredEntries.length === 0 && (
            <EntityNoNothingCard
              title="You Have To Start Somewhere"
              message="There are no smart lists to show. You can create a new smart list."
              newEntityLocations="/app/workspace/smart-lists/new"
              helpSubject={DocsHelpSubject.SMART_LISTS}
            />
          )}
          {filteredEntries.map((entry) => (
            <EntityCard
              key={`smart-list-${entry.smart_list.ref_id}`}
              entityId={`smart-list-${entry.smart_list.ref_id}`}
            >
              <EntityLink
                to={`/app/workspace/smart-lists/${entry.smart_list.ref_id}`}
              >
                {entry.smart_list.icon && (
                  <EntityIconComponent icon={entry.smart_list.icon} />
                )}
                <EntityNameComponent name={entry.smart_list.name} />
                {entry.tags.map((tag) => (
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
  error: () => `There was an error loading the smart lists! Please try again!`,
});
