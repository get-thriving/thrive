import { ApiError } from "@jupiter/webapi-client";
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { useActionData, useNavigation } from "@remix-run/react";
import { StatusCodes } from "http-status-codes";
import { useContext, useState } from "react";
import { z } from "zod";
import { parseForm } from "zodix";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { FieldError, GlobalError } from "@jupiter/core/infra/component/errors";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import {
  ActionSingle,
  ButtonSingle,
  NavSingle,
  SectionActions,
  ActionsExpansion,
} from "@jupiter/core/infra/component/section-actions";
import {
  noErrorSomeData,
  validationErrorToUIErrorInfo,
} from "@jupiter/core/infra/action-result";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";

import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { getLoggedInApiClient } from "~/api-clients.server";

const ParamsSchema = z.object({});

const CreateFormSchema = z.object({
  intent: z.string().optional(),
  name: z.string(),
});

export const handle = {
  displayType: DisplayType.LEAF,
};

export async function action({ request }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const form = await parseForm(request, CreateFormSchema);

  try {
    const result = await apiClient.apiKey.aPiKeyCreate({ name: form.name });
    return json(noErrorSomeData({ created: true, apiKey: result.api_key }));
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

export default function NewApiKey() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const inputsEnabled = navigation.state === "idle";

  const [hasCopied, setHasCopied] = useState(false);

  const successData =
    actionData?.theType === "no-error-some-data" ? actionData.data : null;
  const created = successData?.created === true;
  const apiKey = successData?.apiKey ?? null;

  async function copyToClipboard() {
    if (apiKey) {
      await navigator.clipboard.writeText(apiKey);
      setHasCopied(true);
    }
  }

  return (
    <LeafPanel
      key="manage-api/new"
      fakeKey="manage-api/new"
      returnLocation="/app/workspace/manage-api"
      inputsEnabled={inputsEnabled}
    >
      <SectionCard
        title="New API Key"
        actions={
          <SectionActions
            id="api-key-create"
            topLevelInfo={topLevelInfo}
            inputsEnabled={inputsEnabled}
            expansion={created ? ActionsExpansion.ALWAYS_SHOW : undefined}
            actions={
              created
                ? [
                    ButtonSingle({
                      text: hasCopied ? "Copied" : "Copy",
                      onClick: copyToClipboard,
                      disabled: hasCopied,
                      highlight: true,
                    }),
                    NavSingle({
                      text: "Close",
                      link: "/app/workspace/manage-api",
                    }),
                  ]
                : [
                    ActionSingle({
                      text: "Create",
                      value: "create",
                      highlight: true,
                    }),
                  ]
            }
          />
        }
      >
        <GlobalError actionResult={actionData} />

        {!created ? (
          <FormControl fullWidth>
            <InputLabel id="name">Name</InputLabel>
            <OutlinedInput label="Name" name="name" readOnly={!inputsEnabled} />
            <FieldError actionResult={actionData} fieldName="/name" />
          </FormControl>
        ) : apiKey ? (
          <>
            <Typography variant="body1">
              This is your new API key. <em>Store it in a safe place!</em> You
              won&apos;t be able to see it again.
            </Typography>
            <ApiKeyBox variant="body2">{apiKey}</ApiKeyBox>
          </>
        ) : null}
      </SectionCard>
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary(
  "/app/workspace/manage-api",
  ParamsSchema,
  {
    error: () => `There was an error creating the API key! Please try again!`,
  },
);

const ApiKeyBox = styled(Typography)(({ theme }) => ({
  marginTop: "1rem",
  padding: "0.5rem",
  textAlign: "center",
  fontSize: "0.8rem",
  borderRadius: "0.25rem",
  backgroundColor: theme.palette.success.dark,
  color: theme.palette.success.contrastText,
}));
