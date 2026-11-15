import type {
  LoaderFunctionArgs,
  ShouldRevalidateFunction,
} from "react-router";
import { useSearchParams } from "react-router";
import { z } from "zod";
import { EntityNameComponent } from "@jupiter/core/common/component/entity-name";
import {
  EntityCard,
  EntityLink,
} from "@jupiter/core/infra/component/entity-card";
import { EntityStack } from "@jupiter/core/infra/component/entity-stack";
import { makeBranchErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { EntityPanel } from "@jupiter/core/infra/component/layout/entity-panel";
import { PanelNewAction } from "@jupiter/core/infra/component/layout/panel-new-action";
import { NestedOutlet } from "@jupiter/core/infra/component/layout/nested-outlet";
import { NestingAwareBlock } from "@jupiter/core/infra/component/layout/nesting-aware-block";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import type { StrataHandle } from "@jupiter/core/infra/strata/strata-handle";
import { useLoaderDataSafeForAnimation } from "@jupiter/core/infra/component/use-loader-data-for-animation";
import { basicShouldRevalidate } from "@jupiter/core/infra/should-revalidate";
import { getLoggedInApiClient } from "@jupiter/core/infra/api-clients.server";

const ParamsSchema = z.object({});

export const handle = {
  displayType: DisplayType.BRANCH,
  strata: { size: "S" } satisfies StrataHandle,
  label: "Exports",
};

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const response = await apiClient.schedule.scheduleExportFind({
    include_notes: false,
    include_tags: false,
    allow_archived: false,
  });

  return {
    entries: response.entries,
  };
}

export const shouldRevalidate: ShouldRevalidateFunction = basicShouldRevalidate;

export default function ScheduleExportViewAll() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const [query] = useSearchParams();

  return (
    <EntityPanel
      kind="branch"
      title="Calendar exports"
      key="calendar-schedule-export"
      returnLocation={`/app/workspace/calendar?${query}`}
      actions={
        <PanelNewAction
          kind="branch"
          link={`/app/workspace/calendar/schedule/export/new?${query}`}
        />
      }
    >
      <NestingAwareBlock>
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

      <NestedOutlet />
    </EntityPanel>
  );
}

export const ErrorBoundary = makeBranchErrorBoundary(
  (_params, searchParams) => `/app/workspace/calendar?${searchParams}`,
  ParamsSchema,
  {
    error: () => "There was an error loading calendar exports!",
  },
);
