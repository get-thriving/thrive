import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { Outlet, useNavigation, useSearchParams } from "@remix-run/react";
import { AnimatePresence } from "framer-motion";
import { z } from "zod";
import { useContext, useState } from "react";
import { EntityNameComponent } from "@jupiter/core/common/component/entity-name";
import {
  EntityCard,
  EntityLink,
} from "@jupiter/core/infra/component/entity-card";
import { EntityStack } from "@jupiter/core/infra/component/entity-stack";
import { makeBranchErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { BranchPanel } from "@jupiter/core/infra/component/layout/branch-panel";
import { NestingAwareBlock } from "@jupiter/core/infra/component/layout/nesting-aware-block";
import { ScheduleStreamColorTag } from "@jupiter/core/schedule/component/color-tag";
import {
  DisplayType,
  useBranchNeedsToShowLeaf,
} from "@jupiter/core/infra/component/use-nested-entities";
import {
  FilterManyOptions,
  NavSingle,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import { TagTag } from "@jupiter/core/common/sub/tags/component/tag-tag";
import type { Tag } from "@jupiter/webapi-client";

import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { basicShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { getLoggedInApiClient } from "~/api-clients.server";

const ParamsSchema = z.object({});

export const handle = {
  displayType: DisplayType.BRANCH,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const response = await apiClient.schedule.scheduleStreamFind({
    allow_archived: false,
    include_notes: false,
    include_tags: true,
  });

  const allTags = await apiClient.tags.tagFind({
    allow_archived: false,
  });

  return json({
    entries: response.entries,
    allTags: allTags.tags as Array<Tag>,
  });
}

export const shouldRevalidate: ShouldRevalidateFunction = basicShouldRevalidate;

export default function ScheduleStreamViewAll() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const [query] = useSearchParams();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const navigation = useNavigation();
  const inputsEnabled = navigation.state === "idle";

  const shouldShowALeaf = useBranchNeedsToShowLeaf();
  const [selectedTagsRefId, setSelectedTagsRefId] = useState<string[]>([]);

  const filteredEntries = loaderData.entries.filter((entry) => {
    if (selectedTagsRefId.length === 0) {
      return true;
    }
    return entry.tags.some((tag: Tag) =>
      selectedTagsRefId.includes(tag.ref_id),
    );
  });

  return (
    <BranchPanel
      key="calendar-schedule-stream"
      createLocation={`/app/workspace/calendar/schedule/stream/new?${query}`}
      returnLocation={`/app/workspace/calendar?${query}`}
      actions={
        <SectionActions
          id="calendar-schedule-stream"
          topLevelInfo={topLevelInfo}
          inputsEnabled={inputsEnabled}
          actions={[
            NavSingle({
              text: "New External",
              link: `/app/workspace/calendar/schedule/stream/new-external?${query}`,
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
      <NestingAwareBlock shouldHide={shouldShowALeaf}>
        <EntityStack>
          {filteredEntries.map((entry) => (
            <EntityCard
              entityId={`schedule-stream-${entry.schedule_stream.ref_id}`}
              key={`schedule-stream-${entry.schedule_stream.ref_id}`}
            >
              <EntityLink
                to={`/app/workspace/calendar/schedule/stream/${entry.schedule_stream.ref_id}?${query}`}
              >
                <EntityNameComponent name={entry.schedule_stream.name} />
                <ScheduleStreamColorTag color={entry.schedule_stream.color} />
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
    </BranchPanel>
  );
}

export const ErrorBoundary = makeBranchErrorBoundary(
  (_params, searchParams) => `/app/workspace/calendar?${searchParams}`,
  ParamsSchema,
  {
    error: () => "There was an error loading time plan calendar streams!",
  },
);
