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
  isNoErrorSomeData,
  noErrorSomeData,
  type SomeErrorNoData,
  validationErrorToUIErrorInfo,
} from "@jupiter/core/infra/action-result";
import {
  ActionsExpansion,
  ActionSingle,
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
  redirectForEmailVerificationPage,
} from "~/routes/app/lifecycle/lifecycle-redirects.server";

const QuerySchema = z.object({
  userId: z.string(),
});

const VerifyEmailFormSchema = z.discriminatedUnion("intent", [
  z.object({
    userId: z.string(),
    intent: z.literal("verify"),
    code: z.string(),
  }),
  z.object({
    userId: z.string(),
    intent: z.literal("resend"),
  }),
]);

type VerifyActionError = SomeErrorNoData & {
  exhaustedCodeRetries?: boolean;
  resendRateLimited?: boolean;
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
    switch (form.intent) {
      case "resend": {
        await apiClient.auth.createEmailVerificationAttempt({
          user_id: form.userId,
        });

        return json(noErrorSomeData({ codeResent: true }));
      }

      case "verify": {
        const result = await apiClient.auth.verifyEmailVerificationAttempt({
          user_id: form.userId,
          code: form.code,
        });

        if (result.verified) {
          return redirect(createWorkspaceUrl(form.userId));
        }

        if (result.can_retry) {
          const actionData: VerifyActionError = {
            ...aGlobalError(
              "The verification code was incorrect too many times. Please request a new code.",
            ),
            exhaustedCodeRetries: true,
          };
          return json(actionData);
        }

        return json(aGlobalError("The verification code was incorrect."));
      }

      default:
        throw new Response("Bad Intent", { status: 500 });
    }
  } catch (error) {
    if (
      error instanceof ApiError &&
      error.status === StatusCodes.TOO_MANY_REQUESTS
    ) {
      return json({
        ...validationErrorToUIErrorInfo(error.body),
        resendRateLimited: true,
      } satisfies VerifyActionError);
    }

    if (
      error instanceof ApiError &&
      (error.status === StatusCodes.UNPROCESSABLE_ENTITY ||
        error.status === StatusCodes.BAD_GATEWAY)
    ) {
      return json(validationErrorToUIErrorInfo(error.body));
    }

    throw error;
  }
}

export default function EmailVerificationVerify() {
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const inputsEnabled = navigation.state === "idle";

  const codeResent =
    actionData !== undefined &&
    isNoErrorSomeData(actionData) &&
    actionData.data.codeResent === true;

  const exhaustedCodeRetries =
    actionData !== undefined &&
    actionData.theType === "some-error-no-data" &&
    (actionData as VerifyActionError).exhaustedCodeRetries === true;

  const resendRateLimited =
    actionData !== undefined &&
    actionData.theType === "some-error-no-data" &&
    (actionData as VerifyActionError).resendRateLimited === true;

  const verifyInputsEnabled = inputsEnabled && !exhaustedCodeRetries;

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
                  highlight: !exhaustedCodeRetries,
                  disabled: exhaustedCodeRetries,
                }),
                ActionSingle({
                  text: "Resend Code",
                  value: "resend",
                  highlight: exhaustedCodeRetries,
                  disabled: resendRateLimited,
                }),
              ]}
            />
          }
        >
          <input type="hidden" name="userId" value={loaderData.userId} />

          <Typography variant="body1">
            Enter the 6-digit verification code we sent to{" "}
            <strong>{loaderData.emailAddress}</strong>.
          </Typography>

          {codeResent && (
            <Typography variant="body1" color="success.main">
              A new verification code has been sent to your email.
            </Typography>
          )}

          <FormControl fullWidth>
            <InputLabel id="code">Verification Code</InputLabel>
            <OutlinedInput
              label="Verification Code"
              name="code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              readOnly={!verifyInputsEnabled}
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
