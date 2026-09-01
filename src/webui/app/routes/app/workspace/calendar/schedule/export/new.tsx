import { FormControl, InputLabel, OutlinedInput } from "@mui/material";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import {
  useActionData,
  useLoaderData,
  useNavigation,
  useSearchParams,
} from "@remix-run/react";
import { useContext } from "react";
import { z } from "zod";
import { parseForm } from "zodix";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { FieldError, GlobalError } from "@jupiter/core/infra/component/errors";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import {
  ActionSingle,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import {
  ActionsPosition,
  SectionCard,
} from "@jupiter/core/infra/component/section-card";
import { ScheduleStreamMultiSelect } from "@jupiter/core/apps/schedule/component/multi-select";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import {
  selectZod,
  fixSelectOutputEntityId,
} from "@jupiter/core/common/select-form";
import { handleActionApiError } from "@jupiter/core/infra/errors.server";
import {
  CREATE_AND_ANOTHER_INTENT,
  createAnotherAware,
  createAnotherLocation,
  isCreateAndAnother,
  withoutCreateAnotherIndex,
} from "@jupiter/core/infra/create-and-another";

import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { getLoggedInApiClient } from "~/api-clients.server";

const ParamsSchema = z.object({});

const CreateFormSchema = z.object({
  intent: z.string().optional(),
  name: z.string(),
  scheduleStreamRefIds: selectZod(z.string()),
});

export const handle = {
  displayType: DisplayType.LEAF,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const streamsResponse = await apiClient.schedule.scheduleStreamFind({
    allow_archived: false,
    include_notes: false,
    include_tags: false,
  });

  return json({
    allScheduleStreams: streamsResponse.entries.map((e) => e.schedule_stream),
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const form = await parseForm(request, CreateFormSchema);
  const url = new URL(request.url);

  try {
    const response = await apiClient.schedule.scheduleExportCreate({
      name: form.name,
      schedule_stream_ref_ids:
        fixSelectOutputEntityId(form.scheduleStreamRefIds) ?? [],
    });

    if (isCreateAndAnother(form.intent)) {
      return redirect(createAnotherLocation(request));
    }

    return redirect(
      `/app/workspace/calendar/schedule/export/${response.new_schedule_export.ref_id}?${withoutCreateAnotherIndex(url.searchParams)}`,
    );
  } catch (error) {
    return handleActionApiError(error);
  }
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

function ScheduleExportNew() {
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const navigation = useNavigation();
  const [query] = useSearchParams();

  const inputsEnabled = navigation.state === "idle";

  return (
    <LeafPanel
      key="schedule-export/new"
      fakeKey="schedule-export/new"
      inputsEnabled={inputsEnabled}
      returnLocation={`/app/workspace/calendar/schedule/export?${withoutCreateAnotherIndex(query)}`}
    >
      <GlobalError actionResult={actionData} />
      <SectionCard
        id="schedule-export-properties"
        title="Properties"
        actionsPosition={ActionsPosition.BELOW}
        actions={
          <SectionActions
            id="schedule-export-properties"
            topLevelInfo={topLevelInfo}
            inputsEnabled={inputsEnabled}
            actions={[
              ActionSingle({
                text: "Create",
                value: "create",
                highlight: true,
              }),
              ActionSingle({
                text: "Create & Another",
                value: CREATE_AND_ANOTHER_INTENT,
              }),
            ]}
          />
        }
      >
        <FormControl fullWidth>
          <InputLabel id="name">Name</InputLabel>
          <OutlinedInput label="name" name="name" readOnly={!inputsEnabled} />
          <FieldError actionResult={actionData} fieldName="/name" />
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="scheduleStreamRefIds">Calendar Streams</InputLabel>
          <ScheduleStreamMultiSelect
            labelId="scheduleStreamRefIds"
            label="Calendar Streams"
            name="scheduleStreamRefIds"
            readOnly={!inputsEnabled}
            allScheduleStreams={loaderData.allScheduleStreams}
          />
          <FieldError
            actionResult={actionData}
            fieldName="/schedule_stream_ref_ids"
          />
        </FormControl>
      </SectionCard>
    </LeafPanel>
  );
}

export default createAnotherAware(ScheduleExportNew);

export const ErrorBoundary = makeLeafErrorBoundary(
  (_params, searchParams) =>
    `/app/workspace/calendar/schedule/export?${withoutCreateAnotherIndex(searchParams)}`,
  ParamsSchema,
  {
    error: () =>
      `There was an error creating the calendar export! Please try again!`,
  },
);
