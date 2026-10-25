import { OAuthGrantStatus } from "@jupiter/webapi-client";
import { Stack, Typography } from "@mui/material";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  ShouldRevalidateFunction,
} from "react-router";
import {
  redirect,
  useActionData,
  useLoaderData,
  useNavigation,
} from "react-router";
import { useContext } from "react";
import { z } from "zod";
import { parseForm, parseParams } from "zodix";
import { makeLeafErrorBoundary } from "@jupiter/core/infra/component/error-boundary";
import { GlobalError } from "@jupiter/core/infra/component/errors";
import { LeafPanel } from "@jupiter/core/infra/component/layout/leaf-panel";
import { SectionCard } from "@jupiter/core/infra/component/section-card";
import {
  ActionSingle,
  SectionActions,
} from "@jupiter/core/infra/component/section-actions";
import { DisplayType } from "@jupiter/core/infra/component/use-nested-entities";
import { TopLevelInfoContext } from "@jupiter/core/infra/top-level-context";
import {
  handleActionApiError,
  handleLoaderApiError,
} from "@jupiter/core/infra/errors.server";
import { standardShouldRevalidate } from "@jupiter/core/infra/should-revalidate";
import { getLoggedInApiClient } from "@jupiter/core/infra/api-clients.server";
import {
  formatOAuthTimestamp,
  oauthGrantStatusLabel,
} from "@jupiter/core/auth/sub/oauth_grant/components/oauth-grant-view";

const ParamsSchema = z.object({
  id: z.string(),
});

const FormSchema = z.discriminatedUnion("intent", [
  z.object({
    intent: z.literal("revoke"),
  }),
]);

export const handle = {
  displayType: DisplayType.LEAF,
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const { id } = parseParams(params, ParamsSchema);

  try {
    const result = await apiClient.auth.oAuthGrantLoad({
      ref_id: id,
      allow_archived: true,
    });

    return {
      oauthGrant: result.oauth_grant,
    };
  } catch (error) {
    handleLoaderApiError(error);
  }
}

export async function action({ request, params }: ActionFunctionArgs) {
  const apiClient = await getLoggedInApiClient(request);
  const { id } = parseParams(params, ParamsSchema);
  const form = await parseForm(request, FormSchema);

  try {
    switch (form.intent) {
      case "revoke": {
        await apiClient.auth.oAuthGrantArchive({ ref_id: id });

        return redirect(`/app/workspace/access`);
      }

      default:
        throw new Response("Bad Intent", { status: 500 });
    }
  } catch (error) {
    return handleActionApiError(error);
  }
}

export const shouldRevalidate: ShouldRevalidateFunction =
  standardShouldRevalidate;

export default function ConnectedApp() {
  const actionData = useActionData<typeof action>();
  const loaderData = useLoaderData<typeof loader>();
  const topLevelInfo = useContext(TopLevelInfoContext);
  const navigation = useNavigation();
  const inputsEnabled = navigation.state === "idle";

  const oauthGrant = loaderData.oauthGrant;
  const revoked = oauthGrant.status === OAuthGrantStatus.REVOKED;

  return (
    <LeafPanel
      key={`access/connected-apps/${oauthGrant.ref_id}`}
      fakeKey={`access/connected-apps/${oauthGrant.ref_id}`}
      returnLocation="/app/workspace/access"
      inputsEnabled={inputsEnabled}
    >
      <SectionCard
        title="Connected app"
        actions={
          revoked ? undefined : (
            <SectionActions
              id={`oauth-grant-${oauthGrant.ref_id}-actions`}
              topLevelInfo={topLevelInfo}
              inputsEnabled={inputsEnabled}
              actions={[
                ActionSingle({
                  id: "oauth-grant-revoke",
                  text: "Revoke access",
                  value: "revoke",
                  highlight: true,
                }),
              ]}
            />
          )
        }
      >
        <GlobalError actionResult={actionData} />

        <Stack spacing={1}>
          <Typography variant="body1" sx={{ wordBreak: "break-all" }}>
            {oauthGrant.client_id}
          </Typography>
          <Typography variant="body2">
            Status: {oauthGrantStatusLabel(oauthGrant.status)}
          </Typography>
          <Typography variant="body2">
            Approved {formatOAuthTimestamp(oauthGrant.created_time)}
          </Typography>
          {oauthGrant.refresh_issued_time && (
            <Typography variant="body2">
              Last refreshed{" "}
              {formatOAuthTimestamp(oauthGrant.refresh_issued_time)}
            </Typography>
          )}
          {oauthGrant.expires_time && !revoked && (
            <Typography variant="body2">
              Stops working without use on{" "}
              {formatOAuthTimestamp(oauthGrant.expires_time)}
            </Typography>
          )}
          <Typography variant="body2" color="text.secondary">
            Revoking stops the app from getting new access. An access token it
            already holds keeps working until it expires, which takes up to an
            hour.
          </Typography>
        </Stack>
      </SectionCard>
    </LeafPanel>
  );
}

export const ErrorBoundary = makeLeafErrorBoundary(
  "/app/workspace/access",
  ParamsSchema,
  {
    notFound: (params) => `Could not find connected app ${params.id}!`,
    error: () =>
      `There was an error loading the connected app! Please try again!`,
  },
);
