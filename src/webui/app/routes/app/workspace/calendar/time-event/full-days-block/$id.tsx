import { ApiError, NamedEntityTag } from "@jupiter/webapi-client";
import {
  Box,
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
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { useContext, useEffect, useState } from "react";
import { z } from "zod";
import { parseParams } from "zodix";
import { parseEntityLinkStd } from "@jupiter/core/common/entity-link";
import { occasionTimeEventName } from "@jupiter/core/common/sub/time_events/time-event";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { FieldError, GlobalError } from "@jupiter/core/infra/component/errors";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import {
  ActionMultipleSpread,
  ActionSingle,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import { TimeEventSourceLink } from "@jupiter/core/common/sub/time_events/component/source-link";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";

import { basicShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { getSession } from "~/sessions";
import { getLoggedInApiClient } from "~/api-clients.server";

const ParamsSchema = z.object({
  id: z.string(),
});

export const handle = {
  displayType: DisplayType.LEAF,
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const { id } = parseParams(params, ParamsSchema);

  try {
    const response = await apiClient.timeEvents.timeEventFullDaysBlockLoad({
      ref_id: id,
      allow_archived: true,
    });

    return json({
      fullDaysBlock: response.full_days_block,
      scheduleEvent: response.schedule_event,
      person: response.person,
      contact: response.contact,
      occasion: response.occasion,
      vacation: response.vacation,
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === StatusCodes.NOT_FOUND) {
      throw new Response(ReasonPhrases.NOT_FOUND, {
        status: StatusCodes.NOT_FOUND,
        statusText: ReasonPhrases.NOT_FOUND,
      });
    }

    throw error;
  }
}

export async function action({ request, params }: ActionFunctionArgs) {
  await getSession(request.headers.get("Cookie"));
  parseParams(params, ParamsSchema);
  const url = new URL(request.url);

  return redirect(`/app/workspace/calendar?${url.searchParams}`);
}

export const shouldRevalidate: ShouldRevalidateFunction = basicShouldRevalidate;

export default function TimeEventFullDaysBlockViewOne() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const actionData = useActionData<typeof action>();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const navigation = useNavigation();
  const [query] = useSearchParams();

  const inputsEnabled =
    navigation.state === "idle" && !loaderData.fullDaysBlock.archived;
  const corePropertyEditable = false;

  const [durationDays, setDurationDays] = useState(
    loaderData.fullDaysBlock.duration_days,
  );
  useEffect(() => {
    setDurationDays(loaderData.fullDaysBlock.duration_days);
  }, [loaderData.fullDaysBlock.duration_days]);

  let name = null;
  const { theType } = parseEntityLinkStd(loaderData.fullDaysBlock.owner);
  switch (theType) {
    case NamedEntityTag.SCHEDULE_EVENT_FULL_DAYS:
      name = loaderData.scheduleEvent!.name;
      break;

    case NamedEntityTag.OCCASION:
      name = occasionTimeEventName(
        loaderData.fullDaysBlock,
        loaderData.contact!,
        loaderData.occasion!,
      );
      break;

    case NamedEntityTag.VACATION:
      name = loaderData.vacation!.name;
      break;

    default:
      throw new Error(`Unknown full-days time event owner type: ${theType}`);
  }

  return (
    <LeafPanel
      key={`time-event-full-days-block-${loaderData.fullDaysBlock.ref_id}`}
      fakeKey={`time-event-full-days-block-${loaderData.fullDaysBlock.ref_id}`}
      showArchiveAndRemoveButton
      inputsEnabled={inputsEnabled}
      entityNotEditable={!corePropertyEditable}
      entityArchived={loaderData.fullDaysBlock.archived}
      returnLocation={`/app/workspace/calendar?${query}`}
    >
      <GlobalError actionResult={actionData} />
      <SectionCard
        id="time-event-full-days-block-properties"
        title="Properties"
        actions={
          <SectionActions
            id="time-event-full-days-block-properties"
            topLevelInfo={topLevelInfo}
            inputsEnabled={inputsEnabled}
            actions={[
              ActionMultipleSpread({
                actions: [
                  ActionSingle({
                    text: "Save",
                    value: "update",
                    highlight: true,
                  }),
                ],
              }),
            ]}
          />
        }
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
            <FieldError actionResult={actionData} fieldName="/name" />
          </FormControl>

          <TimeEventSourceLink
            timeEvent={loaderData.fullDaysBlock}
            extraInfo={{ person: loaderData.person ?? undefined }}
          />
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
            readOnly={!inputsEnabled || !corePropertyEditable}
            disabled={!inputsEnabled || !corePropertyEditable}
            defaultValue={loaderData.fullDaysBlock.start_date}
          />

          <FieldError actionResult={actionData} fieldName="/start_date" />
        </FormControl>

        <Stack spacing={2} direction="row">
          <ButtonGroup variant="outlined" disabled={!corePropertyEditable}>
            <Button
              disabled={!inputsEnabled}
              variant={durationDays === 1 ? "contained" : "outlined"}
              onClick={() => setDurationDays(1)}
            >
              1D
            </Button>
            <Button
              disabled={!inputsEnabled}
              variant={durationDays === 3 ? "contained" : "outlined"}
              onClick={() => setDurationDays(3)}
            >
              3d
            </Button>
            <Button
              disabled={!inputsEnabled}
              variant={durationDays === 7 ? "contained" : "outlined"}
              onClick={() => setDurationDays(7)}
            >
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
              readOnly={!inputsEnabled || !corePropertyEditable}
              value={durationDays}
              onChange={(e) => setDurationDays(parseInt(e.target.value, 10))}
            />

            <FieldError actionResult={actionData} fieldName="/duration_days" />
          </FormControl>
        </Stack>
      </SectionCard>
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary(
  (params) => `/app/workspace/calendar/time-event/full-days-block/${params.id}`,
  ParamsSchema,
  {
    notFound: (params) =>
      `Could not find time event full days block #${params.id}!`,
    error: (params) =>
      `There was an error loading time event full days block #${params.id}! Please try again!`,
  },
);
