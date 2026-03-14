import {
  ApiError,
  LifePlan,
  MilestoneSummary,
  NoteNamespace,
  AspectSummary,
  type Tag,
  TagNamespace,
} from "@jupiter/webapi-client";
import {
  FormControl,
  FormLabel,
  InputLabel,
  OutlinedInput,
  Stack,
} from "@mui/material";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { useActionData, useNavigation } from "@remix-run/react";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { useContext } from "react";
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
  SectionActions,
  ActionSingle,
} from "@jupiter/core/infra/component/section-actions";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import { PartialDateSelect } from "#/core/life_plan/component/partial-date-select";
import { AspectSelect } from "#/core/life_plan/sub/aspects/component/select";
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
    startDate: z.string(),
    endDate: z.string(),
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
    include_life_plan: true,
    include_aspects: true,
    include_milestones: true,
  });

  try {
    const allTags = await apiClient.tags.tagFind({
      allow_archived: false,
      filter_namespace: [TagNamespace.CHAPTER],
    });

    const response = await apiClient.lifePlan.chapterLoad({
      ref_id: id,
      allow_archived: true,
    });

    return json({
      lifePlan: summaryResponse.life_plan as LifePlan,
      allMilestones: summaryResponse.milestones as MilestoneSummary[],
      allAspects: summaryResponse.aspects as Array<AspectSummary>,
      rootAspect: summaryResponse.root_aspect as AspectSummary,
      chapter: response.chapter,
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
        await apiClient.lifePlan.chapterUpdate({
          ref_id: id,
          name: {
            should_change: true,
            value: form.name,
          },
          aspect_ref_id: {
            should_change: true,
            value: form.aspect,
          },
          start_date: {
            should_change: true,
            value: form.startDate,
          },
          end_date: {
            should_change: true,
            value: form.endDate,
          },
        });

        return redirect(`/app/workspace/life-plan/chapters/${id}`);
      }

      case "create-note": {
        await apiClient.notes.noteCreate({
          namespace: NoteNamespace.CHAPTER,
          source_entity_ref_id: id,
          content: [],
        });

        return redirect(`/app/workspace/life-plan/chapters/${id}`);
      }

      case "archive": {
        await apiClient.lifePlan.chapterArchive({
          ref_id: id,
        });

        return redirect(`/app/workspace/life-plan/chapters`);
      }

      case "remove": {
        await apiClient.lifePlan.chapterRemove({
          ref_id: id,
        });

        return redirect(`/app/workspace/life-plan/chapters`);
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

export default function Chapter() {
  const loaderData = useLoaderDataForAnimation<typeof loader>();
  const actionData = useActionData<typeof action>();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const navigation = useNavigation();

  const inputsEnabled =
    navigation.state === "idle" && !loaderData.chapter.archived;

  return (
    <LeafPanel
      key={`chapter-${loaderData.chapter.ref_id}`}
      isLeaflet
      fakeKey={`chapters-${loaderData.chapter.ref_id}`}
      showArchiveAndRemoveButton
      inputsEnabled={inputsEnabled}
      entityArchived={loaderData.chapter.archived}
      returnLocation="/app/workspace/life-plan/chapters"
    >
      <GlobalError actionResult={actionData} />
      <SectionCard
        title="Properties"
        actions={
          <SectionActions
            id="chapter-properties"
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
              defaultValue={loaderData.chapter.name}
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
              namespace={TagNamespace.CHAPTER}
              sourceEntityRefId={loaderData.chapter.ref_id}
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
            defaultValue={loaderData.chapter.aspect_ref_id}
          />
        </FormControl>

        <FormControl fullWidth>
          <FormLabel id="startDate">Start Date</FormLabel>
          <PartialDateSelect
            maxAge={loaderData.lifePlan.max_age}
            name="startDate"
            initialDate={loaderData.chapter.start_date}
            inputsEnabled={inputsEnabled}
            allMilestones={loaderData.allMilestones}
          />
          <FieldError actionResult={actionData} fieldName="/start_date" />
        </FormControl>

        <FormControl fullWidth>
          <FormLabel id="endDate">End Date</FormLabel>
          <PartialDateSelect
            maxAge={loaderData.lifePlan.max_age}
            name="endDate"
            initialDate={loaderData.chapter.end_date}
            inputsEnabled={inputsEnabled}
            allMilestones={loaderData.allMilestones}
          />
          <FieldError actionResult={actionData} fieldName="/end_date" />
        </FormControl>
      </SectionCard>

      <SectionCard
        title="Note"
        actions={
          <SectionActions
            id="chapter-note"
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
  "/app/workspace/life-plan/chapters",
  ParamsSchema,
  {
    notFound: (params) => `Could not find chapter with ID ${params.id}!`,
    error: (params) =>
      `There was an error loading chapter with ID ${params.id}! Please try again!`,
  },
);
