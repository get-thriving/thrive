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
import {
  GlobalPropertiesContext,
  serverToClientGlobalProperties,
} from "@jupiter/core/config-client";
import { GLOBAL_PROPERTIES } from "@jupiter/core/config-server";
import { FrontDoorInfoContext } from "@jupiter/core/infra/frontdoor-info-context";
import { OverdueThresholdsContext } from "@jupiter/core/infra/overdue-thresholds-context";
import { ServiceLinksContext } from "@jupiter/core/infra/service-links-context";
import { loadFrontDoorInfo } from "@jupiter/core/frontdoor.server";

import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { getGuestApiClient } from "~/api-clients.server";
import { ServicePropertiesContext } from "~/logic/config";
import {
  SERVICE_PROPERTIES,
  serverToClientServiceProperties,
} from "~/logic/config.server";

export async function loader({ request }: LoaderFunctionArgs) {
  // The frontdoor cookie is never set on the published domain; infer
  // everything from the user agent.
  const frontDoor = await loadFrontDoorInfo(
    GLOBAL_PROPERTIES.version,
    null,
    request.headers.get("User-Agent"),
  );

  const apiClient = await getGuestApiClient(request);
  const response = await apiClient.application.loadTopLevelInfo({});

  return json({
    globalProperties: serverToClientGlobalProperties(GLOBAL_PROPERTIES),
    serviceProperties: serverToClientServiceProperties(
      SERVICE_PROPERTIES,
      frontDoor,
    ),
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
    <GlobalPropertiesContext.Provider value={loaderData.globalProperties}>
      <ServicePropertiesContext.Provider value={loaderData.serviceProperties}>
        <FrontDoorInfoContext.Provider
          value={loaderData.serviceProperties.frontDoorInfo}
        >
          <ServiceLinksContext.Provider value={loaderData.serviceProperties}>
            <OverdueThresholdsContext.Provider
              value={loaderData.serviceProperties}
            >
              <TopLevelInfoProvider
                user={loaderData.user}
                workspace={loaderData.workspace}
                userFeatureFlagControls={loaderData.userFeatureFlagControls}
                workspaceFeatureFlagControls={
                  loaderData.workspaceFeatureFlagControls
                }
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
            </OverdueThresholdsContext.Provider>
          </ServiceLinksContext.Provider>
        </FrontDoorInfoContext.Provider>
      </ServicePropertiesContext.Provider>
    </GlobalPropertiesContext.Provider>
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
