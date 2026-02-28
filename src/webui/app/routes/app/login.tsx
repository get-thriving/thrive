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
import { Title } from "@jupiter/core/infra/component/title";
import { ServicePropertiesContext } from "@jupiter/core/config-client";
import { validationErrorToUIErrorInfo } from "@jupiter/core/infra/action-result";
import { AUTH_TOKEN_NAME } from "@jupiter/core/infra/names";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import {
  ActionsPosition,
  SectionCard,
} from "@jupiter/core/infra/component/section-card";
import {
  ActionSingle,
  NavSingle,
  NavMultipleCompact,
  ActionsExpansion,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import { EMPTY_CONTEXT } from "@jupiter/core/infra/top-level-context";

import { commitSession, getSession } from "~/sessions";
import { getGuestApiClient } from "~/api-clients.server";

const LoginFormSchema = z.object({
  emailAddress: z.string(),
  password: z.string(),
});

export const handle = {
  displayType: DisplayType.ROOT,
};

// @secureFn
export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const apiClient = await getGuestApiClient(request);

  if (session.has(AUTH_TOKEN_NAME)) {
    const result = await apiClient.application.loadTopLevelInfo({});
    if (result.user || result.workspace) {
      return redirect("/app/workspace");
    }
  }

  return json({});
}

// @secureFn
export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const apiClient = await getGuestApiClient(request);
  const form = await parseForm(request, LoginFormSchema);

  try {
    const result = await apiClient.application.login({
      email_address: form.emailAddress,
      password: form.password,
    });

    session.set(AUTH_TOKEN_NAME, result.auth_token_ext);

    // Login succeeded, send them to the home page.
    return redirect("/app/workspace", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
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

// @secureFn
export default function Login() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();

  const serviceProperties = useContext(ServicePropertiesContext);

  const inputsEnabled = navigation.state === "idle";

  return (
    <StandaloneContainer>
      <SmartAppBar>
        <Logo />

        <Title />

        <CommunityLink />

        <DocsHelp
          size="medium"
          subject={DocsHelpSubject.ROOT}
          theId="docs-help"
        />
      </SmartAppBar>

      <LifecyclePanel>
        <GlobalError actionResult={actionData} />
        <SectionCard
          title="Login"
          actionsPosition={ActionsPosition.BELOW}
          actions={
            <SectionActions
              id="login"
              topLevelInfo={EMPTY_CONTEXT}
              inputsEnabled={inputsEnabled}
              expansion={ActionsExpansion.ALWAYS_SHOW}
              actions={[
                ActionSingle({
                  text: "Login",
                  value: "login",
                  highlight: true,
                }),
                NavMultipleCompact({
                  navs: [
                    NavSingle({
                      text: "New Workspace",
                      link: "/app/init",
                    }),
                    NavSingle({
                      text: "Reset Password",
                      link: "/app/reset-password",
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
          <FormControl fullWidth>
            <InputLabel id="emailAddress">Email Address</InputLabel>
            <OutlinedInput
              label="Email Address"
              name="emailAddress"
              type="email"
              autoComplete="email"
              readOnly={!inputsEnabled}
              defaultValue={""}
            />
            <FieldError actionResult={actionData} fieldName="/email_address" />
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="password">Password</InputLabel>
            <Password
              label="Password"
              name="password"
              autoComplete="current-password"
              inputsEnabled={inputsEnabled}
            />
            <FieldError actionResult={actionData} fieldName="/password" />
          </FormControl>
        </SectionCard>
      </LifecyclePanel>
    </StandaloneContainer>
  );
}

export const ErrorBoundary = makeRootErrorBoundary({
  error: () => `There was an error logging in! Please try again!`,
});
