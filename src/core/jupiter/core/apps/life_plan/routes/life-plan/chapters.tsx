import {
  DocsHelpSubject,
  AspectSummary,
  type LifePlan,
  type MilestoneSummary,
  type Tag,
} from "@jupiter/webapi-client";
import type {
  LoaderFunctionArgs,
  ShouldRevalidateFunction,
} from "react-router";
import { useNavigation } from "react-router";
import { useContext } from "react";
import { z } from "zod";
import AddIcon from "@mui/icons-material/Add";

import { EntityNameComponent } from "#/core/common/component/entity-name";
import { aDateToDate } from "#/core/common/adate";
import { EntityNoNothingCard } from "#/core/infra/component/entity-no-nothing-card";
import { EntityCard, EntityLink } from "#/core/infra/component/entity-card";
import { EntityStack } from "#/core/infra/component/entity-stack";
import { makeLeafErrorBoundary } from "#/core/infra/component/error-boundary";
import { NestingAwareBlock } from "#/core/infra/component/layout/nesting-aware-block";
import { NestedOutlet } from "#/core/infra/component/layout/nested-outlet";
import {
  DisplayType,
  useLeafNeedsToShowLeaflet,
  useTrunkNeedsToShowLeaf,
} from "#/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "#/core/infra/top-level-context";
import { lifePlanBirthdayDate } from "#/core/apps/life_plan/root";
import { sortChaptersNaturally } from "#/core/apps/life_plan/sub/chapters/root";
import { LeafPanel } from "#/core/infra/component/layout/leaf-panel";
import {
  FilterManyOptions,
  NavSingle,
  SectionActions,
} from "#/core/infra/component/section-actions";
import { SectionCard } from "#/core/infra/component/section-card";
import { AspectTag } from "#/core/apps/life_plan/sub/aspects/component/tag";
import { sortAspectsByTreeOrder } from "#/core/apps/life_plan/sub/aspects/root";
import { TagTag } from "#/core/common/sub/tags/component/tag-tag";
import { basicShouldRevalidate } from "#/core/infra/should-revalidate";
import { useLoaderDataSafeForAnimation } from "#/core/infra/component/use-loader-data-for-animation";
import { getLoggedInApiClient } from "#/core/infra/api-clients.server";
import {
  stringFilterCodec,
  useSectionFilterMany,
} from "#/core/infra/component/use-section-filter";

export const handle = {
  displayType: DisplayType.LEAF,
};

const ParamsSchema = z.object({});

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);

  const [summaryResponse, response, allTags] = await Promise.all([
    apiClient.application.getSummaries({
      include_life_plan: true,
      include_aspects: true,
      include_milestones: true,
    }),
    apiClient.lifePlan.chapterFind({
      allow_archived: false,
      include_notes: false,
      include_tags: true,
    }),
    apiClient.tags.tagFind({
      allow_archived: false,
    }),
  ]);

  return {
    lifePlan: summaryResponse.life_plan as LifePlan,
    allMilestones: summaryResponse.milestones as MilestoneSummary[],
    allAspects: summaryResponse.aspects as AspectSummary[],
    entries: response.entries,
    allTags: allTags.tags,
  };
}

export const shouldRevalidate: ShouldRevalidateFunction = basicShouldRevalidate;

const PANEL_ID = "life-plan-chapters";

export default function Chapters() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const shouldShowALeaf = useTrunkNeedsToShowLeaf();
  const shouldShowALeaflet = useLeafNeedsToShowLeaflet();
  const navigation = useNavigation();
  const inputsEnabled = navigation.state === "idle";

  const [selectedTagsRefId, setSelectedTagsRefId] = useSectionFilterMany(
    PANEL_ID,
    "tags",
    stringFilterCodec,
  );

  const birthday = lifePlanBirthdayDate(loaderData.lifePlan);
  const today = aDateToDate(topLevelInfo.today);

  const sortedAspects = sortAspectsByTreeOrder(loaderData.allAspects);
  const allAspectsByRefId = new Map(
    loaderData.allAspects.map((aspect) => [aspect.ref_id, aspect]),
  );

  const entriesByRefId = new Map(
    loaderData.entries.map((entry) => [entry.chapter.ref_id, entry]),
  );

  const sortedChapters = sortChaptersNaturally(
    birthday,
    today,
    loaderData.entries.map((entry) => entry.chapter),
    loaderData.allMilestones,
    sortedAspects,
  ).filter((chapter) => {
    if (selectedTagsRefId.length === 0) {
      return true;
    }
    const entry = entriesByRefId.get(chapter.ref_id);
    return entry?.tags?.some((tag: Tag) =>
      selectedTagsRefId.includes(tag.ref_id),
    );
  });

  return (
    <LeafPanel
      key="chapters"
      fakeKey="chapters"
      returnLocation="/app/workspace/apps/life-plan"
      shouldShowALeaflet={shouldShowALeaflet}
      inputsEnabled={inputsEnabled}
    >
      <NestingAwareBlock shouldHide={shouldShowALeaf || shouldShowALeaflet}>
        <SectionCard
          title="Chapters"
          actions={
            <SectionActions
              id="chapters"
              topLevelInfo={topLevelInfo}
              inputsEnabled={inputsEnabled}
              actions={[
                NavSingle({
                  text: "New Chapter",
                  link: `/app/workspace/apps/life-plan/chapters/new`,
                  icon: <AddIcon />,
                  id: "new-chapter",
                }),
                FilterManyOptions(
                  "Tags",
                  loaderData.allTags.map((tag) => ({
                    value: tag.ref_id,
                    text: tag.name,
                  })),
                  selectedTagsRefId,
                  setSelectedTagsRefId,
                ),
              ]}
            />
          }
        >
          {sortedChapters.length === 0 && (
            <EntityNoNothingCard
              title="You Have To Start Somewhere"
              message="There are no chapters to show. You can create a new chapter."
              newEntityLocations="/app/workspace/apps/life-plan/chapters/new"
              helpSubject={DocsHelpSubject.LIFE_PLAN_CHAPTERS}
            />
          )}

          <EntityStack>
            {sortedChapters.map((chapter) => (
              <EntityCard
                key={`chapter-${chapter.ref_id}`}
                entityId={`chapter-${chapter.ref_id}`}
              >
                <EntityLink
                  to={`/app/workspace/apps/life-plan/chapters/${chapter.ref_id}`}
                >
                  <AspectTag
                    aspect={allAspectsByRefId.get(chapter.aspect_ref_id)!}
                  />
                  <EntityNameComponent name={chapter.name} />
                  {entriesByRefId.get(chapter.ref_id)?.tags?.map((tag: Tag) => (
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
  "/app/workspace/apps/life-plan/chapters",
  ParamsSchema,
  {
    error: () => `There was an error loading the chapters! Please try again!`,
  },
);
