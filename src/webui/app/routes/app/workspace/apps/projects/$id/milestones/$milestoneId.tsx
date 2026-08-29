import { NamedEntityTag } from "@jupiter/webapi-client";
import { FormControl, InputLabel, OutlinedInput, Stack } from "@mui/material";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { useActionData, useNavigation } from "@remix-run/react";
import { useContext } from "react";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
import { getSuggestedDatesForProjectMilestoneDate } from "@jupiter/core/common/suggested-date";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { FieldError, GlobalError } from "@jupiter/core/infra/component/errors";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import {
  ActionSingle,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import { DateInputWithSuggestions } from "@jupiter/core/infra/component/date-input-with-suggestions";
import { ProjectMilestoneSourceLink } from "@jupiter/core/apps/projects/sub/milestones/component/source-link";
import {
  handleActionApiError,
  handleLoaderApiError,
} from "@jupiter/core/infra/errors.server";

import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { getLoggedInApiClient } from "~/api-clients.server";

const ParamsSchema = z.object({
  id: z.string(),
  milestoneId: z.string(),
});

const UpdateFormSchema = z.discriminatedUnion("intent", [
  z.object({
    intent: z.literal("update"),
    name: z.string(),
    date: z.string(),
  }),
  z.object({
    intent: z.literal("archive"),
  }),
  z.object({
    intent: z.literal("remove"),
  }),
]);

export const handle = {
  displayType: DisplayType.LEAFLET,
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const { milestoneId } = parseParams(params, ParamsSchema);

  try {
    const result = await apiClient.projects.projectMilestoneLoad({
      ref_id: milestoneId,
      allow_archived: true,
    });

    return json({
      milestone: result.project_milestone,
    });
  } catch (error) {
    handleLoaderApiError(error);
  }
}

export async function action({ request, params }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const { id: projectId, milestoneId } = parseParams(params, ParamsSchema);
  const form = await parseForm(request, UpdateFormSchema);

  try {
    switch (form.intent) {
      case "update": {
        await apiClient.projects.projectMilestoneUpdate({
          ref_id: milestoneId,
          name: {
            should_change: true,
            value: form.name,
          },
          date: {
            should_change: true,
            value: form.date,
          },
        });

        return redirect(`/app/workspace/apps/projects/${projectId}`);
      }

      case "archive": {
        await apiClient.projects.projectMilestoneArchive({
          ref_id: milestoneId,
        });
        return redirect(`/app/workspace/apps/projects/${projectId}`);
      }

      case "remove": {
        await apiClient.projects.projectMilestoneRemove({
          ref_id: milestoneId,
        });
        return redirect(`/app/workspace/apps/projects/${projectId}`);
      }

      default:
        throw new Response("Bad Intent", { status: 500 });
    }
  } catch (error) {
    return handleActionApiError(error);
  }
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

export default function ProjectMilestoneView() {
  const { milestone } = useLoaderDataSafeForAnimation<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const topLevelInfo = useContext(TopLevelInfoContext);

  const inputsEnabled = navigation.state === "idle" && !milestone.archived;

  return (
    <LeafPanel
      key={`project-milestone-${milestone.ref_id}`}
      entityType={NamedEntityTag.PROJECT_MILESTONE}
      entityRefId={milestone.ref_id}
      fakeKey={`project-milestone-${milestone.ref_id}`}
      isLeaflet
      showArchiveAndRemoveButton
      inputsEnabled={inputsEnabled}
      entityArchived={milestone.archived}
      returnLocation={`/app/workspace/apps/projects/${milestone.project_ref_id}`}
    >
      <GlobalError actionResult={actionData} />
      <SectionCard
        id="milestone-properties"
        title="Properties"
        actions={
          <SectionActions
            id="milestone-properties"
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
        <Stack direction="row" spacing={2}>
          <FormControl sx={{ flexGrow: 3 }}>
            <InputLabel id="name">Name</InputLabel>
            <OutlinedInput
              label="Name"
              name="name"
              readOnly={!inputsEnabled}
              defaultValue={milestone.name}
            />
            <FieldError actionResult={actionData} fieldName="/name" />
          </FormControl>
          <ProjectMilestoneSourceLink projectId={milestone.project_ref_id} />
        </Stack>

        <FormControl fullWidth>
          <InputLabel id="date" shrink margin="dense">
            Date
          </InputLabel>
          <DateInputWithSuggestions
            name="date"
            label="date"
            inputsEnabled={inputsEnabled}
            defaultValue={milestone.date}
            suggestedDates={getSuggestedDatesForProjectMilestoneDate(
              topLevelInfo.today,
            )}
          />
          <FieldError actionResult={actionData} fieldName="/date" />
        </FormControl>
      </SectionCard>
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary("../../..", ParamsSchema, {
  notFound: (params) => `Could not find milestone #${params.milestoneId}!`,
  error: (params) =>
    `There was an error loading milestone #${params.milestoneId}! Please try again!`,
});
