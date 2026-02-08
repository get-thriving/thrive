import {
  DocsHelpSubject,
  ProjectSummary,
  type LifePlan,
  type MilestoneSummary,
  type Tag,
  TagNamespace,
} from "@jupiter/webapi-client";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { Outlet, useNavigation } from "@remix-run/react";
import { AnimatePresence } from "framer-motion";
import { useContext, useState } from "react";
import { z } from "zod";
import { EntityNameComponent } from "@jupiter/core/common/component/entity-name";
import { aDateToDate } from "@jupiter/core/common/adate";
import { EntityNoNothingCard } from "@jupiter/core/infra/component/entity-no-nothing-card";
import {
  EntityCard,
  EntityLink,
} from "@jupiter/core/infra/component/entity-card";
import { EntityStack } from "@jupiter/core/infra/component/entity-stack";
import AddIcon from "@mui/icons-material/Add";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { NestingAwareBlock } from "@jupiter/core/infra/component/layout/nesting-aware-block";
import {
  DisplayType,
  useLeafNeedsToShowLeaflet,
  useTrunkNeedsToShowLeaf,
} from "@jupiter/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import { lifePlanBirthdayDate } from "@jupiter/core/life_plan/root";
import { sortChaptersNaturally } from "@jupiter/core/life_plan/sub/chapters/root";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import {
  FilterManyOptions,
  NavSingle,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import { ProjectTag } from "#/core/life_plan/sub/aspects/component/tag";
import { sortProjectsByTreeOrder } from "#/core/life_plan/sub/aspects/root";
import { TagTag } from "#/core/common/sub/tags/component/tag-tag";

import { getLoggedInApiClient } from "~/api-clients.server";
import { basicShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";

export const handle = {
  displayType: DisplayType.LEAF,
};

const ParamsSchema = z.object({});

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);

  const summaryResponse = await apiClient.application.getSummaries({
    include_life_plan: true,
    include_projects: true,
    include_milestones: true,
  });

  const response = await apiClient.lifePlan.chapterFind({
    allow_archived: false,
    include_notes: false,
    include_tags: true,
  });

  const allTags = await apiClient.tags.tagFind({
    allow_archived: false,
    filter_namespace: [TagNamespace.CHAPTER],
  });

  return json({
    lifePlan: summaryResponse.life_plan as LifePlan,
    allMilestones: summaryResponse.milestones as MilestoneSummary[],
    allProjects: summaryResponse.projects as ProjectSummary[],
    entries: response.entries,
    allTags: allTags.tags,
  });
}

export const shouldRevalidate: ShouldRevalidateFunction = basicShouldRevalidate;

export default function Chapters() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const shouldShowALeaf = useTrunkNeedsToShowLeaf();
  const shouldShowALeaflet = useLeafNeedsToShowLeaflet();
  const navigation = useNavigation();
  const inputsEnabled = navigation.state === "idle";

  const [selectedTagsRefId, setSelectedTagsRefId] = useState<string[]>([]);

  const birthday = lifePlanBirthdayDate(loaderData.lifePlan);
  const today = aDateToDate(topLevelInfo.today);

  const sortedProjects = sortProjectsByTreeOrder(loaderData.allProjects);
  const allProjectsByRefId = new Map(
    loaderData.allProjects.map((project) => [project.ref_id, project]),
  );

  const entriesByRefId = new Map(
    loaderData.entries.map((entry) => [entry.chapter.ref_id, entry]),
  );

  const sortedChapters = sortChaptersNaturally(
    birthday,
    today,
    loaderData.entries.map((entry) => entry.chapter),
    loaderData.allMilestones,
    sortedProjects,
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
      returnLocation="/app/workspace/life-plan"
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
                  link: `/app/workspace/life-plan/chapters/new`,
                  icon: <AddIcon />,
                }),
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
          {sortedChapters.length === 0 && (
            <EntityNoNothingCard
              title="You Have To Start Somewhere"
              message="There are no chapters to show. You can create a new chapter."
              newEntityLocations="/app/workspace/life-plan/chapters/new"
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
                  to={`/app/workspace/life-plan/chapters/${chapter.ref_id}`}
                >
                  <ProjectTag
                    project={allProjectsByRefId.get(chapter.project_ref_id)!}
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

      <AnimatePresence mode="wait" initial={false}>
        <Outlet />
      </AnimatePresence>
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary(
  "/app/workspace/life-plan/chapters",
  ParamsSchema,
  {
    error: () => `There was an error loading the chapters! Please try again!`,
  },
);
