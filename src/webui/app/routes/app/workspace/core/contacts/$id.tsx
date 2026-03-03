import type { Contact } from "@jupiter/webapi-client";
import { ApiError } from "@jupiter/webapi-client";
import { FormControl, InputLabel, OutlinedInput } from "@mui/material";
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
    const result = await apiClient.contacts.contactLoad({
      ref_id: id,
      allow_archived: true,
    });

    return json({
      contact: result.contact as Contact,
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
        await apiClient.contacts.contactUpdate({
          ref_id: id,
          name: {
            should_change: true,
            value: form.name,
          },
        });

        return redirect(`/app/workspace/core/contacts/${id}`);
      }

      case "archive": {
        await apiClient.contacts.contactArchive({
          ref_id: id,
        });

        return redirect(`/app/workspace/core/contacts/${id}`);
      }

      case "remove": {
        await apiClient.contacts.contactRemove({
          ref_id: id,
        });

        return redirect(`/app/workspace/core/contacts`);
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

    if (error instanceof ApiError && error.status === StatusCodes.CONFLICT) {
          return json(validationErrorToUIErrorInfo(error.body));
        }

    throw error;
  }
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

export default function ContactDetail() {
  const actionData = useActionData<typeof action>();
  const loaderData = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const { id } = useParams();
  const inputsEnabled = navigation.state === "idle";

  const contact = loaderData.contact;

  return (
    <LeafPanel
      key={`core/contacts/${contact.ref_id}`}
      fakeKey={`core/contacts/${contact.ref_id}`}
      returnLocation="/app/workspace/core/contacts"
      inputsEnabled={inputsEnabled}
      showArchiveAndRemoveButton
      entityArchived={contact.archived}
    >
      <GlobalError actionResult={actionData} />

      <SectionCard
        title={`Contact ${contact.name}`}
        actions={
          <SectionActions
            id={`contact-${contact.ref_id}-actions`}
            topLevelInfo={topLevelInfo}
            inputsEnabled={inputsEnabled}
            actions={[
              ActionSingle({
                id: "contact-update",
                text: "Update",
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
            defaultValue={contact.name}
            readOnly={!inputsEnabled}
          />
          <FieldError actionResult={actionData} fieldName="/name/value" />
        </FormControl>

        {/* Helpful for actions coming from LeafPanel dialog as well */}
        <input name="id" type="hidden" value={id ?? contact.ref_id} />
      </SectionCard>
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary(
  `/app/workspace/core/contacts`,
  ParamsSchema,
  {
    notFound: (params) => `Could not find contact #${params.id}!`,
    error: (params) =>
      `There was an error loading contact #${params.id}! Please try again!`,
  },
);
