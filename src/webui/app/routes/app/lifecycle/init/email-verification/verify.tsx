import { DocsHelpSubject } from "@jupiter/webapi-client";
import { Typography, Button, Stack, Alert, TextField } from "@mui/material";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  ShouldRevalidateFunction,
  useActionData,
  useFetcher,
  useLoaderData,
} from "@remix-run/react";
import { CommunityLink } from "@jupiter/core/infra/component/community-link";
import { DocsHelp } from "@jupiter/core/infra/component/docs-help";
import { makeRootErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { LifecyclePanel } from "@jupiter/core/infra/component/layout/lifecycle-panel";
import { StandaloneContainer } from "@jupiter/core/infra/component/layout/standalone-container";
import { SmartAppBar } from "@jupiter/core/infra/component/smart-appbar";
import { Logo } from "@jupiter/core/infra/component/logo";
import { Title } from "@jupiter/core/infra/component/title";
import { useState } from "react";

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

  const formData = await request.formData();
  const code = formData.get("code") as string;

  if (!code || code.length !== 6 || !/^\d+$/.test(code)) {
    return json({
      success: false,
      error: "Please enter a valid 6-digit code",
    });
  }

  const apiClient = await getGuestApiClient(request);
  const loaderData = await loader({ request } as LoaderFunctionArgs);

  if (loaderData instanceof Response) {
    return loaderData;
  }

  try {
    const result = await apiClient.auth.verifyEmailVerificationAttempt({
      user_id: loaderData.userId,
      code: code,
    });

    if (result.verified) {
      return redirect(
        `/app/lifecycle/init/create-workspace?userId=${loaderData.userId}`,
      );
    } else {
      return json({
        success: false,
        error: "Invalid verification code. Please try again.",
      });
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Verification failed";

    if (errorMessage.includes("expired")) {
      return json({
        success: false,
        error:
          "Your verification code has expired. Please request a new one.",
      });
    }

    if (errorMessage.includes("attempts")) {
      return json({
        success: false,
        error:
          "Too many failed attempts. Please request a new verification code.",
      });
    }

    return json({
      success: false,
      error: errorMessage,
    });
  }
}

export default function EmailVerificationVerify() {
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const fetcher = useFetcher<typeof action>();
  const [code, setCode] = useState("");

  const isLoading = fetcher.state === "submitting";
  const showError = actionData?.error;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("code", code);
    fetcher.submit(formData, { method: "post" });
  };

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
          Enter Verification Code
        </Typography>
        <Stack spacing={2} sx={{ mt: 3 }}>
          <Typography variant="body1">
            We&apos;ve sent a 6-digit verification code to your email. Please
            enter it below to verify your account.
          </Typography>

          {showError && <Alert severity="error">{showError}</Alert>}

          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                label="Verification Code"
                type="text"
                inputProps={{ maxLength: 6, pattern: "[0-9]*" }}
                placeholder="000000"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                disabled={isLoading}
                fullWidth
              />
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={isLoading || code.length !== 6}
                fullWidth
              >
                {isLoading ? "Verifying..." : "Verify Code"}
              </Button>
            </Stack>
          </form>

          <Button
            variant="text"
            color="primary"
            href="/app/lifecycle/init/email-verification/start"
            fullWidth
            sx={{ mt: 2 }}
          >
            Try Another Verification Code
          </Button>
        </Stack>
      </LifecyclePanel>
    </StandaloneContainer>
  );
}

export const ErrorBoundary = makeRootErrorBoundary({
  error: () => `There was an error loading the verification page! Please try again!`,
});
