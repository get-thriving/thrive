import { ApiError } from "@jupiter/webapi-client";
import { FormControl, InputLabel } from "@mui/material";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { useActionData, useNavigation } from "@remix-run/react";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { parseForm } from "zodix";
import { useContext } from "react";
import { makeTrunkErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { FieldError, GlobalError } from "@jupiter/core/infra/component/errors";
import { ToolPanel } from "@jupiter/core/infra/component/layout/tool-panel";
import { TrunkPanel } from "@jupiter/core/infra/component/layout/trunk-panel";
import { validationErrorToUIErrorInfo } from "@jupiter/core/infra/action-result";
import { Password } from "@jupiter/core/auth/component/password";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import {
  SectionActions,
  ActionSingle,
} from "@jupiter/core/infra/component/section-actions";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";

import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { getIntent } from "~/logic/intent";
import { getLoggedInApiClient } from "~/api-clients.server";

const UpdateFormSchema = z.discriminatedUnion("intent", [
  z.object({
    intent: z.literal("change-password"),
    currentPassword: z.string(),
    newPassword: z.string(),
    newPasswordRepeat: z.string(),
  }),
]);

export const handle = {
  displayType: DisplayType.TOOL,
};

export async function loader({ request }: LoaderFunctionArgs) {
  await getLoggedInApiClient(request);
  return json({});
}

export async function action({ request }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const form = await parseForm(request, UpdateFormSchema);

  const { intent } = getIntent<undefined>(form.intent);

  try {
    switch (intent) {
      case "change-password": {
        await apiClient.auth.changePassword({
          current_password: form.currentPassword,
          new_password: form.newPassword,
          new_password_repeat: form.newPasswordRepeat,
        });

        return redirect(`/app/workspace/security`);
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

export default function Security() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const inputsEnabled = navigation.state === "idle";
  const topLevelInfo = useContext(TopLevelInfoContext);

  return (
    <TrunkPanel key={"security"} returnLocation="/app/workspace">
      <ToolPanel>
        <GlobalError actionResult={actionData} />
        <SectionCard
          id="security"
          title="Security"
          actions={
            <SectionActions
              id="security-actions"
              topLevelInfo={topLevelInfo}
              inputsEnabled={inputsEnabled}
              actions={[
                ActionSingle({
                  id: "change-password",
                  text: "Change Password",
                  value: "change-password",
                  highlight: true,
                }),
              ]}
            />
          }
        >
          <FormControl fullWidth>
            <InputLabel id="currentPassword">Current Password</InputLabel>
            <Password
              label="Current Password"
              name="currentPassword"
              autoComplete="current-password"
              inputsEnabled={inputsEnabled}
            />
            <FieldError
              actionResult={actionData}
              fieldName="/current_password"
            />
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="newPassword">New Password</InputLabel>
            <Password
              label="newPassword"
              name="newPassword"
              autoComplete="new-password"
              inputsEnabled={inputsEnabled}
            />
            <FieldError actionResult={actionData} fieldName="/new_password" />
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="newPasswordRepeat">New Password Repeat</InputLabel>
            <Password
              label="New Password Repeat"
              name="newPasswordRepeat"
              autoComplete="new-password"
              inputsEnabled={inputsEnabled}
            />
            <FieldError
              actionResult={actionData}
              fieldName="/new_password_repeat"
            />
          </FormControl>
        </SectionCard>
      </ToolPanel>
    </TrunkPanel>
  );
}

export const ErrorBoundary = makeTrunkErrorBoundary("/app/workspace", {
  error: () =>
    `There was an error changing security settings! Please try again!`,
});
