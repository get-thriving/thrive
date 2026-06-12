import {
  ApiError,
  Contact,
  NamedEntityTag,
  Tag,
  WorkspaceFeature,
} from "@jupiter/webapi-client";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { useActionData, useNavigation } from "@remix-run/react";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { useContext } from "react";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
import { isWorkspaceFeatureAvailable } from "@jupiter/core/workspaces/root";
import { EntityNoteEditor } from "@jupiter/core/infra/component/entity-note-editor";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { GlobalError } from "@jupiter/core/infra/component/errors";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import { TimeEventFullDaysBlockStack } from "@jupiter/core/common/sub/time_events/sub/full_days_block/component/stack";
import { validationErrorToUIErrorInfo } from "@jupiter/core/infra/action-result";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import {
  ActionSingle,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import { VacationEditor } from "@jupiter/core/vacations/component/editor";
import { noteStdOwner } from "#/core/common/sub/notes/note-std-owner";

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
  z.object({
    intent: z.literal("create-publish"),
    publishOwner: z.string(),
  }),
  z.object({
    intent: z.literal("activate-publish"),
    publishEntityRefId: z.string(),
  }),
  z.object({
    intent: z.literal("to-draft-publish"),
    publishEntityRefId: z.string(),
  }),
]);

export const handle = {
  displayType: DisplayType.LEAF,
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const { id } = parseParams(params, ParamsSchema);

  try {
    const allTags = await apiClient.tags.tagFind({
      allow_archived: false,
    });
    const allContacts = await apiClient.contacts.contactFind({
      allow_archived: false,
    });

    const result = await apiClient.vacations.vacationLoad({
      ref_id: id,
      allow_archived: true,
    });

    return json({
      vacation: result.vacation,
      note: result.note,
      timeEventBlock: result.time_event_block,
      tags: result.tags,
      contacts: result.contacts ?? [],
      publishEntity: result.publish_entity ?? null,
      allTags: allTags.tags as Array<Tag>,
      allContacts: allContacts.contacts as Array<Contact>,
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
        await apiClient.vacations.vacationUpdate({
          ref_id: id,
          name: {
            should_change: true,
            value: form.name,
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

        return redirect(`/app/workspace/vacations`);
      }

      case "create-note": {
        await apiClient.notes.noteCreate({
          owner: noteStdOwner(NamedEntityTag.VACATION, id),
          content: [],
        });

        return redirect(`/app/workspace/vacations/${id}`);
      }

      case "archive": {
        await apiClient.vacations.vacationArchive({
          ref_id: id,
        });
        return redirect(`/app/workspace/vacations`);
      }

      case "remove": {
        await apiClient.vacations.vacationRemove({
          ref_id: id,
        });
        return redirect(`/app/workspace/vacations`);
      }

      case "create-publish": {
        await apiClient.publish.publishEntityCreate({
          owner: form.publishOwner,
        });

        return redirect(`/app/workspace/vacations/${id}`);
      }

      case "activate-publish": {
        await apiClient.publish.publishEntityActivate({
          ref_id: form.publishEntityRefId,
        });

        return redirect(`/app/workspace/vacations/${id}`);
      }

      case "to-draft-publish": {
        await apiClient.publish.publishEntityToDraft({
          ref_id: form.publishEntityRefId,
        });

        return redirect(`/app/workspace/vacations/${id}`);
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

export default function Vacation() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const topLevelInfo = useContext(TopLevelInfoContext);

  const inputsEnabled =
    navigation.state === "idle" && !loaderData.vacation.archived;

  const timeEventBlockEntry = {
    time_event: loaderData.timeEventBlock,
    entry: {
      vacation: loaderData.vacation,
      time_event: loaderData.timeEventBlock,
    },
  };

  return (
    <LeafPanel
      key={`vacation-${loaderData.vacation.ref_id}`}
      entityType={NamedEntityTag.VACATION}
      entityRefId={loaderData.vacation.ref_id}
      fakeKey={`vacation-${loaderData.vacation.ref_id}`}
      showArchiveAndRemoveButton
      inputsEnabled={inputsEnabled}
      entityArchived={loaderData.vacation.archived}
      returnLocation="/app/workspace/vacations"
      publishable
      publishEntity={loaderData.publishEntity ?? undefined}
    >
      <GlobalError actionResult={actionData} />
      <VacationEditor
        vacation={loaderData.vacation}
        tags={loaderData.tags}
        contacts={loaderData.contacts}
        allTags={loaderData.allTags}
        allContacts={loaderData.allContacts}
        inputsEnabled={inputsEnabled}
        topLevelInfo={topLevelInfo}
        actionResult={actionData}
      />

      {isWorkspaceFeatureAvailable(
        topLevelInfo.workspace,
        WorkspaceFeature.SCHEDULE,
      ) && (
        <TimeEventFullDaysBlockStack
          topLevelInfo={topLevelInfo}
          inputsEnabled={inputsEnabled}
          title="Time Events"
          entries={[timeEventBlockEntry]}
        />
      )}

      <SectionCard
        title="Note"
        actions={
          <SectionActions
            id="vacation-create-note"
            topLevelInfo={topLevelInfo}
            inputsEnabled={inputsEnabled}
            actions={[
              ActionSingle({
                id: "vacation-create-note",
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
  "/app/workspace/vacations",
  ParamsSchema,
  {
    notFound: (params) => `Could not find vacation #${params.id}!`,
    error: (params) =>
      `There was an error loading vacation #${params.id}! Please try again!`,
  },
);
