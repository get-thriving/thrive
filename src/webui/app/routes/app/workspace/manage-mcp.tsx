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
import { McpKeyView } from "@jupiter/core/mcp_key/components/mcp-key-view";
import { Stack, Typography } from "@mui/material";

import { useLoaderDataSafeForAnimation } from "~/rendering/use-loader-data-for-animation";
import { standardShouldRevalidate } from "~/rendering/standard-should-revalidate";
import { getLoggedInApiClient } from "~/api-clients.server";
import { DocsHelp } from "#/core/infra/component/docs-help";
import { ServicePropertiesContext } from "#/core/config-client";
import { DocsHelpSubject } from "@jupiter/webapi-client";

export const handle = {
  displayType: DisplayType.TRUNK,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const mcpKeysResult = await apiClient.mcpKey.mCpKeyFind({
    allow_archived: false,
  });

  return json({
    mcpKeys: mcpKeysResult.mcp_keys,
  });
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

export default function ManageMcp() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const serviceProperties = useContext(ServicePropertiesContext);

  const shouldShowALeaf = useTrunkNeedsToShowLeaf();
  const shouldShowALeaflet = useLeafNeedsToShowLeaflet();

  return (
    <TrunkPanel
      key="manage-mcp"
      returnLocation="/app/workspace"
    >
      <NestingAwareBlock shouldHide={shouldShowALeaf || shouldShowALeaflet}>
        <ToolPanel>
          <SectionCard title="MCP">
            <Typography variant="body1">
              Use MCP (Model Context Protocol) to connect AI assistants like
              Claude, Cursor, or ChatGPT to your Thrive workspace. Create an MCP
              key below and configure your AI assistant with it, following the 
              instructions in the docs <DocsHelp size="small" subject={DocsHelpSubject.MCP} />.
            </Typography>
            <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
            <Typography variant="body2" sx={{ alignSelf: "center" }}>
                MCP available at{" "}
                <Typography component="span" variant="body2" sx={{ fontFamily: "monospace" }}>
                  {serviceProperties.mcpUrl}
                </Typography>
              </Typography>
              </Stack>
          </SectionCard>

          <SectionCard
            title="MCP Keys"
            actions={
              <SectionActions
                id="mcp-keys-actions"
                topLevelInfo={topLevelInfo}
                inputsEnabled={true}
                actions={[
                  NavSingle({
                    text: "Add",
                    link: "/app/workspace/manage-mcp/new",
                    highlight: true,
                  }),
                ]}
              />
            }
          >
            <EntityStack>
              {loaderData.mcpKeys.map((mcpKey) => (
                <EntityCard
                  entityId={`mcp-key-${mcpKey.ref_id}`}
                  key={`mcp-key-${mcpKey.ref_id}`}
                >
                  <EntityLink
                    to={`/app/workspace/manage-mcp/${mcpKey.ref_id}`}
                  >
                    <McpKeyView mcpKey={mcpKey} />
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
  error: () => `There was an error loading the MCP keys! Please try again!`,
});
