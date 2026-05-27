import { ApiError, NamedEntityTag } from "@jupiter/webapi-client";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { useActionData, useNavigation } from "@remix-run/react";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
import { EntityNoteEditor } from "@jupiter/core/infra/component/entity-note-editor";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { GlobalError } from "@jupiter/core/infra/component/errors";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import { validationErrorToUIErrorInfo } from "@jupiter/core/infra/action-result";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import {
  isVisionActivable,
  isVisionEditable,
} from "#/core/life_plan/sub/visions/root";
import {
  ActionSingle,
  SectionActions,
} from "#/core/infra/component/section-actions";
import { useContext } from "react";
import { TopLevelInfoContext } from "#/core/infra/top-level-context";

import { getLoggedInApiClient } from "~/api-clients.server";
import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";

const ParamsSchema = z.object({
  id: z.string(),
});

const UpdateFormSchema = z.discriminatedUnion("intent", [
  z.object({ intent: z.literal("mark-draft-as-active") }),
  z.object({ intent: z.literal("archive") }),
  z.object({ intent: z.literal("remove") }),
]);

export const handle = {
  displayType: DisplayType.LEAFLET,
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const { id } = parseParams(params, ParamsSchema);

  try {
    const result = await apiClient.lifePlan.visionLoad({
      ref_id: id,
      allow_archived: true,
    });

    return json({
      vision: result.vision,
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

export async function action({ request, params }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const { id } = parseParams(params, ParamsSchema);
  const form = await parseForm(request, UpdateFormSchema);

  try {
    switch (form.intent) {
      case "mark-draft-as-active": {
        await apiClient.lifePlan.visionMarkDraftAsActive({
          ref_id: id,
        });
        return redirect(`/app/workspace/life-plan`);
      }

      case "archive": {
        await apiClient.lifePlan.visionArchive({
          ref_id: id,
        });
        return redirect(`/app/workspace/life-plan`);
      }

      case "remove": {
        await apiClient.lifePlan.visionRemove({
          ref_id: id,
        });
        return redirect(`/app/workspace/life-plan`);
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

export default function Vision() {
  const topLevelInfo = useContext(TopLevelInfoContext);
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();

  const inputsEnabled =
    navigation.state === "idle" && !loaderData.vision.archived;
  const noteInputsEnabled =
    inputsEnabled && isVisionEditable(loaderData.vision);
  const isActivable = isVisionActivable(loaderData.vision);

  return (
    <LeafPanel
      key={`vision-${loaderData.vision.ref_id}`}
      entityType={NamedEntityTag.VISION}
      entityRefId={loaderData.vision.ref_id}
      fakeKey={`vision-${loaderData.vision.ref_id}`}
      showArchiveAndRemoveButton
      isLeaflet
      inputsEnabled={inputsEnabled}
      entityArchived={loaderData.vision.archived}
      returnLocation="/app/workspace/life-plan/visions"
    >
      <GlobalError actionResult={actionData} />

      <SectionCard
        title="Vision"
        actions={
          <SectionActions
            id="vision-actions"
            topLevelInfo={topLevelInfo}
            inputsEnabled={inputsEnabled}
            actions={[
              ActionSingle({
                text: "Mark as Active",
                value: "mark-draft-as-active",
                highlight: true,
                disabled: !isActivable,
              }),
            ]}
          />
        }
      >
        <EntityNoteEditor
          initialNote={loaderData.note}
          inputsEnabled={noteInputsEnabled}
        />
      </SectionCard>
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary(
  "/app/workspace/life-plan/visions",
  ParamsSchema,
  {
    notFound: (params) => `Could not find vision #${params.id}!`,
    error: (params) =>
      `There was an error loading vision #${params.id}! Please try again!`,
  },
);
