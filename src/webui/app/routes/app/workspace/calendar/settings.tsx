import { ApiError, ScheduleStreamSource } from "@jupiter/webapi-client";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  FormControl,
  FormControlLabel,
  InputLabel,
  Switch,
  styled,
} from "@mui/material";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import {
  useActionData,
  useNavigation,
  useSearchParams,
} from "@remix-run/react";
import { StatusCodes } from "http-status-codes";
import { useContext } from "react";
import { z } from "zod";
import { CheckboxAsString, parseForm } from "zodix";
import { EntitySummaryLink } from "@jupiter/core/common/component/entity-summary-link";
import { AppComponentTag } from "@jupiter/core/infra/component/app-component-tag";
import {
  EntityCard,
  EntityLink,
} from "@jupiter/core/infra/component/entity-card";
import { makeBranchErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { FieldError, GlobalError } from "@jupiter/core/infra/component/errors";
import { BranchPanel } from "@jupiter/core/infra/component/layout/branch-panel";
import { ScheduleStreamMultiSelect } from "@jupiter/core/schedule/component/multi-select";
import { StandardDivider } from "@jupiter/core/infra/component/standard-divider";
import { TimeDiffTag } from "@jupiter/core/common/component/time-diff-tag";
import {
  noErrorNoData,
  validationErrorToUIErrorInfo,
} from "@jupiter/core/infra/action-result";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import {
  SectionActions,
  ActionSingle,
  ActionsExpansion,
} from "@jupiter/core/infra/component/section-actions";

import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { selectZod } from "~/logic/select";
import { getLoggedInApiClient } from "~/api-clients.server";

const ParamsSchema = z.object({});

const ScheduleExternalSyncFormSchema = z.object({
  scheduleStreamRefIds: selectZod(z.string()),
  syncEvenIfNotModified: CheckboxAsString,
});

export const handle = {
  displayType: DisplayType.BRANCH,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const summaryResponse = await apiClient.application.getSummaries({
    include_schedule_streams: true,
  });
  const response = await apiClient.schedule.scheduleExternalSyncLoadRuns({});

  return json({
    scheduleStreams: summaryResponse.schedule_streams!,
    entries: response.entries,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const form = await parseForm(request, ScheduleExternalSyncFormSchema);

  try {
    await apiClient.schedule.scheduleExternalSyncDo({
      sync_even_if_not_modified: form.syncEvenIfNotModified,
      filter_schedule_stream_ref_id: form.scheduleStreamRefIds,
    });

    return json(noErrorNoData());
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

export default function CalendarSettings() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const topLevelInfo = useContext(TopLevelInfoContext);

  const inputsEnabled = navigation.state === "idle";

  const query = useSearchParams();

  const scheduleStreamsByRefId = new Map(
    loaderData.scheduleStreams.map((stream) => [stream.ref_id, stream]),
  );

  return (
    <BranchPanel
      key="calendar-settings"
      returnLocation={`/app/workspace/calendar?${query}`}
    >
      <GlobalError actionResult={actionData} />

      <SectionCard
        title="External Calendar Sync"
        actions={
          <SectionActions
            id="calendar-external-sync"
            topLevelInfo={topLevelInfo}
            inputsEnabled={inputsEnabled}
            expansion={ActionsExpansion.ALWAYS_SHOW}
            actions={[
              ActionSingle({
                text: "Sync",
                value: "sync",
                highlight: true,
              }),
            ]}
          />
        }
      >
        <FormControl fullWidth>
          <InputLabel id="scheduleStreamRefId">Schedule Streams</InputLabel>
          <ScheduleStreamMultiSelect
            labelId="scheduleStreamRefIds"
            label="Schedule Streams"
            name="scheduleStreamRefIds"
            readOnly={!inputsEnabled}
            allScheduleStreams={loaderData.scheduleStreams.filter(
              (ss) => ss.source === ScheduleStreamSource.EXTERNAL_ICAL,
            )}
          />
          <FieldError
            actionResult={actionData}
            fieldName="/filter_schedule_stream_ref_id"
          />
        </FormControl>

        <FormControl fullWidth>
          <FormControlLabel
            control={
              <Switch
                name="syncEvenIfNotModified"
                readOnly={!inputsEnabled}
                disabled={!inputsEnabled}
                defaultChecked={false}
              />
            }
            label="Sync Even If Not Modified"
          />
          <FieldError
            actionResult={actionData}
            fieldName="/sync_even_if_not_modified"
          />
        </FormControl>
      </SectionCard>

      <StandardDivider title="Previous Runs" size="large" />

      {loaderData.entries.map((entry) => {
        return (
          <Accordion key={entry.ref_id}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <AccordionHeader>
                Run from <AppComponentTag source={entry.source} />
                on {entry.today} from {entry.start_of_window} to{" "}
                {entry.end_of_window}{" "}
                {entry.sync_even_if_not_modified ? "and sync forced " : " "}
                with {entry.entity_records.length}
                {entry.even_more_entity_records ? "+" : ""} entities synced
                <TimeDiffTag
                  today={topLevelInfo.today}
                  labelPrefix="from"
                  collectionTime={entry.created_time}
                />
              </AccordionHeader>
            </AccordionSummary>

            <AccordionDetails>
              <ExternalSyncTargetsSection>
                Synced Streams
                {entry.per_stream_results.map((stream) => (
                  <EntityCard
                    key={`calendar-streams-${entry.ref_id}-${stream.schedule_stream_ref_id}`}
                  >
                    <EntityLink
                      to={`/app/workspace/calendar/schedule/stream/${stream.schedule_stream_ref_id}`}
                    >
                      {scheduleStreamsByRefId.get(stream.schedule_stream_ref_id)
                        ?.name || "Archived Stream"}
                    </EntityLink>

                    {stream.error_msg && (
                      <Box>
                        <ErrorDisplay>{stream.error_msg}</ErrorDisplay>
                      </Box>
                    )}
                  </EntityCard>
                ))}
              </ExternalSyncTargetsSection>

              {entry.entity_records.length > 0 && (
                <>
                  <StandardDivider title="Entities" size="large" />
                  {entry.entity_records.map((record) => (
                    <EntityCard
                      key={`entities-${entry.ref_id}-${record.ref_id}`}
                    >
                      <EntitySummaryLink
                        today={topLevelInfo.today}
                        summary={record}
                      />
                    </EntityCard>
                  ))}
                </>
              )}
            </AccordionDetails>
          </Accordion>
        );
      })}
    </BranchPanel>
  );
}

export const ErrorBoundary = makeBranchErrorBoundary(
  (_params, searchParams) => `/app/workspace/calendar?${searchParams}`,
  ParamsSchema,
  {
    error: () =>
      `There was an error creating the event in day! Please try again!`,
  },
);

const AccordionHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  flexWrap: "wrap",
}));

const ErrorDisplay = styled("pre")(({ theme }) => ({
  color: theme.palette.error.main,
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
}));

const ExternalSyncTargetsSection = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  flexWrap: "wrap",
  paddingBottom: theme.spacing(1),
}));
