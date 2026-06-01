import { DocsHelpSubject } from "@jupiter/webapi-client";
import { Typography } from "@mui/material";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { ShouldRevalidateFunction } from "@remix-run/react";
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

  return json({});
}

export default function VerificationStart() {
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
        <Typography variant="body1">
          We&apos;ve sent a verification email to your address. Please check
          your inbox and follow the instructions to verify your account before
          continuing.
        </Typography>
      </LifecyclePanel>
    </StandaloneContainer>
  );
}

export const ErrorBoundary = makeRootErrorBoundary({
  error: () => `There was an error loading the verification page! Please try again!`,
});
