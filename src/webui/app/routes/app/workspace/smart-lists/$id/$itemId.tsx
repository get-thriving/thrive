import type { Contact, Tag } from "@jupiter/webapi-client";
import { NamedEntityTag, ApiError, TagNamespace } from "@jupiter/webapi-client";
import {
  FormControl,
  FormControlLabel,
  InputLabel,
  OutlinedInput,
  Switch,
  Stack,
} from "@mui/material";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { useActionData, useNavigation, useParams } from "@remix-run/react";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { z } from "zod";
import { CheckboxAsString, parseForm, parseParams } from "zodix";
import { useContext } from "react";
import { EntityNoteEditor } from "@jupiter/core/infra/component/entity-note-editor";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { FieldError, GlobalError } from "@jupiter/core/infra/component/errors";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import { TagsEditor } from "@jupiter/core/common/sub/tags/component/tags-editor";
import { ContactsEditor } from "@jupiter/core/common/sub/contacts/component/contacts-editor";
import { entityLinkStd } from "@jupiter/core/common/entity-link";
import { useBigScreen } from "@jupiter/core/infra/component/use-big-screen";
import { validationErrorToUIErrorInfo } from "@jupiter/core/infra/action-result";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import {
  ActionSingle,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import { noteStdOwner } from "#/core/common/sub/notes/note-std-owner";

import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { getLoggedInApiClient } from "~/api-clients.server";

const ParamsSchema = z.object({
  id: z.string(),
  itemId: z.string(),
});

const UpdateFormSchema = z.discriminatedUnion("intent", [
  z.object({
    intent: z.literal("update"),
    name: z.string(),
    isDone: CheckboxAsString,
    url: z
      .string()
      .transform((s) => (s === "" ? undefined : s))
      .optional(),
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
  const { itemId } = parseParams(params, ParamsSchema);

  try {
    const result = await apiClient.smartLists.smartListItemLoad({
      ref_id: itemId,
      allow_archived: true,
    });

    const allTags = await apiClient.tags.tagFind({
      allow_archived: false,
      filter_namespace: [TagNamespace.SMART_LIST_ITEM],
    });
    const allContacts = await apiClient.contacts.contactFind({
      allow_archived: false,
    });

    return json({
      item: result.item,
      genericTags: result.generic_tags as Array<Tag>,
      contacts:
        (
          result as {
            contacts?: Array<Contact>;
          }
        ).contacts ?? [],
      allTags: allTags.tags as Array<Tag>,
      allContacts: allContacts.contacts as Array<Contact>,
      note: result.note,
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

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

export async function action({ request, params }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const { id, itemId } = parseParams(params, ParamsSchema);
  const form = await parseForm(request, UpdateFormSchema);

  try {
    switch (form.intent) {
      case "update": {
        await apiClient.smartLists.smartListItemUpdate({
          ref_id: itemId,
          name: {
            should_change: true,
            value: form.name,
          },
          is_done: {
            should_change: true,
            value: form.isDone,
          },
          url: {
            should_change: true,
            value: form.url,
          },
        });

        return redirect(`/app/workspace/smart-lists/${id}`);
      }

      case "create-note": {
        await apiClient.notes.noteCreate({
          owner: noteStdOwner(NamedEntityTag.SMART_LIST_ITEM, itemId),
          content: [],
        });

        return redirect(`/app/workspace/smart-lists/${id}/${itemId}`);
      }

      case "archive": {
        await apiClient.smartLists.smartListItemArchive({
          ref_id: itemId,
        });

        return redirect(`/app/workspace/smart-lists/${id}`);
      }

      case "remove": {
        await apiClient.smartLists.smartListItemRemove({
          ref_id: itemId,
        });

        return redirect(`/app/workspace/smart-lists/${id}`);
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

export default function SmartListItem() {
  const { id } = useParams();
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const isBigScreen = useBigScreen();

  const inputsEnabled =
    navigation.state === "idle" && !loaderData.item.archived;

  return (
    <LeafPanel
      key={`smart-list-${id}/item-${loaderData.item.ref_id}`}
      entityType={NamedEntityTag.SMART_LIST_ITEM}
      entityRefId={loaderData.item.ref_id}
      fakeKey={`smart-list-${id}/item-${loaderData.item.ref_id}`}
      showArchiveAndRemoveButton
      inputsEnabled={inputsEnabled}
      entityArchived={loaderData.item.archived}
      returnLocation={`/app/workspace/smart-lists/${id}`}
    >
      <GlobalError actionResult={actionData} />
      <SectionCard
        title="Properties"
        actions={
          <SectionActions
            id="email-task-actions"
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
        <Stack direction="row" useFlexGap spacing={1}>
          <FormControl fullWidth sx={{ flexGrow: 1 }}>
            <InputLabel id="name">Name</InputLabel>
            <OutlinedInput
              label="Name"
              defaultValue={loaderData.item.name}
              name="name"
              readOnly={!inputsEnabled}
            />

            <FieldError actionResult={actionData} fieldName="/name" />
          </FormControl>
        </Stack>

        <Stack direction={isBigScreen ? "row" : "column"} spacing={2}>
          <FormControl sx={{ flexGrow: 1, minWidth: "25%" }}>
            <TagsEditor
              name="generic_tags_names"
              aloneOnLine
              allTags={loaderData.allTags}
              defaultValue={loaderData.genericTags.map((t) => t.ref_id)}
              inputsEnabled={inputsEnabled}
              namespace={TagNamespace.SMART_LIST_ITEM}
              sourceEntityRefId={loaderData.item.ref_id}
              label="Tags"
            />
          </FormControl>

          <FormControl sx={{ flexGrow: 1, minWidth: "25%" }}>
            <ContactsEditor
              name="contacts_names"
              aloneOnLine
              allContacts={loaderData.allContacts}
              defaultValue={loaderData.contacts.map((c) => c.ref_id)}
              inputsEnabled={inputsEnabled}
              owner={entityLinkStd(
                NamedEntityTag.SMART_LIST_ITEM,
                loaderData.item.ref_id,
              )}
              label="Contacts"
            />
          </FormControl>
        </Stack>

        <FormControl fullWidth>
          <FormControlLabel
            control={
              <Switch
                name="isDone"
                readOnly={!inputsEnabled}
                disabled={!inputsEnabled}
                defaultChecked={loaderData.item.is_done}
              />
            }
            label="Is Done"
          />
          <FieldError actionResult={actionData} fieldName="/is_done" />
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="url">Url [Optional]</InputLabel>
          <OutlinedInput
            label="Url"
            name="url"
            readOnly={!inputsEnabled}
            defaultValue={loaderData.item.url}
          />
          <FieldError actionResult={actionData} fieldName="/url" />
        </FormControl>
      </SectionCard>

      <SectionCard
        title="Note"
        actions={
          <SectionActions
            id="smart-list-item-note"
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
  "/app/workspace/smart-lists",
  ParamsSchema,
  {
    notFound: (params) =>
      `Could not find item ${params.itemId} in smart list ${params.id}!`,
    error: (params) =>
      `There was an error loading item ${params.itemId} in smart list ${params.id}! Please try again!`,
  },
);
