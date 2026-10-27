import { UserAuthMethod } from "@jupiter/webapi-client";
import { Alert, FormControl, InputLabel } from "@mui/material";
import type {
  ActionFunctionArgs,
  ShouldRevalidateFunction,
} from "react-router";
import { redirect, useActionData, useNavigation } from "react-router";
import { useContext } from "react";
import { z } from "zod";
import { parseForm } from "zodix";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { FieldError, GlobalError } from "@jupiter/core/infra/component/errors";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import { Password } from "@jupiter/core/auth/component/password";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import {
  ActionSingle,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import { handleActionApiError } from "@jupiter/core/infra/errors.server";
import { standardShouldRevalidate } from "@jupiter/core/infra/should-revalidate";
import { getLoggedInApiClient } from "@jupiter/core/infra/api-clients.server";

const ParamsSchema = z.object({});

const UpdateFormSchema = z.discriminatedUnion("intent", [
  z.object({
    intent: z.literal("change-password"),
    currentPassword: z.string(),
    newPassword: z.string(),
    newPasswordRepeat: z.string(),
  }),
  z.object({
    intent: z.literal("add-password"),
    newPassword: z.string(),
    newPasswordRepeat: z.string(),
  }),
]);

export const handle = {
  displayType: DisplayType.LEAF,
};

export async function action({ request }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const form = await parseForm(request, UpdateFormSchema);

  try {
    switch (form.intent) {
      case "change-password": {
        await apiClient.auth.changePassword({
          current_password: form.currentPassword,
          new_password: form.newPassword,
          new_password_repeat: form.newPasswordRepeat,
        });

        return redirect(`/app/workspace/account`);
      }

      case "add-password": {
        const result = await apiClient.auth.addLocalAuth({
          new_password: form.newPassword,
          new_password_repeat: form.newPasswordRepeat,
        });

        return redirect(
          `/app/lifecycle/util/local/show-recovery-token?recoveryToken=${result.new_recovery_token}`,
        );
      }

      default:
        throw new Response("Bad Intent", { status: 500 });
    }
  } catch (error) {
    return handleActionApiError(error);
  }
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

export default function AccountPassword() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const topLevelInfo = useContext(TopLevelInfoContext);

  const hasLocal = topLevelInfo.userLinkedAuthMethods.includes(
    UserAuthMethod.LOCAL,
  );
  const verified = topLevelInfo.user.verified;
  const inputsEnabled = navigation.state === "idle";

  return (
    <LeafPanel
      key="account/password"
      fakeKey="account/password"
      returnLocation="/app/workspace/account"
      inputsEnabled={inputsEnabled}
    >
      <SectionCard
        title={hasLocal ? "Change Password" : "Add a Password"}
        actions={
          <SectionActions
            id="password-actions"
            topLevelInfo={topLevelInfo}
            inputsEnabled={inputsEnabled && (hasLocal || verified)}
            actions={[
              ActionSingle({
                text: hasLocal ? "Change Password" : "Add Password",
                value: hasLocal ? "change-password" : "add-password",
                highlight: true,
              }),
            ]}
          />
        }
      >
        <GlobalError actionResult={actionData} />

        {!hasLocal && !verified && (
          <Alert severity="info">
            Verify your email address before adding a password.
          </Alert>
        )}

        {hasLocal && (
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
        )}

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
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary(
  "/app/workspace/account",
  ParamsSchema,
  {
    error: () => `There was an error changing the password! Please try again!`,
  },
);
