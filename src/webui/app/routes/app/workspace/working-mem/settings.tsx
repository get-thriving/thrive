import type { InboxTask, ProjectSummary } from "@jupiter/webapi-client";
import {
  ApiError,
  InboxTaskStatus,
  RecurringTaskPeriod,
  WorkspaceFeature,
} from "@jupiter/webapi-client";
import { FormControl, FormLabel } from "@mui/material";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { useActionData, useFetcher, useNavigation } from "@remix-run/react";
import { StatusCodes } from "http-status-codes";
import { useContext } from "react";
import { z } from "zod";
import { parseForm } from "zodix";
import { sortInboxTasksNaturally } from "@jupiter/core/inbox_tasks/root";
import { InboxTaskStack } from "@jupiter/core/inbox_tasks/component/stack";
import { isWorkspaceFeatureAvailable } from "@jupiter/core/workspaces/root";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { FieldError, GlobalError } from "@jupiter/core/infra/component/errors";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import { PeriodSelect } from "@jupiter/core/common/component/period-select";
import { ProjectSelect } from "@jupiter/core/life_plan/sub/aspects/component/select";
import { validationErrorToUIErrorInfo } from "@jupiter/core/infra/action-result";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import {
  ActionSingle,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import { SectionCard } from "@jupiter/core/infra/component/section-card";

import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { getLoggedInApiClient } from "~/api-clients.server";

const UpdateFormSchema = z.discriminatedUnion("intent", [
  z.object({
    intent: z.literal("update"),
    generationPeriod: z.nativeEnum(RecurringTaskPeriod),
    cleanupProject: z.string().optional(),
  }),
]);

const ParamsSchema = z.object({});

export const handle = {
  displayType: DisplayType.LEAF,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const summaryResponse = await apiClient.application.getSummaries({
    include_projects: true,
  });

  const response = await apiClient.workingMem.workingMemLoadSettings({});

  return json({
    generationPeriod: response.generation_period,
    cleanupProject: response.cleanup_project,
    cleanUpInboxTasks: response.clean_up_inbox_tasks,
    allProjects: summaryResponse.projects as Array<ProjectSummary>,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const form = await parseForm(request, UpdateFormSchema);

  try {
    switch (form.intent) {
      case "update": {
        await apiClient.workingMem.workingMemUpdateSettings({
          generation_period: {
            should_change: true,
            value: form.generationPeriod,
          },
          cleanup_project_ref_id: {
            should_change: form.cleanupProject !== undefined,
            value: form.cleanupProject,
          },
        });

        return redirect(`/app/workspace/working-mem/settings`);
      }

      default: {
        throw new Error(`Unknown intent: ${form.intent}`);
      }
    }
  } catch (error) {
    if (
      error instanceof ApiError &&
      error.status === StatusCodes.UNPROCESSABLE_ENTITY
    ) {
      return json(validationErrorToUIErrorInfo(error.body));
    }

    throw error;
  }
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

export default function WorkingMemSettings() {
  const navigation = useNavigation();
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const actionData = useActionData<typeof action>();
  const topLevelInfo = useContext(TopLevelInfoContext);

  const inputsEnabled = navigation.state === "idle";

  const sortedCleanupTasks = sortInboxTasksNaturally(
    loaderData.cleanUpInboxTasks,
    {
      dueDateAscending: false,
    },
  );

  const cardActionFetcher = useFetcher();

  function handleCardMarkDone(it: InboxTask) {
    cardActionFetcher.submit(
      {
        id: it.ref_id,
        status: InboxTaskStatus.DONE,
      },
      {
        method: "post",
        action: "/app/workspace/inbox-tasks/update-status-and-eisen",
      },
    );
  }

  function handleCardMarkNotDone(it: InboxTask) {
    cardActionFetcher.submit(
      {
        id: it.ref_id,
        status: InboxTaskStatus.NOT_DONE,
      },
      {
        method: "post",
        action: "/app/workspace/inbox-tasks/update-status-and-eisen",
      },
    );
  }

  return (
    <LeafPanel
      key="working-mem/settings"
      fakeKey={"working-mem/settings"}
      returnLocation="/app/workspace/working-mem"
      inputsEnabled={inputsEnabled}
    >
      <GlobalError actionResult={actionData} />

      <SectionCard
        title="Settings"
        actions={
          <SectionActions
            id="working-mem-settings"
            topLevelInfo={topLevelInfo}
            inputsEnabled={inputsEnabled}
            actions={[
              ActionSingle({
                text: "Save",
                value: "update",
                highlight: true,
              }),
            ]}
          />
        }
      >
        <GlobalError actionResult={actionData} />

        <FormControl fullWidth>
          <FormLabel id="generationPeriod">Generation Period</FormLabel>
          <PeriodSelect
            labelId="generationPeriod"
            label="Generation Period"
            name="generationPeriod"
            inputsEnabled={inputsEnabled}
            defaultValue={loaderData.generationPeriod}
            allowedValues={[
              RecurringTaskPeriod.DAILY,
              RecurringTaskPeriod.WEEKLY,
            ]}
          />
          <FieldError
            actionResult={actionData}
            fieldName="/generation_period"
          />
        </FormControl>

        {isWorkspaceFeatureAvailable(
          topLevelInfo.workspace,
          WorkspaceFeature.LIFE_PLAN,
        ) && (
          <FormControl fullWidth>
            <ProjectSelect
              name="cleanupProject"
              label="Clean Up Project"
              inputsEnabled={inputsEnabled}
              allProjects={loaderData.allProjects}
              disabled={false}
              defaultValue={loaderData.cleanupProject.ref_id}
            />
            <FieldError
              actionResult={actionData}
              fieldName="/cleanup_project_ref_id"
            />
          </FormControl>
        )}
      </SectionCard>

      <SectionCard title="Cleanup Tasks">
        {sortedCleanupTasks && (
          <InboxTaskStack
            topLevelInfo={topLevelInfo}
            showOptions={{
              showStatus: true,
              showDueDate: true,
              showHandleMarkDone: true,
              showHandleMarkNotDone: true,
            }}
            inboxTasks={sortedCleanupTasks}
            onCardMarkDone={handleCardMarkDone}
            onCardMarkNotDone={handleCardMarkNotDone}
          />
        )}
      </SectionCard>
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary(
  "/app/workspace/working-mem",
  ParamsSchema,
  {
    notFound: () => `Could not find the working memory settings!`,
    error: () =>
      `There was an error loading the working memory settings! Please try again!`,
  },
);
