import { ApiError, AppShell, DocsHelpSubject } from "@jupiter/webapi-client";
import { FormControl, InputLabel, OutlinedInput } from "@mui/material";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData, useNavigation } from "@remix-run/react";
import { StatusCodes } from "http-status-codes";
import { useContext } from "react";
import { z } from "zod";
import { parseForm } from "zodix";
import { CommunityLink } from "@jupiter/core/infra/component/community-link";
import { DocsHelp } from "@jupiter/core/infra/component/docs-help";
import { makeRootErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { FieldError, GlobalError } from "@jupiter/core/infra/component/errors";
import { LifecyclePanel } from "@jupiter/core/infra/component/layout/lifecycle-panel";
import { StandaloneContainer } from "@jupiter/core/infra/component/layout/standalone-container";
import { SmartAppBar } from "@jupiter/core/infra/component/smart-appbar";
import { Logo } from "@jupiter/core/infra/component/logo";
import { Password } from "@jupiter/core/auth/component/password";
import { LifecycleOAuthProviderButtons } from "@jupiter/core/auth/component/lifecycle-oauth-provider-buttons";
import { Title } from "@jupiter/core/infra/component/title";
import { ServicePropertiesContext } from "@jupiter/core/config-client";
import { validationErrorToUIErrorInfo } from "@jupiter/core/infra/action-result";
import {
  ActionsExpansion,
  ActionSingle,
  NavMultipleCompact,
  NavSingle,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import {
  ActionsPosition,
  SectionCard,
} from "@jupiter/core/infra/component/section-card";
import { EMPTY_CONTEXT } from "@jupiter/core/infra/top-level-context";
import { AUTH_TOKEN_NAME } from "@jupiter/core/infra/names";

import { getGuestApiClient } from "~/api-clients.server";
import { commitSession, getSession } from "~/sessions";

const InitCreateUserFormSchema = z.object({
  userEmailAddress: z.string(),
  userName: z.string(),
  authPassword: z.string(),
  authPasswordRepeat: z.string(),
});

// @secureFn
export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getGuestApiClient(request);
  const result = await apiClient.application.loadTopLevelInfo({});
  if (result.user && result.workspace) {
    return redirect("/app/workspace");
  }
  if (result.user && !result.user.verified) {
    return redirect("/app/lifecycle/init/email-verification/start");
  }
  if (result.user) {
    return redirect(
      `/app/lifecycle/init/create-workspace?userId=${result.user.ref_id}`,
    );
  }

  return json({});
}

// @secureFn
export async function action({ request }: ActionFunctionArgs) {
  const apiClient = await getGuestApiClient(request);
  const session = await getSession(request.headers.get("Cookie"));
  const form = await parseForm(request, InitCreateUserFormSchema);

  try {
    const result = await apiClient.application.initCreateUserLocal({
      user_email_address: form.userEmailAddress,
      user_name: form.userName,
      auth_password: form.authPassword,
      auth_password_repeat: form.authPasswordRepeat,
    });

    session.set(AUTH_TOKEN_NAME, result.auth_token_ext);

    return redirect(
      `/app/lifecycle/init/email-verification/start`,
      {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      },
    );
  } catch (error) {
    if (error instanceof ApiError && error.status === StatusCodes.CONFLICT) {
      return redirect("/app/lifecycle/util/user-already-exists");
    }

    if (
      error instanceof ApiError &&
      error.status === StatusCodes.UNPROCESSABLE_ENTITY
    ) {
      return json(validationErrorToUIErrorInfo(error.body));
    }

    throw error;
  }
}

export default function InitCreateUser() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const inputsEnabled = navigation.state === "idle";

  const serviceProperties = useContext(ServicePropertiesContext);

  return (
    <StandaloneContainer>
      <SmartAppBar>
        <Logo />

        <Title />

        <CommunityLink />

        <DocsHelp size="medium" subject={DocsHelpSubject.ROOT} />
      </SmartAppBar>

      <LifecyclePanel>
        <GlobalError actionResult={actionData} />
        <SectionCard
          title="New Account"
          actionsPosition={ActionsPosition.BELOW}
          actions={
            <SectionActions
              id="init-create-user"
              topLevelInfo={EMPTY_CONTEXT}
              inputsEnabled={inputsEnabled}
              expansion={ActionsExpansion.ALWAYS_SHOW}
              actions={[
                ActionSingle({
                  text: "Create",
                  value: "create",
                  highlight: true,
                }),
                NavMultipleCompact({
                  navs: [
                    NavSingle({
                      text: "Login",
                      link: "/app/lifecycle/login/local/login",
                    }),
                    NavSingle({
                      text: "Reset Password",
                      link: "/app/lifecycle/util/local/reset-password",
                    }),
                    NavSingle({
                      text: "Pick Server",
                      link: "/app/pick-server/desktop",
                      disabled:
                        serviceProperties.frontDoorInfo.appShell !==
                        AppShell.DESKTOP_ELECTRON,
                    }),
                  ],
                }),
              ]}
            />
          }
        >
          <LifecycleOAuthProviderButtons />

          <FormControl fullWidth>
            <InputLabel id="userEmailAddress">Your Email Address</InputLabel>
            <OutlinedInput
              type="email"
              autoComplete="email"
              label="Your Email Address"
              name="userEmailAddress"
              readOnly={!inputsEnabled}
              defaultValue={""}
            />
            <FieldError
              actionResult={actionData}
              fieldName="/user_email_address"
            />
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="userName">Your Name</InputLabel>
            <OutlinedInput
              label="Your Name"
              name="userName"
              readOnly={!inputsEnabled}
              defaultValue={""}
            />
            <FieldError actionResult={actionData} fieldName="/user_name" />
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="authPassword">Password</InputLabel>
            <Password
              label="Password"
              name="authPassword"
              autoComplete="new-password"
              inputsEnabled={inputsEnabled}
            />
            <FieldError actionResult={actionData} fieldName="/auth_password" />
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="authPasswordRepeat">Password Repeat</InputLabel>
            <Password
              label="Password Repeat"
              name="authPasswordRepeat"
              inputsEnabled={inputsEnabled}
            />
            <FieldError
              actionResult={actionData}
              fieldName="/auth_password_repeat"
            />
          </FormControl>
        </SectionCard>
      </LifecyclePanel>
    </StandaloneContainer>
  );
}

export const ErrorBoundary = makeRootErrorBoundary({
  error: () => `There was an error creating your account! Please try again!`,
});
