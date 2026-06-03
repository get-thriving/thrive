import { ApiError, DocsHelpSubject } from "@jupiter/webapi-client";
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  Typography,
} from "@mui/material";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { parseForm, parseQuery } from "zodix";
import { CommunityLink } from "@jupiter/core/infra/component/community-link";
import { DocsHelp } from "@jupiter/core/infra/component/docs-help";
import { makeRootErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { FieldError, GlobalError } from "@jupiter/core/infra/component/errors";
import { LifecyclePanel } from "@jupiter/core/infra/component/layout/lifecycle-panel";
import { StandaloneContainer } from "@jupiter/core/infra/component/layout/standalone-container";
import { SmartAppBar } from "@jupiter/core/infra/component/smart-appbar";
import { Logo } from "@jupiter/core/infra/component/logo";
import { Title } from "@jupiter/core/infra/component/title";
import {
  aGlobalError,
  validationErrorToUIErrorInfo,
} from "@jupiter/core/infra/action-result";
import {
  ActionsExpansion,
  ActionSingle,
  NavSingle,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import {
  ActionsPosition,
  SectionCard,
} from "@jupiter/core/infra/component/section-card";
import { EMPTY_CONTEXT } from "@jupiter/core/infra/top-level-context";

import { getGuestApiClient } from "~/api-clients.server";
import {
  createWorkspaceUrl,
  emailVerificationStartUrl,
  redirectForEmailVerificationPage,
} from "~/routes/app/lifecycle/lifecycle-redirects.server";

const QuerySchema = z.object({
  userId: z.string(),
});

const VerifyEmailFormSchema = z.object({
  userId: z.string(),
  code: z.string(),
});

type VerifyActionData = ReturnType<typeof aGlobalError> & {
  canRetry?: boolean;
};

// @secureFn
export async function loader({ request }: LoaderFunctionArgs) {
  const query = parseQuery(request, QuerySchema);
  const apiClient = await getGuestApiClient(request);
  const result = await apiClient.application.loadTopLevelInfo({});

  const redirectResponse = redirectForEmailVerificationPage(
    result,
    query.userId,
  );
  if (redirectResponse !== null) {
    return redirectResponse;
  }

  return json({
    userId: query.userId,
    emailAddress: result.user!.email_address,
  });
}

// @secureFn
export async function action({ request }: ActionFunctionArgs) {
  const apiClient = await getGuestApiClient(request);
  const form = await parseForm(request, VerifyEmailFormSchema);

  try {
    const result = await apiClient.auth.verifyEmailVerificationAttempt({
      user_id: form.userId,
      code: form.code,
    });

    if (result.verified) {
      return redirect(createWorkspaceUrl(form.userId));
    }

    const actionData: VerifyActionData = {
      ...aGlobalError("The verification code was incorrect."),
      canRetry: result.can_retry,
    };
    return json(actionData);
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

export default function EmailVerificationVerify() {
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>() as
    | VerifyActionData
    | undefined;
  const navigation = useNavigation();
  const inputsEnabled = navigation.state === "idle";

  const canRetry = actionData?.canRetry === true;

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
          title="Enter Verification Code"
          actionsPosition={ActionsPosition.BELOW}
          actions={
            <SectionActions
              id="email-verification-verify"
              topLevelInfo={EMPTY_CONTEXT}
              inputsEnabled={inputsEnabled}
              expansion={ActionsExpansion.ALWAYS_SHOW}
              actions={[
                ActionSingle({
                  text: "Verify",
                  value: "verify",
                  highlight: true,
                }),
                ...(canRetry
                  ? [
                      NavSingle({
                        text: "Request New Code",
                        link: emailVerificationStartUrl(loaderData.userId),
                      }),
                    ]
                  : []),
              ]}
            />
          }
        >
          <input type="hidden" name="userId" value={loaderData.userId} />

          <Typography variant="body1">
            Enter the 6-digit verification code we sent to{" "}
            <strong>{loaderData.emailAddress}</strong>.
          </Typography>

          <FormControl fullWidth>
            <InputLabel id="code">Verification Code</InputLabel>
            <OutlinedInput
              label="Verification Code"
              name="code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              readOnly={!inputsEnabled}
              defaultValue={""}
            />
            <FieldError actionResult={actionData} fieldName="/code" />
          </FormControl>
        </SectionCard>
      </LifecyclePanel>
    </StandaloneContainer>
  );
}

export const ErrorBoundary = makeRootErrorBoundary({
  error: () => `There was an error verifying your email! Please try again!`,
});
