import type { Person } from "@jupiter/webapi-client";
import { ApiError } from "@jupiter/webapi-client";
import { FormControl, InputLabel, OutlinedInput, Stack } from "@mui/material";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import {
  useActionData,
  useLoaderData,
  useNavigation,
  useParams,
} from "@remix-run/react";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { useContext } from "react";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { FieldError, GlobalError } from "@jupiter/core/infra/component/errors";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import {
  ActionSingle,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import { validationErrorToUIErrorInfo } from "@jupiter/core/infra/action-result";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import { PersonNamespaceTag } from "#/core/common/sub/persons/component/person-namespace-tag";

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
    const result = await apiClient.persons.personLoad({
      ref_id: id,
      allow_archived: true,
    });

    return json({
      person: result.person as Person,
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
        await apiClient.persons.personUpdate({
          ref_id: id,
          name: {
            should_change: true,
            value: form.name,
          },
        });

        return redirect(`/app/workspace/core/persons/${id}`);
      }

      case "archive": {
        await apiClient.persons.personArchive({
          ref_id: id,
        });

        return redirect(`/app/workspace/core/persons/${id}`);
      }

      case "remove": {
        await apiClient.persons.personRemove({
          ref_id: id,
        });

        return redirect(`/app/workspace/core/persons`);
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

export default function PersonDetail() {
  const actionData = useActionData<typeof action>();
  const loaderData = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const { id } = useParams();
  const inputsEnabled = navigation.state === "idle";

  const person = loaderData.person;

  return (
    <LeafPanel
      key={`core/persons/${person.ref_id}`}
      fakeKey={`core/persons/${person.ref_id}`}
      returnLocation="/app/workspace/core/persons"
      inputsEnabled={inputsEnabled}
      showArchiveAndRemoveButton
      entityArchived={person.archived}
    >
      <GlobalError actionResult={actionData} />

      <SectionCard
        title={`Person ${person.name}`}
        actions={
          <SectionActions
            id={`person-${person.ref_id}-actions`}
            topLevelInfo={topLevelInfo}
            inputsEnabled={inputsEnabled}
            actions={[
              ActionSingle({
                id: "person-update",
                text: "Update",
                value: "update",
                highlight: true,
              }),
            ]}
          />
        }
      >
        <Stack direction="row" spacing={2}>
          <FormControl fullWidth sx={{ flexGrow: 1 }}>
            <PersonNamespaceTag namespace={person.namespace} />
          </FormControl>
          <FormControl fullWidth sx={{ flexGrow: 2 }}>
            <InputLabel id="name">Name</InputLabel>
            <OutlinedInput
              label="Name"
              name="name"
              defaultValue={person.name}
              readOnly={!inputsEnabled}
            />
            <FieldError actionResult={actionData} fieldName="/name/value" />
            <FieldError actionResult={actionData} fieldName="/name" />
          </FormControl>
        </Stack>

        {/* Helpful for actions coming from LeafPanel dialog as well */}
        <input name="id" type="hidden" value={id ?? person.ref_id} />
      </SectionCard>
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary(
  `/app/workspace/core/persons`,
  ParamsSchema,
  {
    notFound: (params) => `Could not find person #${params.id}!`,
    error: (params) =>
      `There was an error loading person #${params.id}! Please try again!`,
  },
);
