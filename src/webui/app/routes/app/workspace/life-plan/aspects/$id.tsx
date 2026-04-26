import type { AspectSummary, Tag } from "@jupiter/webapi-client";
import { NamedEntityTag, ApiError } from "@jupiter/webapi-client";
import { FormControl, InputLabel, OutlinedInput, Stack } from "@mui/material";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { useActionData, useNavigation } from "@remix-run/react";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { useContext, useEffect, useState } from "react";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
import { isRootAspect } from "#/core/life_plan/sub/aspects/root";
import { EntityNoteEditor } from "@jupiter/core/infra/component/entity-note-editor";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { FieldError, GlobalError } from "@jupiter/core/infra/component/errors";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import { AspectSelect } from "@jupiter/core/life_plan/sub/aspects/component/select";
import { validationErrorToUIErrorInfo } from "@jupiter/core/infra/action-result";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import {
  SectionActions,
  ActionSingle,
} from "@jupiter/core/infra/component/section-actions";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import { entityLinkStd } from "@jupiter/core/common/entity-link";
import { TagsEditor } from "#/core/common/sub/tags/component/tags-editor";
import { useBigScreen } from "@jupiter/core/infra/component/use-big-screen";
import { noteStdOwner } from "#/core/common/sub/notes/note-std-owner";

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
    parentAspectRefId: z.string().optional(),
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
  });

  try {
    const allTags = await apiClient.tags.tagFind({
      allow_archived: false,
    });

    const response = await apiClient.lifePlan.aspectLoad({
      ref_id: id,
      allow_archived: true,
    });

    return json({
      rootAspect: summaryResponse.root_aspect as AspectSummary,
      allAspects: summaryResponse.aspects as Array<AspectSummary>,
      aspect: response.aspect,
      tags: response.tags,
      note: response.note,
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
        await apiClient.lifePlan.aspectUpdate({
          ref_id: id,
          name: {
            should_change: true,
            value: form.name,
          },
          parent_aspect_ref_id: {
            should_change: form.parentAspectRefId !== undefined,
            value: form.parentAspectRefId ?? null,
          },
        });

        return redirect(`/app/workspace/life-plan/aspects/${id}`);
      }

      case "create-note": {
        await apiClient.notes.noteCreate({
          owner: noteStdOwner(NamedEntityTag.ASPECT, id),
          content: [],
        });

        return redirect(`/app/workspace/life-plan/aspects/${id}`);
      }

      case "archive": {
        await apiClient.lifePlan.aspectArchive({
          ref_id: id,
        });

        return redirect(`/app/workspace/life-plan/aspects`);
      }

      case "remove": {
        await apiClient.lifePlan.aspectRemove({
          ref_id: id,
        });

        return redirect(`/app/workspace/life-plan/aspects`);
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

export default function Aspect() {
  const loaderData = useLoaderDataForAnimation<typeof loader>();
  const actionData = useActionData<typeof action>();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const isBigScreen = useBigScreen();
  const navigation = useNavigation();

  const inputsEnabled =
    navigation.state === "idle" && !loaderData.aspect.archived;

  const parentAspect = loaderData.allAspects.find(
    (aspect) => aspect.ref_id === loaderData.aspect.parent_aspect_ref_id,
  );
  const [selectedAspect, setSelectedAspect] = useState(
    parentAspect === undefined
      ? loaderData.rootAspect.ref_id
      : parentAspect.ref_id,
  );

  useEffect(() => {
    const parentAspect = loaderData.allAspects.find(
      (aspect) => aspect.ref_id === loaderData.aspect.parent_aspect_ref_id,
    );
    setSelectedAspect(
      parentAspect === undefined
        ? loaderData.rootAspect.ref_id
        : parentAspect.ref_id,
    );
  }, [loaderData]);

  return (
    <LeafPanel
      key={`aspect-${loaderData.aspect.ref_id}`}
      entityType={NamedEntityTag.ASPECT}
      entityRefId={loaderData.aspect.ref_id}
      isLeaflet
      fakeKey={`aspects-${loaderData.aspect.ref_id}`}
      showArchiveAndRemoveButton={!isRootAspect(loaderData.aspect)}
      inputsEnabled={inputsEnabled}
      entityArchived={loaderData.aspect.archived}
      returnLocation="/app/workspace/life-plan/aspects"
    >
      <GlobalError actionResult={actionData} />
      <SectionCard
        title="Properties"
        actions={
          <SectionActions
            id="aspect-properties"
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
        <Stack direction={isBigScreen ? "row" : "column"} spacing={1}>
          <FormControl fullWidth sx={{ flexGrow: 3 }}>
            <InputLabel id="name">Name</InputLabel>
            <OutlinedInput
              label="name"
              name="name"
              readOnly={!inputsEnabled}
              disabled={!inputsEnabled}
              defaultValue={loaderData.aspect.name}
            />
            <FieldError actionResult={actionData} fieldName="/name" />
          </FormControl>

          <FormControl fullWidth sx={{ flexGrow: 2 }}>
            <TagsEditor
              name="tags"
              label={null}
              aloneOnLine={!isBigScreen}
              allTags={loaderData.allTags}
              defaultValue={loaderData.tags.map((tag: Tag) => tag.ref_id)}
              inputsEnabled={inputsEnabled}
              owner={entityLinkStd(
                NamedEntityTag.ASPECT,
                loaderData.aspect.ref_id,
              )}
            />
          </FormControl>
        </Stack>

        {!isRootAspect(loaderData.aspect) && (
          <FormControl fullWidth>
            <AspectSelect
              name="parentAspectRefId"
              label="Parent Aspect"
              inputsEnabled={inputsEnabled}
              disabled={false}
              allAspects={loaderData.allAspects}
              value={selectedAspect}
              onChange={setSelectedAspect}
            />

            <FieldError
              actionResult={actionData}
              fieldName="/parent_aspect_ref_id"
            />
          </FormControl>
        )}
      </SectionCard>

      <SectionCard
        title="Note"
        actions={
          <SectionActions
            id="aspect-note"
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
          <>
            <EntityNoteEditor
              initialNote={loaderData.note}
              inputsEnabled={inputsEnabled}
            />
          </>
        )}
      </SectionCard>
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary(
  "/app/workspace/life-plan/aspects",
  ParamsSchema,
  {
    notFound: (params) => `Could not find aspect with ID ${params.id}!`,
    error: (params) =>
      `There was an error loading aspect with ID ${params.id}! Please try again!`,
  },
);
