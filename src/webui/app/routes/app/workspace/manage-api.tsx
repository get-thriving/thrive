import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { Outlet } from "@remix-run/react";
import { AnimatePresence } from "framer-motion";
import { useContext } from "react";
import { makeTrunkErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { NestingAwareBlock } from "@jupiter/core/infra/component/layout/nesting-aware-block";
import { ToolPanel } from "@jupiter/core/infra/component/layout/tool-panel";
import { TrunkPanel } from "@jupiter/core/infra/component/layout/trunk-panel";
import {
  useLeafNeedsToShowLeaflet,
  useTrunkNeedsToShowLeaf,
  DisplayType,
} from "@jupiter/core/infra/component/use-nested-entities";
import { ServicePropertiesContext } from "@jupiter/core/config-client";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import {
  NavSingle,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import {
  EntityCard,
  EntityLink,
} from "@jupiter/core/infra/component/entity-card";
import { EntityStack } from "@jupiter/core/infra/component/entity-stack";
import { ApiKeyView } from "@jupiter/core/api_key/components/api-key-view";
import { Button, Stack, Typography } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { DocsHelp } from "#/core/infra/component/docs-help";
import { DocsHelpSubject } from "@jupiter/webapi-client";

import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { getLoggedInApiClient } from "~/api-clients.server";

export const handle = {
  displayType: DisplayType.TRUNK,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const apiKeysResult = await apiClient.apiKey.aPiKeyFind({
    allow_archived: false,
  });

  return json({
    apiKeys: apiKeysResult.api_keys,
  });
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

export default function ManageApi() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const serviceProperties = useContext(ServicePropertiesContext);
  const topLevelInfo = useContext(TopLevelInfoContext);

  const shouldShowALeaf = useTrunkNeedsToShowLeaf();
  const shouldShowALeaflet = useLeafNeedsToShowLeaflet();

  const apiDocsUrl = `${serviceProperties.apiUrl}/redoc`;

  return (
    <TrunkPanel key="manage-api" returnLocation="/app/workspace">
      <NestingAwareBlock shouldHide={shouldShowALeaf || shouldShowALeaflet}>
        <ToolPanel>
          <SectionCard title="REST API">
            <Typography variant="body1">
              Use the REST API to integrate Thrive with your own applications
              and scripts. Create an API key below, and follow the instructions
              in the docs{" "}
              <DocsHelp size="small" subject={DocsHelpSubject.API} />.
            </Typography>
            <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
              <Typography variant="body2" sx={{ alignSelf: "center" }}>
                API available at{" "}
                <Typography
                  component="span"
                  variant="body2"
                  sx={{ fontFamily: "monospace" }}
                >
                  {serviceProperties.apiUrl}
                </Typography>
              </Typography>
              <Button
                variant="outlined"
                size="small"
                href={apiDocsUrl}
                target="_blank"
                endIcon={<OpenInNewIcon />}
              >
                API Documentation
              </Button>
            </Stack>
          </SectionCard>

          <SectionCard
            title="API Keys"
            actions={
              <SectionActions
                id="api-keys-actions"
                topLevelInfo={topLevelInfo}
                inputsEnabled={true}
                actions={[
                  NavSingle({
                    text: "Add",
                    link: "/app/workspace/manage-api/new",
                    highlight: true,
                  }),
                ]}
              />
            }
          >
            <EntityStack>
              {loaderData.apiKeys.map((apiKey) => (
                <EntityCard
                  entityId={`api-key-${apiKey.ref_id}`}
                  key={`api-key-${apiKey.ref_id}`}
                >
                  <EntityLink to={`/app/workspace/manage-api/${apiKey.ref_id}`}>
                    <ApiKeyView apiKey={apiKey} />
                  </EntityLink>
                </EntityCard>
              ))}
            </EntityStack>
          </SectionCard>
        </ToolPanel>
      </NestingAwareBlock>

      <AnimatePresence mode="wait" initial={false}>
        <Outlet />
      </AnimatePresence>
    </TrunkPanel>
  );
}

export const ErrorBoundary = makeTrunkErrorBoundary("/app/workspace", {
  error: () => `There was an error loading the API keys! Please try again!`,
});
