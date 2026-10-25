import type {
  LoaderFunctionArgs,
  ShouldRevalidateFunction,
} from "react-router";
import { useContext } from "react";
import { makeTrunkErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { NestingAwareBlock } from "@jupiter/core/infra/component/layout/nesting-aware-block";
import { NestedOutlet } from "@jupiter/core/infra/component/layout/nested-outlet";
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
import { ApiKeyView } from "@jupiter/core/api_key/components/api-key-view";
import { McpKeyView } from "@jupiter/core/mcp_key/components/mcp-key-view";
import { OAuthGrantView } from "@jupiter/core/auth/sub/oauth_grant/components/oauth-grant-view";
import { Button, Stack, Typography } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { DocsHelp } from "#/core/infra/component/docs-help";
import { DocsHelpSubject } from "@jupiter/webapi-client";
import { useLoaderDataSafeForAnimation } from "@jupiter/core/infra/component/use-loader-data-for-animation";
import { standardShouldRevalidate } from "@jupiter/core/infra/should-revalidate";
import { getLoggedInApiClient } from "@jupiter/core/infra/api-clients.server";

import { useServiceProperties } from "~/logic/config";

export const handle = {
  displayType: DisplayType.TRUNK,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const [oauthGrantsResult, mcpKeysResult, apiKeysResult] = await Promise.all([
    apiClient.auth.oAuthGrantFind({ allow_archived: false }),
    apiClient.mcpKey.mCpKeyFind({ allow_archived: false }),
    apiClient.apiKey.aPiKeyFind({ allow_archived: false }),
  ]);

  return {
    oauthGrants: oauthGrantsResult.oauth_grants,
    mcpKeys: mcpKeysResult.mcp_keys,
    apiKeys: apiKeysResult.api_keys,
  };
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

export default function Access() {
  const loaderData = useLoaderDataSafeForAnimation<typeof loader>();
  const serviceProperties = useServiceProperties();
  const topLevelInfo = useContext(TopLevelInfoContext);

  const shouldShowALeaf = useTrunkNeedsToShowLeaf();
  const shouldShowALeaflet = useLeafNeedsToShowLeaflet();

  const apiDocsUrl = `${serviceProperties.apiUrl}/redoc`;
  // The configured address is the bare server in some setups and ends in /mcp in
  // others. An assistant that signs in needs the endpoint, which always ends in
  // /mcp. An MCP key is added after the configured address as it is.
  const mcpServerAddress = `${serviceProperties.mcpUrl.replace(/\/mcp\/?$/, "").replace(/\/$/, "")}/mcp`;
  const mcpKeyAddress = `${serviceProperties.mcpUrl.replace(/\/$/, "")}/v1/YOUR_KEY_HERE/mcp`;

  return (
    <TrunkPanel key="access" returnLocation="/app/workspace">
      <NestingAwareBlock shouldHide={shouldShowALeaf || shouldShowALeaflet}>
        <ToolPanel>
          <SectionCard title="Connected apps">
            <Typography variant="body1">
              Apps you have approved to use Thrive in your name, such as an AI
              assistant connecting through MCP. Revoke one to stop it getting
              new access.
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              To connect an assistant that can sign in, give it this MCP server
              address <DocsHelp size="small" subject={DocsHelpSubject.MCP} />:{" "}
              <Typography
                component="span"
                variant="body2"
                sx={{ fontFamily: "monospace", wordBreak: "break-all" }}
              >
                {mcpServerAddress}
              </Typography>
            </Typography>
            {loaderData.oauthGrants.length === 0 ? (
              <Typography variant="body2" sx={{ mt: 1 }}>
                No apps are connected.
              </Typography>
            ) : (
              <EntityStack>
                {loaderData.oauthGrants.map((oauthGrant) => (
                  <EntityCard
                    entityId={`oauth-grant-${oauthGrant.ref_id}`}
                    key={`oauth-grant-${oauthGrant.ref_id}`}
                  >
                    <EntityLink
                      to={`/app/workspace/access/connected-apps/${oauthGrant.ref_id}`}
                    >
                      <OAuthGrantView oauthGrant={oauthGrant} />
                    </EntityLink>
                  </EntityCard>
                ))}
              </EntityStack>
            )}
          </SectionCard>

          <SectionCard
            title="MCP keys"
            actions={
              <SectionActions
                id="mcp-keys-actions"
                topLevelInfo={topLevelInfo}
                inputsEnabled={true}
                actions={[
                  NavSingle({
                    text: "Add",
                    link: "/app/workspace/access/mcp-keys/new",
                    highlight: true,
                  }),
                ]}
              />
            }
          >
            <Typography variant="body1">
              For an assistant that cannot sign in, create an MCP key and give
              it the MCP key address, following the instructions in the docs{" "}
              <DocsHelp size="small" subject={DocsHelpSubject.MCP} />. The key
              is part of the address, so keep both secret.
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              MCP key address{" "}
              <Typography
                component="span"
                variant="body2"
                sx={{ fontFamily: "monospace", wordBreak: "break-all" }}
              >
                {mcpKeyAddress}
              </Typography>
            </Typography>
            <EntityStack>
              {loaderData.mcpKeys.map((mcpKey) => (
                <EntityCard
                  entityId={`mcp-key-${mcpKey.ref_id}`}
                  key={`mcp-key-${mcpKey.ref_id}`}
                >
                  <EntityLink
                    to={`/app/workspace/access/mcp-keys/${mcpKey.ref_id}`}
                  >
                    <McpKeyView mcpKey={mcpKey} />
                  </EntityLink>
                </EntityCard>
              ))}
            </EntityStack>
          </SectionCard>

          <SectionCard
            title="API keys"
            actions={
              <SectionActions
                id="api-keys-actions"
                topLevelInfo={topLevelInfo}
                inputsEnabled={true}
                actions={[
                  NavSingle({
                    text: "Add",
                    link: "/app/workspace/access/api-keys/new",
                    highlight: true,
                  }),
                ]}
              />
            }
          >
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
            <EntityStack>
              {loaderData.apiKeys.map((apiKey) => (
                <EntityCard
                  entityId={`api-key-${apiKey.ref_id}`}
                  key={`api-key-${apiKey.ref_id}`}
                >
                  <EntityLink
                    to={`/app/workspace/access/api-keys/${apiKey.ref_id}`}
                  >
                    <ApiKeyView apiKey={apiKey} />
                  </EntityLink>
                </EntityCard>
              ))}
            </EntityStack>
          </SectionCard>
        </ToolPanel>
      </NestingAwareBlock>

      <NestedOutlet />
    </TrunkPanel>
  );
}

export const ErrorBoundary = makeTrunkErrorBoundary("/app/workspace", {
  error: () => `There was an error loading your access! Please try again!`,
});
