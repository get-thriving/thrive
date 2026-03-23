import { ApiError } from "@jupiter/webapi-client";
import {
  Button,
  ButtonGroup,
  FormControl,
  InputLabel,
  OutlinedInput,
  Stack,
} from "@mui/material";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import {
  useActionData,
  useNavigation,
  useSearchParams,
} from "@remix-run/react";
import { StatusCodes } from "http-status-codes";
import { DateTime } from "luxon";
import { useContext, useEffect, useState } from "react";
import { z } from "zod";
import { parseForm, parseQuery } from "zodix";
import { timeEventInDayBlockParamsToUtc } from "@jupiter/core/common/sub/time_events/time-event";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { FieldError, GlobalError } from "@jupiter/core/infra/component/errors";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import {
  ActionSingle,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import { TimeEventParamsSource } from "@jupiter/core/common/sub/time_events/component/params-source";
import { validationErrorToUIErrorInfo } from "@jupiter/core/infra/action-result";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";

import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { getLoggedInApiClient } from "~/api-clients.server";

const ParamsSchema = z.object({});

const QuerySchema = z.object({
  timePlanActivityRefId: z.string(),
  timePlanRefId: z.string(),
  date: z
    .string()
    .regex(/[0-9][0-9][0-9][0-9][-][0-9][0-9][-][0-9][0-9]/)
    .optional(),
});

const CreateFormSchema = z.object({
  userTimezone: z.string(),
  startDate: z.string(),
  startTimeInDay: z.string().optional(),
  durationMins: z.string().transform((v) => parseInt(v, 10)),
});

export const handle = {
  displayType: DisplayType.LEAF,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const query = parseQuery(request, QuerySchema);

  const activityResponse =
    await apiClient.timePlans.timePlanActivityLoad({
      ref_id: query.timePlanActivityRefId,
      allow_archived: true,
    });

  return json({
    date: query.date,
    timePlanActivity: activityResponse.time_plan_activity,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const query = parseQuery(request, QuerySchema);
  const form = await parseForm(request, CreateFormSchema);

  try {
    const { startDate, startTimeInDay } = timeEventInDayBlockParamsToUtc(
      form,
      form.userTimezone,
    );

    await apiClient.timeEvents.timeEventInDayBlockCreateForTimePlanActivity({
      time_plan_activity_ref_id: query.timePlanActivityRefId,
      start_date: startDate,
      start_time_in_day: startTimeInDay ?? "",
      duration_mins: form.durationMins,
    });

    return redirect(
      `/app/workspace/time-plans/${query.timePlanRefId}/${query.timePlanActivityRefId}`,
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

export default function TimeEventInDayBlockCreateForTimePlanActivity() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const actionData = useActionData<typeof action>();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const navigation = useNavigation();
  const [query] = useSearchParams();

  const inputsEnabled =
    navigation.state === "idle" && !loaderData.timePlanActivity.archived;

  const rightNow = DateTime.local({ zone: topLevelInfo.user.timezone });

  const [startDate, setStartDate] = useState(rightNow.toFormat("yyyy-MM-dd"));
  const [startTimeInDay, setStartTimeInDay] = useState(
    rightNow.toFormat("HH:mm"),
  );
  const [durationMins, setDurationMins] = useState(60);

  useEffect(() => {
    if (query.get("sourceStartDate") && query.get("sourceStartTimeInDay")) {
      setStartDate(query.get("sourceStartDate")!);
      setStartTimeInDay(query.get("sourceStartTimeInDay")!);
    }
    if (query.get("sourceDurationMins")) {
      setDurationMins(parseInt(query.get("sourceDurationMins")!, 10));
    }
  }, [query]);

  return (
    <LeafPanel
      key="time-event-in-day-block/new"
      fakeKey="time-event-in-day-block/new"
      returnLocation={`/app/workspace/calendar?${query}`}
      inputsEnabled={inputsEnabled}
    >
      <TimeEventParamsSource
        startDate={startDate}
        startTimeInDay={startTimeInDay}
        durationMins={durationMins}
      />
      <GlobalError actionResult={actionData} />
      <SectionCard
        id="time-event-in-day-block-properties"
        title="Properties"
        actions={
          <SectionActions
            id="time-event-in-day-block-properties"
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
        <input
          type="hidden"
          name="userTimezone"
          value={topLevelInfo.user.timezone}
        />

        <FormControl fullWidth>
          <InputLabel id="name">Name</InputLabel>
          <OutlinedInput
            label="name"
            name="name"
            defaultValue={loaderData.timePlanActivity.name}
            readOnly={true}
          />
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="startDate" shrink margin="dense">
            Start Date
          </InputLabel>
          <OutlinedInput
            type="date"
            notched
            label="startDate"
            name="startDate"
            readOnly={!inputsEnabled}
            disabled={!inputsEnabled}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <FieldError actionResult={actionData} fieldName="/start_date" />
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="startTimeInDay" shrink margin="dense">
            Start Time
          </InputLabel>
          <OutlinedInput
            type="time"
            label="startTimeInDay"
            name="startTimeInDay"
            readOnly={!inputsEnabled}
            value={startTimeInDay}
            onChange={(e) => setStartTimeInDay(e.target.value)}
          />

          <FieldError
            actionResult={actionData}
            fieldName="/start_time_in_day"
          />
        </FormControl>

        <Stack spacing={2} direction="row">
          <ButtonGroup variant="outlined" disabled={!inputsEnabled}>
            <Button
              disabled={!inputsEnabled}
              variant={durationMins === 15 ? "contained" : "outlined"}
              onClick={() => setDurationMins(15)}
            >
              15m
            </Button>
            <Button
              disabled={!inputsEnabled}
              variant={durationMins === 30 ? "contained" : "outlined"}
              onClick={() => setDurationMins(30)}
            >
              30m
            </Button>
            <Button
              disabled={!inputsEnabled}
              variant={durationMins === 60 ? "contained" : "outlined"}
              onClick={() => setDurationMins(60)}
            >
              60m
            </Button>
          </ButtonGroup>

          <FormControl fullWidth>
            <InputLabel id="durationMins" shrink margin="dense">
              Duration (Mins)
            </InputLabel>
            <OutlinedInput
              type="number"
              label="Duration (Mins)"
              name="durationMins"
              readOnly={!inputsEnabled}
              value={durationMins}
              onChange={(e) => {
                if (Number.isNaN(parseInt(e.target.value, 10))) {
                  setDurationMins(0);
                  e.preventDefault();
                  return;
                }

                return setDurationMins(parseInt(e.target.value, 10));
              }}
            />

            <FieldError actionResult={actionData} fieldName="/duration_mins" />
          </FormControl>
        </Stack>
      </SectionCard>
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary(
  (_params, searchParams) => `/app/workspace/calendar?${searchParams}`,
  ParamsSchema,
  {
    error: () =>
      `There was an error creating the event in day! Please try again!`,
  },
);
