import type { AspectSummary, Tag } from "@jupiter/webapi-client";
import { DocsHelpSubject } from "@jupiter/webapi-client";
import AddIcon from "@mui/icons-material/Add";
import type {
  LoaderFunctionArgs,
  ShouldRevalidateFunction,
} from "react-router";
import { useNavigation } from "react-router";
import { useContext } from "react";
import { z } from "zod";

import { EntityNameComponent } from "#/core/common/component/entity-name";
import { EntityNoNothingCard } from "#/core/infra/component/entity-no-nothing-card";
import { EntityCard, EntityLink } from "#/core/infra/component/entity-card";
import { EntityStack } from "#/core/infra/component/entity-stack";
import { makeLeafErrorBoundary } from "#/core/infra/component/error-boundary";
import { NestingAwareBlock } from "#/core/infra/component/layout/nesting-aware-block";
import { NestedOutlet } from "#/core/infra/component/layout/nested-outlet";
import { LeafPanel } from "#/core/infra/component/layout/leaf-panel";
import {
  DisplayType,
  useLeafNeedsToShowLeaflet,
  useTrunkNeedsToShowLeaf,
} from "#/core/infra/component/use-nested-entities";
import { SectionCard } from "#/core/infra/component/section-card";
import {
  FilterManyOptions,
  NavSingle,
  SectionActions,
} from "#/core/infra/component/section-actions";
import { TopLevelInfoContext } from "#/core/infra/top-level-context";
import { sortMilestonesNaturally } from "#/core/apps/life_plan/sub/milestones/root";
import { AspectTag } from "#/core/apps/life_plan/sub/aspects/component/tag";
import { TagTag } from "#/core/common/sub/tags/component/tag-tag";
import { basicShouldRevalidate } from "#/core/infra/should-revalidate";
import { useLoaderDataSafeForAnimation } from "#/core/infra/component/use-loader-data-for-animation";
import { getLoggedInApiClient } from "#/core/infra/api-clients.server";
import { useSectionFilters } from "#/core/infra/component/use-section-filter";

export const handle = {
  displayType: DisplayType.LEAF,
};

const ParamsSchema = z.object({});

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);

  const [summaryResponse, response, allTags] = await Promise.all([
    apiClient.application.getSummaries({
      include_aspects: true,
    }),
    apiClient.lifePlan.milestoneFind({
      allow_archived: false,
      include_notes: false,
      include_tags: true,
    }),
    apiClient.tags.tagFind({
      allow_archived: false,
    }),
  ]);

  return {
    allAspects: summaryResponse.aspects as AspectSummary[],
    entries: response.entries,
    allTags: allTags.tags,
  };
}

export const shouldRevalidate: ShouldRevalidateFunction = basicShouldRevalidate;

const PANEL_ID = "life-plan-milestones";

const FILTERS = z.object({
  tags: z.array(z.string()).default([]),
});

export default function Milestones() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const shouldShowALeaf = useTrunkNeedsToShowLeaf();
  const shouldShowALeaflet = useLeafNeedsToShowLeaflet();
  const navigation = useNavigation();
  const inputsEnabled = navigation.state === "idle";

  const [{ tags: selectedTagsRefId }, setFilters] = useSectionFilters(
    PANEL_ID,
    FILTERS,
  );

  const allAspectsByRefId = new Map(
    loaderData.allAspects.map((aspect) => [aspect.ref_id, aspect]),
  );

  const entriesByRefId = new Map(
    loaderData.entries.map((entry) => [entry.milestone.ref_id, entry]),
  );

  const sortedMilestones = sortMilestonesNaturally(
    loaderData.entries.map((e) => e.milestone),
  ).filter((milestone) => {
    if (selectedTagsRefId.length === 0) {
      return true;
    }
    const entry = entriesByRefId.get(milestone.ref_id);
    return entry?.tags?.some((tag: Tag) =>
      selectedTagsRefId.includes(tag.ref_id),
    );
  });

  return (
    <LeafPanel
      key="life-plan-milestones"
      fakeKey="life-plan-milestones"
      returnLocation="/app/workspace/apps/life-plan"
      shouldShowALeaflet={shouldShowALeaflet}
      inputsEnabled={inputsEnabled}
    >
      <NestingAwareBlock shouldHide={shouldShowALeaf || shouldShowALeaflet}>
        <SectionCard
          title="Milestones"
          actions={
            <SectionActions
              id="life-plan-milestones"
              topLevelInfo={topLevelInfo}
              inputsEnabled={inputsEnabled}
              actions={[
                NavSingle({
                  text: "New Milestone",
                  link: `/app/workspace/apps/life-plan/milestones/new`,
                  icon: <AddIcon />,
                  id: "new-milestone",
                }),
                FilterManyOptions(
                  "Tags",
                  loaderData.allTags.map((tag) => ({
                    value: tag.ref_id,
                    text: tag.name,
                  })),
                  selectedTagsRefId,
                  (tags) => setFilters({ tags }),
                ),
              ]}
            />
          }
        >
          {sortedMilestones.length === 0 && (
            <EntityNoNothingCard
              title="You Have To Start Somewhere"
              message="There are no milestones to show. You can create a new milestone."
              newEntityLocations="/app/workspace/apps/life-plan/milestones/new"
              helpSubject={DocsHelpSubject.LIFE_PLAN_MILESTONES}
            />
          )}

          <EntityStack>
            {sortedMilestones.map((milestone) => (
              <EntityCard
                key={`milestone-${milestone.ref_id}`}
                entityId={`milestone-${milestone.ref_id}`}
              >
                <EntityLink
                  to={`/app/workspace/apps/life-plan/milestones/${milestone.ref_id}`}
                >
                  <AspectTag
                    aspect={allAspectsByRefId.get(milestone.aspect_ref_id)!}
                  />
                  <EntityNameComponent name={milestone.name} />
                  {entriesByRefId
                    .get(milestone.ref_id)
                    ?.tags?.map((tag: Tag) => (
                      <TagTag key={tag.ref_id} tag={tag} />
                    ))}
                </EntityLink>
              </EntityCard>
            ))}
          </EntityStack>
        </SectionCard>
      </NestingAwareBlock>

      <NestedOutlet />
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary(
  "/app/workspace/apps/life-plan/milestones",
  ParamsSchema,
  {
    error: () => `There was an error loading the milestones! Please try again!`,
  },
);
