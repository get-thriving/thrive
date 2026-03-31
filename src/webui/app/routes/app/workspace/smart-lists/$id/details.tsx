import type { Tag } from "@jupiter/webapi-client";
import { ApiError, NoteNamespace, TagNamespace } from "@jupiter/webapi-client";
import { FormControl, InputLabel, OutlinedInput, Stack } from "@mui/material";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { useActionData, useNavigation, useParams } from "@remix-run/react";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
import { useContext } from "react";
import { EntityNoteEditor } from "@jupiter/core/infra/component/entity-note-editor";
import { IconSelector } from "@jupiter/core/infra/component/icon-selector";
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
import { TagsEditor } from "@jupiter/core/common/sub/tags/component/tags-editor";
import { useBigScreen } from "@jupiter/core/infra/component/use-big-screen";

import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { getLoggedInApiClient } from "~/api-clients.server";

const ParamsSchema = z.object({
  id: z.string(),
});

const UpdateFormSchema = z.discriminatedUnion("intent", [
  z.object({
    intent: z.literal("update"),
    name: z.string(),
    icon: z.string().optional(),
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
  displayType: DisplayType.LEAF,
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const { id } = parseParams(params, ParamsSchema);

  try {
    const response = await apiClient.smartLists.smartListLoad({
      ref_id: id,
      include_item_tags_and_notes: false,
      allow_archived: true,
      allow_archived_items: false,
      allow_archived_tags: false,
    });

    const allTags = await apiClient.tags.tagFind({
      allow_archived: false,
      filter_namespace: [TagNamespace.SMART_LIST],
    });

    return json({
      smartList: response.smart_list,
      note: response.note,
      tags: response.tags as Array<Tag>,
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
      case "update": {
        await apiClient.smartLists.smartListUpdate({
          ref_id: id,
          name: {
            should_change: true,
            value: form.name,
          },
          icon: {
            should_change: true,
            value: form.icon,
          },
        });

        return redirect(`/app/workspace/smart-lists/${id}`);
      }

      case "create-note": {
        await apiClient.notes.noteCreate({
          namespace: NoteNamespace.SMART_LIST,
          source_entity_ref_id: id,
          content: [],
        });

        return redirect(`/app/workspace/smart-lists/${id}/details`);
      }

      case "archive": {
        await apiClient.smartLists.smartListArchive({
          ref_id: id,
        });

        return redirect(`/app/workspace/smart-lists/${id}`);
      }

      case "remove": {
        await apiClient.smartLists.smartListRemove({
          ref_id: id,
        });

        return redirect(`/app/workspace/smart-lists`);
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

export default function SmartListDetails() {
  const { id } = useParams();
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const isBigScreen = useBigScreen();

  const inputsEnabled =
    navigation.state === "idle" && !loaderData.smartList.archived;

  return (
    <LeafPanel
      key={`smart-list-${id}/details`}
      fakeKey={`smart-list-${id}/details`}
      showArchiveAndRemoveButton
      inputsEnabled={inputsEnabled}
      entityArchived={loaderData.smartList.archived}
      returnLocation={`/app/workspace/smart-lists/${id}`}
    >
      <GlobalError actionResult={actionData} />
      <SectionCard
        title="Properties"
        actions={
          <SectionActions
            id="smart-list-properties"
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
        <Stack
          direction={isBigScreen ? "row" : "column"}
          useFlexGap
          spacing={1}
        >
          <FormControl fullWidth sx={{ flexGrow: 1 }}>
            <InputLabel id="name">Name</InputLabel>
            <OutlinedInput
              label="Name"
              name="name"
              readOnly={!inputsEnabled}
              defaultValue={loaderData.smartList.name}
            />
            <FieldError actionResult={actionData} fieldName="/name" />
          </FormControl>

          <FormControl fullWidth sx={{ flexGrow: 1 }}>
            <TagsEditor
              name="tags_names"
              aloneOnLine={!isBigScreen}
              allTags={loaderData.allTags}
              defaultValue={loaderData.tags.map((t) => t.ref_id)}
              inputsEnabled={inputsEnabled}
              namespace={TagNamespace.SMART_LIST}
              sourceEntityRefId={loaderData.smartList.ref_id}
            />
          </FormControl>
        </Stack>

        <FormControl fullWidth>
          <InputLabel id="icon">Icon</InputLabel>
          <IconSelector
            readOnly={!inputsEnabled}
            defaultIcon={loaderData.smartList.icon}
          />
          <FieldError actionResult={actionData} fieldName="/icon" />
        </FormControl>
      </SectionCard>

      <SectionCard
        title="Note"
        actions={
          <SectionActions
            id="smart-list-note"
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
  (params) => `/app/workspace/smart-lists/${params.id}`,
  ParamsSchema,
  {
    notFound: (params) =>
      `Could not find smart list item details for #${params.id}!`,
    error: (params) =>
      `There was an error loading smart list item details for #${params.id}! Please try again!`,
  },
);
