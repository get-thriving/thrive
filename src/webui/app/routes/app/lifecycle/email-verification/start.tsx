import { ApiError, DocsHelpSubject } from "@jupiter/webapi-client";
import { Typography } from "@mui/material";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { parseForm, parseQuery } from "zodix";
import { CommunityLink } from "@jupiter/core/infra/component/community-link";
import { DocsHelp } from "@jupiter/core/infra/component/docs-help";
import { makeRootErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { GlobalError } from "@jupiter/core/infra/component/errors";
import { LifecyclePanel } from "@jupiter/core/infra/component/layout/lifecycle-panel";
import { StandaloneContainer } from "@jupiter/core/infra/component/layout/standalone-container";
import { SmartAppBar } from "@jupiter/core/infra/component/smart-appbar";
import { Logo } from "@jupiter/core/infra/component/logo";
import { Title } from "@jupiter/core/infra/component/title";
import { validationErrorToUIErrorInfo } from "@jupiter/core/infra/action-result";
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
  emailVerificationVerifyUrl,
  redirectForEmailVerificationPage,
} from "~/routes/app/lifecycle/lifecycle-redirects.server";

const QuerySchema = z.object({
  userId: z.string(),
});

const SendVerificationEmailFormSchema = z.object({
  userId: z.string(),
});

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
  const form = await parseForm(request, SendVerificationEmailFormSchema);

  try {
    await apiClient.auth.createEmailVerificationAttempt({
      user_id: form.userId,
    });

    return redirect(emailVerificationVerifyUrl(form.userId));
  } catch (error) {
    if (error instanceof ApiError && error.status === StatusCodes.CONFLICT) {
      return redirect(emailVerificationVerifyUrl(form.userId));
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

export default function EmailVerificationStart() {
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const inputsEnabled = navigation.state === "idle";

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
          title="Verify Your Email"
          actionsPosition={ActionsPosition.BELOW}
          actions={
            <SectionActions
              id="email-verification-start"
              topLevelInfo={EMPTY_CONTEXT}
              inputsEnabled={inputsEnabled}
              expansion={ActionsExpansion.ALWAYS_SHOW}
              actions={[
                ActionSingle({
                  text: "Send Verification Email",
                  value: "send",
                  highlight: true,
                }),
              ]}
            />
          }
        >
          <input type="hidden" name="userId" value={loaderData.userId} />

          <Typography variant="body1">
            We need to verify your email address{" "}
            <strong>{loaderData.emailAddress}</strong> before you can continue.
            When you press the button below, we will send you an email with a
            6-digit verification code. You will then enter that code on the next
            screen.
          </Typography>
        </SectionCard>
      </LifecyclePanel>
    </StandaloneContainer>
  );
}

export const ErrorBoundary = makeRootErrorBoundary({
  error: () =>
    `There was an error starting email verification! Please try again!`,
});
