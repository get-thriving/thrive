import { ApiError } from "@jupiter/webapi-client";
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
import { StatusCodes } from "http-status-codes";
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
import { ScheduleStreamMultiSelect } from "@jupiter/core/schedule/component/multi-select";
import { validationErrorToUIErrorInfo } from "@jupiter/core/infra/action-result";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";

import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { getLoggedInApiClient } from "~/api-clients.server";
import { selectZod, fixSelectOutputEntityId } from "~/logic/select";

const ParamsSchema = z.object({});

const CreateFormSchema = z.object({
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
      schedule_stream_ref_ids: fixSelectOutputEntityId(form.scheduleStreamRefIds) ?? [],
    });

    return redirect(
      `/app/workspace/calendar/schedule/export/${response.new_schedule_export.ref_id}?${url.searchParams}`,
    );
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

export default function ScheduleExportNew() {
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
      returnLocation={`/app/workspace/calendar/schedule/export?${query}`}
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
          <FieldError actionResult={actionData} fieldName="/schedule_stream_ref_ids" />
        </FormControl>
      </SectionCard>
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary(
  (_params, searchParams) =>
    `/app/workspace/calendar/schedule/export?${searchParams}`,
  ParamsSchema,
  {
    error: () =>
      `There was an error creating the calendar export! Please try again!`,
  },
);
