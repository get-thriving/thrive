import {
  ApiError,
  NamedEntityTag,
  RecurringTaskPeriod,
  WorkspaceFeature,
} from "@jupiter/webapi-client";
import type { GoalSummary, Tag } from "@jupiter/webapi-client";
import { FormControl, InputLabel, OutlinedInput, Stack } from "@mui/material";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { useActionData, useNavigation } from "@remix-run/react";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { useContext } from "react";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
import { sortJournalsNaturally } from "@jupiter/core/journals/root";
import { allowUserChanges } from "@jupiter/core/journals/source";
import { isWorkspaceFeatureAvailable } from "@jupiter/core/workspaces/root";
import { sortTimePlansNaturally } from "@jupiter/core/time_plans/root";
import { EntityNoteEditor } from "@jupiter/core/infra/component/entity-note-editor";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { FieldError, GlobalError } from "@jupiter/core/infra/component/errors";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import {
  ActionSingle,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import { JournalStack } from "@jupiter/core/journals/component/stack";
import { PeriodSelect } from "@jupiter/core/common/component/period-select";
import { ShowReport } from "@jupiter/core/report/component/show-report";
import { TimePlanStack } from "@jupiter/core/time_plans/component/stack";
import { validationErrorToUIErrorInfo } from "@jupiter/core/infra/action-result";
import { LeafPanelExpansionState } from "@jupiter/core/infra/leaf-panel-expansion";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import { useBigScreen } from "@jupiter/core/infra/component/use-big-screen";
import { entityLinkStd } from "@jupiter/core/common/entity-link";
import { TagsEditor } from "@jupiter/core/common/sub/tags/component/tags-editor";

import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { getLoggedInApiClient } from "~/api-clients.server";

const ParamsSchema = z.object({
  id: z.string(),
});

const UpdateFormSchema = z.discriminatedUnion("intent", [
  z.object({
    intent: z.literal("change-time-config"),
    rightNow: z.string(),
    period: z.nativeEnum(RecurringTaskPeriod),
  }),
  z.object({
    intent: z.literal("refresh-stats"),
  }),
  z.object({
    intent: z.literal("archive"),
  }),
  z.object({
    intent: z.literal("remove"),
  }),
]);

export const handle = {
  displayType: DisplayType.LEAF,
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const { id } = parseParams(params, ParamsSchema);

  const summaryResponse = await apiClient.application.getSummaries({
    include_workspace: true,
    include_aspects: true,
    include_goals: true,
  });

  try {
    const workspace = summaryResponse.workspace!;

    const allTags = await apiClient.tags.tagFind({
      allow_archived: false,
    });

    const result = await apiClient.journals.journalLoad({
      ref_id: id,
      allow_archived: true,
    });

    let timePlanResult = undefined;
    if (isWorkspaceFeatureAvailable(workspace, WorkspaceFeature.TIME_PLANS)) {
      timePlanResult =
        await apiClient.timePlans.timePlanLoadForTimeDateAndPeriod({
          right_now: result.journal.right_now,
          period: result.journal.period,
          allow_archived: false,
        });
    }

    return json({
      allAspects: summaryResponse.aspects || undefined,
      allGoals: (summaryResponse.goals as Array<GoalSummary>) || undefined,
      journal: result.journal,
      journalStats: result.journal_stats,
      note: result.note,
      writingTask: result.writing_task,
      subPeriodJournals: result.sub_period_journals,
      timePlan: timePlanResult?.time_plan,
      subTimePlans: timePlanResult?.sub_period_time_plans ?? [],
      tags: result.tags,
      allTags: allTags.tags as Array<Tag>,
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
  const apiClient = await getLoggedInApiClient(request);
  const { id } = parseParams(params, ParamsSchema);
  const form = await parseForm(request, UpdateFormSchema);

  try {
    switch (form.intent) {
      case "change-time-config": {
        await apiClient.journals.journalChangeTimeConfig({
          ref_id: id,
          right_now: {
            should_change: true,
            value: form.rightNow,
          },
          period: {
            should_change: true,
            value: form.period,
          },
        });
        return redirect(`/app/workspace/journals/${id}`);
      }

      case "refresh-stats": {
        await apiClient.journals.journalRefreshStats({
          ref_id: id,
        });
        return redirect(`/app/workspace/journals/${id}`);
      }

      case "archive": {
        await apiClient.journals.journalArchive({
          ref_id: id,
        });
        return redirect(`/app/workspace/journals/${id}`);
      }

      case "remove": {
        await apiClient.journals.journalRemove({
          ref_id: id,
        });
        return redirect(`/app/workspace/journals`);
      }

      default:
        throw new Response("Bad Intent", { status: 500 });
    }
  } catch (error) {
    if (
      error instanceof ApiError &&
      error.status === StatusCodes.UNPROCESSABLE_ENTITY
    ) {
      return json(validationErrorToUIErrorInfo(error.body));
    }

    if (error instanceof ApiError && error.status === StatusCodes.CONFLICT) {
      return json(validationErrorToUIErrorInfo(error.body));
    }

    throw error;
  }
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

export default function Journal() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();

  const isBigScreen = useBigScreen();

  const topLevelInfo = useContext(TopLevelInfoContext);

  const corePropertyEditable = allowUserChanges(loaderData.journal.source);
  const inputsEnabled =
    navigation.state === "idle" && !loaderData.journal.archived;

  const sortedSubJournals = sortJournalsNaturally(loaderData.subPeriodJournals);
  const sortedTimePlans = sortTimePlansNaturally(loaderData.subTimePlans);

  return (
    <LeafPanel
      key={`journal-${loaderData.journal.ref_id}`}
      entityType={NamedEntityTag.JOURNAL}
      entityRefId={loaderData.journal.ref_id}
      fakeKey={`journal-${loaderData.journal.ref_id}`}
      showArchiveAndRemoveButton={corePropertyEditable}
      inputsEnabled={inputsEnabled}
      entityArchived={loaderData.journal.archived}
      returnLocation="/app/workspace/journals"
      initialExpansionState={LeafPanelExpansionState.FULL}
    >
      <GlobalError actionResult={actionData} />
      <SectionCard
        title="Properties"
        actions={
          <SectionActions
            id="journal-properties"
            topLevelInfo={topLevelInfo}
            inputsEnabled={inputsEnabled}
            actions={[
              ActionSingle({
                id: "journal-change-time-config",
                text: "Change Time Config",
                value: "change-time-config",
                disabled: !inputsEnabled || !corePropertyEditable,
                highlight: true,
              }),
              ActionSingle({
                id: "journal-refresh-stats",
                text: "Refresh Stats",
                value: "refresh-stats",
                disabled: !inputsEnabled,
              }),
            ]}
          />
        }
      >
        <Stack
          direction={isBigScreen ? "row" : "column"}
          spacing={2}
          useFlexGap
        >
          <FormControl fullWidth>
            <InputLabel id="rightNow" shrink margin="dense">
              The Date
            </InputLabel>
            <OutlinedInput
              type="date"
              notched
              label="rightNow"
              name="rightNow"
              readOnly={!inputsEnabled || !corePropertyEditable}
              defaultValue={loaderData.journal.right_now}
              disabled={!inputsEnabled || !corePropertyEditable}
            />

            <FieldError actionResult={actionData} fieldName="/right_now" />
          </FormControl>

          <FormControl fullWidth>
            <PeriodSelect
              labelId="period"
              label="Period"
              name="period"
              inputsEnabled={inputsEnabled && corePropertyEditable}
              defaultValue={loaderData.journal.period}
            />
            <FieldError actionResult={actionData} fieldName="/status" />
          </FormControl>

          <FormControl fullWidth>
            <TagsEditor
              name="tags"
              allTags={loaderData.allTags}
              defaultValue={loaderData.tags.map((tag) => tag.ref_id)}
              inputsEnabled={inputsEnabled}
              owner={entityLinkStd(
                NamedEntityTag.JOURNAL,
                loaderData.journal.ref_id,
              )}
            />
          </FormControl>
        </Stack>
      </SectionCard>

      <SectionCard id="journal-note" title="Note">
        <EntityNoteEditor
          initialNote={loaderData.note}
          inputsEnabled={inputsEnabled}
        />
      </SectionCard>

      <SectionCard id="journal-report" title="Report">
        <ShowReport
          topLevelInfo={topLevelInfo}
          allAspects={loaderData.allAspects || []}
          allGoals={loaderData.allGoals || []}
          report={loaderData.journalStats.report}
        />
      </SectionCard>

      <SectionCard id="sub-journals" title="Other Journals in this Period">
        <JournalStack
          topLevelInfo={topLevelInfo}
          journals={sortedSubJournals}
        />
      </SectionCard>

      {isWorkspaceFeatureAvailable(
        topLevelInfo.workspace,
        WorkspaceFeature.TIME_PLANS,
      ) &&
        loaderData.timePlan &&
        sortedTimePlans.length > 0 && (
          <SectionCard id="sub-time-plans" title="Time Plans in this Period">
            {loaderData.timePlan && (
              <TimePlanStack
                topLevelInfo={topLevelInfo}
                timePlans={[loaderData.timePlan]}
              />
            )}
            {sortedTimePlans.length > 0 && (
              <TimePlanStack
                topLevelInfo={topLevelInfo}
                timePlans={sortedTimePlans}
              />
            )}
          </SectionCard>
        )}
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary(
  "/app/workspace/journals",
  ParamsSchema,
  {
    notFound: (params) => `Could not find journal #${params.id}!`,
    error: (params) =>
      `There was an error loading journal #${params.id}! Please try again!`,
  },
);
