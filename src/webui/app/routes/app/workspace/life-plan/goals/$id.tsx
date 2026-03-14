import {
  ApiError,
  GoalSummary,
  NoteNamespace,
  AspectSummary,
  type Tag,
  TagNamespace,
} from "@jupiter/webapi-client";
import { FormControl, InputLabel, OutlinedInput, Stack } from "@mui/material";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { useActionData, useNavigation } from "@remix-run/react";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { useContext, useState } from "react";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
import { EntityNoteEditor } from "@jupiter/core/infra/component/entity-note-editor";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { FieldError, GlobalError } from "@jupiter/core/infra/component/errors";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import { validationErrorToUIErrorInfo } from "@jupiter/core/infra/action-result";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import {
  ActionSingle,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import { AspectSelect } from "#/core/life_plan/sub/aspects/component/select";
import { GoalSelect } from "#/core/life_plan/sub/goals/components/select";
import { TagsEditor } from "#/core/common/sub/tags/component/tags-editor";

import { useLoaderDataSafeForAnimation as useLoaderDataForAnimation } from "~/rendering/use-loader-data-for-animation";
import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { getLoggedInApiClient } from "~/api-clients.server";

const ParamsSchema = z.object({
  id: z.string(),
});

const UpdateFormSchema = z.discriminatedUnion("intent", [
  z.object({
    intent: z.literal("update"),
    name: z.string(),
    aspect: z.string(),
    parent_goal: z.string().optional().default(""),
  }),
  z.object({
    intent: z.literal("create-note"),
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
  const { id } = parseParams(params, ParamsSchema);

  const summaryResponse = await apiClient.application.getSummaries({
    include_aspects: true,
    include_goals: true,
  });

  try {
    const allTags = await apiClient.tags.tagFind({
      allow_archived: false,
      filter_namespace: [TagNamespace.GOAL],
    });

    const response = await apiClient.lifePlan.goalLoad({
      ref_id: id,
      allow_archived: true,
    });

    return json({
      allAspects: summaryResponse.aspects as Array<AspectSummary>,
      rootAspect: summaryResponse.root_aspect as AspectSummary,
      allGoals: summaryResponse.goals as Array<GoalSummary>,
      goal: response.goal,
      tags: response.tags,
      note: response.note ?? null,
      allTags: allTags.tags,
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
      case "update": {
        await apiClient.lifePlan.goalUpdate({
          ref_id: id,
          name: {
            should_change: true,
            value: form.name,
          },
          aspect_ref_id: {
            should_change: true,
            value: form.aspect,
          },
          parent_goal_ref_id: {
            should_change: true,
            value: form.parent_goal === "" ? null : form.parent_goal,
          },
        });

        return redirect(`/app/workspace/life-plan/goals/${id}`);
      }

      case "create-note": {
        await apiClient.notes.noteCreate({
          namespace: NoteNamespace.GOAL,
          source_entity_ref_id: id,
          content: [],
        });

        return redirect(`/app/workspace/life-plan/goals/${id}`);
      }

      case "archive": {
        await apiClient.lifePlan.goalArchive({
          ref_id: id,
        });

        return redirect(`/app/workspace/life-plan/goals`);
      }

      case "remove": {
        await apiClient.lifePlan.goalRemove({
          ref_id: id,
        });

        return redirect(`/app/workspace/life-plan/goals`);
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

    throw error;
  }
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

export default function GoalView() {
  const loaderData = useLoaderDataForAnimation<typeof loader>();
  const actionData = useActionData<typeof action>();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const navigation = useNavigation();

  const inputsEnabled =
    navigation.state === "idle" && !loaderData.goal.archived;

  const [selectedAspectRefId, setSelectedAspectRefId] = useState<string>(
    loaderData.goal.aspect_ref_id,
  );
  const [selectedParentGoalRefId, setSelectedParentGoalRefId] = useState<
    string | null
  >(loaderData.goal.parent_goal_ref_id ?? null);

  const parentGoalCandidates = loaderData.allGoals.filter(
    (g) => g.ref_id !== loaderData.goal.ref_id,
  );

  return (
    <LeafPanel
      key={`goal-${loaderData.goal.ref_id}`}
      isLeaflet
      fakeKey={`goals-${loaderData.goal.ref_id}`}
      showArchiveAndRemoveButton
      inputsEnabled={inputsEnabled}
      entityArchived={loaderData.goal.archived}
      returnLocation="/app/workspace/life-plan/goals"
    >
      <GlobalError actionResult={actionData} />

      <SectionCard
        title="Properties"
        actions={
          <SectionActions
            id="goal-properties"
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
        <Stack direction="row" spacing={1}>
          <FormControl fullWidth sx={{ flexGrow: 3 }}>
            <InputLabel id="name">Name</InputLabel>
            <OutlinedInput
              label="name"
              name="name"
              readOnly={!inputsEnabled}
              disabled={!inputsEnabled}
              defaultValue={loaderData.goal.name}
            />
            <FieldError actionResult={actionData} fieldName="/name" />
          </FormControl>

          <FormControl fullWidth sx={{ flexGrow: 2 }}>
            <TagsEditor
              name="tags"
              label={null}
              allTags={loaderData.allTags}
              defaultValue={loaderData.tags.map((tag: Tag) => tag.ref_id)}
              inputsEnabled={inputsEnabled}
              namespace={TagNamespace.GOAL}
              sourceEntityRefId={loaderData.goal.ref_id}
            />
          </FormControl>
        </Stack>

        <FormControl fullWidth>
          <AspectSelect
            name="aspect"
            label="Aspect"
            inputsEnabled={inputsEnabled}
            disabled={false}
            allAspects={loaderData.allAspects}
            value={selectedAspectRefId}
            onChange={(newAspectRefId) => {
              setSelectedAspectRefId(newAspectRefId);
              setSelectedParentGoalRefId(null);
            }}
          />
          <FieldError actionResult={actionData} fieldName="/aspect_ref_id" />
        </FormControl>

        <FormControl fullWidth>
          <GoalSelect
            name="parent_goal"
            label="Parent Goal"
            inputsEnabled={inputsEnabled}
            disabled={false}
            onlyForAspect={selectedAspectRefId}
            allGoals={parentGoalCandidates}
            value={selectedParentGoalRefId}
            onChange={(newValue) => setSelectedParentGoalRefId(newValue)}
          />
          <FieldError
            actionResult={actionData}
            fieldName="/parent_goal_ref_id"
          />
        </FormControl>
      </SectionCard>

      <SectionCard
        title="Note"
        actions={
          <SectionActions
            id="goal-note"
            topLevelInfo={topLevelInfo}
            inputsEnabled={inputsEnabled}
            actions={[
              ActionSingle({
                text: "Create Note",
                value: "create-note",
                highlight: false,
                disabled: loaderData.note !== null,
              }),
            ]}
          />
        }
      >
        {loaderData.note && (
          <EntityNoteEditor
            initialNote={loaderData.note}
            inputsEnabled={inputsEnabled}
          />
        )}
      </SectionCard>
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary(
  "/app/workspace/life-plan/goals",
  ParamsSchema,
  {
    notFound: () => `Could not find the goal!`,
    error: () => `There was an error loading the goal! Please try again!`,
  },
);
