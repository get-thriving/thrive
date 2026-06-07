import type {
  LoadTopLevelInfoResult,
  User,
  Workspace,
} from "@jupiter/webapi-client";
import { DocsHelpSubject } from "@jupiter/webapi-client";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { Outlet } from "@remix-run/react";
import { CommunityLink } from "@jupiter/core/infra/component/community-link";
import { DocsHelp } from "@jupiter/core/infra/component/docs-help";
import { makeRootErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { StandaloneContainer } from "@jupiter/core/infra/component/layout/standalone-container";
import { SmartAppBar } from "@jupiter/core/infra/component/smart-appbar";
import { Logo } from "@jupiter/core/infra/component/logo";
import { Title } from "@jupiter/core/infra/component/title";
import { TopLevelInfoProvider } from "@jupiter/core/infra/component/top-level-info-provider";
import { EMPTY_CONTEXT } from "@jupiter/core/infra/top-level-context";

import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { getGuestApiClient } from "~/api-clients.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getGuestApiClient(request);
  const response = await apiClient.application.loadTopLevelInfo({});

  return json({
    userFeatureFlagControls: response.user_feature_flag_controls,
    workspaceFeatureFlagControls: response.workspace_feature_flag_controls,
    userScoreOverview: response.user_score_overview ?? null,
    ...resolvePublishedTopLevelEntities(response),
  });
}

export const shouldRevalidate: ShouldRevalidateFunction = ({ nextUrl }) => {
  return nextUrl.searchParams.has("invalidateTopLevel");
};

export default function Published() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();

  return (
    <TopLevelInfoProvider
      user={loaderData.user}
      workspace={loaderData.workspace}
      userFeatureFlagControls={loaderData.userFeatureFlagControls}
      workspaceFeatureFlagControls={loaderData.workspaceFeatureFlagControls}
      userScoreOverview={loaderData.userScoreOverview}
    >
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

        <Outlet />
      </StandaloneContainer>
    </TopLevelInfoProvider>
  );
}

export const ErrorBoundary = makeRootErrorBoundary({
  error: () =>
    `There was an error loading the published page! Please try again!`,
});

function resolvePublishedTopLevelEntities(response: LoadTopLevelInfoResult): {
  user: User;
  workspace: Workspace;
} {
  if (response.user && response.workspace) {
    return {
      user: response.user,
      workspace: response.workspace,
    };
  }

  return {
    user: {
      ...EMPTY_CONTEXT.user,
      feature_flags: response.default_user_feature_flags,
    },
    workspace: {
      ...EMPTY_CONTEXT.workspace,
      name: response.deafult_workspace_name,
      feature_flags: response.default_workspace_feature_flags,
    },
  };
}
