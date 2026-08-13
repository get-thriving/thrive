import type {
  Contact,
  Person,
  ScheduleEventFullDays,
  ScheduleEventInDay,
  ScheduleStreamSummary,
  Tag,
  TimeEventFullDaysBlock,
  TimeEventInDayBlock,
  Timezone,
  UserLight,
} from "@jupiter/webapi-client";
import { NamedEntityTag } from "@jupiter/webapi-client";
import LaunchIcon from "@mui/icons-material/Launch";
import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  InputLabel,
  OutlinedInput,
  Stack,
} from "@mui/material";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { useParams, useSearchParams } from "@remix-run/react";
import { useContext } from "react";
import { z } from "zod";
import { parseParams } from "zodix";
import { parseEntityLinkStd } from "@jupiter/core/common/entity-link";
import { TimeEventSourceLink } from "@jupiter/core/common/sub/time_events/component/source-link";
import {
  occasionTimeEventName,
  timeEventInDayBlockParamsToTimezone,
} from "@jupiter/core/common/sub/time_events/time-event";
import { calendarEventWorkspacePathFromTimePlan } from "@jupiter/core/calendar/component/calendar-navigation";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import {
  NavSingle,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { LeafPanelExpansionState } from "@jupiter/core/infra/leaf-panel-expansion";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import type { TopLevelInfo } from "@jupiter/core/infra/top-level-context";
import { handleLoaderApiError } from "@jupiter/core/infra/errors.server";
import { ScheduleEventInDayEditor } from "@jupiter/core/schedule/sub/event_in_day/component/editor";
import { ScheduleEventFullDaysEditor } from "@jupiter/core/schedule/sub/event_full_days/component/editor";
import {
  TIME_PLAN_VIEW_PARAM,
  withTimePlanView,
} from "@jupiter/core/time_plans/view-mode";

import { basicShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { getLoggedInApiClient } from "~/api-clients.server";

const ParamsSchema = z.object({
  id: z.string(),
  kind: z.enum([
    "schedule-event-in-day",
    "schedule-event-full-days",
    "time-event-in-day-block",
    "time-event-full-days-block",
  ]),
  refId: z.string(),
});

export const handle = {
  displayType: DisplayType.LEAF,
};

type ScheduleExtras = {
  allScheduleStreams: Array<ScheduleStreamSummary>;
  tags: Array<Tag>;
  contacts: Array<Contact>;
  allTags: Array<Tag>;
  allContacts: Array<Contact>;
  owner?: UserLight;
};

type CalendarEventDetails =
  | {
      kind: "schedule-event-in-day";
      refId: string;
      archived: boolean;
      originalPath: string;
      scheduleEventInDay: ScheduleEventInDay;
      timeEventInDayBlock: TimeEventInDayBlock;
      extras: ScheduleExtras;
    }
  | {
      kind: "schedule-event-full-days";
      refId: string;
      archived: boolean;
      originalPath: string;
      scheduleEventFullDays: ScheduleEventFullDays;
      timeEventFullDaysBlock: TimeEventFullDaysBlock;
      extras: ScheduleExtras;
    }
  | {
      kind: "time-event-in-day-block";
      refId: string;
      archived: boolean;
      originalPath: string;
      name: string;
      inDayBlock: TimeEventInDayBlock;
    }
  | {
      kind: "time-event-full-days-block";
      refId: string;
      archived: boolean;
      originalPath: string;
      name: string;
      fullDaysBlock: TimeEventFullDaysBlock;
      person?: Person;
    };

export async function loader({ request, params }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const { id, kind, refId } = parseParams(params, ParamsSchema);
  const originalPath = calendarEventWorkspacePathFromTimePlan(kind, refId, id);

  try {
    switch (kind) {
      case "schedule-event-in-day": {
        const [summaryResponse, response, allTags, allContacts] =
          await Promise.all([
            apiClient.application.getSummaries({
              include_schedule_streams: true,
            }),
            apiClient.schedule.scheduleEventInDayLoad({
              ref_id: refId,
              allow_archived: true,
            }),
            apiClient.tags.tagFind({ allow_archived: false }),
            apiClient.contacts.contactFind({ allow_archived: false }),
          ]);
        const summaryStreams =
          (summaryResponse.schedule_streams as Array<ScheduleStreamSummary>) ??
          [];
        const allScheduleStreams = summaryStreams.some(
          (stream) => stream.ref_id === response.schedule_stream.ref_id,
        )
          ? summaryStreams
          : [...summaryStreams, response.schedule_stream];
        return json({
          kind,
          refId,
          archived: response.schedule_event_in_day.archived,
          originalPath,
          scheduleEventInDay: response.schedule_event_in_day,
          timeEventInDayBlock: response.time_event_in_day_block,
          extras: {
            allScheduleStreams,
            tags: response.tags as Array<Tag>,
            contacts: response.contacts ?? [],
            allTags: allTags.tags as Array<Tag>,
            allContacts: allContacts.contacts as Array<Contact>,
            owner: response.owner,
          },
        } satisfies CalendarEventDetails);
      }

      case "schedule-event-full-days": {
        const [summaryResponse, response, allTags, allContacts] =
          await Promise.all([
            apiClient.application.getSummaries({
              include_schedule_streams: true,
            }),
            apiClient.schedule.scheduleEventFullDaysLoad({
              ref_id: refId,
              allow_archived: true,
            }),
            apiClient.tags.tagFind({ allow_archived: false }),
            apiClient.contacts.contactFind({ allow_archived: false }),
          ]);
        const summaryStreams =
          (summaryResponse.schedule_streams as Array<ScheduleStreamSummary>) ??
          [];
        const allScheduleStreams = summaryStreams.some(
          (stream) => stream.ref_id === response.schedule_stream.ref_id,
        )
          ? summaryStreams
          : [...summaryStreams, response.schedule_stream];
        return json({
          kind,
          refId,
          archived: response.schedule_event_full_days.archived,
          originalPath,
          scheduleEventFullDays: response.schedule_event_full_days,
          timeEventFullDaysBlock: response.time_event_full_days_block,
          extras: {
            allScheduleStreams,
            tags: response.tags as Array<Tag>,
            contacts: response.contacts ?? [],
            allTags: allTags.tags as Array<Tag>,
            allContacts: allContacts.contacts as Array<Contact>,
            owner: response.owner,
          },
        } satisfies CalendarEventDetails);
      }

      case "time-event-in-day-block": {
        const response = await apiClient.timeEvents.timeEventInDayBlockLoad({
          ref_id: refId,
          allow_archived: true,
        });
        const name =
          response.schedule_event?.name ??
          response.big_plan?.name ??
          response.todo_task?.name ??
          response.habit?.name ??
          response.chore?.name ??
          response.time_plan_activity?.name ??
          response.in_day_block.name;
        return json({
          kind,
          refId,
          archived: response.in_day_block.archived,
          originalPath,
          name,
          inDayBlock: response.in_day_block,
        } satisfies CalendarEventDetails);
      }

      case "time-event-full-days-block": {
        const response = await apiClient.timeEvents.timeEventFullDaysBlockLoad({
          ref_id: refId,
          allow_archived: true,
        });
        const ownerType = parseEntityLinkStd(response.full_days_block.owner)
          .theType as NamedEntityTag;
        let name = response.full_days_block.name;
        if (
          ownerType === NamedEntityTag.OCCASION &&
          response.contact &&
          response.occasion
        ) {
          name = occasionTimeEventName(
            response.full_days_block,
            response.contact,
            response.occasion,
          );
        } else if (ownerType === NamedEntityTag.VACATION && response.vacation) {
          name = response.vacation.name;
        } else if (
          ownerType === NamedEntityTag.SCHEDULE_EVENT_FULL_DAYS &&
          response.schedule_event
        ) {
          name = response.schedule_event.name;
        }
        return json({
          kind,
          refId,
          archived: response.full_days_block.archived,
          originalPath,
          name,
          fullDaysBlock: response.full_days_block,
          person: response.person ?? undefined,
        } satisfies CalendarEventDetails);
      }
    }
  } catch (error) {
    handleLoaderApiError(error);
  }
}

export const shouldRevalidate: ShouldRevalidateFunction = basicShouldRevalidate;

export default function TimePlanCalendarEventDetails() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const { id } = useParams();
  const [query] = useSearchParams();
  const timePlanView = query.get(TIME_PLAN_VIEW_PARAM);

  return (
    <LeafPanel
      key={`time-plan-calendar-event-${loaderData.kind}-${loaderData.refId}`}
      fakeKey={`time-plan-calendar-event-${loaderData.kind}-${loaderData.refId}`}
      inputsEnabled={true}
      entityArchived={loaderData.archived}
      returnLocation={withTimePlanView(
        `/app/workspace/time-plans/${id}`,
        timePlanView,
      )}
      initialExpansionState={LeafPanelExpansionState.SMALL}
    >
      {loaderData.kind === "schedule-event-in-day" && (
        <ScheduleEventInDayProperties
          loaderData={loaderData}
          timezone={topLevelInfo.user.timezone}
        />
      )}
      {loaderData.kind === "schedule-event-full-days" && (
        <ScheduleEventFullDaysProperties loaderData={loaderData} />
      )}
      {loaderData.kind === "time-event-in-day-block" && (
        <TimeEventInDayProperties
          name={loaderData.name}
          inDayBlock={loaderData.inDayBlock}
          timezone={topLevelInfo.user.timezone}
          originalPath={loaderData.originalPath}
        />
      )}
      {loaderData.kind === "time-event-full-days-block" && (
        <TimeEventFullDaysProperties
          name={loaderData.name}
          fullDaysBlock={loaderData.fullDaysBlock}
          person={loaderData.person}
          originalPath={loaderData.originalPath}
        />
      )}
    </LeafPanel>
  );
}

function openOriginalActions(
  id: string,
  topLevelInfo: TopLevelInfo,
  originalPath: string,
) {
  return (
    <SectionActions
      id={id}
      topLevelInfo={topLevelInfo}
      inputsEnabled={true}
      actions={[
        NavSingle({
          text: "Open original",
          icon: <LaunchIcon />,
          link: originalPath,
        }),
      ]}
    />
  );
}

function ScheduleEventInDayProperties({
  loaderData,
  timezone,
}: {
  loaderData: Extract<CalendarEventDetails, { kind: "schedule-event-in-day" }>;
  timezone: Timezone;
}) {
  const topLevelInfo = useContext(TopLevelInfoContext);
  const local = timeEventInDayBlockParamsToTimezone(
    {
      startDate: loaderData.timeEventInDayBlock.start_date,
      startTimeInDay: loaderData.timeEventInDayBlock.start_time_in_day,
    },
    timezone,
  );

  return (
    <ScheduleEventInDayEditor
      scheduleEventInDay={loaderData.scheduleEventInDay}
      timeEventInDayBlock={loaderData.timeEventInDayBlock}
      allScheduleStreams={loaderData.extras.allScheduleStreams}
      tags={loaderData.extras.tags}
      contacts={loaderData.extras.contacts}
      allTags={loaderData.extras.allTags}
      allContacts={loaderData.extras.allContacts}
      inputsEnabled={false}
      corePropertyEditable={false}
      topLevelInfo={topLevelInfo}
      entityOwnerRefId={loaderData.extras.owner?.ref_id}
      startDate={local.startDate!}
      startTimeInDay={local.startTimeInDay!}
      durationMins={loaderData.timeEventInDayBlock.duration_mins}
      actions={openOriginalActions(
        "schedule-event-in-day-properties",
        topLevelInfo,
        loaderData.originalPath,
      )}
    />
  );
}

function ScheduleEventFullDaysProperties({
  loaderData,
}: {
  loaderData: Extract<
    CalendarEventDetails,
    { kind: "schedule-event-full-days" }
  >;
}) {
  const topLevelInfo = useContext(TopLevelInfoContext);

  return (
    <ScheduleEventFullDaysEditor
      scheduleEventFullDays={loaderData.scheduleEventFullDays}
      timeEventFullDaysBlock={loaderData.timeEventFullDaysBlock}
      allScheduleStreams={loaderData.extras.allScheduleStreams}
      tags={loaderData.extras.tags}
      contacts={loaderData.extras.contacts}
      allTags={loaderData.extras.allTags}
      allContacts={loaderData.extras.allContacts}
      inputsEnabled={false}
      corePropertyEditable={false}
      topLevelInfo={topLevelInfo}
      entityOwnerRefId={loaderData.extras.owner?.ref_id}
      actions={openOriginalActions(
        "schedule-event-full-days-properties",
        topLevelInfo,
        loaderData.originalPath,
      )}
    />
  );
}

function TimeEventInDayProperties({
  name,
  inDayBlock,
  timezone,
  originalPath,
}: {
  name: string;
  inDayBlock: TimeEventInDayBlock;
  timezone: Timezone;
  originalPath: string;
}) {
  const topLevelInfo = useContext(TopLevelInfoContext);
  const local = timeEventInDayBlockParamsToTimezone(
    {
      startDate: inDayBlock.start_date,
      startTimeInDay: inDayBlock.start_time_in_day,
    },
    timezone,
  );
  const durationMins = inDayBlock.duration_mins;

  return (
    <SectionCard
      id="time-plan-calendar-event-details"
      title="Properties"
      actions={openOriginalActions(
        "time-plan-calendar-event-details",
        topLevelInfo,
        originalPath,
      )}
    >
      <Box sx={{ display: "flex", flexDirection: "row", gap: "0.25rem" }}>
        <FormControl fullWidth>
          <InputLabel id="name">Name</InputLabel>
          <OutlinedInput
            label="name"
            name="name"
            readOnly={true}
            defaultValue={name}
          />
        </FormControl>
        <TimeEventSourceLink timeEvent={inDayBlock} />
      </Box>

      <FormControl fullWidth>
        <InputLabel id="startDate" shrink margin="dense">
          Start Date
        </InputLabel>
        <OutlinedInput
          type="date"
          notched
          label="startDate"
          name="startDate"
          readOnly={true}
          disabled={true}
          defaultValue={local.startDate}
        />
      </FormControl>

      <FormControl fullWidth>
        <InputLabel id="startTimeInDay" shrink margin="dense">
          Start Time
        </InputLabel>
        <OutlinedInput
          type="time"
          label="startTimeInDay"
          name="startTimeInDay"
          readOnly={true}
          defaultValue={local.startTimeInDay}
        />
      </FormControl>

      <Stack spacing={2} direction="row">
        <ButtonGroup variant="outlined" disabled>
          <Button variant={durationMins === 15 ? "contained" : "outlined"}>
            15m
          </Button>
          <Button variant={durationMins === 30 ? "contained" : "outlined"}>
            30m
          </Button>
          <Button variant={durationMins === 60 ? "contained" : "outlined"}>
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
            readOnly={true}
            defaultValue={durationMins}
          />
        </FormControl>
      </Stack>
    </SectionCard>
  );
}

function TimeEventFullDaysProperties({
  name,
  fullDaysBlock,
  person,
  originalPath,
}: {
  name: string;
  fullDaysBlock: TimeEventFullDaysBlock;
  person?: Person;
  originalPath: string;
}) {
  const topLevelInfo = useContext(TopLevelInfoContext);
  const durationDays = fullDaysBlock.duration_days;

  return (
    <SectionCard
      id="time-plan-calendar-event-details"
      title="Properties"
      actions={openOriginalActions(
        "time-plan-calendar-event-details",
        topLevelInfo,
        originalPath,
      )}
    >
      <Box sx={{ display: "flex", flexDirection: "row", gap: "0.25rem" }}>
        <FormControl fullWidth>
          <InputLabel id="name">Name</InputLabel>
          <OutlinedInput
            label="name"
            name="name"
            readOnly={true}
            defaultValue={name}
          />
        </FormControl>
        <TimeEventSourceLink timeEvent={fullDaysBlock} extraInfo={{ person }} />
      </Box>

      <FormControl fullWidth>
        <InputLabel id="startDate" shrink margin="dense">
          Start Date
        </InputLabel>
        <OutlinedInput
          type="date"
          notched
          label="startDate"
          name="startDate"
          readOnly={true}
          disabled={true}
          defaultValue={fullDaysBlock.start_date}
        />
      </FormControl>

      <Stack spacing={2} direction="row">
        <ButtonGroup variant="outlined" disabled>
          <Button variant={durationDays === 1 ? "contained" : "outlined"}>
            1D
          </Button>
          <Button variant={durationDays === 3 ? "contained" : "outlined"}>
            3d
          </Button>
          <Button variant={durationDays === 7 ? "contained" : "outlined"}>
            7d
          </Button>
        </ButtonGroup>

        <FormControl fullWidth>
          <InputLabel id="durationDays" shrink margin="dense">
            Duration (Days)
          </InputLabel>
          <OutlinedInput
            type="number"
            label="Duration (Days)"
            name="durationDays"
            readOnly={true}
            defaultValue={durationDays}
          />
        </FormControl>
      </Stack>
    </SectionCard>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary(
  (params, searchParams) =>
    withTimePlanView(
      `/app/workspace/time-plans/${params.id}`,
      searchParams.get(TIME_PLAN_VIEW_PARAM),
    ),
  ParamsSchema,
  {
    notFound: (params) =>
      `Could not find calendar event ${params.refId} in time plan ${params.id}!`,
    error: (params) =>
      `There was an error loading calendar event ${params.refId} in time plan ${params.id}! Please try again!`,
  },
);
