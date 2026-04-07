import { ApiError, NamedEntityTag } from "@jupiter/webapi-client";
import { FormControl, InputLabel, OutlinedInput } from "@mui/material";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { useActionData, useNavigation } from "@remix-run/react";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
import { useContext } from "react";
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
    const result = await apiClient.prm.circleLoad({
      ref_id: id,
      allow_archived: true,
    });

    return json({
      circle: result.circle,
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
        await apiClient.prm.circleUpdate({
          ref_id: id,
          name: {
            should_change: true,
            value: form.name,
          },
        });
        return redirect(`/app/workspace/prm/circles/${id}`);
      }

      case "archive": {
        await apiClient.prm.circleArchive({
          ref_id: id,
        });
        return redirect(`/app/workspace/prm/circles`);
      }

      case "remove": {
        await apiClient.prm.circleRemove({
          ref_id: id,
        });
        return redirect(`/app/workspace/prm/circles`);
      }
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

export default function Circle() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const topLevelInfo = useContext(TopLevelInfoContext);

  const circle = loaderData.circle;
  const inputsEnabled = navigation.state === "idle" && !circle.archived;

  return (
    <LeafPanel
      key={`circle-${circle.ref_id}`}
      entityType={NamedEntityTag.CIRCLE}
      entityRefId={circle.ref_id}
      fakeKey={`circle-${circle.ref_id}`}
      showArchiveAndRemoveButton
      inputsEnabled={inputsEnabled}
      entityArchived={circle.archived}
      returnLocation="/app/workspace/prm/circles"
    >
      <GlobalError actionResult={actionData} />
      <SectionCard
        title="Properties"
        actions={
          <SectionActions
            id="circle-properties"
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
        <FormControl fullWidth>
          <InputLabel id="name">Name</InputLabel>
          <OutlinedInput
            label="Name"
            name="name"
            readOnly={!inputsEnabled}
            defaultValue={circle.name}
          />
          <FieldError actionResult={actionData} fieldName="/name" />
        </FormControl>
      </SectionCard>
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary(
  "/app/workspace/prm/circles",
  ParamsSchema,
  {
    notFound: (params) => `Could not find circle with ID ${params.id}!`,
    error: (params) =>
      `There was an error loading circle with ID ${params.id}! Please try again!`,
  },
);
