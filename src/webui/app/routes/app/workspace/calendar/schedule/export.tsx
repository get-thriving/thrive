import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { Outlet, useNavigation, useSearchParams } from "@remix-run/react";
import { AnimatePresence } from "framer-motion";
import { z } from "zod";
import { EntityNameComponent } from "@jupiter/core/common/component/entity-name";
import {
  EntityCard,
  EntityLink,
} from "@jupiter/core/infra/component/entity-card";
import { EntityStack } from "@jupiter/core/infra/component/entity-stack";
import { makeBranchErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { BranchPanel } from "@jupiter/core/infra/component/layout/branch-panel";
import { NestingAwareBlock } from "@jupiter/core/infra/component/layout/nesting-aware-block";
import {
  DisplayType,
  useBranchNeedsToShowLeaf,
} from "@jupiter/core/infra/component/use-nested-entities";

import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { basicShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { getLoggedInApiClient } from "~/api-clients.server";

const ParamsSchema = z.object({});

export const handle = {
  displayType: DisplayType.BRANCH,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const response = await apiClient.schedule.scheduleExportFind({
    include_notes: false,
    include_tags: false,
    allow_archived: false,
  });

  return json({
    entries: response.entries,
  });
}

export const shouldRevalidate: ShouldRevalidateFunction = basicShouldRevalidate;

export default function ScheduleExportViewAll() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const [query] = useSearchParams();
  const navigation = useNavigation();
  const inputsEnabled = navigation.state === "idle";

  const shouldShowALeaf = useBranchNeedsToShowLeaf();

  return (
    <BranchPanel
      key="calendar-schedule-export"
      createLocation={`/app/workspace/calendar/schedule/export/new?${query}`}
      returnLocation={`/app/workspace/calendar?${query}`}
    >
      <NestingAwareBlock shouldHide={shouldShowALeaf}>
        <EntityStack>
          {loaderData.entries.map((entry) => (
            <EntityCard
              entityId={`schedule-export-${entry.schedule_export.ref_id}`}
              key={`schedule-export-${entry.schedule_export.ref_id}`}
            >
              <EntityLink
                to={`/app/workspace/calendar/schedule/export/${entry.schedule_export.ref_id}?${query}`}
              >
                <EntityNameComponent name={entry.schedule_export.name} />
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
    error: () => "There was an error loading calendar exports!",
  },
);
