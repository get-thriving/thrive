import type { InboxTask } from "@jupiter/webapi-client";
import { InboxTaskStatus, RecurringTaskPeriod } from "@jupiter/webapi-client";
import { FormControl, FormLabel } from "@mui/material";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  ShouldRevalidateFunction,
} from "react-router";
import {
  redirect,
  useActionData,
  useFetcher,
  useNavigation,
} from "react-router";
import { useContext } from "react";
import { z } from "zod";
import { parseForm } from "zodix";

import {
  WORKING_MEM_CLEANUP_TASK_DIFFICULTY,
  sortInboxTasksNaturally,
} from "#/core/common/sub/inbox_tasks/root";
import { InboxTaskStack } from "#/core/common/sub/inbox_tasks/component/stack";
import { makeLeafErrorBoundary } from "#/core/infra/component/error-boundary";
import { FieldError, GlobalError } from "#/core/infra/component/errors";
import { LeafPanel } from "#/core/infra/component/layout/leaf-panel";
import { PeriodSelect } from "#/core/common/component/period-select";
import { DisplayType } from "#/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "#/core/infra/top-level-context";
import {
  ActionSingle,
  SectionActions,
} from "#/core/infra/component/section-actions";
import { SectionCard } from "#/core/infra/component/section-card";
import { handleActionApiError } from "#/core/infra/errors.server";
import {
  SchedulingParamsFormFields,
  schedulingParamsUpdateArgs,
} from "#/core/common/scheduling-params-form";
import { SchedulingParamsBlock } from "#/core/common/component/scheduling-params-block";
import { useLoaderDataSafeForAnimation } from "#/core/infra/component/use-loader-data-for-animation";
import { standardShouldRevalidate } from "#/core/infra/should-revalidate";
import { getLoggedInApiClient } from "#/core/infra/api-clients.server";

const UpdateFormSchema = z.discriminatedUnion("intent", [
  z.object({
    intent: z.literal("update"),
    generationPeriod: z.nativeEnum(RecurringTaskPeriod),
    ...SchedulingParamsFormFields,
  }),
]);

const ParamsSchema = z.object({});

export const handle = {
  displayType: DisplayType.LEAF,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);

  const response = await apiClient.workingMem.workingMemLoadSettings({});

  return {
    generationPeriod: response.generation_period,
    cleanupTaskSchedulingParams: response.cleanup_task_scheduling_params,
    cleanUpInboxTasks: response.clean_up_inbox_tasks,
  };
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
          ...schedulingParamsUpdateArgs(form),
        });

        return redirect(`/app/workspace/apps/working-mem/settings`);
      }

      default: {
        throw new Error(`Unknown intent: ${form.intent}`);
      }
    }
  } catch (error) {
    return handleActionApiError(error);
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
        action: "/app/workspace/core/inbox-tasks/update-status-and-eisen",
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
        action: "/app/workspace/core/inbox-tasks/update-status-and-eisen",
      },
    );
  }

  return (
    <LeafPanel
      key="working-mem/settings"
      fakeKey={"working-mem/settings"}
      returnLocation="/app/workspace/apps/working-mem"
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

        <SchedulingParamsBlock
          inputsEnabled={inputsEnabled}
          schedulingParams={loaderData.cleanupTaskSchedulingParams}
          difficulty={WORKING_MEM_CLEANUP_TASK_DIFFICULTY}
          actionData={actionData}
        />
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
  "/app/workspace/apps/working-mem",
  ParamsSchema,
  {
    notFound: () => `Could not find the working memory settings!`,
    error: () =>
      `There was an error loading the working memory settings! Please try again!`,
  },
);
