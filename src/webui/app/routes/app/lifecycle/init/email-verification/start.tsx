import { DocsHelpSubject } from "@jupiter/webapi-client";
import { Typography, Button, Stack, Alert } from "@mui/material";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { ShouldRevalidateFunction, useActionData, useFetcher } from "@remix-run/react";
import { CommunityLink } from "@jupiter/core/infra/component/community-link";
import { DocsHelp } from "@jupiter/core/infra/component/docs-help";
import { makeRootErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { LifecyclePanel } from "@jupiter/core/infra/component/layout/lifecycle-panel";
import { StandaloneContainer } from "@jupiter/core/infra/component/layout/standalone-container";
import { SmartAppBar } from "@jupiter/core/infra/component/smart-appbar";
import { Logo } from "@jupiter/core/infra/component/logo";
import { Title } from "@jupiter/core/infra/component/title";

import { getGuestApiClient } from "~/api-clients.server";

export const shouldRevalidate: ShouldRevalidateFunction = () => false;

// @secureFn
export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getGuestApiClient(request);
  const result = await apiClient.application.loadTopLevelInfo({});

  if (!result.user) {
    return redirect("/app/lifecycle/init/local/create-user");
  }
  if (result.user.verified && result.workspace) {
    return redirect("/app/workspace");
  }
  if (result.user.verified) {
    return redirect(
      `/app/lifecycle/init/create-workspace?userId=${result.user.ref_id}`,
    );
  }

  return json({ userId: result.user.ref_id });
}

// @secureFn
export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  const apiClient = await getGuestApiClient(request);
  const loaderData = await loader({ request } as LoaderFunctionArgs);

  if (loaderData instanceof Response) {
    return loaderData;
  }

  try {
    await apiClient.auth.createEmailVerificationAttempt({
      user_id: loaderData.userId,
    });
    return json({ success: true, error: null });
  } catch (err) {
    return json({
      success: false,
      error:
        err instanceof Error ? err.message : "Failed to send verification email",
    });
  }
}

export default function EmailVerificationStart() {
  const actionData = useActionData<typeof action>();
  const fetcher = useFetcher<typeof action>();

  const isLoading = fetcher.state === "submitting";
  const showSuccess = actionData?.success;
  const showError = actionData?.error;

  return (
    <StandaloneContainer>
      <SmartAppBar>
        <Logo />
        <Title />
        <CommunityLink />
        <DocsHelp size="medium" subject={DocsHelpSubject.ROOT} theId="docs-help" />
      </SmartAppBar>

      <LifecyclePanel>
        <Typography variant="h5" gutterBottom>
          Verify Your Email
        </Typography>
        <Stack spacing={2} sx={{ mt: 3 }}>
          <Typography variant="body1">
            We need to verify your email address before you can continue.
            Click the button below to send a verification email to your inbox.
          </Typography>

          {showSuccess && (
            <Alert severity="success">
              Verification email sent! Check your inbox for the code and proceed
              to enter it.
            </Alert>
          )}

          {showError && (
            <Alert severity="error">{showError}</Alert>
          )}

          <fetcher.Form method="post">
            <Button
              variant="contained"
              color="primary"
              disabled={isLoading}
              onClick={() => fetcher.submit({}, { method: "post" })}
              fullWidth
            >
              {isLoading ? "Sending..." : "Send Verification Email"}
            </Button>
          </fetcher.Form>
        </Stack>
      </LifecyclePanel>
    </StandaloneContainer>
  );
}

export const ErrorBoundary = makeRootErrorBoundary({
  error: () => `There was an error loading the verification page! Please try again!`,
});
